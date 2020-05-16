import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css';
import Menu from './components/Menu'


function App() {
  const [socket, setSocket] = useState();
  useEffect(() => {
    const socket = io.connect('localhost:3000');
    setSocket(socket)

    socket.on('game joined', ({gameName}) => {
      window.game = {name: gameName}
      console.log('joiii')
    });

    socket.on('game created', ({gameName}) => {
      window.game = {name: gameName}
    });

    socket.on('begin game', () => {
      console.log('begin the game111111')
    })

  }, []);
  return (
    <div>
      <h2>Cambio</h2>
      <Menu socket={socket}/>
    </div>
  );
}

export default App;
