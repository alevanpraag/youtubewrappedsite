import React, { useState } from "react";
import { Grid, Typography, withStyles, Button} from "@material-ui/core";

export default function TestPage(props){

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </Grid>
      <Grid item xs={12} align="center">
      <div className="rectangle">
      <img src="https://i.ytimg.com/vi/Bp3Ytv-v918/maxresdefault.jpg" alt="alternatetext" width="480" height="270"></img>
      </div>
      </Grid>     
      <Grid item xs={12} align="center">
        <div className="createbutton">CREATE</div>   
      </Grid>                
    </Grid>
    )
}

