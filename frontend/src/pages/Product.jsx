import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts.jsx";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState(false);

  // console.log(productId);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        // console.log(item);
        return null;
      }
    });
  };
  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 border-gray-300 pt-10 opacity-100 transition-opacity duration-500 ease-in">
      {/*---------- Product data------------ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-12">
        {/*--------------- Product image------- */}
        <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
          <div className="flex w-full justify-between overflow-x-auto sm:w-[19%] sm:flex-col sm:justify-normal sm:overflow-y-scroll">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] flex-shrink-0 cursor-pointer sm:mb-3 sm:w-full"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="h-auto w-full" alt="Product Image" />
          </div>
        </div>

        {/* Product information */}
        <div className="flex-1">
          <h1 className="mt-2 text-2xl font-medium">{productData.name}</h1>
          <div className="mt-2 flex items-center gap-1">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="my-8 flex flex-col gap-4">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border border-gray-200 bg-gray-100 px-4 py-2 ${item === size ? "border-orange-500" : " "} `}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() =>
              setTimeout(() => {
                const success = addToCart(productData._id, size);
                if (success) {
                  setSize("");
                }
              }, 100)
            }
            className="bg-black px-8 py-3 text-sm text-white active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 border-gray-300 sm:w-4/5" />
          <div className="mt-5 flex flex-col gap-1 text-sm text-gray-500">
            <p>100% Original product. </p>
            <p>Cash on delivery is available on thisproduct. </p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* -----Decription & Review -------- */}
      <div className="mt-20">
        <div className="flex">
          <p
            onClick={() => setDescription(true)}
            className={`cursor-pointer border border-gray-300 px-5 py-3 text-sm ${description && "border-gray-400 font-semibold"} `}
          >
            Description
          </p>
          <p
            onClick={() => setDescription(false)}
            className={`cursor-pointer border border-gray-300 px-5 py-3 text-sm ${!description && "border-gray-400 font-semibold"} `}
          >
            Reviews (122)
          </p>
        </div>
        <div
          className={`flex flex-col gap-4 border border-gray-300 px-6 py-6 text-sm text-gray-500 ${!description ? "hidden" : "block"} `}
        >
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
        <div
          className={`flex flex-col gap-4 border border-gray-300 px-6 py-6 text-sm text-gray-500 ${description ? "hidden" : "block"} `}
        >
          <p>{productData.description}</p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
        <RelatedProducts
          _id={productData._id}
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>

      {/* --Diplay related products -------- */}
    </div>
  ) : (
    <div>
      <p className="mt-30 text-center text-lg text-gray-500">
        No products found
      </p>
    </div>
  );
};

export default Product;

Product;
