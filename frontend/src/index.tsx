import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { setupAxios, setupLogger } from "./utils/axiosSetup";
import getData from "./getData.js";
import axios from "axios";

//Not used - possible initial state but it shouldn't be hardcoded using the commit1 import (possible backend integration)
//let graphData = getData(commit1, undefined);
//const graphLifespan = axios.post(`/graph/create`, graphData);

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root') as HTMLElement;
  if (rootElement) {
    setupLogger();
    setupAxios();

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App data={null}/>
        </React.StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
});
