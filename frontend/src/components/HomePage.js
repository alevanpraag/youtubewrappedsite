import React, { useEffect, useState } from "react";
import {Container, Grid} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IMAGES from '../index.js';

export default function HomePage(props) {   
    const [code, setCode] = useState("");
    const [prevUser, setPrevUser] = useState(false);
    const navigate = useNavigate();   
     
    function title() {
      if (window.innerWidth> 0 && window.innerWidth < 700) {
        return (<img src={IMAGES.title} width="300" height="60" />);
      } else if (window.innerWidth > 700) {
        return (<img src={IMAGES.title} width="500" height="100" />);
      } 
     }
    

    function checkUser(){
        fetch('/api/check-user')
        .then((response) => (response.json()))
        .then((data) => { setPrevUser(data.prevUser);
                          setCode(data.code);})    
      }

    function handlePreviousPressed() {
        navigate('/mywrap/'+code) 
      }        

    function handleBeginPressed() {
        navigate('/create')
      }  

    function renderPreviousButton(){
        return (
          <>
          <Grid item xs={2} align="center"></Grid> 
        <Grid item xs={8} align="center">
            <div className="createbutton" onClick={handlePreviousPressed}> See My Rewind</div>
        </Grid>
          </>);    
    } 
    useEffect(() => {
      // check if user has created a rewind before
      checkUser();  
      title();
    });    

    return (
      <Container>
        <Grid className="center" align="center" container spacing={1}>
          <Grid item xs={12} align="center">
            <h2>YouTube</h2>
            {title()}
          </Grid>
          <Grid item xs={2} align="center"></Grid>
          <Grid item xs={8} align="center">
              <h4 style={{ color: "#94D2BD" }}> Here your YouTube memories are not just data but a story waiting to be told...</h4>
          </Grid>         
          <Grid item xs={2} align="center"></Grid> 
          <Grid item xs={2} align="center"></Grid>  
          <Grid item xs={8} align="center">
            <div className="playbutton" onClick={handleBeginPressed}> 
            <img className="playIcon" src={IMAGES.play} />
            <span className="playText"> Start </span>
            </div>
          </Grid>     
          <Grid item xs={2} align="center"></Grid> 
          {(prevUser) ? renderPreviousButton() : null}         
        </Grid>         
      </Container> 
    );
}
