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
        <div className="absolute top-2 right-2 z-50 flex flex-col gap-2 text-sm bg-blue-300 bg-opacity-60 rounded-lg p-4 w-44">
            {/* <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    value=""
                    checked={is3d}
                    className="sr-only peer"
                    onClick={() => {
                        setIs3d(!is3d);
                    }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                    3D
                </span>
            </label> */}
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    defaultChecked={isDark}
                    className="sr-only peer"
                    onClick={() => {
                        setIsDark(!isDark);
                    }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                    {isDark ? `Dark` : `Light`}
                </span>

            </label>

            <label className="relative inline-flex items-center cursor-pointer">
                {/* Added for changes*/}
                <input
                    type="checkbox"
                    defaultChecked={trackChanges}
                    className="sr-only peer"
                    onClick={() => {
                        let newTrackChanges = !trackChanges;
                        setTrackChanges(newTrackChanges);
                        console.log(trackChanges)
                        if (newTrackChanges && (currentInstance != 0)) { //Thuis should be checking when trackChanges is true but the setTrackChanges takes too long to update the variable
                            console.log("SHOW CHANGE DATA")
                            console.log(graphTimeline[currentInstance - 1])
                            console.log(graphTimeline[currentInstance])
                            setGraphData(compareChanges(graphTimeline[currentInstance - 1], graphTimeline[currentInstance]))
                        } else {
                            console.log("SHOW SINGLE DATA")
                            setGraphData(getData(graphTimeline[currentInstance]));
                        }
                    }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                    {trackChanges ? `Changes` : `No changes`}
                </span>
            </label>

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
