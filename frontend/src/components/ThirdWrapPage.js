import React, { useEffect, useState } from "react";
import { json, useNavigate, useParams } from 'react-router-dom';
import { Container, Grid} from '@mui/material';
import { render } from "react-dom";
import Plotly from 'plotly.js-dist-min';
import IMAGES from '../index.js';

export default function ThirdWrapPage(props){
    let {code} = useParams();  
    const navigate = useNavigate();
    const [counts, setCounts] = useState(null);

    async function makeGraph(){
      let response = await fetch("/api/get-month"  + '?code=' + code);
      let json_data = await response.json();
      let arr = [];
        for (let step = 12; step > 0; step--) {
          let m = step.toString();
          if (step < 10){
            m = "0"+m;
          }
          let count = json_data[m]
          arr.push(count);
        }
          setCounts(arr);
      let data = [
      {
            y: ['December', 'November', 'October','September','August','July','June','May','April','March','February','January'],
            x: counts,
            type: 'bar',
            orientation: 'h',
            text: counts? counts.map(String) : [],
            textposition: "outside" ,
            marker: {
              color: ['#EE9B00', '#CA6702','#BB3E03', '#AE2012', '#9B2226', 
                      '#EE9B00', '#CA6702','#BB3E03', '#AE2012', '#9B2226',
                      '#EE9B00', '#CA6702']
            }
          }
        ]; 
        let layout = {
            paper_bgcolor: "rgba(255,255,255, 0)",
            plot_bgcolor:"rgba(255,255,255, 0)" ,
            showlegend: false,
            xaxis: {visible: false},
            font: {color: '#EAF0F6'},
            bargap:0
      };
        let element =  document.getElementById('myDiv');
        if (typeof(element) != 'undefined' && element != null)
        {
          Plotly.newPlot('myDiv', data,layout, {staticPlot: true});
        }    
      } 

    function handleBack() {
        navigate('/mywrap2/'+code)
    }  
    function handleNext() {
        navigate('/mywrap4/'+code)
    }    

    function handleHomePressed() {
      navigate('/');
    }  
    useEffect(() => {
        makeGraph(); 
      }); 

     

    return (
    <Container>
    <Grid className="center" container spacing={2}>
      <Grid item xs={12} align="center">
      <h6>How many videos you watched each month</h6>      
      </Grid>       
      <Grid item xs={12} align="center">
        <div id="myDiv"></div>
      </Grid>                            
    </Grid>
    <Grid className="footer" align="center" container spacing={2} >
    <Grid item xs={6} align="right">
        <div className="createbutton" onClick={handleBack}>
          <img src={IMAGES.rewind} width="49" height="26" />
        </div>  
      </Grid>    
      <Grid item xs={6} align="left">
        <div className="createbutton" onClick={handleNext}>
          <img src={IMAGES.forward} width="49" height="26" />
        </div>
      </Grid>         
    </Grid>
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