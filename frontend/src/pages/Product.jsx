import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { FaBrain, FaHammer } from 'react-icons/fa';

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');

    const fetchProductData = async () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item);
                setImage(item.image[0]);
                return null;
            }
        });
    };

    useEffect(() => {
        fetchProductData();
    }, [productId, products]);

    return productData ? (
        <div className='border-t-2 pt-10 sm:pt-20 mt-15 transition-opacity ease-in duration-500 opacity-100 min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-white'>
            <SEO
                title={productData.name}
                description={productData.description.substring(0, 160)}
                keywords={`${productData.name}, ${productData.category}, Ladakh product, handcrafted, Pashmina, Kharnak`}
            />
            {/* ----------- Product Data -------------- */}
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* ---------- Product Images ------------- */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-start sm:w-[18.7%] w-full no-scrollbar gap-3'>
                        {productData.image.map((item, index) => (
                            <img
                                key={index}
                                onClick={() => setImage(item)}
                                src={item}
                                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-2xl border ${item === image ? 'border-black' : 'border-transparent'} object-cover aspect-square`}
                                alt=""
                            />
                        ))}
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img className='w-full h-auto object-cover rounded-[2.5rem] shadow-sm aspect-square' src={image} alt="" />
                    </div>
                </div>

                {/* -------- Product Info ---------- */}
                <div className='flex-1'>
                    <div className='mb-6'>
                        <div className="flex items-center gap-4 mb-2">
                            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-blue-600'>{productData.category} / {productData.subCategory}</p>
                        </div>
                        <h1 className='font-black text-3xl sm:text-4xl lg:text-5xl mt-2 uppercase tracking-tighter text-gray-900'>{productData.name}</h1>
                        {productData.originalPrice && (
                            <p className='mt-1 text-lg text-gray-500 line-through'>{currency}{productData.originalPrice}</p>
                        )}
                        <p className='mt-2 text-3xl font-extrabold text-[#1e1964] inline-block '>{currency}{productData.price}</p>

                    </div>

                    <div className='flex items-center gap-1 mt-2 mb-6'>
                        <div className="flex text-yellow-500 text-sm">
                            {[...Array(4)].map((_, i) => <img key={i} src={assets.star_icon} alt="" className="w-3.5" />)}
                            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
                        </div>
                        {/* <p className='pl-2 text-xs font-bold text-gray-400 uppercase tracking-widest'>(122 Verified)</p> */}
                    </div>


                    <div className='mt-8 flex flex-col gap-1'>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</p>
                        <p className='mt-2 text-gray-600 md:w-4/5 font-medium leading-relaxed'>{productData.description}</p>
                    </div>


                    <div className='flex flex-col gap-4 my-10'>
                        {/* Simple check if sizes exist and is not empty array/string */}
                        {productData.sizes && productData.sizes.length > 0 && (
                            <div className='flex flex-col gap-3'>
                                <p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Select Specification</p>
                                <div className='flex gap-2'>
                                    {productData.sizes.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSize(item)}
                                            className={`border py-3 px-6 bg-gray-50 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${item === size ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {productData.artisanName && (
                            <div className="inline-flex items-center gap-4 border border-gray-100 rounded-[1.5rem] bg-gray-50 p-4 pr-12 w-fit">
                                <div className="w-12 h-12 bg-[#1e1964] rounded-full flex items-center justify-center text-white shadow-md">

                                    <FaBrain className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-1">crafted by</p>
                                    <p className="font-serif text-lg text-[#1e1964]">{productData.artisanName}</p>
                                    {productData.projectType && (
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">{productData.projectType}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {productData.quantity > 0 ? (
                        <button
                            onClick={() => {
                                if (productData.sizes && productData.sizes.length > 0 && !size) {
                                    toast.error('Select Product Size');
                                    return;
                                }
                                addToCart(productData._id, size || 'Standard');
                            }}
                            className='bg-black text-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/20 hover:shadow-black/30 hover:scale-105 active:scale-95 transition-all duration-300'
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <div className='bg-gray-100 text-gray-400 px-10 py-5 text-xs font-black uppercase tracking-[0.2em] rounded-2xl cursor-not-allowed'>
                            Out of Stock
                        </div>
                    )}

                    <hr className='mt-12 sm:w-4/5 border-gray-100' />

                    <div className='text-xs text-gray-500 mt-5 flex flex-col gap-2 font-medium'>
                        <p className='flex items-center gap-2'><IoCheckmarkCircle className="text-green-500 text-lg" /> 100% Original Product.</p>
                        <p className='flex items-center gap-2'><IoCloseCircle className="text-red-500 text-lg" /> Cash on Delivery is NOT available.</p>
                        <p className='flex items-center gap-2'><IoCloseCircle className="text-red-500 text-lg" /> No Change or Return Policy.</p>
                    </div>
                </div>
            </div>

            {/* --------- Description & Review Section (Optional but good for SEO/Content) ---------- */}
            <div className='mt-24'>
                <div className='flex gap-4 border-b border-gray-100 pb-4'>
                    <p className='font-black text-gray-900 text-sm uppercase tracking-widest cursor-pointer border-b-2 border-black pb-4 -mb-4.5'>Authenticity</p>
                    {/* <p className='font-bold text-gray-400 text-sm uppercase tracking-widest cursor-pointer hover:text-gray-600 transition-colors'>Reviews (122)</p> */}
                </div>
                <div className='flex flex-col gap-4 border border-gray-100 p-8 md:p-12 rounded-[2rem] mt-10 bg-gray-50/50'>
                    <p className='text-sm text-gray-600 leading-relaxed font-medium'>Every Kharnak product serves as a tangible artifact of the region's rich cultural tapestry. Sourced directly from local artisans, this item helps sustain traditional craftsmanship while offering you a piece of authentic heritage.</p>
                    <p className='text-sm text-gray-600 leading-relaxed font-medium'>We certify that this product is handcrafted using regionally sourced materials, ensuring minimal environmental impact and maximum community benefit.</p>
                </div>
            </div>

            {/* --------- Related Products ---------- */}
            <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentId={productData._id} />
        </div>
    ) : <div className='opacity-0'></div>;
};

export default Product;
