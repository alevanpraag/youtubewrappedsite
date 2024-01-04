import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Typography, IconButton } from "@material-ui/core";

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
                <Typography variant="h4"> Your first video watched:</Typography>      
            </Grid>   
            <Grid item xs={12} align="center">
                <Typography variant="h6">{name}</Typography> 
            </Grid>        
            <Grid item xs={12} align="center">
                <div className="rectangle">        
                    <img src={url} alt="firstvideo" width="480" height="270"></img>
                </div>
            </Grid>   
            <Grid item xs={12} align="center"></Grid>
                <div className="createbutton" onClick={handleNext}> Next</div>
            <Grid/>
            <Grid item xs={12} align="center"></Grid>
                <div className="createbutton" onClick={handleBack}> Back</div>
            <Grid/>               
        </Grid>
        )
}

