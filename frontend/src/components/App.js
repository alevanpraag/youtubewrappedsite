import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from './HomePage';

export default function App(props) {
    return (
         <div>
            <HomePage/>
        </div>
    );
}

const appDiv = ReactDOM.createRoot(document.getElementById("app"));
appDiv.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
