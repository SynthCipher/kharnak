import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { useNavigate, Link } from 'react-router-dom';
import RelatedProducts from '../components/RelatedProducts';
import { IoCartOutline, IoTrashBin } from 'react-icons/io5';
import { RiDeleteBin7Line } from 'react-icons/ri';

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        // Assuming cartItems structure is { itemId: { size: quantity } }
        if (products.length > 0) {
            const tempData = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        tempData.push({
                            _id: items,
                            size: item,
                            quantity: cartItems[items][item]
                        });
                    }
                }
            }
            setCartData(tempData);
        }
    }, [cartItems, products]);

    // Find a product to use for recommendations (e.g., the first one in cart)
    const recommendationSource = cartData.length > 0 ? products.find(p => p._id === cartData[0]._id) : null;

    return (
        <div className='border-t pt-14 mt-20 min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-white'>
            <div className='text-2xl mb-3'>
                <h1 className='text-gray-500 uppercase tracking-wider font-bold'>Your Cart</h1>
            </div>

            <div className='my-8'>
                {cartData.length > 0 ? (
                    <div>
                        {cartData.map((item, index) => {
                            const productData = products.find((product) => product._id === item._id);
                            if (!productData) return null;

                            return (
                                <div key={index} className='p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row items-center gap-6'>
                                    <div onClick={() => navigate(`/product/${item._id}`)} className='flex items-start gap-6 flex-1 w-full cursor-pointer group/item'>
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
                                            <img className='w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500' src={productData.image[0]} alt="" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className='text-sm sm:text-lg font-black uppercase tracking-tight text-[#1e1964] group-hover/item:text-blue-600 transition-colors'>{productData.name}</p>
                                            <div className='flex items-center gap-3 mt-1'>
                                                <p className='text-sm font-bold text-gray-500'>{currency}{productData.price}</p>
                                                <span className="hidden sm:block text-gray-300">|</span>
                                                <p className='px-2 py-0.5 border border-gray-200 bg-white rounded text-[10px] font-black uppercase tracking-widest text-gray-400'>Size: {item.size}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-12">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.size, item.quantity > 1 ? item.quantity - 1 : 1)}
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >-</button>
                                            <input
                                                readOnly
                                                className='w-10 text-center text-sm font-bold bg-transparent focus:outline-none'
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                            />
                                            <button
                                                onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                            >+</button>
                                        </div>

                                        <button
                                            onClick={() => updateQuantity(item._id, item.size, 0)}
                                            className='group p-2 rounded-full hover:bg-red-50 transition-colors'
                                            title="Remove Item"
                                        >
                                            <RiDeleteBin7Line />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <div className='flex justify-end my-20'>
                            <div className='w-full sm:w-[450px]'>
                                <div className='w-full text-end'>
                                    <button
                                        onClick={() => {
                                            if (token) {
                                                navigate('/place-order');
                                            } else {
                                                toast.info("Please login to proceed to checkout");
                                                navigate('/login', { state: { from: '/cart' } });
                                            }
                                        }}
                                        className='bg-black text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-3 rounded-xl hover:shadow-xl transition-all'
                                    >Proceed to Checkout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <h2 className="text-3xl font-black text-gray-200 uppercase tracking-tighter">Cart Empty</h2>
                        </div>
                        <p className="text-gray-400 font-medium">Looks like you haven't added anything to your cart yet.</p>
                        <button onClick={() => navigate('/shop')} className="bg-[#1e1964] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-blue-900/10">Start Shopping</button>
                    </div>
                )}
            </div>

            {/* Recommendations: If cart has items, show related to first item. If empty, show Latest items */}
            <div className="mt-20 mb-20">
                {cartData.length > 0 && recommendationSource ? (
                    <RelatedProducts category={recommendationSource.category} subCategory={recommendationSource.subCategory} currentId={recommendationSource._id} />
                ) : (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className='text-3xl font-black text-gray-800 uppercase tracking-tighter'>Explore Collection</h2>
                            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-2'>
                                Discover our latest arrivals and timeless pieces.
                            </p>
                        </div>
                        {/* Display first 5 products as a fallback "Explore" section */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                            {products.slice(0, 5).map((item, index) => (
                                <Link key={index} to={`/product/${item._id}`} className='text-gray-700 cursor-pointer group flex flex-col gap-3' onClick={() => window.scrollTo(0, 0)}>
                                    <div className='overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-50 aspect-square relative'>
                                        <img className='hover:scale-110 transition ease-in-out duration-700 w-full h-full object-cover' src={item.image[0]} alt={item.name} />
                                        {item.bestseller && (
                                            <span className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                                Bestseller
                                            </span>
                                        )}
                                    </div>
                                    <div className="px-2">
                                        <p className='pt-1 pb-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest'>{item.artisanName || "Kharnak Artisan"}</p>
                                        <p className='text-sm font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-2'>{item.name}</p>
                                        <p className='text-sm font-bold text-gray-500 mt-1'>{currency}{item.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Cart;
