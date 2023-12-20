import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class CreateWrapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      file: null,
    };

    this.handleUploadPressed = this.handleUploadPressed.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handleFileChange(e) { 
    this.setState({
      file: e.target.files[0],
    });
  }

  gotoWrapPage(data)
  {
    console.log(data.code);
    const code = data.code
    this.props.history.push('/mywrap/'+code);
  }


  handleUploadPressed = async (e) =>{
    e.preventDefault()
    let form_data = new FormData();
    form_data.append("file", this.state.file);
    form_data.append("name", this.state.name);    
    const requestOptions = {
      method: "POST",
      headers: {'X-CSRFToken': "{{ csrf_token }}", },
      body: form_data,
    };
    fetch("/api/create-wrap", requestOptions)
      .then((response) => response.json())
      .then((data) => this.gotoWrapPage(data));
  }

  render() {
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
              onChange={this.handleNameChange}
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
                    <input type="file" name="file" onChange={this.handleFileChange}></input>
                </form>
        </Grid>        
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleUploadPressed}
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
}