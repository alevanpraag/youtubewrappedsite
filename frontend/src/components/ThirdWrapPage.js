import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import { render } from "react-dom";

export default function ThirdWrapPage(props){
    let {code} = useParams();  
    const navigate = useNavigate();
    const [jan, setJan] = useState("");
    const [feb, setFeb] = useState("");
    const [mar, setMar] = useState("");
    getMonthData();

    function handleBack() {
        navigate('/mywrap2/'+code)
    }  

    function monthInfo(month){
        return month+" videos"
      }

    function getMonthData() {
        fetch("/api/get-month"  + '?code=' + code)
        .then((response) => response.json()) 
        .then((data) => {setJan(data['01']);
                            setFeb(data['02']);
                            setMar(data['03']);
        })  
    }
 
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
      <Typography variant="h4">
            Your year at a glance:
          </Typography>      
      </Grid>       
      <Grid item xs={12} align="center">
        <h6>January you watched {monthInfo(jan)}</h6>
        <h6>February you watched {monthInfo(feb)}</h6>
        <h6>March you watched {monthInfo(mar)}</h6>
      </Grid>              
        <Grid item xs={12} align="center"></Grid>
      <div
          className="createbutton"
          onClick={handleBack}
        > back
        </div>
        <Grid/>               
    </Grid>
    )
}

