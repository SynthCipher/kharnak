import React, { useContext, useEffect, useState } from "react";
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx";
import { ShopContext } from "../context/shopContext.jsx";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProduct, setLatestProduct] = useState([]);

  useEffect(() => {
    setLatestProduct(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 ">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas
          doloribus et provident! Dolorum rerum vitae quasi, id ipsum nesciunt
        </p>
      </div>

      {/* Rendering Produnt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pay-y-6">
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
