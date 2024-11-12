// src/ProductCard.js
import React from 'react';
import './ProductCard.css';

function ProductCard({ product, addToCart, removeFromCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h5>{product.title}</h5>
      <div>
      <p>{product.price} DA</p>
      <div className="product-controls">
        <button onClick={removeFromCart}>-</button>
        <span>{product.quantity || 0}</span> 
        <button onClick={addToCart}>+</button>
      </div>
      </div>
    </div>
  );
}

export default ProductCard;
