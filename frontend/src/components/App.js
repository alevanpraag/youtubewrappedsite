import React from "react";
import ReactDOM from "react-dom/client";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route
} from "react-router-dom"
import HomePage from './HomePage';
import CreateWrapPage from "./CreateWrapPage";
import MyWrapPage from "./MyWrapPage";
import SecondWrapPage from "./SecondWrapPage";
import LoadingPage from "./LoadingPage";
import TestPage from "./TestPage";
import HelpPage from "./HelpPage";

export default function App(props) {
    return (
         <div className="center">
          <Router>
              <Routes>
                  <Route path="/" element={<HomePage/>}/>
                  <Route path="/create" element={<CreateWrapPage/>}/>
                  <Route path="/loading/:code" element={<LoadingPage/>}/>
                  <Route path="/mywrap/:code" element={<MyWrapPage/>}/>
                  <Route path="/mywrap2/:code" element={<SecondWrapPage/>}/>
                  <Route path="/test" element={<TestPage/>}/>
                  <Route path="/help" element={<HelpPage/>}/>
              </Routes>
          </Router>          
        </div>
    );
}

const appDiv = ReactDOM.createRoot(document.getElementById("app"));
appDiv.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);