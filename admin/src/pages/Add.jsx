import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";

const Add = () => {
  const { backendUrl, token } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const productToEdit = location.state?.product;

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]); // For edit mode

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Handicrafts");
  const [subCategory, setSubCategory] = useState("Woolen");
  const [bestseller, setBestseller] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [sizes, setSizes] = useState([]);
  const [artisanName, setArtisanName] = useState("");
  const [gender, setGender] = useState("Unisex");
  const [projectType, setProjectType] = useState("Self");

  const isEdit = !!productToEdit;

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setCategory(productToEdit.category);
      setSubCategory(productToEdit.subCategory);
      setBestseller(productToEdit.bestseller);
      setQuantity(productToEdit.quantity);
      setSizes(productToEdit.sizes || []);
      setArtisanName(productToEdit.artisanName || "");
      setGender(productToEdit.gender || "Unisex");
      setProjectType(productToEdit.projectType || "Self");
      setOldImages(productToEdit.image || []);
    }
  }, [productToEdit]);

  const categories = ["Handicrafts", "Food", "Souvenirs", "Clothing", "Other"];
  const subCategories = [
    "Woolen",
    "Carpet",
    "Pashmina",
    "Snack",
    "Organic",
    "Instrument",
    "Accessory"
  ];
  const sizeOptions = ["S", "M", "L", "XL", "XXL"];
  const genderOptions = ["Unisex", "Men", "Women"];
  const projectOptions = ["Individual", "Self Help Group", "Community"];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeOldImage = (index) => {
    setOldImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!isEdit && images.length === 0) {
        setIsSubmitting(false);
        return toast.error("Please upload at least one image.");
      }
      if (isEdit && images.length === 0 && oldImages.length === 0) {
        setIsSubmitting(false);
        return toast.error("Product must have at least one image.");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("quantity", quantity);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("artisanName", artisanName);
      formData.append("gender", gender);
      formData.append("projectType", projectType);

      // Append new images
      images.forEach((image) => {
        formData.append("image", image);
      });

      if (isEdit) {
        formData.append("productId", productToEdit._id);
        formData.append("oldImages", JSON.stringify(oldImages));
      }

      const endpoint = isEdit ? "/api/product/update" : "/api/product/add";
      const { data } = await axios.post(backendUrl + endpoint, formData, { headers: { token } });

      if (data.success) {
        toast.success(data.message);
        navigate("/list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="w-full">
      <div className="mb-10">
        <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>{isEdit ? "Edit Stock" : "Inventory Forge"}</h1>
        <p className="text-gray-500 font-medium">{isEdit ? "Modifying existing artisanal record." : "Adding new artisanal products to the Kharnak digital storefront."}</p>
      </div>

      <div className="w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-50">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Visual Documentation</p>
          </div>

          <div className="flex gap-4 flex-wrap">
            {/* Old Images (Edit Mode) */}
            {oldImages.map((img, index) => (
              <div key={`old-${index}`} className="relative group w-28 h-28 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <img src={img} alt="Product" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeOldImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all">
                  <MdClose size={12} />
                </button>
              </div>
            ))}

            {/* New Images Preview */}
            {images.map((img, index) => (
              <div key={`new-${index}`} className="relative group w-28 h-28 bg-gray-50 rounded-2xl border border-blue-200 overflow-hidden">
                <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 shadow-md">
                  <MdClose size={12} />
                </button>
              </div>
            ))}

            {/* Add Image Button */}
            <label className="cursor-pointer group relative">
              <div className="w-28 h-28 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-50/10 transition-all flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <img className="w-8 opacity-40 group-hover:opacity-60 transition-opacity mb-1" src={assets.upload_area} alt="Upload" />
                  <span className="text-[9px] font-bold text-gray-400 group-hover:text-blue-500 uppercase tracking-wider">Add +</span>
                </div>
              </div>
              <input onChange={handleImageChange} type="file" multiple hidden />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="w-full">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Product Designation</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                type="text"
                placeholder="e.g. Handwoven Kharnak Woolen"
                required
              />
            </div>

            <div className="w-full">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Narrative / Description</p>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 font-medium text-gray-700 leading-relaxed"
                placeholder="Describe the artisanal craftsmanship..."
                required
              />
            </div>

            <div className="w-full">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Artisan Name</p>
              <input
                onChange={(e) => setArtisanName(e.target.value)}
                value={artisanName}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                type="text"
                placeholder="e.g. Tenzin Norbu"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Core Category</p>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                >
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Specialization</p>
                <select
                  onChange={(e) => setSubCategory(e.target.value)}
                  value={subCategory}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                >
                  {subCategories.map((sub, index) => (
                    <option key={index} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Artisan Gender</p>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                >
                  {genderOptions.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Project Type</p>
                <select
                  onChange={(e) => setProjectType(e.target.value)}
                  value={projectType}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                >
                  {projectOptions.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Initial Stock</p>
                <input
                  onChange={(e) => setQuantity(e.target.value)}
                  value={quantity}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                  type="number"
                  min="0"
                  placeholder="1"
                  required
                />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Unit Valuation (₹)</p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                type="number"
                placeholder="0"
                required
              />
            </div>


            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Available Dimensions (Optional)</p>
              <div className="flex gap-3 flex-wrap">
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
                    className={`px-5 py-3 rounded-xl border-2 transition-all cursor-pointer font-black text-xs uppercase tracking-widest ${sizes.includes(size)
                      ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-black/20"
                      : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <input
                type="checkbox"
                onChange={() => setBestseller((prev) => !prev)}
                checked={bestseller}
                id="bestseller"
                className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500 border-gray-200 cursor-pointer"
              />
              <label className="cursor-pointer font-bold text-sm text-blue-900 uppercase tracking-tighter" htmlFor="bestseller">
                Promoted Item (Bestseller Status)
              </label>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group relative px-12 py-5 bg-black hover:bg-blue-600 text-white font-black rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-xs shadow-2xl shadow-black/20 hover:shadow-blue-600/30 active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isSubmitting ? "Processing..." : (isEdit ? "Update Product Record" : "Forge Product Entry")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Add;
