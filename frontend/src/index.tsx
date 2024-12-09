import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { setupAxios, setupLogger } from "./utils/axiosSetup";
import getData from "./getData.js";
import axios from "axios";
import commit1 from './data/IR2_57b3.json';


setupLogger();
setupAxios();
let graphData = getData(commit1, undefined);
// console.log(graphData);
//const graphLifespan = axios.post(`/graph/create`, graphData);
//console.log(graphLifespan);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App data={graphData}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((onPerfEntry : any) =>{});
