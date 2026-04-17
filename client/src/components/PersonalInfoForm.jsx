import React from 'react'
import { Link, BriefcaseBusiness, Mail, MapPin, Phone, User, Globe } from 'lucide-react'


const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value })
    }

    const fields = [
        { key: 'full_name', label: 'Full Name', icon: User, type: 'text', required: true },
        { key: 'email', label: 'Email Address', icon: Mail, type: 'email', required: true },
        { key: 'phone', label: 'Phone Number', icon: Phone, type: 'tel' },
        { key: 'location', label: 'Location', icon: MapPin, type: 'text' },
        { key: 'profession', label: 'Profession', icon: BriefcaseBusiness, type: 'text' },
        { key: 'linkedin', label: 'LinkedIn', icon: Link, type: 'url' },
        { key: 'website', label: 'Personal Website', icon: Globe, type: 'url' },

    ]

    return (
        <div>
            <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
            <p className='text-sm text-gray-600'>Get Started with the personal information</p>
            <div className="flex items-center gap-2">
                <label>
                    {data.image ? (
                        <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} alt='user-image ' className="w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80" />
                    ) : (
                        <div className='items-center inline-flex gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
                            <User className='size-10 p-2.5 border rounded-full' />
                            Upload user image
                        </div>
                    )}
                    <input type="file" accept="image/jpeg , image/png" className='hidden' onChange={(e) => handleChange("image", e.target.files[0])} />
                </label>
                {typeof data.image === 'object' && (
                    <div className='flex flex-col pl-4 gap-1 text-sm'>
                        <p>Remove Background</p>
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className='sr-only peer' onChange={() => setRemoveBackground(prev => !prev)} checked={removeBackground} />
                            <div className='w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-[#8a4179] transition-colors duration-200'>

                            </div>
                            <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5'></span>
                        </label>
                    </div>
                )}

            </div>


            {fields.map((field) => {
                const Icon = field.icon;
                return (
                    <div key={field.key} className='space-y-1 mt-5'>

                        <label className='flex items-center text-sm gap-2 font-medium text-gray-600'>
                            <Icon className='size-4' />
                            {field.label}
                            {field.required && <span className='text-red-500'>*</span>}
                        </label>
                        <input type={field.type} value={data[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring  focus:ring-[#a75296] focus:border-[#a75296] outline-none transition-colors text-sm' placeholder={`Enter your ${field.label.toLowerCase()}`} required={field.required} />

                    </div>
                )

            })}

        </div>
    )
}

export default PersonalInfoForm