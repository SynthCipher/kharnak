import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useNavigate } from "react-router-dom";

const RelatedProducts = ({ category, subCategory, _id }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  // Fisher-Yates shuffle function to shuffle the products array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  useEffect(() => {
    // if (products.length > 0) {
    //   let productsCopy = products.slice();
    //   productsCopy = productsCopy.filter((item) => category === item.category);
    //   productsCopy = productsCopy.filter(
    //     (item) => subCategory === item.subCategory,
    //   );
    //   console.log(productsCopy.slice(0, 5));
    //   setRelated(productsCopy.slice(0, 5));
    // }
    if (products.length > 0) {
      let productsCopy = products.slice();

      if (category) {
        productsCopy = productsCopy.filter(
          (item) => item.category === category,
        );
      }
      if (subCategory) {
        productsCopy = productsCopy.filter(
          (item) => item.subCategory === subCategory,
        );
      }

      if (_id) {
        productsCopy = productsCopy.filter((item) => item._id !== _id);
      }

      // Shuffle the filtered products and take the first 5
      const shuffledProducts = shuffleArray(productsCopy);
      const randomProducts = shuffledProducts.slice(0, 5);
      // Log the random products for debugging
      // console.log(randomProducts);
      // Set the related products (randomly selected)
      setRelated(randomProducts);
    }
  }, [products, category, subCategory, _id]);

  return (
    <div className="my-24">
      <div className="py-2 text-center text-3xl">
        <Title text1={"Related"} text2={"Products"} />
      </div>
      <div className="grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {related.map((item, index) => (
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

export default RelatedProducts;
