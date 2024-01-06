import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import IMAGES from '../index.js';

export default function MyWrapPage(props){
  const [name, setName] = useState("");
  const [count, setCount] = useState(null);
  const navigate = useNavigate();
  let {code} = useParams();
  getWrapDetails(); 

  function getWrapDetails(){
    fetch('/api/get-wrap' + '?code=' + code)
    .then((response) => {
      if (!response.ok){navigate('/');}
      return response.json();}) 
    .then((data) => {setCount(data.count);
                      setName(data.name);})     
  }  
              
  function countInfo(){
    return "You watched "+ count +" videos"
  }
  function handleNext() {
    navigate('/mywrap2/'+code)
  }
  function handleBack() {
    navigate('/create')
}    

  return (
    <Grid container spacing={1} >
      <Grid item xs={12} align="center">
        <h3>{name}'s 2023</h3>
      </Grid>
      <Grid item xs={12} align="center">
        <h6>{countInfo()}</h6>
      </Grid>          
      <Grid item xs={6} align="left">
        <div className="createbutton" onClick={handleBack}>
          <img src={IMAGES.rewind} width="49" height="26" />
        </div>  
      </Grid>    
      <Grid item xs={6} align="right">
        <div className="createbutton" onClick={handleNext}>
          <img src={IMAGES.forward} width="49" height="26" />
        </div>
      </Grid>        
    </Grid>
    )
}

