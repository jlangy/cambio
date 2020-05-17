import React, { useState } from 'react';
import './card.css';

function Card({front, back}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`card-container ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(prev => !prev)}>
      <div className="front">{front}</div>
      <div className="back">{back}</div>
    </div>
  )
}

export default Card;
