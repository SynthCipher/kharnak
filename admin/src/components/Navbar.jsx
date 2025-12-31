import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { setToken } = useContext(AppContext)

  return (
    <div className='flex items-center py-5 px-[4%] justify-between bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-30'>
      <div className='flex items-center gap-6'>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center p-2 shadow-xl shadow-black/10">
            <img className='w-full h-auto brightness-0 invert' src={assets.logo} alt="Logo" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tighter leading-none">Kharnak</h1>
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">Global Dashboard</span>
          </div>
        </Link>
      </div>

      <div className='flex items-center gap-8'>
        <div className='text-right hidden sm:flex flex-col items-end gap-0.5 border-r border-gray-100 pr-8 mr-2'>
          <p className='text-[10px] font-black uppercase tracking-widest text-blue-600'>System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <p className='text-xs font-bold text-gray-800'>Administrator Online</p>
          </div>
        </div>
        <button
          onClick={() => setToken('')}
          className='group relative flex items-center gap-2 bg-black hover:bg-red-600 transition-all duration-300 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:shadow-red-600/20 active:scale-95'
        >
          <span>Logout Session</span>
        </button>
      </div>
    </div>

  )
}

export default Navbar
