"use client"
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation } from 'react-router-dom';
import GraphWrapper from "./components/graph/GraphWrapper";
import { setupAxios, setupLogger } from "./utils/axiosSetup";

import axios from "axios";



export default function Node(){
    const location = useLocation();
    const data=JSON.parse(location.state);
    const graphRef = useRef();
    const [search, setSearch] = useState("");
    const [value, setValue] = useState(8);
    const [initCoords, setInitCoords] = useState(null);
    const [initRotation, setInitRotation] = useState(null);
    const [graphData, setGraphData] = useState(data);
    const [is3d, setIs3d] = useState(true);
    const [antiPattern, setAntiPattern] = useState(false);
    const [selectedAntiPattern, setSelectedAntiPattern] = useState("none");
    const [max, setMax] = useState(6);
    const [color, setColor] = useState("dark-default");
    const ref = useRef<HTMLDivElement>(null);
    const [isDark, setIsDark] = useState(true);
    const [graphName, setGraphName] = useState("test");
    const [graphTimeline, setGraphTimeline] = useState(null);
    const [currentInstance, setCurrentInstance] = useState(null);
    const [defNodeColor, setDefNodeColor] = useState(false);
    const [trackNodes, setTrackNodes] = useState([]);
    const [focusNode, setFocusNode] = useState();
    console.log(data);
    
    
    
    
    
        return (
            <div className={`max-w-full min-h-screen max-h-screen overflow-clip ${
                isDark ? `bg-gray-900` : `bg-gray-100`
            }`}
            
            >

            
            <GraphWrapper
                height={ref?.current?.clientHeight ?? 735}
                width={ref?.current?.clientWidth ?? 1710}
                search={search}
                threshold={value}
                graphRef={graphRef}
                graphData={data}
                setInitCoords={setInitCoords}
                setInitRotation={setInitRotation}
                is3d={is3d}
                antiPattern={antiPattern}
                colorMode={color}
                defNodeColor={defNodeColor}
                setDefNodeColor={setDefNodeColor}
                setGraphData={setGraphData}
                isDarkMode={isDark}
                selectedAntiPattern={selectedAntiPattern}
                trackNodes={trackNodes}
                focusNode={focusNode}
            />
            
            </div>
            
        

        );

}
