import React, { useEffect, useState } from "react";
import {Box, Grid} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IMAGES from '../index.js';

export default function TestPage(props) {   
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
      <Box className="center" sx={{ width: '100%' }}>
        <Grid container spacing={4}>
        <Grid item xs={12} align="center">
        <h1>YouTube</h1>
        <img src={IMAGES.title} width="500" height="100" />
        </Grid>
        <Grid item xs={12} align="center">
            <div className="createbutton" onClick={handleBeginPressed}> 
            <img src={IMAGES.play} width="59" height="53" />
            <h2 style={{fontSize : '1.5rem', fontWeight : '400'}}>Start</h2>
            </div>
        </Grid>  
        {renderPreviousButton()}
        <Grid item xs={12} align="center">
          <div className="createbutton" onClick={handleHelpPressed}> Help </div>    
        </Grid>                   
      </Grid> 
      </Box>
      
    );
}


