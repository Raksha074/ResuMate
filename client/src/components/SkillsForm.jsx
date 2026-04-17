import { Plus, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({ data = [], onChange }) => {
    const [newSkill, setNewSkill] = useState('')

    const addSkill = () => {
        if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
            setNewSkill('')
        }
    }
    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, i) => i !== indexToRemove))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    }

    return (
        <div className='space-y-4'>

            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
                <p className='text-sm text-gray-500'>Add your technical and soft skills</p>
            </div>
            <div className='flex gap-2'>
                <input type='text' value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleKeyPress} placeholder='Enter a skill' className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#a75296] focus:border-[#a75296] outline-none transition-colors text-sm' />
                <button onClick={addSkill} disabled={!newSkill.trim()} className='flex items-center gap-2 px-4 py-2 text-sm bg-[#f9eef8] text-[#8a4179] rounded-lg hover:bg-[#e7c0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                    <Plus className='size-4' />
                    Add Skill
                </button>
            </div>

            {data && data.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                    {data.map((skill, index) => (

                        <span key={index} className='flex items-center gap-1 px-3 py-1 bg-[#f9eef8] text-[#8a4179] rounded-full text-sm'>
                            {skill}
                            <button onClick={() => removeSkill(index)} className='ml-1  hover:bg-red-200 rounded-full transition-colors '>
                                <X className='w-3 h-3' />
                            </button>
                        </span>
                    ))}
                </div>
            )
                :
                (
                    <div className='text-center py-6 text-gray-500'>
                        <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300' />
                        <p className='text-sm text-gray-500'>No skills added yet</p>
                        <p className='text-sm text-gray-500'>Add your technical and soft skills above</p>
                    </div>

                )}
            <div className='bg-[#f9eef8] p-3 rounded-lg'>
                <p className='text-sm text-[#8a4179]'><strong>Tip: </strong>Add 8-12 relevant skills. Includes technical skills (programming languages, tools) and soft skills (communication, teamwork, leadership).</p>
            </div>
        </div>
    )
}

export default SkillsForm