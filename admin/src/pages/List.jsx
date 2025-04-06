import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
const List = () => {
  const { backendUrl, token, currency } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  const fetchList = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/product/list", {
        headers: { token },
      });
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
  const removeItem = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        {
          headers: { token },
        }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchList();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* ----LISAT TABLE TITLE */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-300 bg-gray-100 text-sm ">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* -------Procut List -------- */}
        {products.reverse().map((product, index) => (
          <div
            key={index}
            className=" grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] gap-2 items-center py-1 px-2 border border-gray-300 text-sm "
          >
            <img className="w-12" src={product.image[0]} />
            <p>{product.name}</p>
            <p>{product.category}</p>

            <p >
              {currency}
              {product.price}
            </p>
            <p className="text-red-600 cursor-pointer text-2xl text-center md:flex md:justify-center ">
              <MdDeleteOutline
                className=" text-red-600 cursor-pointer "
                onClick={() => removeItem(product._id)}
              />
            </p>
          </div>
        ))}
      </div>
      {/* </div> */}
    </>
  );
};

export default List;
