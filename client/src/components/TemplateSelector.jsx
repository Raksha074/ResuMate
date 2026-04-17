import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const templates = [
        { id: 'classic', name: 'Classic', preview: 'A clean, traditional resume format with clear sections and a professional typography.' },
        { id: 'modern', name: 'Modern', preview: 'Sleek design with strategic use of color and modern font choices.' },
        { id: 'minimal', name: 'Minimal', preview: 'ultra-clean design that puts your content front and center' },
        { id: 'minimal-image', name: 'Minimal Image', preview: 'Minimalist layout with a dedicated space for your professional photo' },
    ]
    return (
        <div className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-[#8a4179] bg-gradient-to-br from-[#f9eef8] to-[#f2dcef] ring-[#d89acd] hover:ring transition-all px-3 py-2 rounded-lg'>
                <Layout size={14} /><span className='max-sm:hidden'>Template</span>
            </button>
            {isOpen && (
                <div className='absolute top-full mt-2 w-xs space-y-3 z-10 bg-white rounded-md shadow-sm border border-gray-200'>

                    <h3 className='text-sm font-medium text-gray-900 mb-4'>Select a template</h3>
                    <div className='space-y-2'>
                        {templates.map((template) => (
                            <div key={template.id} onClick={() => { onChange(template.id); setIsOpen(false) }} className={`relative p-3 rounded-md border cursor-pointer transition-all ${selectedTemplate === template.id ? 'border-[#a75296] bg-[#f2dcef]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'}`}>
                                {selectedTemplate === template.id && (
                                    <div className='absolute top-2 right-2'>
                                        <div className='size-5 bg-[#713763] rounded-full flex items-center justify-center'>
                                            <Check className='w-3 h-3 text-white' />
                                        </div>
                                    </div>
                                )}

                                <div className='space-y-1'>
                                    <h4 className='font-medium text-gray-800'>{template.name}</h4>
                                    <div className='mt-2 p-2 bg-[#f9eef8] rounded text-xs text-gray-500 italic '> {template.preview}</div>
                                </div>

                            </div>

                        ))}
                    </div>

                </div>
            )}
        </div>
    )
}

export default TemplateSelector