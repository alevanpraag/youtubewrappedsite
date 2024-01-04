import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";

export default function MyWrapPage(props){
  const [name, setName] = useState("");
  const [count, setCount] = useState(null);
  const [music, setMusic] = useState(null);
  const navigate = useNavigate();
  let {code} = useParams();
  getWrapDetails(); 

  function getWrapDetails(){
    fetch('/api/get-wrap' + '?code=' + code)
    .then((response) => {
      if (!response.ok){navigate('/');}
      return response.json();}) 
    .then((data) => {setCount(data.count);
                      setName(data.name);
                      setMusic(data.music_count)})     
  }  
              
  function countInfo(){
    return "You watched "+ count +" videos"
  }

  function musicInfo(){
    return music +" were music videos"
  }
  function handleNext() {
    navigate('/mywrap2/'+code)
  }
  function handleBack() {
    navigate('/create')
}    

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <h3>{name}'s 2023</h3>
      </Grid>
      <Grid item xs={12} align="center">
        <h6>{countInfo()}</h6>
      </Grid>    
      <Grid item xs={12} align="center">
        <h6>{musicInfo()}</h6>
      </Grid>         
      <Grid item xs={12} align="center">
        <div className="createbutton" onClick={handleNext}> Next</div>
      </Grid>
      <Grid item xs={12} align="center">
        <div className="createbutton" onClick={handleBack}> Back</div>
      </Grid>         
    </Grid>
    )
}

