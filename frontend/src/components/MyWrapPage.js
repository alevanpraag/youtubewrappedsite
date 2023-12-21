import React, { Component, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const pages = {
    START: 'pages.start',
    END: 'pages.end'
};

export default function MyWrapPage(props){
    const [page, setPage] = useState(pages.START);
    const [name, setName] = useState("");
    const [count, setCount] = useState(0)
    let { code } = useParams();
    
    
    getWrapDetails();
    function startInfo(){
      const videos = "" + count
      return "You watched"+ videos +"videos";
  }
  
    function endInfo(){
        return "End Page";
  }
    function getWrapDetails(){
        fetch('/api/get-wrap' + '?code=' + code)
        .then((response) => response.json()) 
        .then((data) => {setName(data.name)
                          setCount(data.count)})
    }

    return (
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {name}'s 2023
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="body1">
            {page === pages.START ? startInfo() : endInfo()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <IconButton
            onClick={() => {
              page === pages.END ? setPage(pages.START) : setPage(pages.END);
            }}
          >
            {page === pages.END ? (
              <NavigateBeforeIcon />
            ) : (
              <NavigateNextIcon />
            )}
          </IconButton>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    )
}

