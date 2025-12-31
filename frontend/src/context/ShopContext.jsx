import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                const productInfo = products.find(p => p._id === itemId);
                if (productInfo && cartData[itemId][size] + 1 > productInfo.quantity) {
                    toast.error(`Only ${productInfo.quantity} items available.`);
                    return;
                }
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        } else {
            localStorage.setItem('cartItems', JSON.stringify(cartData));
        }
        toast.success("Added to Cart");
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        const productInfo = products.find(p => p._id === itemId);
        if (productInfo && quantity > productInfo.quantity) {
            toast.error(`Only ${productInfo.quantity} items available.`);
            // Do not update state or backend
            return;
        }

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        } else {
            localStorage.setItem('cartItems', JSON.stringify(cartData));
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/product/list')
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (data.success) {
                setCartItems(data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (token) {
            getUserCart(token);
        } else {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                // Guest user: load from local storage
                const localCart = localStorage.getItem('cartItems');
                if (localCart) {
                    setCartItems(JSON.parse(localCart));
                } else {
                    setCartItems({});
                }
            }
        }
    }, [token])

    const logout = () => {
        setToken('');
        setCartItems({});
        localStorage.removeItem('token');
        navigate('/login');
    }

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, logout
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
