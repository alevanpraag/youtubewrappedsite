import React, { Component } from "react";
import CreateWrapPage from "./CreateWrapPage";
import MyWrapPage from "./MyWrapPage";
import LoadingPage from "./LoadingPage";
import TestPage from "./TestPage";
import { Grid, Button} from "@material-ui/core";

import { 
    BrowserRouter as Router, 
    Routes, 
    Route,
    Link, 
} from "react-router-dom"

function renderHomePage(){  

    return (
        <Grid container spacing={4}>
        <Grid item xs={12} align="center">
        <h3>2023</h3>
        <h1>YouTube</h1>
        <h3>rewind</h3>
        </Grid>
        <Grid item xs={12} align="center">
        <Button variant="contained" to="/create" component={Link}>
            Begin
          </Button>
        </Grid>           
      </Grid>);
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
