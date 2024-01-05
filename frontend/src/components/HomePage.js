import React, { useEffect, useState } from "react";
import { Grid, Button, withStyles} from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import IMAGES from '../index.js';

export default function HomePage(props) {   
    const [code, setCode] = useState(null);
    const navigate = useNavigate(); 

    function checkUser(){
        fetch('/api/check-user')
        .then((response) => (response.json()))
        .then((data) => {setCode(data.code)})       
      }

    function handlePreviousPressed() {
        navigate('/mywrap/'+code) 
      }        

    function handleBeginPressed() {
        navigate('/create')
      }  

    function handleHelpPressed() {
        navigate('/help')
      }      

    function renderPreviousButton(){
        if (code == null){return null;}
        return (
        <Grid item xs={12} align="center">
            <div className="createbutton" onClick={handlePreviousPressed}> See My Rewind</div>
        </Grid>);    
    } 

  useEffect(() => {
    checkUser(); 
  });

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
        {renderPreviousButton()}
        <Grid item xs={12} align="center">
          <div className="createbutton" onClick={handleHelpPressed}> Help </div>    
        </Grid>                   
      </Grid> 
      
    );
}
