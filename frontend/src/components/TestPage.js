import React, { useState } from "react";
import { Grid, Typography, withStyles, Button} from "@material-ui/core";

const RedTextTypography = withStyles({
  root: {
    color: "#780000"
  }
})(Typography);
export default function TestPage(props){
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState(<span>Choose a File&hellip;</span>);    
  
    function handleFileChange(e) { 
      setFile(e.target.files[0]);
      setFilename(<span>{e.target.files[0].name}</span>)
    }    

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
      <Grid item xs={12} align="center">
        <input type="file" name="file" id="file" className="inputfile" onChange={handleFileChange} accept=".jpeg"/>
		<label htmlFor="file"> {filename}</label>      
      </Grid>                
    </Grid>
    )
}

