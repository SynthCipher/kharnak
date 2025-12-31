import React from "react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import {
  RiFileCopyLine
} from "react-icons/ri";
import { assets } from "../assets/assets.js";

const Orders = () => {
  const { currency, backendUrl, token } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const { data } = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (data.success) {
        // console.log("order pager : -----", data.orders);
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (orderId, status) => {
    if (!token) {
      return null;
    }
    try {
      // console.log(orderId);
      const { data } = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status },
        { headers: { token } }
      );
      if (data.success) {
        await fetchAllOrders();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders();
    }
  }, [token]);

  /* Tracking Edit Logic */
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    trackingId: '',
    courierCompany: '',
    courierLink: '',
    expectedDate: ''
  });

  const editHandler = (order) => {
    setEditingOrderId(order._id);
    setTrackingForm({
      trackingId: order.trackingId || '',
      courierCompany: order.courierCompany || '',
      courierLink: order.courierLink || '',
      expectedDate: order.expectedDate || ''
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Order ID copied!");
  };

  const submitTracking = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/order/update', { orderId: editingOrderId, ...trackingForm }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        setEditingOrderId(null);
        await fetchAllOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Order Command</h1>
        <p className="text-gray-500 font-medium">Tracking and fulfilling global Kharnak commercial requests.</p>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={index}
              className="group grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.7fr_2.5fr_1.5fr_1.2fr_1.5fr] gap-6 items-start bg-white border border-gray-50 p-6 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-gray-900/5 transition-all duration-500"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <img className="w-10 opacity-70" src={assets.parcel_icon} alt="" />
                </div>
                <div title={order._id} onClick={() => copyToClipboard(order._id)} className="flex items-center gap-1 cursor-pointer group/id bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/id:text-white">#{order._id.slice(-6)}</span>
                  <RiFileCopyLine className="text-[10px] text-gray-300 group-hover/id:text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <p className="text-sm font-bold text-gray-800" key={index}>
                      {item.name} x {item.quantity} <span className="text-blue-500 text-[10px] font-black uppercase ml-2">{item.size}</span>
                    </p>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Recipient Details</p>
                  <p className="text-sm font-bold text-gray-900">{order.address.firstName + " " + order.address.lastName}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  <p className="text-xs font-bold text-gray-400 mt-1">{order.address.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Logistics</p>
                  <p className="text-sm font-bold text-gray-800">Total Items: {order.items.length}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Method: {order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${order.payment ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {order.payment ? 'Payment Captured' : 'Payment Awaited'}
                  </span>
                </div>
                {/* Tracking Display / Edit Button */}
                <div className="pt-2">
                  {order.trackingId ? (
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-blue-100 mb-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Logistics Info</p>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-gray-100">{order.courierCompany}</span>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-gray-800 flex items-center gap-1 group/track cursor-pointer" onClick={() => copyToClipboard(order.trackingId)} title="Copy ID">
                          {order.trackingId} <RiFileCopyLine className="text-gray-300 group-hover/track:text-blue-500 transition-colors" />
                        </p>
                        {order.expectedDate && <p className="text-[9px] font-medium text-gray-500 mt-0.5">Exp: {new Date(order.expectedDate).toLocaleDateString()}</p>}
                      </div>

                      {order.courierLink && (
                        <a href={order.courierLink} target="_blank" rel="noopener noreferrer" className="block text-center bg-black text-white text-[9px] font-bold uppercase tracking-widest py-1.5 rounded-lg hover:bg-gray-800 transition-all">
                          Track Shipment
                        </a>
                      )}
                    </div>
                  ) : null}

                  {/* Tracking Form (Inline) */}
                  {editingOrderId === order._id ? (
                    <form onSubmit={submitTracking} className="mt-4 bg-gray-50 p-4 rounded-xl space-y-2 border border-blue-100 animate-in fade-in zoom-in duration-300 relative z-10 shadow-lg">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Update Logistics</p>
                      <input value={trackingForm.courierCompany} onChange={e => setTrackingForm({ ...trackingForm, courierCompany: e.target.value })} placeholder="Courier Name" className="w-full text-xs p-2 rounded border border-gray-200" />
                      <input value={trackingForm.trackingId} onChange={e => setTrackingForm({ ...trackingForm, trackingId: e.target.value })} placeholder="Tracking ID" className="w-full text-xs p-2 rounded border border-gray-200" />
                      <input value={trackingForm.courierLink} onChange={e => setTrackingForm({ ...trackingForm, courierLink: e.target.value })} placeholder="Tracking Link" className="w-full text-xs p-2 rounded border border-gray-200" />
                      <input value={trackingForm.expectedDate} onChange={e => setTrackingForm({ ...trackingForm, expectedDate: e.target.value })} type="date" placeholder="Expected Delivery Date" className="w-full text-xs p-2 rounded border border-gray-200 text-gray-400 focus:text-gray-900" />
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-black text-white text-[10px] py-2 rounded-lg font-bold uppercase tracking-widest">Save</button>
                        <button type="button" onClick={() => setEditingOrderId(null)} className="flex-1 bg-white text-gray-500 text-[10px] py-2 rounded-lg font-bold uppercase tracking-widest border border-gray-200">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => editHandler(order)} className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-600 underline hover:text-black">
                      {order.trackingId ? 'Edit Tracking' : 'Add Tracking'}
                    </button>
                  )}
                </div>
              </div>

              {/* Amount & Time */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Amount</p>
                <p className="text-2xl font-black text-gray-900">
                  {currency}{order.amount}
                </p>
                <p className="text-[10px] text-gray-400 font-bold mt-2">
                  {new Date(order.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Status Update */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Update Core Status</p>
                  <select
                    onChange={(e) => statusHandler(order._id, e.target.value)}
                    value={order.status}
                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl font-bold text-xs text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No commercial requests detected</p>
          </div>
        )}
      </div>
    </div >
  );
};

export default Orders;
