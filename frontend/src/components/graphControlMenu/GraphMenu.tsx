import React, { useState } from "react";
import GraphButtonMenu from "./GraphButtons";
import Search from "./Search";
import getData from "../../getData";
import compareChanges from "../../getChanges";

type Props = {
    graphRef: any;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    graphData: any;
    setGraphData: any;
    initCoords: any;
    initRotation: any;
    is3d: any;
    setIs3d: any;
    isDark: boolean;
    setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
    trackChanges: boolean;
    setTrackChanges: React.Dispatch<React.SetStateAction<boolean>>;
    antiPattern: boolean;
    selectedAntiPattern: string;
    currentInstance: any;
    graphTimeline: any;
}

/**
 * A menu to be able to do all sorts of things with the force graph.
 *
 * @param {Object} props The props passed to this object
 * @param {React.MutableRefObject<ForceGraphMethods>} props.graphRef Reference to the internal force graph to access methods/camera
 * @returns {JSX.Element} The menu for the graph
 */
const GraphMenu: React.FC<Props> = ({
    graphRef,
    search,
    setSearch,
    value,
    setValue,
    graphData,
    setGraphData,
    initCoords,
    initRotation,
    is3d,
    setIs3d,
    isDark,
    setIsDark,
    trackChanges,
    setTrackChanges,
    antiPattern,
    selectedAntiPattern,
    currentInstance,
    graphTimeline
}) => {
    return (
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-4 bg-slate-800/70 text-white rounded-xl p-4 shadow-lg backdrop-blur-none transition-all duration-300 w-1/6">
            {/* Header with title */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2 animated-gradient-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m9-12h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9 12h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5" />
                    </svg>
                    Settings
                </h2>
            </div>

            {/* Horizontal divider */}
            <div className="w-full h-px bg-slate-700"></div>

            {/* Theme Switch */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    {isDark ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.61.748-3.807A9.754 9.754 0 0012 2.25c5.385 0 9.75 4.365 9.75 9.75 0 1.06-.165 2.08-.478 3.052zm-12.66-7.467c-.074.073-.178.147-.29.213L9.673 11.25H7.125a.75.75 0 010-1.5h1.777l-.608-2.666a.75.75 0 011.45-.334l.607 2.666h2.559a.75.75 0 010 1.5h-1.777l.608 2.666a.75.75 0 01-1.45.334l-.607-2.666h-2.559a.75.75 0 010-1.5h1.777z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12H5.25m-.386-6.364l1.591 1.591M12 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                    )}
                    <strong>Theme:</strong> {isDark ? 'Dark' : 'Light'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        defaultChecked={isDark}
                        className="sr-only peer"
                        onClick={() => {
                            setIsDark(!isDark);
                        }}
                    />
                    <div className="w-11 h-6 bg-yellow-400 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-400 transition-colors duration-300
                                    peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                                    after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                    peer-checked:after:translate-x-full after:duration-300">
                    </div>
                </label>
            </div>

            {/* Changes Switch */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    {trackChanges ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.53-.25 3-.747 4.33M20.25 18H5.75c-1.24 0-2.25-1.01-2.25-2.25V7.5c0-1.24 1.01-2.25 2.25-2.25h14.5c1.24 0 2.25 1.01 2.25 2.25V12M12 3v.375" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75l-3 3m0 0l-3 3m3-3l3-3m0 0l3-3M21 12c0 1.53-.25 3-.747 4.33M20.25 18H5.75c-1.24 0-2.25-1.01-2.25-2.25V7.5c0-1.24 1.01-2.25 2.25-2.25h14.5c1.24 0 2.25 1.01 2.25 2.25V12M12 3v.375" />
                        </svg>
                    )}
                    <strong>Changes:</strong> {trackChanges ? 'Yes' : 'No'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        defaultChecked={trackChanges}
                        className="sr-only peer"
                        onClick={() => {
                            let newTrackChanges = !trackChanges;
                            setTrackChanges(newTrackChanges);
                            if (newTrackChanges && currentInstance !== 0) {
                                setGraphData(compareChanges(graphTimeline[currentInstance - 1], graphTimeline[currentInstance]));
                            } else {
                                setGraphData(getData(graphTimeline[currentInstance]));
                            }
                        }}
                    />
                    <div className="w-11 h-6 bg-red-500 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-400 transition-colors duration-300
                                    peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                                    after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                    peer-checked:after:translate-x-full after:duration-300">
                    </div>
                </label>
            </div>
            
            {/* Horizontal divider */}
            <div className="w-full h-px bg-slate-700"></div>
            
            <Search
                graphRef={graphRef}
                search={search}
                setSearch={setSearch}
                graphData={graphData}
            />
            <GraphButtonMenu
                graphRef={graphRef}
                graphData={graphData}
                setGraphData={setGraphData}
                initCoords={initCoords}
                initRotation={initRotation}
                is3d={is3d}
            />
        </div>
    );
};

export default GraphMenu;
