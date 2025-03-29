import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemQuantity = item.quantity || 1;
      return total + item.price * itemQuantity;
    }, 0);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="alert alert-info">Your cart is empty</div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <ul className="list-group mb-3">
              {cart.map((item: CartItem) => {
                const quantity = item.quantity || 1;
                const itemTotal = item.price * quantity;
                return (
                  <li
                    key={item.bookID}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h5 className="mb-1">{item.title}</h5>
                      <small>
                        ${item.price.toFixed(2)} x {quantity} = $
                        {itemTotal.toFixed(2)}
                      </small>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item.bookID)}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h4>Total:</h4>
              <h3>${calculateTotal().toFixed(2)}</h3>
              <button className="btn btn-primary w-100 mb-2">Checkout</button>
              <button
                className="btn btn-secondary w-100"
                onClick={() => navigate('/books')}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
