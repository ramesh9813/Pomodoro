import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BeepSound from './resource/BeepSound.wav'; // Importing the local audio file

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [beepAudio] = useState(new Audio(BeepSound));
  const timerRef = useRef();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    beepAudio.pause();
    beepAudio.currentTime = 0;
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isRunning) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isRunning) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            if (isSession) {
              setTimerLabel('Break');
              setTimeLeft(breakLength * 60);
              setIsSession(false);
              beepAudio.play();
            } else {
              setTimerLabel('Session');
              setTimeLeft(sessionLength * 60);
              setIsSession(true);
              beepAudio.play();
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, breakLength, sessionLength, isSession, beepAudio]);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  return (
    <div className="App container border   mt-5 ">
      <h1>25+5 Clock</h1>
     {/* break and seassion container */}
     <div className="d-flex justify-content-center">
      <div className="length-controls second-row-left border rounded m-1 p-3">
        <div id="break-label">Break Length</div>
        <div className="d-flex justify-content-center">
          <button id="break-decrement" className='btn btn-primary' onClick={handleBreakDecrement}>-</button>
          <div id="break-length" className='ps-3 pe-3'>{breakLength}</div>
          <button id="break-increment" className='btn btn-primary' onClick={handleBreakIncrement}>+</button>
        </div>
      </div>
      <div className="length-controls second-row-right  border rounded m-1 p-3">
        <div id="session-label">Session Length</div>
        <div className="d-flex justify-content-center">
        <button id="session-decrement" className='btn btn-primary' onClick={handleSessionDecrement}>-</button>
        <div id="session-length" className='ps-3 pe-3'>{sessionLength}</div>
        <button id="session-increment" className='btn btn-primary' onClick={handleSessionIncrement}>+</button>
        </div>
      </div>
     </div>

    {/* This divs belongs to the timer of the */}
      <div className="seassion third-row border rounded p-3 ps-5 pe-5">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <audio id="beep" src={BeepSound} />
      </div>

    {/* pause and restart of the clock */}
      <div className="pause-and-restart fourth-row pt-2">
        <button id="start_stop" className='btn btn-primary' onClick={handleStartStop}>{isRunning ? 'Pause' : 'Start'}</button>
        <button id="reset" className='btn btn-primary ms-2' onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default App;
