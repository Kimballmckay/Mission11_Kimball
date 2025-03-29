import { useNavigate, useParams } from 'react-router-dom';
import Welcome from '../components/Welcome';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { CartItem } from '../types/CartItem';

function BuyPage() {
  const navigate = useNavigate();
  const { title, bookID, price: priceParam } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (priceParam) {
      setPrice(Number(priceParam));
    }
  }, [priceParam]);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookID: Number(bookID),
      title: title || 'No Project Found',
      price: Number(price),
      quantity: quantity,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <Welcome />
      <h2 className="mb-4 text-center">
        <br />
        <strong>{title}</strong>
      </h2>

      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <div className="mb-3 text-center">
          <strong>Price:</strong> ${price}
        </div>

        <div className="input-group mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <input
            type="number"
            className="form-control text-center"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>

        <div className="mb-3 text-center">
          <strong>Total:</strong>{' '}
          <span className="badge bg-success fs-5">
            ${(price * quantity).toFixed(2)}
          </span>
        </div>

        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-success" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyPage;
