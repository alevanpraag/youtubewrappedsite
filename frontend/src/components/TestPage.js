import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Grid, Button, Typography, withStyles } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import IMAGES from '../index.js';

export default function TestPage(props){
  
    return (
      <div>
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <h3>REWIND TEST</h3>
          <div style={{ position: "relative" }}>
            <img src={IMAGES.play} width="59" height="53" className="under"/>  
            <img src={IMAGES.play} width="59" height="53" className="over"/>
          </div>
        </Grid>                  
      </Grid>        
          <div className="rewind">
            <img src={IMAGES.play} width="59" height="53" className="over"/>
            <img src={IMAGES.play} width="59" height="53" className="under"/>  
          </div>
      </div>

      
      )
}


