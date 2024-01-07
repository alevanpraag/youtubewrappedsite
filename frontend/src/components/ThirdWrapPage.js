import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { render } from "react-dom";
import Plotly from 'plotly.js-dist-min';
import IMAGES from '../index.js';

export default function ThirdWrapPage(props){
    let {code} = useParams();  
    const navigate = useNavigate();
    const [counts, setCounts] = useState(null);
    if (counts == null){
        getMonthData();
    }

    function makeGraph(){
        if (counts == null){return null;}
        var data = [
          {
            x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            y: counts,
            type: 'bar',
            text: counts.map(String),
            textposition: "outside" ,
            marker: {
              color: 'rgb(142,124,195)'
            }
          }
        ]; 
        var layout = {
            paper_bgcolor: "rgba(255,255,255, 0)",
            plot_bgcolor:"rgba(255,255,255, 0)" ,
            showlegend: false,
            yaxis: {visible: false},
            font: {color: '#EAF0F6'}
      };
        var element =  document.getElementById('myDiv');
        if (typeof(element) != 'undefined' && element != null)
        {
          Plotly.newPlot('myDiv', data,layout, {staticPlot: true});
        }    
      } 

    function handleBack() {
        navigate('/mywrap2/'+code)
    }  
    function handleNext() {
        navigate('/mywrap4/'+code)
    }    

    function getMonthData() {
        fetch("/api/get-month"  + '?code=' + code)
        .then((response) => response.json()) 
        .then((data) => {
            var arr = [];
            for (let step = 1; step < 13; step++) {
                var m = step.toString();
                if (step < 10){
                    m = "0"+m;
                }
                var count = data[m]
                arr.push(count);
              }
            setCounts(arr);
        })  
    }

    useEffect(() => {
        makeGraph(); 
      }); 

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
      <h6>How many videos you watched each month</h6>      
      </Grid>       
      <Grid item xs={12} align="center">
        <div id="myDiv"></div>
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

