import React from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'; // Reset icon
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

/*

User Story #26: When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound indicating that time is up should play. This should utilize an HTML5 audio tag and have a corresponding id="beep".

User Story #27: The audio element with id="beep" must be 1 second or longer.

User Story #28: The audio element with id of beep must stop playing and be rewound to the beginning when the element with the id of reset is clicked.
*/
class myTimer extends React.Component{
  constructor(props){
    super(props);
    this.state={
      sessionLength:25,
      breakLength:5,
      seconds:0,
      minutes:25,
      isPlaying:false,
      session:"Session",
    }
    this.intervalID = null;
    this.resetHandler = this.resetHandler.bind(this);
    this.incrementHandler = this.incrementHandler.bind(this);
    this.decrementHandler = this.decrementHandler.bind(this);
    this.playPauseHandler = this.playPauseHandler.bind(this);
  }

  resetHandler(){
/* set break to 5, session length to 25, timer to 25
    if currently playing, stop and reset timer to session Length : 00
*/
    this.setState({
      breakLength:5,
      sessionLength:25,
      seconds:0,
      isPlaying:false,
      minutes:25,
      session:"Session"
    })
    clearInterval(this.intervalID);
    clearInterval(this.intervalID2);
    this.audio.pause();
    this.audio.currentTime = 0;
    

  }
  
  incrementHandler(event){
    //플레이중이 아닐때만 increment
    //break increment
    if(!this.state.isPlaying && event.currentTarget.id==="break-increment" && this.state.breakLength<60){
      this.setState({breakLength:this.state.breakLength+1})
    } 
    //session increment
    else if(!this.state.isPlaying && event.currentTarget.id==="session-increment" && this.state.sessionLength<60){
      this.setState({sessionLength:this.state.sessionLength+1, minutes:this.state.minutes+1, seconds:0})
    }
    
  }

  decrementHandler(event){
    //플레이중이 아닐때만 decrement
    //if event = break then increase break
    //if event = session then increase session
    if(!this.state.isPlaying && event.currentTarget.id==="break-decrement" && this.state.breakLength>1){
      this.setState({breakLength:this.state.breakLength-1})
    } else if(!this.state.isPlaying && event.currentTarget.id==="session-decrement" && this.state.sessionLength>1){
      this.setState({sessionLength:this.state.sessionLength-1, minutes:this.state.minutes-1, seconds:0})
    }
  }

  playPauseHandler(){
    

    //btn clicked (play)
    if(!this.state.isPlaying){
      this.setState({isPlaying:true});

      this.intervalID = setInterval(()=>{
        if(this.state.seconds==0 && this.state.minutes>0){
          this.setState({seconds:59, minutes:this.state.minutes-1});
        } else if(this.state.seconds>0){
          this.setState({seconds:this.state.seconds-1})
        } 
        
      },1000)

    } 
    //btn clicked (pause)
    else if(this.state.isPlaying){
      this.setState({isPlaying:false});
      clearInterval(this.intervalID)
    }
  }
  componentDidMount(){
    this.audio = document.getElementById("beep");
  }

  componentDidUpdate(){
    //after rendering, if the timer reaches 00:00
    if(this.state.seconds == 0 && this.state.minutes == 0){
      this.audio.play();
      this.intervalID2 = setInterval(() => {
         //change from session to break 2 seconds later
        if(this.state.session=='Session'){
          this.setState({minutes:this.state.breakLength, seconds:0, session:"Break"})
        } else if(this.state.session=="Break"){
          //change from break to session
          this.setState({minutes:this.state.sessionLength, seconds:0, session:"Session"})
        }
      }, 2000);
    } 
    //after rendering, if the timer is not 00:00
    else{
      clearInterval(this.intervalID2);
      }
      
    
  }

  render(){
    
    return(
      <>
        <div id="app-container">
          <h1 id="app-title">25 + 5 Clock</h1>
          <div id="break-session-container">
            <div className="length-btn-container" id="break-container">
              <h2 id="break-label">Break Length</h2>
              <div className='arrow-btns-container'>
                <button id="break-increment" className="btn btn-primary" onClick={this.incrementHandler}><FontAwesomeIcon icon={faArrowUp} /></button>
                <span id="break-length">{this.state.breakLength}</span>
                <button id="break-decrement" className="btn btn-primary" onClick={this.decrementHandler}><FontAwesomeIcon icon={faArrowDown} /></button>
              </div>
            </div>
            <div className="length-btn-container" id="session-container">
              <h2 id="session-label">Session Length</h2>
              <div className='arrow-btns-container'>
                <button id="session-increment" className="btn btn-primary" onClick={this.incrementHandler}><FontAwesomeIcon icon={faArrowUp} /></button>
                <span id="session-length">{this.state.sessionLength}</span>
                <button id="session-decrement" className="btn btn-primary" onClick={this.decrementHandler}><FontAwesomeIcon icon={faArrowDown} /></button>
              </div>
            </div>
          </div>

          <div id="timer-container">
              <h2 id="timer-label">{this.state.session}</h2>
              <p id="time-left"><span id="minutes">{this.state.minutes < 10 ? '0' + this.state.minutes : this.state.minutes}</span>:<span id="seconds">{this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds}</span></p> 
          </div>
          <div id="buttons-container">
            <button className="btn btn-secondary" id="start_stop" onClick={this.playPauseHandler}><FontAwesomeIcon icon={faPlay}/> <FontAwesomeIcon icon={faPause}/></button>
            <button className="btn btn-secondary" id="reset" onClick={this.resetHandler}><FontAwesomeIcon icon={faRotateRight} /></button>
          </div>
        </div>
        <audio id="beep" src="/timer-app/beep_2s.wav"></audio>
      </>
    )
  }
}

export default myTimer
