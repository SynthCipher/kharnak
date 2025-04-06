import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Add = () => {
  const { backendUrl, token, navigate } = useContext(AppContext);

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const sizeOptions = ["S", "M", "L", "XL", "XXL", "XXXL", "XS"];
  const categories = ["Men", "Women", "Kids"];
  const subCategories = [
    "Topwear",
    "Bottomwear",
    "Winterwear",
    "Sportswear",
    "Activewear",
  ];

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // if(!image1){
      //   return toast.error("Image Not Selected")
      if (!image1 && !image2 && !image3 && !image4) {
        return toast.error("Please upload at least one image.");
      }
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      // c3nsole.log() form dat3
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });
      console.log(backendUrl);

      const { data } = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);

        setName("");
        // setDescription("");
        setPrice("");
        setBestseller(false)
        setSizes([]);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        // navigate('/list')
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.message(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2 ">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={image1 ? URL.createObjectURL(image1) : assets.upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={image2 ? URL.createObjectURL(image2) : assets.upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={image3 ? URL.createObjectURL(image3) : assets.upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={image4 ? URL.createObjectURL(image4) : assets.upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Produc Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Enter the product name"
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Produc Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write Content Here"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Categoty</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full  px-3 py-2"
          >
            {categories.map((categoryOption, index) => (
              <option key={index} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 ">Sub Categoty</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full  px-3 py-2"
          >
            {subCategories.map((subCategoryOption, index) => (
              <option key={index} value={subCategoryOption}>
                {subCategoryOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Produc Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full sm:w-[120px] px-3 py-2"
            type="number"
            placeholder="399"
          />
        </div>
      </div>
      <div>
        <p className="mb-2">Product Size</p>
        <div className="flex gap-3 flex-wrap  w-full max-w-full">
          {sizeOptions.map((size, index) => (
            <div
              key={index}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded-l"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
