import React from "react";
import { Grid, Typography, withStyles} from "@material-ui/core";

const RedTextTypography = withStyles({
  root: {
    color: "#780000"
  }
})(Typography);
export default function TestPage(props){
    
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

