import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoSearchOutline, IoFilterOutline, IoCartOutline } from 'react-icons/io5';
import { ShopContext } from '../context/ShopContext';
import SEO from '../components/SEO';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sortType, setSortType] = useState('relevant');
    const [showFilter, setShowFilter] = useState(false);

    const navigate = useNavigate();
    const { addToCart } = useContext(ShopContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/product/list');
            if (data.success) {
                setProducts(data.products);
                setFilteredProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let productsCopy = products.slice();

        // 1. Filter Logic
        if (search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (category !== 'All') {
            productsCopy = productsCopy.filter(item => item.category === category);
        }

        // 2. Sort Logic
        switch (sortType) {
            case 'low-high':
                productsCopy.sort((a, b) => (a.price - b.price));
                break;
            case 'high-low':
                productsCopy.sort((a, b) => (b.price - a.price));
                break;
            default: // Relevant
                productsCopy.sort((a, b) => {
                    const aAvailable = a.quantity > 0;
                    const bAvailable = b.quantity > 0;
                    if (aAvailable && !bAvailable) return -1;
                    if (!aAvailable && bAvailable) return 1;
                    return b.date - a.date;
                });
                break;
        }

        setFilteredProducts(productsCopy);

    }, [category, search, sortType, products]);

    const categories = ['All', ...new Set(products.map(item => item.category))];

    return (
        <div className="min-h-screen bg-[#fcf9f2] pt-24 pb-20 px-6 mt-10 md:px-16 lg:px-24 xl:px-32">
            <SEO
                title="Shop"
                description="Shop authentic Ladakh products, premium Pashmina shawls, and handcrafted nomadic treasures. Every purchase supports the artisans of Kharnak."
                keywords="Ladakh products, Pashmina shop, Kharnak crafts, nomadic treasures, Leh gifts, authentic Ladakh pashmina"
            />
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1e1964] mb-2 tracking-tight">
                        Kharnak <span className="text-yellow-600">Shop</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Authentic nomadic treasures and local crafts.</p>
                </div>

                <div className="w-full md:w-[400px] relative group">
                    <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl transition-colors group-focus-within:text-yellow-600" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white rounded-full py-4 pl-12 pr-6 shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Filter */}
                <div className="lg:w-64 flex-shrink-0">
                    <div
                        className="lg:hidden flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 mb-6 cursor-pointer"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        <IoFilterOutline className="text-xl" />
                        <span className="font-bold uppercase tracking-widest text-xs">Filters</span>
                    </div>

                    <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-8 sticky top-32`}>
                        {/* Categories */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                            <h3 className="text-[#1e1964] font-bold uppercase tracking-widest text-xs mb-6 border-b pb-4">Categories</h3>
                            <div className="flex flex-col gap-3">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={category === cat}
                                            onChange={() => setCategory(cat)}
                                            className="w-4 h-4 accent-[#1e1964]"
                                        />
                                        <span className={`text-sm transition-colors ${category === cat ? 'text-[#1e1964] font-bold' : 'text-gray-500 group-hover:text-black'}`}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                            <h3 className="text-[#1e1964] font-bold uppercase tracking-widest text-xs mb-6 border-b pb-4">Sort By</h3>
                            <select
                                onChange={(e) => setSortType(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none"
                            >
                                <option value="relevant">Relevant</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4 shadow-sm border border-gray-100">
                                        <img
                                            src={product.image[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />

                                        {/* Category Badge - INSIDE IMAGE */}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#1e1964] rounded-lg shadow-sm border border-white/50">
                                                {product.category}
                                            </span>
                                        </div>

                                        {/* Sold Out Badge */}
                                        {product.quantity <= 0 && (
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-red-600/90 backdrop-blur-md text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                                                    Sold Out
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Section - Name, Price, Cart Icon */}
                                    <div className="flex justify-between items-end px-1">
                                        <div className="flex-1 pr-4">
                                            <h3 className="text-lg font-medium text-[#1e1964] leading-tight mb-1 group-hover:text-yellow-600 transition-colors font-serif line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm font-light text-gray-500">₹{product.price}</p>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Default to standard size or first available size
                                                const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
                                                addToCart(product._id, size);
                                            }}
                                            disabled={product.quantity <= 0}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#1e1964] hover:bg-[#1e1964] hover:text-white hover:border-[#1e1964] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1e1964]"
                                            title="Add to Cart"
                                        >
                                            <IoCartOutline size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <IoSearchOutline className="text-3xl text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1e1964] mb-2">No items found</h3>
                            <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                            <button
                                onClick={() => { setSearch(''); setCategory('All'); }}
                                className="mt-8 text-yellow-600 font-bold border-b-2 border-yellow-600 hover:text-yellow-700 hover:border-yellow-700 transition-all"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
