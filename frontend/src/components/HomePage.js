import React, { Component } from "react";
import CreateWrapPage from "./CreateWrapPage";
import MyWrapPage from "./MyWrapPage";
import LoadingPage from "./LoadingPage";
import TestPage from "./TestPage";

import { 
    BrowserRouter as Router, 
    Routes, 
    Route,
    Link, 
    Redirect,
} from "react-router-dom"

function renderHomePage(){
    return (<h1>home page</h1>);
  }

export default function HomePage(props) {
    return (
        <Router>
            <Routes>
                <Route path="/" element={renderHomePage()}/>
                <Route path="/create" element={<CreateWrapPage/>}/>
                <Route path="/loading/:code" element={<LoadingPage/>}/>
                <Route path="/mywrap/:code" element={<MyWrapPage/>}/>
                <Route path="/test" element={<TestPage/>}/>
            </Routes>
        </Router>
    );
}
