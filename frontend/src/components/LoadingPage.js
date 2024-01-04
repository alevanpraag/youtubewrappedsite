import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Grid, Button, Typography, withStyles } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';

export default function LoadingPage(props){
  const [error, setError] = useState("");
  let {code} = useParams();
  const navigate = useNavigate();
    
  function createAnalysis() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
      }),
    };
    fetch("/api/process-wrap", requestOptions)
      .then((response) => {
        if (response.ok) {
          navigate('/mywrap/'+code);
        } else {
          setError("Wrap not found.");
        }
      })
      .catch((error) => {
        console.log({error});
      });
  } 

  useEffect(() => {
    createAnalysis(); 
  });

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <h2>
            Creating Your 2023
          </h2>
          <h3>REWIND</h3>
        </Grid>  
        <Grid item xs={12} align="center">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </Grid>                 
      </Grid>
      )
}

