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

export default function HomePage(props) {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<h1>this is the home page</h1>}/>
                <Route path="/create" element={<CreateWrapPage/>}/>
                <Route path="/mywrap/:code" element={<MyWrapPage/>}/>
            </Routes>
        </Router>
    );
}
