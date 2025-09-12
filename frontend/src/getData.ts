// Define the notification interface
interface Notification {
    type: 'error' | 'warning' | 'success' | 'info';
    message: string;
    duration?: number;
}

// Error notification for errorenous IR files.
let notificationCallback: ((notification: Notification) => void) | null = null;

export function setNotificationCallback(callback: (notification: Notification) => void): void {
    notificationCallback = callback;
}

function showError(message: string): void {
    if (notificationCallback) {
        notificationCallback({
            type: 'error',
            message: message,
            duration: 5000 // 5 seconds
        });
    } else {
        console.error('File parsing error:', message);
    }
}

// Define types for better type safety
interface Method {
    name: string;
    parameters: any[];
    returnType: string;
    url: string;
    httpMethod: string;
    className: string;
    annotations: any[];
    methodCalls: MethodCall[];
}

interface MethodCall {
    url?: string;
    httpMethod: string;
    calledFrom: string;
    name: string;
    parameterContents: any[];
}

interface Controller {
    methods: Method[];
    implementedTypes: string[];
    name: string;
}

interface Microservice {
    name: string;
    controllers: Controller[];
    services: Controller[]; // Services have the same structure as controllers
}

interface IRData {
    microservices: Microservice[];
    commitID?: string;
}

// Retrieving and parsing data from the IR json file.
export default function getData(myData: IRData | null, nodes_array?: string[] | undefined) {
    if (!myData) {
        showError("No data provided. File may be empty or corrupted.");
        return null;
    };

    try {
        let microservices = myData["microservices"];
        
        // Checking if the json is valid.
        if (!Array.isArray(microservices)) {
            showError('Invalid file structure. Missing microservices.');
            return null;
        }
        
        let nodes: Array<{ nodeName: string; nodeType: string }> = [];
        let methods: { [key: string]: any } = {};

        // Pre-filtering for performance optimization.
        let filteredMicroservices = nodes_array 
            ? microservices.filter(ms => {
                if (!ms.name) {
                    showError("Microservice missing name.");
                    return false;
                }
                return nodes_array.includes(ms.name);
            })
            : microservices;
        
        for (let microservice of filteredMicroservices){
            let nodeName = microservice["name"];

            if (nodes_array == undefined || nodes_array.includes(nodeName)){
                nodes.push({
                    "nodeName": nodeName,
                    "nodeType": "microservice"
                });

            }
            else {
                continue;
            }
            
            let controllers = microservice["controllers"];
            for (let j=0; j<controllers.length; j++){
                let controller = controllers[j];
                let functions = controller["methods"];
                
                for (let k=0; k<functions.length; k++){
                    let method = functions[k];
                    let methodName = method["name"];
                    let parameters = method["parameters"];
                    let returnType = method["returnType"];
                    let url = method["url"];
                    let http = method["httpMethod"];
                    
                    //Check if this method has a default annotation, then also add that url
                    if (method["annotations"].length > 0 && 
                        method["annotations"][0]["attributes"] && 
                        "default" in method["annotations"][0]["attributes"]){
                        let temp_url = method["annotations"][0]["attributes"]["default"];
                        methods[temp_url] = {
                            "microservice" : nodeName, 
                            "parameters": parameters,
                            "returnType": returnType,
                            "methodName": methodName,
                            "className": method["className"],
                            "httpMethod": http,
                        }
                    }
                    methods[url] = {
                        "microservice" : nodeName, 
                        "parameters": parameters,
                        "returnType": returnType,
                        "className": method["className"],
                        "methodName": methodName,
                        "httpMethod": http,
                    }
                }
            }
        }

        let connections = new Map<string, number>();
        let links: any[] = [];

        // The map can be controller or service
        const iterateThrough = (array: Controller[], microserviceName: string): void => {
            for (let i=0; i<array.length; i++){
                let arr = array[i];
                let funcs = arr["methods"];
                
                for (let i = 0; i < funcs.length; i++) {
                    let methodCalls = funcs[i]["methodCalls"];
                    
                    for (let i=0; i<methodCalls.length; i++){
                        let methodCall = methodCalls[i];
                        
                        // This is calling another microservice if the methodCall 
                        // has a url parameter defined
                        if (!("url" in methodCall)){
                            continue;
                        }
                        
                        let url = methodCall["url"]!;
                        if (!(url in methods)){
                            continue;
                        }
                        
                        let http = methodCall["httpMethod"];
                        let className;
                        if (arr["implementedTypes"].length == 1){ 
                            className = arr["implementedTypes"][0];

                        }
                        else{
                            className = arr["name"];
                        }

                        let calledFrom = methodCall["calledFrom"];
                        let destination = methods[url]["microservice"];
                        let source = microserviceName;
                        let parameters = methodCall["parameterContents"];
                        let connectionKey = `${source}-->${destination}`;
                        
                        if (source != destination){
                            // Check if this connection is already in 
                            // the connections map
                            if (!connections.has(connectionKey)) {
                            const linkIndex = links.length;
                            connections.set(connectionKey, linkIndex);
                            links.push({
                                source,
                                target: destination,
                                nodeType: "link",
                                requests: [
                                    {
                                        "destinationUrl": url,
                                        "sourceMethod": calledFrom,
                                        "endpointFunction": methodCall["name"],
                                        "className": className,
                                        "destinationclassName": methods[url]["className"],
                                        "type": http,
                                        "argument": parameters,
                                        "msReturn": methods[url]["returnType"],
                                    }
                                ],
                                name: connectionKey,
                                type: "link"
                            });
                            } else {
                                const linkIndex = connections.get(connectionKey)!;
                                links[linkIndex].requests.push(
                                    {
                                        "destinationUrl": url,
                                        "sourceMethod": calledFrom,
                                        "endpointFunction": methodCall["name"],
                                        "className": className,
                                        "destinationclassName": methods[url]["className"],
                                        "type": http,
                                        "argument": parameters,
                                        "msReturn": methods[url]["returnType"],
                                    }
                                );
                            }
                        } 
                    }
                }
            }
        }

        for (let microservice of filteredMicroservices){
            let nodeName = microservice["name"];
            let controllers = microservice["controllers"];
            let services = microservice["services"];
            
            iterateThrough(services, nodeName);
            iterateThrough(controllers, nodeName);
        }

        return {
            "graphName": "msgraph",
            "nodes": nodes, 
            "links": links, 
            "gitCommitId": myData["commitID"] || "unknown"
        };

    } catch (error: any ) {
        showError(`IR file parsing failed: ${error.message}`);
        return null;
    }
}