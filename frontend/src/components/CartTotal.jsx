import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, getCartAmount, delivery_fee } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const shippingFee = subtotal > 999 ? 0 : delivery_fee;
  const total = subtotal + shippingFee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="mt-2 flex flex-col gap-2 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>
        <hr className="border-gray-300" />

        {/* Shipping Fee */}
        <div className="flex justify-between">
          <p>Shipping fees</p>
          <p>
            {currency}
            {shippingFee === 0 ? `0 (free Delivery)` : shippingFee.toFixed(2)}
          </p>
        </div>
        <hr className="border-gray-300" />

        {/* Total */}
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {getCartAmount() === 0 ? `0.00` : total.toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
