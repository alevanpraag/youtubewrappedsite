import React, { useEffect, useState } from "react";
import {Container, Grid} from '@mui/material';
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
      <Container>
        <Grid className="center" align="center" container spacing={1}>
          <Grid item xs={12} align="center">
            <h2>YouTube</h2>
            <img src={IMAGES.title} width="500" height="100" />
          </Grid>
          <Grid item xs={12} align="center">
            <div className="playbutton" onClick={handleBeginPressed}> 
            <img className="playIcon" src={IMAGES.play} />
            <span className="playText"> Start </span>
            </div>
          </Grid>  
          {renderPreviousButton()}         
        </Grid> 
        <Grid className="header" container spacing={1}>
        <Grid item xs={6} align="left">          
        </Grid>  
        <Grid item xs={6} align="right">     
          <div onClick={handleHelpPressed}>
            <svg className="helpbutton" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM9 15C9 14.4477 9.44771 14 10 14H10.01C10.5623 14 11.01 14.4477 11.01 15C11.01 15.5523 10.5623 16 10.01 16H10C9.44771 16 9 15.5523 9 15ZM7.94871 7.31623C8.12809 6.77807 8.40506 6.47809 8.70974 6.29646C9.03399 6.10317 9.46619 6 10 6C11.1046 6 12 6.89543 12 8C12 8.20274 11.943 8.28424 11.8555 8.36441C11.7181 8.49043 11.4954 8.6061 11.1154 8.76442C11.0733 8.78198 11.0273 8.80071 10.9783 8.82067C10.6686 8.94689 10.2384 9.1222 9.89839 9.35832C9.43763 9.67829 9.00004 10.2016 9.00004 11C9.00004 11.5523 9.44775 12 10 12C10.542 12 10.9833 11.5689 10.9996 11.0309C11.0091 11.023 11.022 11.013 11.0392 11.0011C11.1836 10.9007 11.3769 10.8208 11.7067 10.6844L11.7077 10.6839C11.7628 10.6612 11.8216 10.6368 11.8846 10.6106C12.2547 10.4564 12.782 10.2283 13.207 9.83872C13.682 9.40326 14 8.79726 14 8C14 5.79086 12.2092 4 10 4C9.22766 4 8.40986 4.14683 7.68566 4.57854C6.94189 5.02191 6.37196 5.72193 6.05134 6.68377C5.8767 7.20772 6.15986 7.77404 6.6838 7.94868C7.20774 8.12333 7.77406 7.84017 7.94871 7.31623Z"/>
            </svg>
          </div>             
        </Grid>    
      </Grid>          
      </Container> 
    );
}
