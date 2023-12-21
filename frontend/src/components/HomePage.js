import React, { Component } from "react";
import CreateWrapPage from "./CreateWrapPage";
import MyWrapPage from "./MyWrapPage";
import { 
    BrowserRouter as Router, 
    Routes, 
    Route,
    Link, 
    Redirect,
} from "react-router-dom"

function renderHomePage(){
    return (
        <h1>this is the home page</h1>
    );
}

export default function HomePage(props) {
    return (
        <Router>
            <Routes>
                <Route path="/" element={renderHomePage}/>
                <Route path="/create" element={<CreateWrapPage/>}/>
                <Route path="/mywrap/:code" element={<MyWrapPage/>}/>
                <Route path="/mywrap/" element={<MyWrapPage/>}/>
            </Routes>
        </Router>
    );
}
