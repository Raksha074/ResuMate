import React, { useState } from 'react'
import { Check, Palette } from 'lucide-react'


const ColorPicker = ({ selectedColor, onChange }) => {
    const colors = [
        { name: 'purple', value: '#916db0' },
        { name: 'bouquet', value: '#b87794' },
        { name: 'blue', value: '#223f58' },
        { name: 'green pea', value: '#1c5b37' },
        { name: 'cerise', value: '#ca3585' },
        { name: 'teal', value: '#368190' },
        { name: 'cyan', value: '#0aeeea' },
        { name: 'camelot', value: '#92445e' },
        { name: 'mocha', value: '#4e342e' },
        { name: 'black', value: '#000000' },
    ]
    const [isOpen, setIsOpen] = useState(false);
    return (

        <div className='relative'>
            <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-[#007590] bg-gradient-to-br from-[#c2fdff] to-[#8cf9ff] ring-[#007590] hover:ring transition-all px-3 py-2 rounded-lg'>
                <Palette size={16} /><span className='max-sm:hidden'>Accent Color</span>
            </button>

            {isOpen &&
                <div className='grid grid-cols-4 w-60 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md shadow-sm border border-gray-200' >
                    {colors.map((color) => (
                        <div key={color.value} className='relative cursor-pointer group flex flex-col' onClick={() => { onChange(color.value); setIsOpen(false) }}>
                            <div className='w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors' style={{ backgroundColor: color.value }}>
                            </div>
                            {selectedColor === color.value && (
                                <div className='absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center'>
                                    <Check className='size-5 text-white' />
                                </div>
                            )}

                            <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>

                        </div>
                    ))}
                </div>
            }

        </div>
    )
}

export default ColorPicker