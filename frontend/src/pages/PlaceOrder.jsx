import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { product } = location.state || {} // Fallback for direct access via cart? Cart usually sends state or we fetch cart data.
    // If coming from Cart, usually no product state, so we should fetch cart items. 
    // But current logic seems built for "Buy Now". I will adapt for both if possible or stick to current flow + Cart support.

    // Actually, if I just built Cart.jsx, it navigates to PlaceOrder without state?
    // Cart.jsx: navigate('/place-order') <- no state.
    // So PlaceOrder needs to handle Cart items too.

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081"
    const { navigate: shopNavigate, cartItems, setCartItems, products, getCartAmount, delivery_fee, token, currency } = useContext(ShopContext)

    const [savedAddresses, setSavedAddresses] = useState([])
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null)
    const [addNewAddress, setAddNewAddress] = useState(false)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    // Fetch user profile to get addresses
    useEffect(() => {
        if (token) {
            const fetchProfile = async () => {
                try {
                    const { data } = await axios.get(backendUrl + '/api/user/profile', { headers: { token } })
                    if (data.success && data.user.addresses) {
                        setSavedAddresses(data.user.addresses)
                        if (data.user.addresses.length > 0) {
                            setSelectedAddressIndex(0);
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchProfile()
        }
    }, [token, backendUrl])

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!rzpKey) {
            toast.error("Razorpay Key ID is missing in Frontend Environment!");
            return;
        }

        const options = {
            key: rzpKey,
            amount: order.amount,
            currency: order.currency,
            name: 'Kharnak Order',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
                    if (data.success) {
                        toast.success("Payment Successful")
                        setCartItems({}) // Clear Cart
                        navigate('/profile')
                    } else {
                        toast.error(data.message)
                        navigate('/profile')
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        if (isSubmitting) return; // Prevent double click
        setIsSubmitting(true);
        try {
            // Determine Address
            let finalAddress = formData;
            if (!addNewAddress && selectedAddressIndex !== null && savedAddresses[selectedAddressIndex]) {
                finalAddress = savedAddresses[selectedAddressIndex];
            } else if (addNewAddress) {
                // Save new address first
                try {
                    await axios.post(backendUrl + '/api/user/add-address', { address: formData }, { headers: { token } })
                    // Note: We don't necessarily set it as default in backend here unless requested, 
                    // but we use this form data for THIS order.
                    // Ideally we refetch saved addresses or update state, but using formData is fine for this txn.
                } catch (err) {
                    console.log("Error saving address:", err)
                }
            } else if (!addNewAddress && selectedAddressIndex === null && savedAddresses.length > 0) {
                setIsSubmitting(false);
                return toast.error("Please select an address or add a new one.")
            }


            let orderItems = []
            let totalAmount = 0;

            // Handle "Buy Now" (product in state) vs Cart
            if (product) {
                // Buy Now Logic
                orderItems.push({
                    ...product,
                    quantity: 1,
                    size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard'
                })
                totalAmount = product.price;
            } else {
                // Cart Logic
                for (const items in cartItems) {
                    for (const item in cartItems[items]) {
                        if (cartItems[items][item] > 0) {
                            const itemInfo = structuredClone(products.find(p => p._id === items))
                            if (itemInfo) {
                                itemInfo.size = item
                                itemInfo.quantity = cartItems[items][item]
                                orderItems.push(itemInfo)
                            }
                        }
                    }
                }
                totalAmount = getCartAmount() + delivery_fee;
            }

            let orderData = {
                address: finalAddress,
                items: orderItems,
                amount: totalAmount,
            }

            const response = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
            if (response.data.success) {
                initPay(response.data.order)
                setIsSubmitting(false);
            } else {
                toast.error(response.data.message)
                setIsSubmitting(false);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
            setIsSubmitting(false);
        }
    }

    // Calculate details for summary
    let summaryItems = [];
    if (product) {
        summaryItems.push({ ...product, quantity: 1, size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard' });
    } else {
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    const itemInfo = products.find(p => p._id === items);
                    if (itemInfo) {
                        summaryItems.push({ ...itemInfo, quantity: cartItems[items][item], size: item });
                    }
                }
            }
        }
    }
    const displayTotal = product ? product.price : (getCartAmount ? getCartAmount() + delivery_fee : 0);


    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col mt-20 sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t px-[4%] bg-gray-50'>
            {/* Left Side - Address Selection */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <h2 className='text-gray-500 uppercase tracking-wider font-bold'>Delivery Information</h2>
                </div>

                {/* Saved Addresses List */}
                {savedAddresses.length > 0 && !addNewAddress && (
                    <div className="flex flex-col gap-3 mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Locations</p>
                        {savedAddresses.map((addr, index) => (
                            <div key={index}
                                onClick={() => { setSelectedAddressIndex(index); setAddNewAddress(false); }}
                                className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressIndex === index && !addNewAddress ? 'border-black bg-white shadow-md' : 'border-gray-200 hover:border-gray-400'} `}
                            >
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className="font-bold text-sm">{addr.firstName} {addr.lastName}</p>
                                        <p className="text-sm text-gray-500">{addr.street}, {addr.city}</p>
                                    </div>
                                    {index === 0 && <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-1 rounded">Default</span>}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{addr.state}, {addr.country}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Address Option */}
                {!addNewAddress && (
                    <div
                        onClick={() => { setAddNewAddress(true); setSelectedAddressIndex(null); }}
                        className={`p-4 border border-dashed rounded-xl cursor-pointer flex items-center justify-center gap-2 mb-6 border-gray-300 text-gray-500 hover:border-black hover:text-black transition-colors`}
                    >
                        <span className="font-bold text-sm uppercase tracking-widest">+ Add New Address</span>
                    </div>
                )}

                {/* New Address Form */}
                {addNewAddress && (
                    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className='flex justify-between items-center mb-2'>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Address Details</p>
                            <button type='button' onClick={() => setAddNewAddress(false)} className='text-xs font-black text-red-500 hover:underline uppercase tracking-widest'>Cancel</button>
                        </div>
                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                        </div>
                        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                            <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                        </div>
                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                            <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                        </div>
                        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
                    </div>
                )}
            </div>

            {/* Right Side */}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <h2 className='text-gray-500 uppercase tracking-wider font-bold mb-4'>Order Summary</h2>
                    <div className='flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 mb-4'>
                        {summaryItems.map((item, index) => (
                            <div key={index} className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
                                <div className='flex items-center gap-3'>
                                    {item.image && item.image[0] && <img src={item.image[0]} alt={item.name} className='w-10 h-10 object-cover rounded-lg' />}
                                    <div className='flex flex-col'>
                                        <p className='text-xs font-bold text-gray-800 line-clamp-1 w-32'>{item.name}</p>
                                        <p className='text-[10px] text-gray-400'>Qty: {item.quantity} | {item.size}</p>
                                    </div>
                                </div>
                                <span className='text-sm font-bold text-gray-700'>{currency}{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-between py-2 border-t border-dashed border-gray-300 font-bold text-lg'>
                        <span>Total Due</span>
                        <span>{currency}{displayTotal}</span>
                    </div>
                </div>

                <div className='mt-8'>
                    <button disabled={isSubmitting} type='submit' className='bg-black text-white px-16 py-3 text-sm active:bg-gray-700 font-bold uppercase tracking-wider w-full disabled:opacity-50 disabled:cursor-not-allowed'>
                        {isSubmitting ? 'Processing...' : (addNewAddress ? 'Save Address & Place Order' : 'Place Order')}
                    </button>
                    {!addNewAddress && savedAddresses.length === 0 && <p className="text-xs text-red-500 mt-2 text-center">Please add an address first.</p>}

                    {/* Policy Disclaimer */}
                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            No Returns Available • Online Payment Only (No COD)
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
