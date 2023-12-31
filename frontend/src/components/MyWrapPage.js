import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";

export default function MyWrapPage(props){
  const [name, setName] = useState("");
  const [count, setCount] = useState(null);
  let {code} = useParams();

  fetch('/api/get-wrap' + '?code=' + code)
  .then((response) => response.json()) 
  .then((data) => {setCount(data.count);
                    setName(data.name)})   

    function pageInfo(){
      const videos = "" + count;
      return ("You watched "+ videos +" videos");
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h3" variant="h3">
          {name}'s 2023
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
      <Typography variant="body1">
          {pageInfo()}
        </Typography>
      </Grid>    
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>        
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
    )
}

