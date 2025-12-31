import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RiShieldUserLine } from 'react-icons/ri'

const ManageAdmins = () => {
    const { backendUrl, token, role } = useContext(AppContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState(null)
    const [admins, setAdmins] = useState([])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (editMode) {
                // Edit Admin
                const { data } = await axios.post(backendUrl + '/api/user/edit-admin', { userId: editId, name, email, password, isActive }, { headers: { token } })
                if (data.success) {
                    toast.success(data.message)
                    resetForm()
                    fetchAdmins()
                } else {
                    toast.error(data.message)
                }
            } else {
                // Add Admin
                const { data } = await axios.post(backendUrl + '/api/user/add-admin', { name, email, password }, { headers: { token } })
                if (data.success) {
                    toast.success(data.message)
                    resetForm()
                    fetchAdmins()
                } else {
                    toast.error(data.message)
                }
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const resetForm = () => {
        setName('')
        setEmail('')
        setPassword('')
        setIsActive(true)
        setEditMode(false)
        setEditId(null)
    }

    const handleEdit = (admin) => {
        setName(admin.name)
        setEmail(admin.email)
        setPassword('') // Don't populate password
        setIsActive(admin.isActive !== false) // Default true if undefined
        setEditMode(true)
        setEditId(admin._id)
    }

    const handleToggleStatus = async (admin) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/toggle-admin-status', { userId: admin._id, isActive: !admin.isActive }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                fetchAdmins()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchAdmins = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/all-users', { headers: { token } })
            if (data.success) {
                // Filter only admins
                const adminUsers = data.users.filter(user => user.role === 'admin' || user.role === 'master_admin')
                setAdmins(adminUsers)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (role === 'master_admin') {
            fetchAdmins()
        }
    }, [role])

    if (role !== 'master_admin') {
        return (
            <div className='min-h-[80vh] flex flex-col items-center justify-center text-center'>
                <RiShieldUserLine className='text-6xl text-gray-300 mb-4' />
                <h2 className='text-2xl font-black text-gray-800 uppercase tracking-tight'>Access Restricted</h2>
                <p className='text-gray-500 mt-2 font-medium'>Only Master Administrators can access this protocol.</p>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className="mb-10">
                <h1 className='text-4xl font-black text-gray-800 tracking-tighter uppercase mb-2'>Admin Command</h1>
                <p className="text-gray-500 font-medium">Managing system administrators and access protocols.</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                {/* Add/Edit Admin Form */}
                <div className='bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-50 h-fit'>
                    <div className='mb-8 flex justify-between items-center'>
                        <div>
                            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1'>{editMode ? 'Update Protocol' : 'New Protocol'}</p>
                            <h3 className='text-2xl font-black text-gray-800 uppercase tracking-tight'>{editMode ? 'Edit Admin' : 'Authorize New Admin'}</h3>
                        </div>
                        {editMode && (
                            <button onClick={resetForm} className='text-xs font-bold text-red-500 uppercase tracking-wider hover:text-red-700'>Cancel</button>
                        )}
                    </div>

                    <form onSubmit={onSubmitHandler} className='space-y-6'>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Officer Name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                type="text"
                                placeholder="Admin Name"
                                required
                            />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Communication Link</p>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                type="email"
                                placeholder="admin@kharnak.com"
                                required
                            />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Security Key {editMode && '(Leave blank to keep current)'}</p>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                                type="password"
                                placeholder={editMode ? "••••••••" : "••••••••"}
                                required={!editMode}
                            />
                        </div>

                        {editMode && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer" onClick={() => setIsActive(!isActive)}>
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isActive ? 'left-5' : 'left-1'}`}></div>
                                </div>
                                <span className={`font-bold text-sm uppercase tracking-wide ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                    {isActive ? 'Active Status' : 'Inactive Status'}
                                </span>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 bg-black hover:bg-blue-600 text-white font-black rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-xs shadow-xl shadow-black/20"
                            >
                                {editMode ? 'Update Credentials' : 'Grant Clearance'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Admin List */}
                <div className='space-y-6'>
                    {admins.map((admin, index) => (
                        <div key={index} className={`bg-white p-6 rounded-[2.5rem] border flex items-center justify-between shadow-sm hover:shadow-md transition-all ${admin.isActive === false ? 'opacity-60 border-gray-200' : 'border-gray-50'}`}>
                            <div className='flex items-center gap-4'>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl ${admin.isActive === false ? 'bg-gray-400' : 'bg-gray-900'}`}>
                                    {admin.name[0]}
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <p className='font-black text-gray-800 uppercase tracking-tight'>{admin.name}</p>
                                        <span className={`w-2 h-2 rounded-full ${admin.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </div>
                                    <p className='text-xs text-gray-400 font-medium'>{admin.email}</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 items-end'>
                                <div className='px-4 py-2 bg-blue-50 rounded-xl'>
                                    <p className='text-[9px] font-black text-blue-600 uppercase tracking-widest'>{admin.role.replace('_', ' ')}</p>
                                </div>
                                {admin.role !== 'master_admin' && (
                                    <div className='flex gap-2 mt-1'>
                                        <button onClick={() => handleEdit(admin)} className='text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-black'>Edit</button>
                                        <button onClick={() => handleToggleStatus(admin)} className={`text-[10px] font-bold uppercase tracking-wider ${admin.isActive !== false ? 'text-red-400 hover:text-red-600' : 'text-green-500 hover:text-green-700'}`}>
                                            {admin.isActive !== false ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ManageAdmins
