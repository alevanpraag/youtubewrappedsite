import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Grid, Button, Typography, withStyles } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';

export default function TestPage(props){

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
        <div className="rectangle">       
        </div>
        
        </Grid>                 
      </Grid>
      )
}


