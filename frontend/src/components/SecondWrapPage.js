import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import IMAGES from '../index.js';

export default function SecondWrapPage(props){
    let {code} = useParams();
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const navigate = useNavigate();
    getWrapDetails();

    function getWrapDetails(){
        fetch('/api/get-first' + '?code=' + code)
        .then((response) => response.json()) 
        .then((data) => {setUrl(data.thumbnail);
                          setName(data.title)})        
    }

    function handleNext() {
        navigate('/mywrap3/'+code)
    }

    function handleBack() {
        navigate('/mywrap/'+code)
    }  

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <h4> Your first video watched:</h4>      
            </Grid>   
            <Grid item xs={12} align="center">
                <h6>{name}</h6> 
            </Grid>        
            <Grid item xs={12} align="center">
                <div className="rectangle">        
                    <img src={url} alt="firstvideo" width="480" height="270"></img>
                </div>
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

