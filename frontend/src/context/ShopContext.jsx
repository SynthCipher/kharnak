import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "₹";
  const delivery_fee = 60;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  // Initialize token from localStorage immediately
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Function to add items to the cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return 0;
    }
    // Step 1: Clone the cart items so we don't mutate the original state directly
    let cartData = structuredClone(cartItems);

    // Step 2: Check if the item already exists in the cart
    if (cartData[itemId]) {
      // If the item exists, check if the size exists for that item
      if (cartData[itemId][size]) {
        // If the size exists, increment its quantity by 1
        cartData[itemId][size] += 1;
      } else {
        // If the size doesn't exist, add it with quantity 1
        cartData[itemId][size] = 1;
      }
    } else {
      // If the item doesn't exist, add it with the given size and quantity 1
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Step 3: Update the state with the modified cart data
    setCartItems(cartData);
    scrollTo(0, 0);

    if (token) {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          {
            headers: { token },
          },
        );
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    // Loop through each product in cartItems
    for (const productID in cartItems) {
      // Loop through each size of the current product
      for (const productSize in cartItems[productID]) {
        try {
          // If the quantity is greater than 0, add it to the totalCount
          if (cartItems[productID][productSize] > 0) {
            totalCount += cartItems[productID][productSize];
          }
        } catch (error) {
          console.log(error); // Log any errors
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getUserCart = async (userToken) => {
    if (!userToken) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        {
          headers: { token: userToken },
        },
      );

      if (data.success) {
        setCartItems(data.cartData);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch cart data");
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    // Loop through each item in cartItems
    for (const productId in cartItems) {
      const product = products.find((product) => product._id === productId);

      // Loop through each size in the cartItems for the given productId
      for (const size in cartItems[productId]) {
        try {
          const quantity = cartItems[productId][size];

          // Ensure quantity is greater than 0, and the price exists for the product
          if (quantity > 0 && product) {
            totalAmount += product.price * quantity;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Load products on initial mount
  useEffect(() => {
    getProductsData();
  }, []);

  // Load cart data when component mounts and when token changes
  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  // Set token from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    getUserCart, // Exposing getUserCart in the context
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
