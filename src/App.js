import React, { useEffect } from 'react';
import socket from "socket.io-client";
import './App.css';

function App() {
  useEffect(() => {
    socket.connect('localhost:3000');
  })
  return (
    <div>
      <h2>Cambio</h2>
    </div>
  );
}

export default App;
