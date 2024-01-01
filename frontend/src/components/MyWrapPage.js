import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";

export default function MyWrapPage(props){
  const [name, setName] = useState("");
  const [count, setCount] = useState(null);
  const [music, setMusic] = useState(null);
  let {code} = useParams();
  const navigate = useNavigate();

  fetch('/api/get-wrap' + '?code=' + code)
  .then((response) => response.json()) 
  .then((data) => {setCount(data.count);
                    setName(data.name);
                    setMusic(data.music_count)})   
              
  function countInfo(){
    const videos = "" + count;
    return "You watched "+ videos +" videos"
  }

  function musicInfo(){
    const music_videos = "" + music;
    return music_videos +" were music videos"
  }

  function handleNext() {
    navigate('/mywrap2/'+code)
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h3" variant="h3">
          {name}'s 2023
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
      <Typography variant="body1">{countInfo()}</Typography>
      </Grid>    
      <Grid item xs={12} align="center">
      <Typography variant="body1">{musicInfo()}</Typography>
      </Grid>         
      <Grid item xs={12} align="center"></Grid>
      <div
          className="createbutton"
          onClick={handleNext}
        > Next
        </div>
        <Grid/>
    </Grid>
    )
}

