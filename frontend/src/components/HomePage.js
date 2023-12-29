import React, { Component } from "react";
import CreateWrapPage from "./CreateWrapPage";
import MyWrapPage from "./MyWrapPage";
import LoadingPage from "./LoadingPage";
import TestPage from "./TestPage";
import { Grid, Button, Typography, withStyles } from "@material-ui/core";

import { 
    BrowserRouter as Router, 
    Routes, 
    Route,
    Link, 
    Redirect,
} from "react-router-dom"

function renderHomePage(){
    const BlueButton = withStyles({
        root: {
            background: "#669bbc",
            color: "#fdf0d5"
        }
      })(Button);    

    const RedTextTypography = withStyles({
        root: {
          color: "#1d3557"
        }
      })(Typography);

    return (
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
        <RedTextTypography component="h1" variant="h1">
            YouTube Rewind
          </RedTextTypography>
        </Grid>
        <Grid item xs={12} align="center">
        <BlueButton variant="contained" to="/create" component={Link}>
            Begin
          </BlueButton>
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
