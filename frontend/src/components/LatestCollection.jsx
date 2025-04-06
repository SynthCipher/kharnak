import React, { useContext, useEffect, useState } from "react";
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx";
import { ShopContext } from "../context/ShopContext.jsx";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProduct, setLatestProduct] = useState([]);

  useEffect(() => {
    setLatestProduct(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="py-8 text-center text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="m-auto w-3/4 text-xs text-gray-600 sm:text-sm md:text-base">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas
          doloribus et provident! Dolorum rerum vitae quasi, id ipsum nesciunt
        </p>
      </div>

      {/* Rendering Produnt */}
      <div className="pay-y-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {latestProduct.map((item, index) => (
          <ProductItem
            key={index}
            _id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
