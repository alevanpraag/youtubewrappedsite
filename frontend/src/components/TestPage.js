import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Grid, Button, Typography, withStyles } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import Plotly from 'plotly.js-dist-min';

export default function TestPage(props){
  function makeGraph(){
    var data = [
      {
        x: ['giraffes', 'orangutans', 'monkeys'],
        y: [20, 14, 23],
        type: 'bar'
      }
    ]; 
    var layout = {
      showlegend: false
  };
    var element =  document.getElementById('myDiv');
    if (typeof(element) != 'undefined' && element != null)
    {
      Plotly.newPlot('myDiv', data,layout, {staticPlot: true});
    }    
  }
  useEffect(() => {
    makeGraph(); 
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
        <div id="myDiv"></div>     
        </Grid>                 
      </Grid>
      )
}


