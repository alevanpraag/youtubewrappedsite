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
import ThirdWrapPage from "./ThirdWrapPage";
import FourthWrapPage from "./FourthWrapPage";
import FifthWrapPage from "./FifthPage";
import TestPage from "./TestPage";
import HelpPage from "./HelpPage";

export default function App(props) {
    return (
         <div>
          <Router>
              <Routes>
                  <Route path="/" element={<HomePage/>}/>
                  <Route path="/create" element={<CreateWrapPage/>}/>
                  <Route path="/mywrap/:code" element={<MyWrapPage/>}/>
                  <Route path="/mywrap2/:code" element={<SecondWrapPage/>}/>
                  <Route path="/mywrap3/:code" element={<ThirdWrapPage/>}/>
                  <Route path="/mywrap4/:code" element={<FourthWrapPage/>}/>
                  <Route path="/mywrap5/:code" element={<FifthWrapPage/>}/>
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