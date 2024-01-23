import React, {useEffect, useState } from "react";
import {Container, Box, Grid} from '@mui/material';
import FormControl from "@material-ui/core/FormControl";
import { useNavigate } from 'react-router-dom';
import IMAGES from '../index.js';


export default function CreateWrapPage(props) {
  const [name, setName] = useState(null);
  const [file, setFile] = useState(null);
  const [code, setCode] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);    
  const [filename, setFilename] = useState(<span>Choose a File&hellip;</span>);  
  const navigate = useNavigate(); 

  function handleNameChange(e) {
    setName(e.target.value);
    let chars = e.target.value.length;
    if (chars>=10){
      setErrorText("Max character limit reached")
    } else {
      setErrorText("")
    }
  }

  function handleFileChange(e) { 
    setError(false);
    setFile(e.target.files[0]);
    setFilename(<span>{e.target.files[0].name}</span>);    
  }

  function handleHomePressed() {
    navigate('/')
  }  
  function handleHelpPressed() {
    navigate('/help')
  }      

  function renderError(){
    if (!error){
      return (<em style={{ fontSize: "1.5rem", color: "#94D2BD" }}>  Give us a nickname and upload your YouTube watch history</em>);
    }
    return (
      <em style={{ fontSize: "1.5rem", color: "#EE9B00" }}> Something went wrong... please upload a valid file</em>
    );
  }
  function goToWrap(){
    if (code != null){
      navigate('/mywrap/'+code);
    }
  }

  function handleUploadPressed() {
    setLoading(true);
    let form_data = new FormData();
    form_data.append("file", file);
    form_data.append("name", name);    
    const requestOptions = {
      method: "POST",
      headers: {'X-CSRFToken': "{{ csrf_token }}", },
      body: form_data,
    };
    fetch("/api/create-wrap", requestOptions)
      .then((response) => {
        if (!response.ok){setError(true);
                          setLoading(false);
                          setFilename(<span>Choose a File&hellip;</span>);
                          setFile(null);}
        return response.json();}) 
      .then((data) => { setCode(data.code);});
  }

  function renderForm(){
    return (
      <Grid className="center" container spacing={1}>
        <Grid item xs={12} align="center">
          <h2>Create your</h2>
          <img src={IMAGES.title} width="500" height="100" />
          <p> {renderError()}</p>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
              <input
                name="name"
                id="name"
                required={true}
                type="text"
                onChange={handleNameChange}
                variant="outlined"
                placeholder="Enter a Name"
                className="namebutton"
                maxLength="10"
              />
              <em style={{ margin: "3px", fontSize: "1rem", color: "#EE9B00" }}>{errorText}</em>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
        <FormControl>
          <input type="file" name="file" id="file" className="inputfile" onChange={handleFileChange} accept=".json"/>
		      <label htmlFor="file"> {filename}</label>
          </FormControl>
        </Grid>     
        {renderCreateButton()}
          <Grid item xs={12} display="flex" alignItems="center" justifyContent="center" gap={1}>
          <h4 style={{ color: "#AE2012", fontSize: "1.25rem" }}> Please request your watch history from your Google account </h4>   
          <div onClick={handleHelpPressed}>
            <svg className="helpbutton" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM9 15C9 14.4477 9.44771 14 10 14H10.01C10.5623 14 11.01 14.4477 11.01 15C11.01 15.5523 10.5623 16 10.01 16H10C9.44771 16 9 15.5523 9 15ZM7.94871 7.31623C8.12809 6.77807 8.40506 6.47809 8.70974 6.29646C9.03399 6.10317 9.46619 6 10 6C11.1046 6 12 6.89543 12 8C12 8.20274 11.943 8.28424 11.8555 8.36441C11.7181 8.49043 11.4954 8.6061 11.1154 8.76442C11.0733 8.78198 11.0273 8.80071 10.9783 8.82067C10.6686 8.94689 10.2384 9.1222 9.89839 9.35832C9.43763 9.67829 9.00004 10.2016 9.00004 11C9.00004 11.5523 9.44775 12 10 12C10.542 12 10.9833 11.5689 10.9996 11.0309C11.0091 11.023 11.022 11.013 11.0392 11.0011C11.1836 10.9007 11.3769 10.8208 11.7067 10.6844L11.7077 10.6839C11.7628 10.6612 11.8216 10.6368 11.8846 10.6106C12.2547 10.4564 12.782 10.2283 13.207 9.83872C13.682 9.40326 14 8.79726 14 8C14 5.79086 12.2092 4 10 4C9.22766 4 8.40986 4.14683 7.68566 4.57854C6.94189 5.02191 6.37196 5.72193 6.05134 6.68377C5.8767 7.20772 6.15986 7.77404 6.6838 7.94868C7.20774 8.12333 7.77406 7.84017 7.94871 7.31623Z"/>
            </svg>
          </div>             
        </Grid>  
        </Grid>     
    );
  }

  function renderLoading(){
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
        <Grid item xs={12} align="center">
        <p> <em style={{ fontSize: "1.5rem", color: "#94D2BD" }}> Please wait, this can take several minutes...</em></p>
        </Grid>                       
      </Grid>      
    );
  }

  function renderCreateButton(){
    if ((file == null) || (!name) || loading){
      return null;
    }
    return (
      <Grid item xs={12} align="center">
        <div className="createbutton" onClick={handleUploadPressed}> Create</div>
      </Grid>);    
  }

  useEffect(() => {
    goToWrap(); 
  });

    return (
      <Container>           
      { loading ? renderLoading() : renderForm()}  
      <Grid className="header" container spacing={1}>
        <Grid item xs={6} align="left">
          <div onClick={handleHomePressed}>
          <svg className="homebutton" viewBox="0 0 30 31" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M17.8456 16.3264L15 14.5037L12.1544 16.3264V19.4963H17.8456L17.8456 16.3264ZM15 16.285L13.6544 17.1469V17.9963H16.3456V17.1469L15 16.285Z"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M14.9999 9.7807L21.957 14.67L21.957 23.1731H8.04281V14.67L14.9999 9.7807ZM10.0428 15.709L14.9999 12.2252L19.957 15.7089L19.957 21.1731H10.0428V15.709Z"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M25.5984 12.5066C25.8512 12.6954 26 12.9923 26 13.3078L26 26.0962C26 26.6485 25.5523 27.0962 25 27.0962H5C4.44772 27.0962 4 26.6485 4 26.0962V13.3078C4 12.9924 4.14884 12.6954 4.40156 12.5066L14.4016 5.03703C14.7565 4.77192 15.2435 4.77192 15.5984 5.03703L25.5984 12.5066ZM15 7.08637L6 13.809V25.0962H24L24 13.809L15 7.08637Z"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M28.8253 10.0994C29.5658 10.6671 30 11.5471 30 12.4802L30 28C30 29.6569 28.6569 31 27 31H3C1.34315 31 0 29.6569 0 28V12.4802C0 11.5471 0.434185 10.6671 1.17471 10.0994L13.1747 0.899393C14.2515 0.0738183 15.7485 0.0738192 16.8253 0.899394L21 4.1V2C21 1.44772 21.4477 1 22 1H26C26.5523 1 27 1.44772 27 2V8.7L28.8253 10.0994ZM27.6084 11.6866L15.6084 2.48661C15.2495 2.21141 14.7505 2.21141 14.3916 2.48661L2.39157 11.6866C2.14473 11.8759 2 12.1692 2 12.4802V28C2 28.5523 2.44772 29 3 29H27C27.5523 29 28 28.5523 28 28L28 12.4802C28 12.1692 27.8553 11.8758 27.6084 11.6866ZM25 7.16667V3H23V5.63333L25 7.16667Z"/>
          </svg>
          </div>            
        </Grid>     
      </Grid>                
      </Container>
    );
}