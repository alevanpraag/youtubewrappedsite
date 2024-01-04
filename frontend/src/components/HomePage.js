import React, { Component } from "react";
import { Grid, Button, withStyles} from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import IMAGES from '../index.js';

export default function HomePage(props) {   
    const navigate = useNavigate(); 

    function handleBeginPressed() {
        navigate('/create')
      }  

    function handleHelpPressed() {
        navigate('/help')
      }        

    return (
        <Grid container spacing={4}>
        <Grid item xs={12} align="center">
        <h1>YouTube</h1>
        <h3>REWIND</h3>
        </Grid>
        <Grid item xs={12} align="center">
            <div className="createbutton" onClick={handleBeginPressed}> 
            <img src={IMAGES.play} width="59" height="53" />
            <h3 style={{fontSize : '1.5rem', fontWeight : '100'}}>START</h3>
            </div>
        </Grid>  
        <Grid item xs={12} align="center">
          <div className="createbutton" onClick={handleHelpPressed}> Help </div>    
        </Grid>                   
      </Grid> 
      
    );
}
