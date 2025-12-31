import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const List = () => {
  const { backendUrl, token, currency } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    if (!window.confirm("FINAL WARNING: This action is permanent and cannot be undone. Proceed?")) {
      return;
    }
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
    <div className="w-full">
      <div className="mb-10">
        <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Inventory Archive</h1>
        <p className="text-gray-500 font-medium font-bold">Managing and curated artisanal products of the Kharnak storefront.</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
        {/* ----LIST TABLE TITLE */}
        <div className="hidden md:grid grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr] items-center py-6 px-10 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
          <span>Visual</span>
          <span>Designation</span>
          <span>Category</span>
          <span>Valuation</span>
          <span className="text-center">Protocol</span>
        </div>

        {/* -------Product List -------- */}
        <div className="divide-y divide-gray-50">
          {products.length > 0 ? products.reverse().map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr] gap-4 items-center py-6 px-10 hover:bg-gray-50/50 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.image[0]} alt={product.name} />
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-black text-gray-800 tracking-tight">{product.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">ID: {product._id.slice(-8)}</p>
              </div>

              <div className="hidden md:block">
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500">
                  {product.category}
                </span>
              </div>

              <div className="font-black text-gray-900 text-sm">
                {currency}{product.price}
              </div>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => navigate('/add', { state: { product } })}
                  className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-600/20 active:scale-90"
                >
                  <FiEdit className="text-lg" />
                </button>
                <button
                  onClick={() => removeItem(product._id)}
                  className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-600/20 active:scale-90"
                >
                  <MdDeleteOutline className="text-xl" />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center">
              <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No inventory records detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default List;
