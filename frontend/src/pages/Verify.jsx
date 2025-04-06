import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);

  // Extract the query parameters
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }

      setIsVerifying(true);
      const response = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        { success, orderId },
        { headers: { token } }, // The backend will extract userId from token
      );

      const data = response.data;

      if (data.success) {
        setCartItems({});
        toast.success("Order successfully placed");
        // navigate('/orders')
        // Delay navigation by 3 seconds (3000 milliseconds)
        setTimeout(() => {
          navigate("/orders");
        }, 2000); // 3000ms = 3 seconds
      } else {
        toast.error(data.message || "Transaction failed. Please try again");
        setTimeout(() => {
          navigate("/cart");
        }, 2000); // 3000ms = 3 seconds
      }
      setIsVerifying(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Verification failed");
      setIsVerifying(false);
      setTimeout(() => {
        navigate("/cart");
      }, 2000); // 3000ms = 3 seconds
    }
  };

  // Frontend: Modified Verify component
  // const verifyPayment = async () => {
  //     try {
  //       if (!token) {
  //         return null;
  //       }

  //       setIsVerifying(true);
  //       // Only send the orderId - success is determined on the backend side
  //         const response = await axios.post(
  //         backendUrl + "/api/order/verifyStripe",
  //         {  orderId },
  //         { headers: { token } }, // The backend will extract userId from token
  //       );

  //       const data = response.data;

  //       if (data.success) {
  //         setCartItems([]);
  //         toast.success("Order successfully placed");
  //       } else {
  //         toast.error(data.message || "Order verification failed");
  //       }
  //       setIsVerifying(false);
  //     } catch (error) {
  //       console.log(error);
  //       toast.error(error.message || "Verification failed");
  //       setIsVerifying(false);
  //     }
  //   };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="-mt-30 flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {isVerifying ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Verifying your payment...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              {success === "true" ? (
                <div className="mb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-8 w-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Payment Successful!
                  </h1>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg
                      className="h-8 w-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Payment Failed
                  </h1>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-md bg-gray-50 p-4">
                <h2 className="mb-2 text-lg font-medium text-gray-700">
                  Order Information
                </h2>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium break-all text-gray-800">
                      {orderId}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${success === "true" ? "text-green-600" : "text-red-600"}`}
                    >
                      {success === "true" ? "Completed" : "Failed"}
                    </span>
                  </div>
                </div>
              </div>

              {success === "true" ? (
                <div className="text-center text-gray-700">
                  <p className="mb-4">
                    Thank you for your purchase! Your order has been
                    successfully processed.
                  </p>
                  <button
                    onClick={() => navigate("/orders")}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  >
                    View My Orders
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-700">
                  <p className="mb-4">
                    We couldn't process your payment. Please try again or
                    contact support.
                  </p>
                  <button
                    onClick={() => navigate("/cart")}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  >
                    Return to Cart
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
