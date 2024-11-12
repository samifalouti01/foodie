import './App.css';
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Cart from './Cart';
import './FallingSnow.css';
import { IoClose, IoArrowBack, IoCheckmark, IoReload } from 'react-icons/io5';

const categories = [
  { name: 'Tous', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt26bqctlEX0GzWk2Z4cVzztaEa34JpJtHFQ&s' },
  { name: 'Pizza', icon: 'https://png.pngtree.com/png-clipart/20230407/ourmid/pngtree-pizza-png-image_6675891.png' },
  { name: 'Tacos', icon: 'https://bbmtacos.fr/wp-content/uploads/2021/10/tacos-1-viande-removebg-preview-e1635431641402.png' },
  { name: 'Panini', icon: 'https://static.vecteezy.com/system/resources/thumbnails/046/437/705/small_2x/sandwich-transparent-background-png.png' },
  { name: 'Burger', icon: 'https://png.pngtree.com/png-clipart/20231020/original/pngtree-3d-illustration-cheese-burger-png-image_13381662.png' },
  { name: 'Chapati', icon: 'https://res.cloudinary.com/dgqpkdeld/image/upload/v1731369314/Untitled_design_1_xpee9l.png' },
  { name: 'Soufflé', icon: 'https://res.cloudinary.com/dgqpkdeld/image/upload/v1731369616/Untitled_design_2_as4ci2.png'},
];

function App() {
  const images = [
    "https://png.pngtree.com/png-clipart/20230407/ourmid/pngtree-pizza-png-image_6675891.png",
    "https://bbmtacos.fr/wp-content/uploads/2021/10/tacos-1-viande-removebg-preview-e1635431641402.png",
    "https://res.cloudinary.com/dgqpkdeld/image/upload/v1731369314/Untitled_design_1_xpee9l.png",
    "https://static.vecteezy.com/system/resources/thumbnails/046/437/705/small_2x/sandwich-transparent-background-png.png",
    "https://png.pngtree.com/png-clipart/20231020/original/pngtree-3d-illustration-cheese-burger-png-image_13381662.png",
    "https://res.cloudinary.com/dgqpkdeld/image/upload/v1731369314/Untitled_design_1_xpee9l.png",
    "https://res.cloudinary.com/dgqpkdeld/image/upload/v1731369616/Untitled_design_2_as4ci2.png",
    "https://png.pngtree.com/png-clipart/20230407/ourmid/pngtree-pizza-png-image_6675891.png",
    "https://bbmtacos.fr/wp-content/uploads/2021/10/tacos-1-viande-removebg-preview-e1635431641402.png",
    "https://res.cloudinary.com/dgqpkdeld/image/upload/v1731369314/Untitled_design_1_xpee9l.png"
  ];
  
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('Burger');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [isFormSubmission, setIsFormSubmission] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    // Fetch products data from the Google Apps Script (doGet function)
    const fetchProductData = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxSx9yF2VA5H9GtXL-PMoNSUMbFpA6wFrah5UEd7eIShtNDYm3hrWmc0hpHoN35jvvp/exec');
        const data = await response.json();
        setProductsData(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleRefresh = () => {
    setIsRotating(true); 

    setTimeout(() => {
      setIsRotating(false);
      window.location.reload(); 
    }, 1000); 
  };

  const handleDeliveryChange = (event) => {
    setDeliveryPrice(Number(event.target.value));
  };

  const filteredProducts = productsData.filter(product => 
    search === 'Tous' || product.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCategoryClick = (categoryName) => {
    setSearch(categoryName === 'Tous' ? '' : categoryName);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (product) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2);

  const handleConfirmClick = () => {
    setIsFormSubmission(true);
  };

  const handleBackClick = () => {
    setIsFormSubmission(false);
  };

  const isCartEmpty = cart.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsLoading(true);
    setMessage('');
  
    // Generate a unique order ID (can be enhanced to be more complex if needed)
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
    const productDetails = cart.map(item => `${item.title} - ${item.quantity}`).join(', ');
  
    const formData = {
      orderId, // Include the generated order ID here
      name,
      phone,
      products: productDetails,
      totalPrice,
      deliveryPrice,
    };
  
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxrVSQ3nzQ_H2_5RjNvAihvoPTqzv1ddkWoPaDQo901iuTjnHo5mbebUjlpVWYNr_HyjQ/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
      });
  
      const result = await response.text();
      if (result === 'Success') {
        setIsSuccess(true);
        setMessage( 
          <> 
            <IoCheckmark size={24} /> طلبك تم بنجاح 
          </> ); 
        setIsFormSubmission(false);
  
        // Set timeout to clear the message after 10 seconds
        setTimeout(() => {
          setMessage('');
        }, 10000);
      } else {
        setIsSuccess(false);
        setMessage('حدث خطأ أثناء إرسال الطلب');
        
        // Set timeout to clear the message after 10 seconds
        setTimeout(() => {
          setMessage('');
        }, 10000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSuccess(false);
      setMessage('حدث خطأ أثناء إرسال الطلب');
      
      // Set timeout to clear the message after 10 seconds
      setTimeout(() => {
        setMessage('');
      }, 10000);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleEmptyCart = () => {
    setCart([]); // Set cart to an empty array
  };
  

  return (
    <div className="App" dir="rtl">
      <div className='falling-snow'>
      {images.map((img, index) => (
                <img src={img} alt={`snowflake ${index}`} className={`snowflake snowflake${index}`} key={index} />
            ))}
      </div>
      <div className='banner'>
        <img src="banner.png" alt="banner" />
      </div>
      <Cart cart={cart} toggleCart={toggleCart} totalPrice={totalPrice} />
      {isCartOpen && (
        <div
          className={`cart-details ${isCartOpen ? 'open' : ''}`}
        >
          <div className="cart-header">
            <button className="close-button" onClick={toggleCart}>
              <IoClose size={24} />
            </button>
          </div>

          {isFormSubmission ? (
            <div className="form-submission">
              <h3>تأكيد الطلب</h3>
              <p>يرجى ملء النموذج أدناه لتأكيد طلبك:</p>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="أدخل اسمك"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="أدخل رقم هاتفك"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? <span className="spinner"></span> : 'إرسال الطلب'}
                </button>
              </form>
              <button onClick={handleBackClick} className="back-btn">
                العودة إلى السلة <IoArrowBack size={24} />
              </button>
              {message && (
                <div className={`message ${isSuccess ? 'success' : 'error'}`}> 
                  {message}
                </div>
              )}
            </div>
          ) : (
            <div className="cart-items">
              <button onClick={handleEmptyCart} className="empty-cart-btn">
                إفراغ السلة
              </button>
              {message && (
                <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
              {cart.map(item => (
                <div className="product-card" key={item.id}>
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  <h5>{item.title}</h5>
                  <span className="qnt">{item.price} دج</span>
                  <div className="product-controls">
                    <button onClick={() => removeFromCart(item)} className="minus-btn">-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="plus-btn">+</button>
                  </div>
                </div>
              ))}
              <div className="total-price">
                <p>إجمالي السعر: {totalPrice} دج</p>
              </div>
              <div className="delivery-options">
                <h3>اختر خيار التوصيل:</h3>
                <label className='dlv'>
                  <input type="radio" name="delivery" value="800" onChange={handleDeliveryChange} /> تسليم سريع (800 دج)
                </label>
                <label>
                  <p className='rcm'>الأكثر طلبًا</p>
                  <label className='dlv'>
                    <input type="radio" name="delivery" value="400" onChange={handleDeliveryChange} /> التسليم بعد 5 ساعات (400 دج)
                  </label>
                </label>
              </div>
              <div className="total-price">
                <p>سعر التوصيل: {deliveryPrice} دج</p>
              </div>
              <button
                onClick={handleConfirmClick}
                className={`confirm-btn ${isCartEmpty ? 'disabled' : ''}`}
                disabled={isCartEmpty}
              >
                تأكيد الطلب
              </button>
            </div>
          )}
        </div>
      )}
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            style={{ direction: 'ltr'}}
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`category-button ${search === category.name ? 'active' : ''}`}
          >
            <img src={category.icon} alt={category.name} />
            {category.name}
          </button>
        ))}
      </div>
      <div className="search-bar">
        <button
          className={`refresh-button ${isRotating ? 'rotate' : ''}`}
          onClick={handleRefresh}
        >
          <IoReload size={24} />
        </button>
        <input
          type="text"
          placeholder="ابحث عن المنتجات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="product-list">
        {filteredProducts.map(product => {
          const productInCart = cart.find(item => item.id === product.id);
          const quantity = productInCart ? productInCart.quantity : 0;

          return (
            <ProductCard
              key={product.id}
              product={{ ...product, quantity }}
              addToCart={() => addToCart(product)}
              removeFromCart={() => removeFromCart(product)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
