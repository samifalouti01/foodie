// src/Cart.js
import React from 'react';
import { IoCart } from 'react-icons/io5';
import './Cart.css';

function Cart({ cart, toggleCart, totalPrice }) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart" onClick={toggleCart}>
      <IoCart size={24} /> <span className="cart-count">{totalItems}</span>
      {totalItems > 0 && (
        <div className="cart-total">
          <p>Total: {totalPrice} DZD</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
