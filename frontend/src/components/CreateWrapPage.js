import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link, useNavigate } from 'react-router-dom';
import { withStyles } from "@material-ui/core";


export default function CreateWrapPage(props) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(<span>Choose a File&hellip;</span>);  
  const navigate = useNavigate();

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleFileChange(e) { 
    setFile(e.target.files[0]);
    setFilename(<span>{e.target.files[0].name}</span>);    
  }

  function goToLoad(data) {
    const code = "" + data.code
    navigate('/loading/'+code)
  }
  function handleBackPressed() {
    navigate('/')
  }  

  function handleUploadPressed() {
    let form_data = new FormData();
    form_data.append("file", file);
    form_data.append("name", name);    
    const requestOptions = {
      method: "POST",
      headers: {'X-CSRFToken': "{{ csrf_token }}", },
      body: form_data,
    };
    fetch("/api/create-wrap", requestOptions)
      .then((response) => response.json())
      .then((data) => goToLoad(data));
  }
  const MainText = withStyles({
    root: {
        color: "#1d3557"
    }
  })(Typography); 
 
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <MainText component="h3" variant="h3">
            Create A Rewind
          </MainText>
        </Grid>
        <Grid item xs={12} align="center">
        <FormControl>
            <TextField
              required={true}
              type="text"
              onChange={handleNameChange}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
              <FormHelperText>Name</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
        <input type="file" name="file" id="file" className="inputfile" onChange={handleFileChange} accept=".json"/>
		    <label htmlFor="file"> {filename}</label>
        </Grid>        
        <Grid item xs={12} align="center">
            <div
          className="createbutton"
          onClick={handleUploadPressed}
        > CREATE
        </div>
        </Grid>
        <Grid item xs={12} align="center">
        <div
          className="backbutton"
          onClick={handleBackPressed}
        > Back
        </div>
        </Grid>
      </Grid>
    );
}