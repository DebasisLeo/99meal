import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useCart from "../../../hooks/useCart";

const FoodCard = ({ item }) => {
  const { id, name, image, price, recipe } = item;
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, refetch] = useCart();

  const handleAddToCart = async () => {
    if (!user?.email) {
      Swal.fire({
        title: "You are not Logged In",
        text: "Please login to add to the cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, login!",
        cancelButtonText: "Cancel"
      }).then(result => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: location } });
        }
      });
      return;
    }

    const cartItem = {
      menuId: id,
      email: user.email,
      name,
      image,
      price
    };

    try {
      // Add to cart
      const res = await fetch("http://localhost:8000/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem)
      });
      const data = await res.json();

      if (data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${name} added to your cart`,
          showConfirmButton: false,
          timer: 1500
        });
        refetch(); // update cart count in navbar

        // Add to user history
        await fetch("http://localhost:8000/history/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: user.email,
            action_type: "ADD_TO_CART",
            item_name: name,
            details: `Price: $${price}`
          })
        });
      } else if (data.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Could not add to cart"
      });
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl relative">
      <figure><img src={image} alt={name} className="w-full h-64 object-cover" /></figure>
      <p className="absolute right-0 mr-4 mt-4 px-4 py-1 bg-slate-900 text-white rounded">
        ${price}
      </p>
      <div className="card-body flex flex-col items-center">
        <h2 className="card-title">{name}</h2>
        <p className="text-gray-600">{recipe}</p>
        <div className="card-actions justify-end">
          <button
            onClick={handleAddToCart}
            className="btn btn-outline bg-slate-100 border-0 border-b-4 text-black border-orange-400 mt-4 hover:bg-orange-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
