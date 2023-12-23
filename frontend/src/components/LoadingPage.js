import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Grid, Button, Typography, withStyles } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';

export default function LoadingPage(props){
  const [count, setCount] = useState(null);
  let {code} = useParams();
  const navigate = useNavigate();
  const RedTextTypography = withStyles({
    root: {
      color: "#1d3557"
    }
  })(Typography);

    useEffect(() => {
      if (count == null) {
        fetch('/api/process-wrap' + '?code=' + code )
        .then((response) => response.json()) 
        .then((data) => {setCount(data.count);})        
      } else {
        navigate('/mywrap/'+code);
      }      
    })
    
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </Grid>
        <Grid item xs={12} align="center">
          <RedTextTypography component="h4" variant="h4" color="textSecondary">
            Creating Your 2023 Wrapped
          </RedTextTypography>
        </Grid>           
      </Grid>
      )
}

