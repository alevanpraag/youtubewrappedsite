import React, {useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import FormControl from "@material-ui/core/FormControl";
import { useNavigate } from 'react-router-dom';


export default function CreateWrapPage(props) {
  const [name, setName] = useState(null);
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
    navigate('/loading/'+data.code)
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

  function renderCreateButton(){
    if ((file == null) || (!name)){
      return null;
    }
    return (
      <Grid item xs={12} align="center">
        <div className="createbutton" onClick={handleUploadPressed}> Create</div>
      </Grid>);    
  }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <h2>Create your</h2>
          <h3>REWIND</h3>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
              <input
                required={true}
                type="text"
                onChange={handleNameChange}
                variant="outlined"
                placeholder="Enter Your Name"
                className="namebutton"
              />
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <input type="file" name="file" id="file" className="inputfile" onChange={handleFileChange} accept=".json"/>
		      <label htmlFor="file"> {filename}</label>
        </Grid>        
          {renderCreateButton()}
        <Grid item xs={12} align="center">
          <div className="createbutton" onClick={handleBackPressed}> Back</div>
        </Grid> 
      </Grid>
    );
}