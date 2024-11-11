// FallingSnow.js

import React from 'react';
import './FallingSnow.css';

const images = [
  'image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png',
  'image6.png', 'image7.png', 'image8.png', 'image9.png', 'image10.png'
];

const FallingSnow = () => {
  return (
    <div className="falling-snow">
      {images.map((img, index) => (
        <img src={img} alt={`snowflake ${index}`} className={`snowflake snowflake${index}`} key={index} />
      ))}
    </div>
  );
};

export default FallingSnow;
