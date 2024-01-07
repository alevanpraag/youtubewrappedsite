import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import IMAGES from '../index.js';

export default function HelpPage(props){
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  function handleHomePressed() {
    navigate('/');
  }   

  function handleChangePage(value){
    const newPage = page + value;
    if (newPage >= 0 && newPage <7){
      setPage(newPage);
    }
  }

  function renderBackButton(){
    return (<div className="createbutton" onClick={() => handleChangePage(-1)}> Back </div>);
    
  }

  function renderInfo(){
    switch(page) {
      case 0:
        return (       
          <Grid container spacing={2}>
          <Grid item xs={12} align="center">
            <h6> To create a rewind, you must download your YouTube history from:</h6>
            <Link style={{ color: "#EAF0F6", fontSize: "1.5rem" }} to="https://takeout.google.com/">https://takeout.google.com/</Link>
          </Grid>
          <Grid item xs={12} align="center">
            <h6> Click more for step-by-step instructions</h6>
          </Grid>
          </Grid>);
      case 1:
        return (       
          <Grid item xs={12} style={{ display: "flex", gap: "1rem" }}>
          <div>
          <img src={IMAGES.imgZero} width="550" height="550" />
          <h6>1. Go to https://takeout.google.com/</h6>
          </div>
          <div>
          <img src={IMAGES.imgOne} width="550" height="550" />
          <h6>2. Deselect all the data</h6>
          </div>
        </Grid>);
      case 2:
        return (        
          <Grid item xs={12} align="center">
            <img src={IMAGES.imgTwo} width="550" height="550" />
            <h6>3. Scroll down and select "YouTube and YouTube Music"</h6>
          </Grid> );
      case 3:
        return (                    
            <Grid item xs={12} style={{ display: "flex", gap: "1rem" }}>
              <div>
              <img src={IMAGES.imgFour} width="550" height="550" />
              <h6>4. Click "All YouTube data included"</h6>
              </div>
              <div>
              <img src={IMAGES.imgFive} width="550" height="550" />
              <h6>5. Deselect all data except "history"</h6>
              </div>
            </Grid>);
      case 4:
        return (                          
            <Grid item xs={12} style={{ display: "flex", gap: "1rem" }}>
              <div>
              <img src={IMAGES.imgThree} width="550" height="550" />
              <h6>6. Click "Multiple formats"</h6>
              </div>
              <div>
              <img src={IMAGES.imgSix} width="550" height="550" />
              <h6>7. Scroll down and select "JSON"</h6>
              </div>
            </Grid>);         
      case 5:
        return (        
          <Grid item xs={12} align="center">
            <img src={IMAGES.imgSeven} width="550" height="550" />
            <h6>This is how everything should look before exporting</h6>
          </Grid> );
      case 6:
        return (        
          <Grid item xs={12} align="center">
            <img src={IMAGES.imgEight} width="550" height="550" />
            <h6>Choose how you want to recieve the file</h6>
          </Grid> );                             
    }    
  }

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <h3>Help</h3>
        </Grid> 
        {renderInfo()}
        <Grid item xs={12} align="center">
          { (page > 0) ? renderBackButton() : null}
          <div className="createbutton" onClick={() => handleChangePage(1)}> More </div>   
        </Grid> 
        <Grid item xs={12} align="center">
          <div className="createbutton" onClick={handleHomePressed}> Home </div>    
        </Grid>                          
      </Grid>
      )
}

