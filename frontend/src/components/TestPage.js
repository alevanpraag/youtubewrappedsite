import React, { useEffect, useState } from "react";
import {Box, Grid} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IMAGES from '../index.js';

export default function TestPage(props) {   

    return (
      <Grid className="center" container spacing={1}>
        <Grid item xs={12} align="center">
          <h2>
            Creating Your 2023
          </h2>
          <img src={IMAGES.title} width="500" height="100" />
        </Grid>  
        <Grid item xs={12} align="center">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </Grid>                   
      </Grid>  
      
    );
}


