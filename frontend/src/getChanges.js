//import getData from "./getData";
//This function is very simliar to the getData function imported above and written by Sandeep, but has a key distinction that our change parser uses.
function getData(myData, nodes_array) {
    let microservices = myData["microservices"];
    let nodes = [];
    let methods = {};
    for (let i=0; i<microservices.length;i++){
        let microservice = microservices[i];
        let nodeName = microservice["name"];
        let nodePath = microservice["path"];
        // This if statement is used to filter nodes if a nodes_array 
        // has been inputted, and only uses nodes that are in the nodes_array
        if (nodes_array == undefined || nodes_array.includes(nodeName)){
            nodes.push({
                "nodeName": nodeName,
                "nodeType": "microservice",
                "nodePath": nodePath
            });

        } else {
            continue;
        }
        
        let controllers = microservice["controllers"];
        for (let i=0; i<controllers.length; i++){
            let controller = controllers[i];
            let functions = controller["methods"];
            for (let i=0; i<functions.length; i++){
                let method = functions[i];
                let methodName = method["name"];
                let parameters = method["parameters"];
                let returnType = method["returnType"];
                let url = method["url"];
                let http = method["httpMethod"];
                // Check if this method has a default annotation, then also add that url
                if ((method["annotations"]?.[0]) && method["annotations"][0]["attributes"] && ("default" in method["annotations"][0]["attributes"])) {
                    let temp_url = method["annotations"][0]["attributes"]["default"];
                    methods[temp_url] = {
                        "microservice" : nodeName, 
                        "parameters": parameters,
                        "returnType": returnType,
                        "methodName": methodName,
                        "className": method["className"],
                        "httpMethod": http,
                    }
                } else {
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
    }

    let connections = [];
    let links = {};
    // array can be controller or service
    function iterateThrough(array, microserviceName){
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
                    
                    let url = methodCall["url"];
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
                    let name = source.concat(" --> ", destination);
                    if (source != destination){
                        // Check if this connection is already in 
                        // connections array
                        if (!(connections.includes(name))){
                            connections.push(name);
                            links[name] =
                                {
                                    "source": source,
                                    "target": destination,
                                    "nodeType": "link",
                                    "requests": [
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
                                    "name": name,
                                    "type":"link",
                                };
                        }
                        else{
                           // The index of this connection in the connections array
                            // is the same index in the links array. Find 
                            // the link based on the index of the name in 
                            // connections array and push a new object into 
                            // the "requests" parameter
                            links[name]["requests"].push(
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

    for (let i=0; i<microservices.length;i++){
        let microservice = microservices[i];
        let nodeName = microservice["name"];

        if (!(nodes_array == undefined) && !(nodes_array.includes(nodeName))){
            continue;
        }

        let controllers = microservice["controllers"];
        let services = microservice["services"];
        iterateThrough(services, nodeName);
        iterateThrough(controllers, nodeName);
    }

    return {
        "graphName": "msgraph",
        "nodes": nodes, 
        "links": links, 
        "gitCommitId": myData["commitID"]
    };
}

function getLinkDifferences(link1, link2) {
    //Uses sets to find the additions subtractions and unchanges links between microservices
    // As a key it uses the link name "microservice 1 -> microservice 2"
    var mySet1 = new Set();
    var mySet2 = new Set();

    for (let k in link1) {
        mySet1.add(k);
    }
    for (let k in link2) {
        mySet2.add(k);
    }

    var additions = new Set([...mySet2].filter(x => !mySet1.has(x)));
    var subtractions = new Set([...mySet1].filter(x => !mySet2.has(x)));
    var unmodifiedLinks = new Set([...mySet1].filter(x => mySet2.has(x)));

    return {
        "linkAdditions" : additions,
        "linkSubtractions" : subtractions,
        "unmodifiedLinks": unmodifiedLinks
    }
}

function getNodeDifferences(earlyCommit, laterCommit) {
    var additions = []
    var subtractions = []
    var unmodifiedNodes = []
    /*
    A list of the all the indices of requests in laterCommit. As we match requests in laterCommit to earlyCommit we will remove the index. 
    The remaining indicies are requests that were added
    */
    var matchedNodes = Array.from({ length: laterCommit.length }, (_, i) => i);
    
    for (let i = 0; i <earlyCommit.length; i++) {
        let matched = false;
        for (let j = 0; j < laterCommit.length; j++) {
            if (earlyCommit[i]['nodeName'] == laterCommit[j]['nodeName'] && 
                earlyCommit[i]['nodeType'] == laterCommit[j]['nodeType'] &&
                earlyCommit[i]['nodePath'] == laterCommit[j]['nodePath']
            ) {
                unmodifiedNodes.push(laterCommit[j]); 
                matched = true;
                matchedNodes.splice(matchedNodes.indexOf(j), 1);            
            }
        }

        if (!matched) {
            subtractions.push(earlyCommit[i])
        }
    }

    for (let index in matchedNodes) {
        additions.push(laterCommit[matchedNodes[index]]);
    }

    return {
        "nodeAdditions" : additions,
        "nodeSubtractions" : subtractions,
        "unmodifiedNodes": unmodifiedNodes
    }
}

function getRequestDifferences(earlyCommit, laterCommit) {
    var additions = []
    var subtractions = []
    var unmodifiedRequest = []
    /*
    A list of the all the indices of requests in laterCommit. As we match requests in laterCommit to earlyCommit we will remove the index. 
    The remaining indicies are requests that were added
    */
    var matchedRequest = Array.from({ length: laterCommit.length }, (_, i) => i);
    
    for (let i = 0; i <earlyCommit.length; i++) {
        let matched = false;
        for (let j = 0; j < laterCommit.length; j++) {
            if (earlyCommit[i]['type'] == laterCommit[j]['type'] && 
                earlyCommit[i]['destinationUrl'] == laterCommit[j]['destinationUrl'] &&
                earlyCommit[i]['sourceMethod'] == laterCommit[j]['sourceMethod'] &&
                earlyCommit[i]['destinationclassName'] == laterCommit[j]['destinationclassName'] &&
                earlyCommit[i]['className'] == laterCommit[j]['className'] &&
                earlyCommit[i]['msReturn'] == laterCommit[j]['msReturn'] 
            ) {
                unmodifiedRequest.push(laterCommit[j]); 
                matched = true;
                matchedRequest.splice(matchedRequest.indexOf(j), 1);            
            }
        }

        if (!matched) {
            subtractions.push(earlyCommit[i]);
        }
    }

    for (let index in matchedRequest) {
        additions.push(laterCommit[matchedRequest[index]]);
    }

    return {
        "linkAdditions" : additions,
        "linkSubtractions" : subtractions,
        "unmodifiedRequest": unmodifiedRequest
    }
}

const findModifications = (linkA, linkB) => {
    let nodes = [];
    let links = [];

    const linkDifferences = getLinkDifferences(linkA['links'], linkB['links']);
    
    /*
    Loops through a set containing all the keys of microservice links, 
    and adds the link object (which includes the requests between the two and more info) 
    to a dictionary of microservice links that have been added since the previous commit
    */
    for (let k of linkDifferences["linkAdditions"]) {
        links.push({"name": k, ...linkB['links'][k], color: "green", "type":"link" });
    }

    for (let k of linkDifferences["linkSubtractions"]) {
        links.push({"name": k, ...linkA['links'][k], color: "red", "type":"link" });
    }

    
    for (let k of linkDifferences['unmodifiedLinks']) {
        let requestsA = linkA['links'][k]['requests']
        let requestsB = linkB['links'][k]['requests']
        let requestDifferences = getRequestDifferences(requestsA, requestsB);
        // The following 3 for loops, loop through the additions, subtractions and unmodified requests of a link. 
        // Each element is a dictionary for a single request, so we are adding the coresponding color to each request for visualization
        let requests = [];
        for (let k of requestDifferences["linkAdditions"]) {
            k["color"] = 'green'
            requests.push(k);
        }
        for (let k of requestDifferences["linkSubtractions"]) {
            k["color"] = 'red'
            requests.push(k);
        }
        for (let k of requestDifferences["unmodifiedRequest"]) {
            k["color"] = 'grey'
            requests.push(k);
        }
        if (requestDifferences["linkAdditions"].length == 0 && requestDifferences["linkSubtractions"] == 0) {
            links.push({'name': k, 'source': linkB['links'][k]['source'], 'target': linkB['links'][k]['target'], 'requests': requests, "type":"link"});
        }
        else {
            links.push({'name': k, 'source': linkB['links'][k]['source'], 'target': linkB['links'][k]['target'], 'requests': requests, "color": "yellow", "type":"link"});
        }
    }


    const nodeDifferences = getNodeDifferences(linkA['nodes'], linkB['nodes']);
    
    /*
    Loops through a set containing all the keys of microservice links, 
    and adds the link object (which includes the requests between the two and more info) 
    to a dictionary of microservice links that have been added since the previous commit
    */
    for (let k of nodeDifferences["nodeAdditions"]) {
        k["color"] = "green";
        nodes.push(k);

    }

    for (let k of nodeDifferences["nodeSubtractions"]) {
        k["color"] = "red";
        nodes.push(k);
    }

    
    for (let k of nodeDifferences['unmodifiedNodes']) {
        nodes.push(k);
    }

    return {
        "graphName": "msgraph",
        "nodes": nodes, 
        "links": links, 
        "gitCommitId": linkB["commitID"]
    };
    
};

export default function compareChanges(commit1, commit2) {
    //The compareChanges function, takes in two IR files for two different commits. It then finds all of the nodes that have been added or deleted, 
    // and all of the requests that have been added or deleted. It will then return a list of nodes and links, with a color attribute on the nodes, links, and requests for visualization
    //In the future this function could be improved to integrate more closely with getData.js as there is a lot of repeated code, and could be parsed more deeply to get what exactly about certain requests changed
    const commitLink1 = getData(commit1, undefined);
    const commitLink2 = getData(commit2, undefined);
    commitLink2["commitID"] = commit2["commitID"]

    const modifications = findModifications(commitLink1, commitLink2);

    return modifications;
}

