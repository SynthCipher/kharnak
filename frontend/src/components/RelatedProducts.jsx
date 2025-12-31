import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ category, subCategory, currentId }) => {
    const { products, currency } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();

            // 1. Strict Filter: Category + SubCategory
            let strictFiltered = productsCopy.filter((item) => category === item.category);
            if (subCategory) {
                strictFiltered = strictFiltered.filter((item) => subCategory === item.subCategory);
            }
            strictFiltered = strictFiltered.filter((item) => currentId !== item._id);

            if (strictFiltered.length > 0) {
                setRelated(strictFiltered.slice(0, 5));
            } else {
                // 2. Fallback: Broad Category or Just Bestsellers/Newest
                // Try Category Only first
                let broadFiltered = productsCopy.filter((item) => category === item.category && currentId !== item._id);

                if (broadFiltered.length > 0) {
                    setRelated(broadFiltered.slice(0, 5));
                } else {
                    // 3. Fallback: Show any 5 products (e.g. Bestsellers or Newest)
                    setRelated(productsCopy.filter(item => currentId !== item._id).slice(0, 5));
                }
            }
        }
    }, [products, category, subCategory, currentId]);

    // Determine Title based on logic? 
    // Ideally we track if it's fallback, but for now "You Might Also Like" covers all cases better than "Related Curations".
    // Or we stick to "Related Curations" and generic "Curations" for fallback. 
    // Let's use a generic appealing title.

    return (
        <div className='my-24'>
            <div className='text-center py-8 text-3xl font-black text-gray-800 uppercase tracking-tighter'>
                <h1>{related.length > 0 && related[0].category === category ? "Related Curations" : "You May Also Like"}</h1>
                <p className='text-xs font-bold text-gray-500 tracking-widest mt-2'>Explore similar artisanal masterpieces</p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {related.map((item, index) => (
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

            {related.length === 0 && (
                <div className='text-center py-10 text-gray-400 text-xs font-bold uppercase tracking-widest'>
                    No related archives found.
                </div>
            )}
        </div>
    );
};

export default RelatedProducts;
