import React from "react"
import myData from "./data/IR323_3138.json";


export default function filterNodes(arrayOfNodes, linksArray){
    console.log(arrayOfNodes);
    let microservices = myData["microservices"];
    let nodes = [];
    let nodesArr = [];
    let links = [];
    let connections = [];

    for (let i=0; i<linksArray.length; i++){
        let requests = linksArray[i]["requests"];
        for (let n=0; n<requests.length; n++){
            let source = requests[n]["className"];
            let destination = requests[n]["destinationclassName"];
            let sourceMethod = requests[n]["sourceMethod"]
            let destinationMethod = requests[n]["endpointFunction"]
            let link = source.concat(" --> ", destination); 
            let parameters = requests[n]["argument"];
            let index;
            if (!(connections.includes(link))){
                connections.push(link);
                links.push(
                    {
                        "source": source,
                        "target": destination,
                        "sourceMicroservice": linksArray[i]["source"],
                        "destinationMicroservice": linksArray[i]["destination"],
                        "requests": [],
                        "name": link
                      })
                index = connections.length - 1;
            }
            else{
                index = connections.indexOf(link);
            }
            links[index]["requests"].push(
                {
                    "sourceMethod": sourceMethod,
                    "type": requests[n]["type"],
                    "endpointFunction": destinationMethod,
                    "argument": parameters,
                    "msReturn": requests[n]["msReturn"],
                  }

            )
        }
    }


    // For each microservice, add each controller name, service name, repository name, 
    // and entity name first, then iterate through each controller method call and service method call 
    // and see what calls they make to each other

    // addNames(arr). arr can be either service, repository, entities, or controller array. 
    // Add the name of this array to nodes. 
    function addNames(microserviceName, arr){
        for (let i=0; i<arr.length; i++){
            let name;
            // Each service should have an implemented type which we are
            // using to define its name, if not use its className
            if (arr[i]["implementedTypes"].length == 1){ 
                name = arr[i]["implementedTypes"][0];

            }
            else{
                name = arr[i]["name"];
            }
            let type = arr[i]["classRole"];
            let packageName = arr[i]["packageName"];
            nodes.push(name);
            nodesArr.push({
                "nodeName": name,
                "nodeType": type, 
                "microserviceName": microserviceName,
                "packageName": packageName,
            })
        }


    }
     // array can be controller or service. Iterate through the method calls of the 
     // array and see if the objectType of what is being called is in the nodes array, ie a 
     // service, controller, repository, or entity. 
    function addLinks(array){
        for (let i=0; i<array.length; i++){
            let source;
            if (array[i]["implementedTypes"].length == 1){ 
                source = array[i]["implementedTypes"][0];

            }
            else{
                source = array[i]["name"];
            }
            
            let methodCalls = array[i]["methodCalls"];
            for (let n=0; n<methodCalls.length; n++){
                let methodCall = methodCalls[n];
                let objectType = methodCall["objectType"];
                let link = source.concat(" --> ", objectType);
                if (nodes.includes(objectType) && objectType != source){
                    if (!(connections.includes(link))){
                        connections.push(link);
                        links.push(
                        {
                            "source": source,
                            "target": objectType,
                            "sourceMicroservice": methodCall["microserviceName"],
                            "destinationMicroservice": methodCall["microserviceName"],
                            "requests": [{
                                "type": "None",
                                "sourceMethod": methodCall["calledFrom"],
                                "endpointFunction": methodCall["name"],
                                "argument": methodCall["parameterContents"],
                                "msReturn": "None",
                            }
                                
                            ],
                            "name": link
                          },
                    )

                }
                else{
                    // The index of this connection in the connections array
                    // is the same index in the links array. Find 
                    // the link based on the index of the name in 
                    // connections array and push a new object into 
                    // the "requests" parameter
                    links[connections.indexOf(link)]["requests"].push(
                        {
                            "sourceMethod": methodCall["calledFrom"],
                            "endpointFunction": methodCall["name"],
                            "argument": methodCall["parameterContents"],
                            "msReturn": "None",
                          }

                    )

                }
                    


                }
                

            }
        } 

    }
    for (let i=0; i<microservices.length;i++){
        let microservice = microservices[i];
        let nodeName = microservice["name"];
        
        if (!(arrayOfNodes.includes(nodeName))){
            continue;
        }
        
        let entities = microservice["entities"];
        let controllers = microservice["controllers"];
        let services = microservice["services"];
        let repositories = microservice["repositories"];
        addNames(nodeName, repositories);
        addNames(nodeName, entities);
        addNames(nodeName, controllers);
        addNames(nodeName, services);
        addLinks(services);
        addLinks(controllers)
        // Go through each service, add to node, and look through method calls
        // to see if it calls a repository
        
    }
    return {
        "graphName": "msgraph",
        "nodes": nodesArr, 
        "links": links, 
        "gitCommitId": "0"
    };


}