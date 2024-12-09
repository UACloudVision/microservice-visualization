"use client"
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation } from 'react-router-dom';
import GraphWrapper from "./components/graph/GraphWrapper";
import { setupAxios, setupLogger } from "./utils/axiosSetup";
import { InfoBox } from "./components/graph/NodeInfoBox";
import Menu from "./components/graph/RightClickNodeMenu";
import * as THREE from "three";
import ForceGraph3D from "react-force-graph-3d";

import axios from "axios";



export default function Node(){
    const location = useLocation();
    const data=JSON.parse(location.state);
    const graphRef = useRef();
    const [search, setSearch] = useState("");
    const [value, setValue] = useState(8);
    const [initCoords, setInitCoords] = useState(null);
    const [initRotation, setInitRotation] = useState(null);
    const [graphData, setGraphData] = useState(data[0]);
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
    const microserviceColors = data[1];
    
    
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
                graphData={graphData}
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
             <Menu trackNodes={trackNodes} setTrackNodes={setTrackNodes} />

            <InfoBox
                graphData={graphData}
                focusNode={focusNode}
                setFocusNode={setFocusNode}
            />
            <Legend 
            microservices={microserviceColors}
            
            /> 
            </div>
            
        

        );

}

function Legend(microservices) {
    let data = microservices["microservices"];
    let sphere = {"nodes":[{"nodeName" : "Sphere", "type": "SERVICE"}], "links":[]};
    
    
    return (
    <div style={{
      display: "flex",
      overflow: "auto",
      flexDirection: "column",      /* Stack elements vertically */
      alignItems: "flex-end",       /* Align items to the right */
      position: "absolute",
      top: "20px",                 /* Distance from the top of the page */
      right: "20px",                 /* Distance from the right of the page */
      gap: "10px", 
      font: "100px"
    }}>
    <div
      style={{
        fontSize:"20px",
        padding: "10px",
        backgroundColor: "lightblue",
        border: "1px solid blue",
        width: "300px",             /* Adjust width as needed */
        maxHeight: "250px", 
        textAlign: "center",
      }}
    >
      <h3 style={{ margin: '0 0 10px' }}>Legend</h3>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        <li>
          Service: 
          <ForceGraph3D
            ref = {useRef()}
            graphData={sphere}
            width={50}
            height={50}
            backgroundColor={"rgba(255,255,255,255)"}
            nodeThreeObject={() => {
              const node = new THREE.Mesh(
                new THREE.SphereGeometry(50),
                new THREE.MeshLambertMaterial({
                    color: 'rgb(0,0,0)',
                })
            );
            return node;

            }
          }
            >
            
          </ForceGraph3D>
        </li>
        <li>
          Controller: Cube
        </li>
        <li>
          Repistory: Cone
        </li>
        <li>
          Entity: Cylinder
        </li>
        
      </ul>
    </div>
    <div
      style={{
        fontSize:"20px",
        padding: "10px",
        backgroundColor: "lightblue",
        border: "1px solid blue",
        width: "300px", 
        maxHeight: "250px",           
        textAlign: "center",
      }}
  >
    Microservice Legend
    {Object.entries(data).map(([name, color], index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                backgroundColor: color,
                marginRight: '10px',
                border: '1px solid #000',
              }}
            ></span>
            {name}
          </li>
        ))}
  </div>
  </div>
  );
};