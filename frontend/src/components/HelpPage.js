import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Container, Grid} from '@mui/material';
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
    if (newPage >= 0 && newPage <6){
      setPage(newPage);
    }
  }

  function renderMoreButton(){
    return ( 
            <Grid item xs={12} align="center">
              <div className="createbutton" onClick={() => handleChangePage(1)}> More </div>
            </Grid>
    );
  }

  function renderNavButtons(){
    return (
            <Grid className="footer" container spacing={2} align="center">
              <Grid item xs={6} align="right">
                <div className="createbutton" onClick={() => handleChangePage(-1)}>
                  <img src={IMAGES.rewind} width="49" height="26" />
                </div>
              </Grid>
              <Grid item xs={6} align="left">
                <div className="createbutton" onClick={() => handleChangePage(1)}>
                  <img src={IMAGES.forward} width="49" height="26" />
                </div>
              </Grid>
            </Grid>
    );
  }

  function renderInfo(){
    switch(page) {
      case 0:
        return (       
          <Grid container spacing={2} align="center">
            <Grid item xs={12} align="center">
              <h6> To create a rewind, you must download your YouTube history from:</h6>
              <Link style={{ color: "#94D2BD", fontSize: "1.5rem" }} to="https://takeout.google.com/">https://takeout.google.com/</Link>
            </Grid>
            <Grid item xs={12} align="center">
              <h6> Click more for step-by-step instructions</h6>
            </Grid>
          </Grid>);
      case 1:
        return (      
          <Grid container spacing={2} align="center">
            <Grid item xs={6} align="right">
              <img src={IMAGES.imgZero} width="500" height="500" />
            </Grid>
            <Grid item xs={6} align="left">
              <img src={IMAGES.imgOne} width="500" height="500" />
            </Grid>
            <Grid item xs={6} align="right">
              <h6>1. Go to <Link style={{ color: "#94D2BD", fontSize: "1.5rem" }} to="https://takeout.google.com/">https://takeout.google.com/</Link></h6>
            </Grid>
            <Grid item xs={6} align="left">
              <h6>2. Deselect all the data</h6>
            </Grid>
          </Grid>);
      case 2:
        return (        
          <Grid item xs={12} align="center">
            <img src={IMAGES.imgTwo} width="500" height="500" />
            <h6>3. Scroll down and select "YouTube and YouTube Music"</h6>
          </Grid> );
      case 3:
        return (                    
          <Grid container spacing={2} align="center">
            <Grid item xs={6} align="right">
              <img src={IMAGES.imgFour} width="500" height="500" />
            </Grid>
            <Grid item xs={6} align="left">
              <img src={IMAGES.imgFive} width="500" height="500" />
            </Grid>
            <Grid item xs={6} align="right">
              <h6>4. Click "All YouTube data included"</h6>
            </Grid>
            <Grid item xs={6} align="left">
              <h6>5. Deselect all data except "history"</h6>
            </Grid>
          </Grid>);                              
      case 4:
        return (        
          <Grid item xs={12} align="center">
            <img src={IMAGES.imgSeven} width="500" height="500" />
            <h6>This is how everything should look before exporting</h6>
          </Grid> );
      case 5:
        return (        
          <Grid item xs={12} align="center">
            <img src={IMAGES.imgEight} width="500" height="500" />
            <h6>Choose how you want to recieve the file</h6>
          </Grid> );                             
    }    
  }

    return (
      <Container>       
      <Grid className="center" container spacing={1}>    
        <Grid item xs={12} align="center">
          <img src={IMAGES.help} width="500" height="100" />
        </Grid> 
        <Grid item xs={12} align="center">
        {renderInfo()}   
        </Grid>   
        <Grid item xs={12} align="center">
        { (page > 0) ? null : renderMoreButton()} 
        </Grid>                                     
      </Grid>
      { (page > 0) ? renderNavButtons() : null} 
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
        <Grid item xs={6} align="right">                
        </Grid>    
      </Grid>                 
      </Container>
      )
}

