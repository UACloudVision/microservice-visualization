import React, { SetStateAction, useEffect, useState } from "react";
import { useInfoBox } from "../../hooks/useInfoBox";
import CollapsableBox from "../CollapsableBox";

type Props = {
    graphData: any;
    focusNode: any;
    setFocusNode: any;
    
};

//Info box shown when you click on a link or a node
export const InfoBox = (props: Props) => {
    const { anchorPoint, show, name, type, depends, setShow, dependencies, patterns, methods, source, destination} =
        useInfoBox(props.graphData, props.setFocusNode);

    const getColorClass = (color: string) => {
        switch (color) {
            case 'red':
            return 'bg-red-500';
            case 'green':
            return 'bg-green-500';
            case 'grey':
            return 'bg-gray-500';
            default:
            return 'bg-white'; // default background color
        }
    };
    
    // Popup for a link
    if (type == "link"){
        return (
        <ul
            className={`absolute flex-col top-[10%] left-[60%] z-50 p-4 max-h-96
                bg-white/90 text-slate-800
                rounded-xl shadow-lg backdrop-blur-sm transition-colors duration-300
                ${show ? `flex` : `hidden`}`}
            style={{ top: anchorPoint.y, left: anchorPoint.x }}
        >
            <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold border-b border-slate-300 pb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    Link Details
                </h4>
                {/* <p className="font-semibold">Link: {name}</p> */}
                <p><strong>Source:</strong> {source}</p>
                <p><strong>Destination:</strong> {destination}</p>
            </div>

            <div className="w-full h-px bg-slate-300 my-2"></div>

            <div className="max-h-96 w-96 overflow-y-scroll dark-scrollbar">
                <div className="font-medium mb-2">Method Calls</div>
                {dependencies && dependencies.length > 0 ? (
                    dependencies.map((link: any, index: number) => (
                        <CollapsableBox
                            key={index}
                            title="Method Calls"
                            svg={arrowSvg}
                            body={
                                link.requests &&
                                link.requests.length > 0 ? (
                                    link.requests.map((func: any, subIndex: number) => (
                                        <ul
                                            key={subIndex}
                                            className={`
                                                mb-4 p-4 rounded-xl border border-slate-300 shadow-sm
                                                bg-white/90 backdrop-blur-sm
                                                ${getColorClass(func.color)}
                                            `}
                                        >
                                            {/* Header Section with Source and Destination */}
                                            <div className="flex flex-col gap-1 mb-2">
                                                <h5 className="font-semibold text-base flex items-center gap-2">
                                                    Source: <span className="font-normal text-slate-600 break-words">{func.sourceMethod}</span>
                                                </h5>
                                                <h5 className="font-semibold text-base flex items-center gap-2">
                                                    Destination: <span className="font-normal text-slate-600 break-words">{func.endpointFunction}</span>
                                                </h5>
                                            </div>
                                            
                                            <div className="w-full h-px bg-slate-300 my-3"></div>
                                            
                                            {/* Details Grid */}
                                            <div className="flex flex-col gap-3">
                                                {func.type && (
                                                    <>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-xs text-slate-500">HTTP Method</span>
                                                            <span className="font-semibold text-sm text-slate-700">{func.type}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-xs text-slate-500">URL</span>
                                                            <span className="font-normal text-sm break-words">{func.destinationUrl}</span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-xs text-slate-500">Return Type</span>
                                                    <span className="font-mono text-cyan-600 text-sm break-words">{func.msReturn ? func.msReturn : 'None'}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-xs text-slate-500">Arguments</span>
                                                    <span className="text-sm break-words">{func.argument}</span>
                                                </div>
                                            </div>
                                        </ul>
                                    ))
                                ) : (
                                    <div>None</div>
                                )
                            }
                            initOpen={false}
                        />
                    ))
                ) : (
                    <div>None</div>
                )}
            </div>

            <div className="w-full h-px bg-slate-300 my-2"></div>
            
            <button
                onClick={() => {
                    props.setFocusNode(null);
                    setShow(false);
                }}
                className="
                    mt-2 w-full rounded-xl px-4 py-2 text-center text-sm font-semibold transition-all duration-200
                    bg-slate-300 hover:bg-slate-400 text-slate-800
                "
            >
                Close Box
            </button>
        </ul>
        );
        
    }
    // check if type is not a microservice, which means it is a CONTROLLER, SERVICE, REPOSITORY, 
    // or ENTITY
    else if (type != "microservice"){
        // methods is not undefined if type is not a microservice and not a link
        return(
        <ul
            className={`absolute flex-col top-[10%] left-[60%] z-50 p-4 max-h-96
                bg-white/90 text-slate-800
                rounded-xl shadow-lg backdrop-blur-sm transition-colors duration-300
                ${show ? `flex` : `hidden`}`}
            style={{ top: anchorPoint.y, left: anchorPoint.x }}
        >
            <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold border-b border-slate-300 pb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.5m4.5 4.5V18m4.5 3v-4.5m4.5 0a2.25 2.25 0 00-2.25-2.25H15m0-1.5-3-3-3 3M21 15h-3.375M15 15h-3.375M18.75 3a2.25 2.25 0 00-2.25 2.25V15m2.25-11.25H12M9 3v13.5m-3-13.5V12M3 15.75V12" />
                    </svg>
                    Node Details
                </h4>
                <div className="flex flex-col gap-1">
                    <p><strong>Node:</strong> {name}</p>
                    <p><strong>Type:</strong> {type}</p>
                    <p><strong>Microservice:</strong> {source}</p>
                </div>
            </div>

            <div className="w-full h-px bg-slate-300 my-2"></div>

            <div className="max-h-96 w-96 overflow-y-scroll dark-scrollbar">
                <div className="font-medium mb-2">Methods:</div>
                {methods && methods.length > 0 ? (
                    methods.map((method: any) => (
                        <CollapsableBox
                            key={method.id}
                            title={method.name}
                            svg={arrowSvg}
                            body={
                                method ? (
                                    <ul
                                        className={`mb-4 p-4 rounded-xl border border-slate-300 shadow-sm
                                            bg-white/90 backdrop-blur-sm`}
                                    >
                                        <div className="flex flex-col gap-3">
                                            {method.url && method.httpMethod && (
                                                <>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-slate-500">HTTP Method</span>
                                                        <span className="font-semibold text-sm text-slate-700">{method.httpMethod}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-slate-500">URL</span>
                                                        <span className="font-normal text-sm break-words">{method.url}</span>
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-medium text-xs text-slate-500">Return Type</span>
                                                <span className="font-mono text-cyan-600 text-sm break-words">{method.returnType ? method.returnType : 'None'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-xs text-slate-500">Parameters</span>
                                                <span className="text-sm break-words">{JSON.stringify(method.parameters)}</span>
                                            </div>
                                        </div>
                                    </ul>
                                ) : (
                                    <div>None</div>
                                )
                            }
                            initOpen={false}
                        />
                    ))
                ) : (
                    <div>None</div>
                )}
            </div>

            <div className="w-full h-px bg-slate-300 my-2"></div>

            <button
                onClick={() => {
                    props.setFocusNode(null);
                    setShow(false);
                }}
                className="
                    mt-2 w-full rounded-xl px-4 py-2 text-center text-sm font-semibold transition-all duration-200
                    bg-slate-300 hover:bg-slate-400 text-slate-800
                "
            >
                Close Box
            </button>
        </ul>

        );

    }

    //Return popup link for a node
    return (
        <ul
            className={`absolute flex-col top-[10%] left-[60%] z-50 p-4 max-h-96
                bg-white/90 text-slate-800
                rounded-xl shadow-lg backdrop-blur-sm transition-colors duration-300
                ${show ? `flex` : `hidden`}`}
            style={{ top: anchorPoint.y, left: anchorPoint.x }}
        >
            <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold border-b border-slate-300 pb-2 flex items-center gap-2">
                    MS: {name}
                </h4>
                <div className="flex flex-col gap-1">
                    <p><strong>Type:</strong> {type}</p>
                    <p><strong>Microservice:</strong> {name}</p>
                </div>
            </div>

            <div className="w-full h-px bg-slate-300 my-2"></div>

            <div className="max-h-96 w-96 overflow-y-scroll dark-scrollbar">
                <h5 className="font-semibold text-sm mt-4">Dependencies</h5>
                <div className="w-full h-px bg-slate-300 my-2"></div>
                <div className="flex flex-col gap-4">
                    {dependencies && dependencies.length > 0 ? (
                        dependencies.map((link: any, index: number) => (
                            <CollapsableBox
                                key={index}
                                title={link.target.nodeName}
                                svg={arrowSvg}
                                body={
                                    link.requests && link.requests.length > 0 ? (
                                        link.requests.map((func: any, subIndex: number) => (
                                            <ul
                                                key={subIndex}
                                                className={`mb-4 p-4 rounded-xl border border-slate-300 shadow-sm bg-white/90 backdrop-blur-sm`}
                                            >
                                                <div className="flex flex-col gap-1 mb-2">
                                                    <h5 className="font-semibold text-base flex items-center gap-2">
                                                        Source Method: <span className="font-normal text-slate-600 break-words">{func.sourceMethod}</span>
                                                    </h5>
                                                    <h5 className="font-semibold text-base flex items-center gap-2">
                                                        Destination Method: <span className="font-normal text-slate-600 break-words">{func.endpointFunction}</span>
                                                    </h5>
                                                </div>
                                                <div className="w-full h-px bg-slate-300 my-3"></div>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-slate-500">HTTP Method</span>
                                                        <span className="font-semibold text-sm text-slate-700">{func.type}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-slate-500">Return Type</span>
                                                        <span className="font-mono text-cyan-600 text-sm break-words">{func.msReturn ? func.msReturn : 'None'}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-slate-500">Arguments</span>
                                                        <span className="text-sm break-words">{func.argument}</span>
                                                    </div>
                                                </div>
                                            </ul>
                                        ))
                                    ) : (
                                        <div>None</div>
                                    )
                                }
                                initOpen={false}
                            />
                        ))
                    ) : (
                        <div>None</div>
                    )}
                </div>
                
                <h5 className="font-semibold text-sm mt-4">Depends On</h5>
                <div className="w-full h-px bg-slate-300 my-2"></div>
                <div className="flex flex-col gap-4">
                    {depends && depends.length > 0 ? (
                        depends.map((link: any, index: number) => (
                            <CollapsableBox
                                key={index}
                                title={link.source.nodeName}
                                svg={arrowSvg}
                                body={
                                    link.requests && link.requests.length > 0 ? (
                                        link.requests.map((func: any, subIndex: number) => (
                                            <ul
                                                key={subIndex}
                                                className={`mb-4 p-4 rounded-xl border border-slate-300 shadow-sm bg-white/90 backdrop-blur-sm`}
                                            >
                                                <div className="flex flex-col gap-1 mb-2">
                                                    <h5 className="font-semibold text-base flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21v-4.5m-1.226-9.678l-1.921-.514A.75.75 0 008.312 6l-4.312 3.45a.75.75 0 00-.215 1.027l1.962 1.57a.75.75 0 00.974-.248l.515-1.921a.75.75 0 00-.132-1.355zM15.541 7.21l1.921-.514a.75.75 0 01.132-1.355l-4.312-3.45a.75.75 0 00-1.027.215l-1.57 1.962a.75.75 0 00.974.248l.515-1.921a.75.75 0 00.132-1.355z" />
                                                        </svg>
                                                        Source Method: <span className="font-normal text-slate-600 break-words">{func.sourceMethod}</span>
                                                    </h5>
                                                    <h5 className="font-semibold text-base flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125S7.722 2.25 12 2.25s8.25 1.847 8.25 4.125zm-16.5 6.375v2.25c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125v-2.25m-16.5 0c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125m-16.5 0v2.25c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125v-2.25" />
                                                        </svg>
                                                        Destination Method: <span className="font-normal text-slate-600 break-words">{func.endpointFunction}</span>
                                                    </h5>
                                                </div>
                                                <div className="w-full h-px bg-slate-300 my-3"></div>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-slate-500">HTTP Method</span>
                                                        <span className="font-semibold text-sm text-slate-700">{func.type}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-slate-500">Return Type</span>
                                                        <span className="font-mono text-cyan-600 text-sm break-words">{func.msReturn ? func.msReturn : 'None'}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs text-slate-500">Arguments</span>
                                                        <span className="text-sm break-words">{func.argument}</span>
                                                    </div>
                                                </div>
                                            </ul>
                                        ))
                                    ) : (
                                        <div>None</div>
                                    )
                                }
                                initOpen={false}
                            />
                        ))
                    ) : (
                        <div>None</div>
                    )}
                </div>
                
                <h5 className="font-semibold text-sm mt-4">Anti-Patterns</h5>
                <div className="w-full h-px bg-slate-300 my-2"></div>
                <div className="flex flex-col gap-4">
                    {patterns && patterns.length > 0 ? (
                        patterns.map((pattern: any, index: number) => (
                            <CollapsableBox
                                key={index}
                                title={pattern.type}
                                svg={arrowSvg}
                                body={
                                    <p className="p-2">
                                        <span className="font-medium text-xs text-slate-500">Threshold:</span>
                                        <span className="text-sm">{pattern.threshold}</span>
                                    </p>
                                }
                                initOpen={false}
                            />
                        ))
                    ) : (
                        <div>None</div>
                    )}
                </div>
            </div>
            <div className="w-full h-px bg-slate-300 my-2"></div>

            <button
                onClick={() => {
                    props.setFocusNode(null);
                    setShow(false);
                }}
                className="
                    mt-2 w-full rounded-xl px-4 py-2 text-center text-sm font-semibold transition-all duration-200
                    bg-slate-300 hover:bg-slate-400 text-slate-800
                "
            >
                Close Box
            </button>
        </ul>
    );
};

const arrowSvg = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-6 w-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
    </svg>
);
