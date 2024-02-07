import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Grid} from '@mui/material';
import IMAGES from '../index.js';

export default function FifthWrapPage(props){
    const [channelA, setChannelA] = useState({name: '', url: '', count: 0});
    const [channelB, setChannelB] = useState({name: '', url: '', count: 0});
    const [channelC, setChannelC] = useState({name: '', url: '', count: 0});
    const [mobileView, setMobileView] = useState(false);

    const navigate = useNavigate();

    let {code} = useParams();

    function onMobile(){
        if (window.innerWidth> 0 && window.innerWidth < 700) {
          setMobileView(true)
        }    
      }    

    function getWrapDetails(){
        fetch('/api/top-channel' + '?code=' + code)
        .then((response) => response.json()) 
        .then((data) => {
                        setChannelA({
                            name: data.channelA,
                            url: data.thmnlA,
                            count: data.countA
                        });          
                        setChannelB({
                            name: data.channelB,
                            url: data.thmnlB,
                            count: data.countB
                        });     
                        setChannelC({
                            name: data.channelC,
                            url: data.thmnlC,
                            count: data.countC
                        });                            
                    })        
    }

    function handleNext() {
        navigate('/mywrap6/'+code)
    }

    function handleBack() {
        navigate('/mywrap3/'+code)
    }  
    function handleHomePressed() {
        navigate('/');
      }       

    function renderChannel(){
        return (
            <Grid className="center" container spacing={2}>
            <Grid item xs={12} align="center">
                <h2> Your top channel:</h2>      
            </Grid>                
            <Grid item xs={12} align="center">
                <img src={url} alt="top" width="88" height="88"></img>
            </Grid>     
            <Grid item xs={12} align="center">
                <h6>{channel}</h6> 
            </Grid>                
            <Grid item xs={12} align="center">
                <h6> You watched {count} of their videos</h6> 
            </Grid>                         
        </Grid>            
        );
    }
    function renderTop(channel,rank){
        return (
        <Grid container spacing={1}> 
        <Grid item xs={3}></Grid>       
            <Grid item xs={2} align="center" sx={{ display: 'flex', justifyContent: "center", alignItems: "center"}}>     
                <span style={{ color: "#94D2BD", fontSize: "3.5rem", fontFamily: 'Orbitron' }}>{rank} </span>
            </Grid>  
            <Grid item xs={2} align="center">     
                <img src={channel.url} sx={{ display: 'flex', justifyContent: "center", alignItems: "center"}} alt="top" width="88" height="88"></img>
            </Grid> 
            <Grid item xs={5} align="center" sx={{ display: 'flex', justifyContent: "center", alignItems: "flex-start", flexDirection: 'column'}}>       
                <h6 style={{ color: '#E9D8A6',fontSize: "2rem", display: 'flex', justifyContent: "center", alignItems: "flex-end"}}> {channel.name}</h6>
                <h6 style={{ color: '#0A9396',fontSize: "1.25rem"  }}> watched <span style={{color: '#94D2BD',fontSize: "1.25rem", fontFamily: 'Orbitron' }}>{channel.count} </span> videos</h6>
            </Grid>                                                 
        </Grid>            
        );
    }        
    function renderMiniTop(channel,rank){
      return (
        <Grid container spacing={1}>      
            <Grid item xs={2} align="center" sx={{ display: 'flex', justifyContent: "center", alignItems: "center"}}>     
                <span style={{ color: "#94D2BD", fontSize: "2rem", fontFamily: 'Orbitron' }}>{rank} </span>
            </Grid>  
            <Grid item xs={5} align="center">     
                <img src={channel.url} sx={{ display: 'flex', justifyContent: "center", alignItems: "center"}} alt="top" width="88" height="88"></img>
            </Grid> 
            <Grid item xs={5} align="center" sx={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: 'column'}}>       
                <h6 style={{ color: '#E9D8A6',fontSize: "1.5rem"}}> {channel.name}</h6>
                <h6 style={{ color: '#005F73',fontSize: "1rem"  }}> {channel.count} videos</h6>
            </Grid>                                                 
        </Grid>     
      );
  }        


function renderMobileTop3(){
  return (
    <Grid container spacing={1}>     
    <Grid item xs={12} align="center" style={{marginBottom: '10px'}}>
    <h2 style={{ fontSize: "1.5rem",color: "#BB3E03" }}> Your <span style={{ color: "#EE9B00", fontFamily: 'Orbitron' }}>top channels</span> this year</h2>      
    </Grid> 
      {(channelA.count>0) ? renderMiniTop(channelA,1) : null}
      {(channelB.count>0) ? renderMiniTop(channelB,2) : null}
      {(channelC.count>0) ? renderMiniTop(channelC,3) : null}                     
  </Grid>      
  );   
}

  function renderTop3(){
    return (
      <Grid container spacing={1}>     
      <Grid item xs={12} align="center" style={{marginBottom: '10px'}}>
          <h2 style={{ color: "#BB3E03" }}> Your <span style={{ color: "#EE9B00", fontSize: "2rem", fontFamily: 'Orbitron' }}>top channels</span> this year</h2>      
      </Grid> 
      <Grid item xs={1}></Grid>
      <Grid item xs={10} align="center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {(channelA.count>0) ? renderTop(channelA,1) : null}
      </Grid>
      <Grid item xs={1}></Grid>
      <Grid item xs={1}></Grid>
      <Grid item xs={10} align="center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {(channelB.count>0) ? renderTop(channelB,2) : null}
      </Grid>   
      <Grid item xs={1}></Grid>
      <Grid item xs={1}></Grid>  
      <Grid item xs={10} align="center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {(channelC.count>0) ? renderTop(channelC,3) : null}
      </Grid>    
      <Grid item xs={2}></Grid>                   
    </Grid>      
    );
  }
  useEffect(() => {
    getWrapDetails();
    onMobile();
}, []);    

    return (
        <div className="wrap">    
        <header>
              <div onClick={handleHomePressed}>
              <svg className="homebutton" viewBox="0 0 30 31" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M17.8456 16.3264L15 14.5037L12.1544 16.3264V19.4963H17.8456L17.8456 16.3264ZM15 16.285L13.6544 17.1469V17.9963H16.3456V17.1469L15 16.285Z"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M14.9999 9.7807L21.957 14.67L21.957 23.1731H8.04281V14.67L14.9999 9.7807ZM10.0428 15.709L14.9999 12.2252L19.957 15.7089L19.957 21.1731H10.0428V15.709Z"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M25.5984 12.5066C25.8512 12.6954 26 12.9923 26 13.3078L26 26.0962C26 26.6485 25.5523 27.0962 25 27.0962H5C4.44772 27.0962 4 26.6485 4 26.0962V13.3078C4 12.9924 4.14884 12.6954 4.40156 12.5066L14.4016 5.03703C14.7565 4.77192 15.2435 4.77192 15.5984 5.03703L25.5984 12.5066ZM15 7.08637L6 13.809V25.0962H24L24 13.809L15 7.08637Z"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M28.8253 10.0994C29.5658 10.6671 30 11.5471 30 12.4802L30 28C30 29.6569 28.6569 31 27 31H3C1.34315 31 0 29.6569 0 28V12.4802C0 11.5471 0.434185 10.6671 1.17471 10.0994L13.1747 0.899393C14.2515 0.0738183 15.7485 0.0738192 16.8253 0.899394L21 4.1V2C21 1.44772 21.4477 1 22 1H26C26.5523 1 27 1.44772 27 2V8.7L28.8253 10.0994ZM27.6084 11.6866L15.6084 2.48661C15.2495 2.21141 14.7505 2.21141 14.3916 2.48661L2.39157 11.6866C2.14473 11.8759 2 12.1692 2 12.4802V28C2 28.5523 2.44772 29 3 29H27C27.5523 29 28 28.5523 28 28L28 12.4802C28 12.1692 27.8553 11.8758 27.6084 11.6866ZM25 7.16667V3H23V5.63333L25 7.16667Z"/>
              </svg>
              </div>            
          </header>     
          <section>   
          {mobileView ? renderMobileTop3() : renderTop3()}
          </section>  
          <footer style={{ justifyContent: 'center', gap: '10px' }}>
                <div className="actionbutton" onClick={handleBack}>
              <img src={IMAGES.rewind} width="49" height="26" />   
                </div>  
                <div className="actionbutton" onClick={handleNext}>
              <img src={IMAGES.forward} width="49" height="26" />
            </div>                 
        </footer>             
        </div>
        )
}

