import React, { useContext, useState } from "react";
import Title from "../components/Title.jsx";
import { ShopContext } from "../context/shopContext.jsx";
import CartTotal from "../components/CartTotal.jsx";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    setCartItems,
    cartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            { razorpay_order_id: response.razorpay_order_id },
            { headers: { token } },
          );
          if (data.success) {
            toast.success(data.message);
            navigate("/orders");
            setCartItems({});

            // navigate(`/verify?success=true&orderId=${response.razorpay_order_id}`,)
          } else {
            toast.error(data.message);
            // navigate(`/verify?success=false&orderId=${response.razorpay_order_id}`,)
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];

      // Correctly iterate through cartItems
      for (const productId in cartItems) {
        // For each product ID in cartItems
        for (const size in cartItems[productId]) {
          // For each size of the current product
          const quantity = cartItems[productId][size];
          // Only process if quantity is greater than 0
          if (quantity > 0) {
            // Find the product by ID
            const productInfo = structuredClone(
              products.find((product) => product._id === productId),
            );
            if (productInfo) {
              // Create a new object with product info and add size and quantity

              productInfo.size = size;
              productInfo.quantity = quantity;

              orderItems.push(productInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount:
          getCartAmount() < 999
            ? getCartAmount() + delivery_fee
            : getCartAmount(),
      };
      // console.log(orderData);

      switch (method) {
        // API FOR CASH ON DELIVERY
        case "cod":
          try {
            const { data } = await axios.post(
              backendUrl + "/api/order/place",
              orderData,
              { headers: { token } },
            );
            console.log("---------", data);
            if (data.success) {
              setCartItems({});
              navigate("/orders");
              toast.success(data.message);
            } else {
              toast.error(data.message);
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
          break;
        case "stripe":
          console.log("stirpeeeeeeeeeeeee");
          try {
            // Make a POST request to your backend to initiate the Stripe payment process
            const { data } = await axios.post(
              // const response = await axios.post(
              backendUrl + "/api/order/stripe",
              orderData, // orderData includes items, amount, and address
              { headers: { token } }, // Attach token in the request headers
            );
            console.log(data);

            if (data.success) {
              // If payment is successful, redirect to Stripe checkout session URL
              const { session_url } = data; 
              window.location.replace(session_url);
              // navigate('/orders')
            } else {
              // If the backend returns an error, display it to the user
              toast.error(data.message); // Assuming you're using a toast library like react-toastify
            }
          } catch (error) {
            console.error(error);
            toast.error(error.message); // Display error message to the user
          }
          break;

        case "razorpay":
          try {
            const { data } = await axios.post(
              backendUrl + "/api/order/razorpay",
              orderData,
              { headers: { token } },
            );

            console.log(data);
            if (data.success) {
              initPay(data.order);
            }
          } catch (error) {
            console.error(error);
            toast.error(error.message); // Display error message to the user
          }
          break;

        default:
          console.log("JIJIJIJIJI");
          break;
      }
      console.log(orderItems);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log(method);
  }, [method]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex min-h-[80vh] flex-col justify-between gap-4 border-t border-gray-300 pt-5 sm:flex-row sm:pt-14"
    >
      {/* ----------left side ------------- */}
      <div className="flex w-full flex-col gap-4 sm:max-w-[480px]">
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            className="w-full rounded border border-gray-300 px-3.5 py-1.5"
            type="text"
            onChange={onChangeHandler}
            name="firstName"
            required
            value={formData.firstName}
            placeholder="First Name"
          />
          <input
            className="w-full rounded border border-gray-300 px-3.5 py-1.5"
            type="text"
            onChange={onChangeHandler}
            name="lastName"
            required
            value={formData.lastName}
            placeholder="Last Name"
          />
        </div>
        <input
          className="w-full rounded border border-gray-300 px-3.5 py-1.5"
          type="email"
          onChange={onChangeHandler}
          required
          name="email"
          value={formData.email}
          placeholder="Email Address"
        />
        <input
          className="w-full rounded border border-gray-300 px-3.5 py-1.5"
          type="text"
          onChange={onChangeHandler}
          required
          name="street"
          value={formData.street}
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            className="w-full rounded border border-gray-300 px-3.5 py-1.5"
            type="text"
            onChange={onChangeHandler}
            required
            name="city"
            value={formData.city}
            placeholder="City"
          />
          <input
            className="w-full rounded border border-gray-300 px-3.5 py-1.5"
            required
            type="text"
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            className="w-full rounded border border-gray-300 px-3.5 py-1.5"
            required
            type="text"
            onChange={onChangeHandler}
            name="pincode"
            value={formData.pincode}
            placeholder="Pincode"
          />
          <input
            className="w-full rounded border border-gray-300 px-3.5 py-1.5"
            required
            type="text"
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            placeholder="Country"
          />
        </div>
        <input
          className="w-full rounded border border-gray-300 px-3.5 py-1.5"
          required
          type="number"
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          placeholder="Phone"
        />
      </div>

      {/* ---right side ----------- */}

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ----------PAYMENT METHOD SELECTION--------- */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex cursor-pointer items-center gap-3 border border-gray-300 p-2 px-3"
            >
              <p
                className={`h-3.5 min-w-3.5 rounded-full border border-gray-300 ${method === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <img src={assets.stripe_logo} className="mx-4 h-5" alt="" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex cursor-pointer items-center gap-3 border border-gray-300 p-2 px-3"
            >
              <p
                className={`h-3.5 min-w-3.5 rounded-full border border-gray-300 ${method === "razorpay" ? "bg-green-400" : ""}`}
              ></p>
              <img src={assets.razorpay_logo} className="mx-4 h-5" alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex cursor-pointer items-center gap-3 border border-gray-300 p-2 px-3"
            >
              <p
                className={`h-3.5 min-w-3.5 rounded-full border border-gray-300 ${method === "cod" ? "bg-green-400" : ""} `}
              ></p>
              <p className="mx-4 text-sm font-medium text-gray-500">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="mt-8 w-full text-end">
            <button
              type="submit"
              // onClick={() => navigate("/orders")}
              className="cursor-pointer bg-black px-16 py-3 text-sm text-white"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

// let orderItems = [];

// for (const items in cartItems) {
//   for (const item in cartItems[items]) {
//     if (cartItems[items][item] > 0) {
//       const itemInfo = structuredClone(
//         products.find((product) => product._id === items),
//       );
//       if (itemInfo) {
//         itemInfo.size = item;
//         itemInfo.quantity = cartItems[items][item];
//         orderItems.push(itemInfo);
//       }
//     }
//   }
// }
