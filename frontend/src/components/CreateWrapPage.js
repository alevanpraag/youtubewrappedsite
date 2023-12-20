import React, { Component, useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link, useParams, useNavigate } from 'react-router-dom';
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function CreateWrapPage(props) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleFileChange(e) { 
    setFile(e.target.files[0]);
  }

  function gotoWrapPage(data)
  {
    const code = data.code;
    navigate('/mywrap/'+code);
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
      .then((data) => gotoWrapPage(data));
  }

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Create A Wrap
          </Typography>
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
            <FormHelperText>
              <div align="center">Name</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
        <form>
                    <input type="file" name="file" onChange={handleFileChange}></input>
                </form>
        </Grid>        
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleUploadPressed}
          >
            Create Wrap
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
}