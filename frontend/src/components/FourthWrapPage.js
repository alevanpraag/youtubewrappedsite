import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import { render } from "react-dom";
import Plotly from 'plotly.js-dist-min';
import IMAGES from '../index.js';

export default function FourthWrapPage(props){
    let {code} = useParams();  
    const navigate = useNavigate();
    const [counts, setCounts] = useState(null);
    const [categories, setCategories] = useState(null);
    if (counts == null){
        getCatData();
    }

    function makeGraph(){
        if (counts == null){return null;}
        var data = [
          {
            labels: categories,
            values: counts,
            textinfo: "label",
            textposition: "outside",
            automargin: true,
            type: 'pie'
          }
        ]; 
        var layout = {
            paper_bgcolor: "rgba(255,255,255, 0)",
            plot_bgcolor:"rgba(255,255,255, 0)" ,
            showlegend: false,
            font: {color: '#EAF0F6'},
            height: 600,
            width: 600,
      };
        var element =  document.getElementById('myDiv');
        if (typeof(element) != 'undefined' && element != null)
        {
          Plotly.newPlot('myDiv', data,layout,  {displayModeBar: false});
        }    
      } 

    function handleBack() {
        navigate('/mywrap3/'+code)
    }  

    function getCatData() {
        fetch("/api/get-categories"  + '?code=' + code)
        .then((response) => response.json()) 
        .then((data) => {
            var tmp_counts = [];
            var tmp_cats = [];
            for (const [key, value] of Object.entries(data)) {
                tmp_cats.push(key);
                tmp_counts.push(value);
              }
            setCounts(tmp_counts);
            setCategories(tmp_cats);
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
    </Grid>
    )
}