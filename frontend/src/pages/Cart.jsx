import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { FaCartShopping } from "react-icons/fa6";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const [cartItemTotal, setCartItemTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const {
    products,
    currency,
    navigate,
    cartItems,
    getCartCount,
    updateQuantity,
    token,
    getUserCart
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Load cart data only once when component mounts if token exists
  useEffect(() => {
    // Only fetch cart data if we haven't loaded it yet and we have a token
    if (token && !cartLoaded) {
      const loadCartData = async () => {
        setIsLoading(true);
        try {
          await getUserCart(token);
          setCartLoaded(true);
        } catch (error) {
          console.error("Error loading cart:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadCartData();
    } else {
      setIsLoading(false);
    }
  }, [token, cartLoaded]); // Remove getUserCart from dependencies to prevent refetching

  // Transform cart items into a more usable format
  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      try {
        const tempData = [];
        // Loop through each product in the cartItems
        for (const productId in cartItems) {
          // Loop through each size of the current product
          for (const size in cartItems[productId]) {
            // Check if the quantity is greater than 0
            if (cartItems[productId][size] > 0) {
              tempData.push({
                _id: productId, // The product's ID
                size: size, // The size of the product
                quantity: cartItems[productId][size], // The quantity of the product
              });
            }
          }
        }
        setCartData(tempData);
      } catch (error) {
        console.error("Error processing cart data:", error);
      }
    }
  }, [cartItems, products]); // Only depend on cartItems and products

  // Update cart item total count
  useEffect(() => {
    try {
      const count = getCartCount();
      setCartItemTotal(count);
    } catch (error) {
      console.error("Error getting cart count:", error);
      setCartItemTotal(0);
    }
  }, [cartItems]); // Remove getCartCount from dependencies to prevent potential loops

  // Handle quantity change
  const handleQuantityChange = (productId, size, value) => {
    // Parse the input value
    const quantity = parseInt(value);
    
    // Only update if value is a valid number and greater than zero
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(productId, size, quantity);
    }
  };

  // Show loading state only during initial load
  if (isLoading && !cartLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  return cartItemTotal !== 0 ? (
    <div className="border-t border-gray-300 pt-14">
      <div className="mb-3 text-2xl">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id,
          );

          if (!productData) {
            return null; // Skip rendering if product data is not found
          }

          return (
            <div
              key={`${item._id}-${item.size}`}
              className="grid grid-cols-[4fr_0.5fr_0.5fr] items-center gap-4 border-t border-b border-gray-300 py-4 text-gray-600 sm:grid-cols-[4fr_2fr_0.5fr]"
            >
              <div className="flex items-start gap-6">
                <img
                  onClick={() => navigate(`/product/${item._id}`)}
                  src={productData.image[0]}
                  className="w-16 cursor-pointer sm:w-20"
                  alt={productData.name}
                />
                <div>
                  <p
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="cursor-pointer text-xs font-medium sm:text-lg"
                  >
                    {productData.name}
                  </p>
                  <div className="mt-2 flex items-center gap-5">
                    <p className="text-xs font-medium sm:text-lg">
                      {currency}
                      {productData.price}
                    </p>
                    <p className="border border-gray-300 bg-slate-50 px-2 sm:px-3 sm:py-1">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                className="max-w-10 border border-gray-300 px-1 py-1 sm:max-w-20 sm:px-2"
                type="number"
                min={1}
                value={item.quantity}
              />
              <img
                src={assets.bin_icon}
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="mr-4 w-4 cursor-pointer sm:w-5"
                alt="Remove item"
              />
            </div>
          );
        })}
      </div>
      <div className="my-20 flex justify-end">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="my-8 bg-black px-8 py-3 text-sm text-white"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
      <p className="mt-30 text-center text-lg text-gray-500">
        No products in cart
      </p>
      <div
        onClick={() => {
          navigate("/collection");
          scrollTo(0, 0);
        }}
        className="flex flex-col items-center justify-center gap-4 cursor-pointer"
      >
        <FaCartShopping className="text-5xl text-gray-500" />
        <p>SHOP NOW</p>
      </div>
    </div>
  );
};

export default Cart;


// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/shopContext";
// import { FaCartShopping } from "react-icons/fa6";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import CartTotal from "../components/CartTotal";
// import axios from "axios";

// const Cart = () => {
//   // const navigate = useNavigate();
//   const [cartItemTotal, setCartItemTotal] = useState(0);
//   const {
//     products,
//     currency,
//     navigate,
//     cartItems,
//     backendUrl,
//     getCartCount,
//     updateQuantity,
//     token,
//   } = useContext(ShopContext);
//   const [cartData, setCartData] = useState([]);

//   useEffect(() => {
//     if (products.length > 0) {
//       const tempData = [];
//       // Loop through each product in the cartItems
//       for (const productId in cartItems) {
//         // Loop through each size of the current product
//         for (const size in cartItems[productId]) {
//           // Check if the quantity is greater than 0
//           if (cartItems[productId][size] > 0) {
//             tempData.push({
//               _id: productId, // The product's ID
//               size: size, // The size of the product
//               quantity: cartItems[productId][size], // The quantity of the product
//             });
//           }
//         }
//       }
//       setCartData(tempData);
//     }
//   }, [cartItems, products]); // Re-run this effect whenever cartItems change

//   useEffect(() => {
//     setCartItemTotal(getCartCount());
//   }, [cartItems]);

//   return cartItemTotal !== 0 ? (
//     <div className="border-t border-gray-300 pt-14">
//       <div className="mb-3 text-2xl">
//         <Title text1={"YOUR"} text2={"CART"} />
//       </div>

//       <div>
//         {cartData.map((item, index) => {
//           const productData = products.find(
//             (product) => product._id === item._id,
//           );

//           return (
//             <div
//               key={index}
//               className="grid grid-cols-[4fr_0.5fr_0.5fr] items-center gap-4 border-t border-b border-gray-300 py-4 text-gray-600 sm:grid-cols-[4fr_2fr_0.5fr]"
//             >
//               <div className="flex items-start gap-6">
//                 <img
//                   onClick={() => navigate(`/product/${item._id}`)}
//                   src={productData.image[0]}
//                   className="w-16 cursor-pointer sm:w-20"
//                   alt=""
//                 />
//                 <div>
//                   <p
//                     onClick={() => navigate(`/product/${item._id}`)}
//                     className="cursor-pointer text-xs font-medium sm:text-lg"
//                   >
//                     {productData.name}
//                   </p>
//                   <div className="mt-2 flex items-center gap-5">
//                     <p className="text-xs font-medium sm:text-lg">
//                       {currency}
//                       {productData.price}
//                     </p>
//                     <p className="border border-gray-300 bg-slate-50 px-2 sm:px-3 sm:py-1">
//                       {item.size}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <input
//                 onChange={(e) =>
//                   e.target.value === "" || e.target.value === 0
//                     ? null
//                     : updateQuantity(
//                         item._id,
//                         item.size,
//                         Number(e.target.value),
//                       )
//                 }
//                 className="max-w-10 border border-gray-300 px-1 py-1 sm:max-w-20 sm:px-2"
//                 type="number"
//                 min={1}
//                 defaultValue={item.quantity}
//               />
//               <img
//                 src={assets.bin_icon}
//                 onClick={() => updateQuantity(item._id, item.size, 0)}
//                 className="mr-4 w-4 cursor-pointer sm:w-5"
//                 alt=""
//               />
//             </div>
//           );
//         })}
//       </div>
//       <div className="my-20 flex justify-end">
//         <div className="w-full sm:w-[450px]">
//           <CartTotal />
//           <div className="w-full text-end">
//             <button
//               onClick={() => navigate("/place-order")}
//               className="my-8 bg-black px-8 py-3 text-sm text-white"
//             >
//               PROCEED TO CHECKOUT
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="mt-30 text-center text-lg text-gray-500">
//         No products In Card
//       </p>
//       <div
//         onClick={() => {
//           navigate("/collection");
//           scrollTo(0, 0);
//         }}
//         className="flex flex-col items-center justify-center gap-4"
//       >
//         <FaCartShopping className="text-5xl text-gray-500" />
//         <p>SHOP NOW</p>
//       </div>
//     </div>
//   );
// };

// export default Cart;



