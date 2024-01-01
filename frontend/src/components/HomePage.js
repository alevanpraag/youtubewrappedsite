import React, { Component } from "react";
import CreateWrapPage from "./CreateWrapPage";
import MyWrapPage from "./MyWrapPage";
import SecondWrapPage from "./SecondWrapPage";
import LoadingPage from "./LoadingPage";
import TestPage from "./TestPage";
import { Grid, Button, withStyles} from "@material-ui/core";

import { 
    BrowserRouter as Router, 
    Routes, 
    Route,
    Link, 
} from "react-router-dom"

function renderHomePage(){  
    const RedButton = withStyles({
        root: {
            backgroundColor: "#c1121f",
            color: "#EAF0F6"
        }
      })(Button);

    return (
        <Grid container spacing={4}>
        <Grid item xs={12} align="center">
        <h3>2023</h3>
        <h1>YouTube</h1>
        <h3>rewind</h3>
        </Grid>
        <Grid item xs={12} align="center">
        <RedButton variant="contained" to="/create" component={Link}>
            Begin
          </RedButton>
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
                <Route path="/mywrap2/:code" element={<SecondWrapPage/>}/>
                <Route path="/test" element={<TestPage/>}/>
            </Routes>
        </Router>
    );
}
