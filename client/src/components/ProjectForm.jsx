import { Plus, Trash2 } from 'lucide-react'
import React from 'react'

const ProjectForm = ({ data, onChange }) => {

    const addProject = () => {
    const newProject = {
        title: "",
        type: "",
        description: "",
        link: ""
    }
    
    // Ensure data is an array before spreading. 
    // If data is null/undefined, it defaults to an empty array.
    const currentData = Array.isArray(data) ? data : [];
    onChange([...currentData, newProject]);
}

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateProject = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div >
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
                    <p className='text-sm text-gray-500'>Add your projects</p>
                </div>
                <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-[#f9eef8] text-[#8a4179] rounded-lg hover:bg-[#e7c0e0] transition-colors '>
                    <Plus className='size-4' />
                    Add Project
                </button>
            </div>

            <div className='space-y-4 mt-6'>
                {data?.map((project, index) => (
                    <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                        <div className='flex items-start justify-between'>
                            <h4 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Project #{index + 1}</h4>
                            <button onClick={() => removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors '>
                                <Trash2 className='size-4' />
                            </button>
                        </div>
                        <div className='grid gap-3'>
                            <input value={project.title || ''} onChange={(e) => updateProject(index, 'title', e.target.value)} type='text' placeholder='Project Title' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#a75296] focus:border-[#a75296] outline-none transition-colors text-sm' />

                            <input value={project.type || ''} onChange={(e) => updateProject(index, 'type', e.target.value)} type='text' placeholder='Project Type' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#a75296] focus:border-[#a75296] outline-none transition-colors text-sm' />

                            <textarea rows={4} value={project.description || ''} onChange={(e) => updateProject(index, 'description', e.target.value)} type='text' placeholder='Project Description' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#a75296] focus:border-[#a75296] outline-none transition-colors text-sm' />


                        </div>
                        <input value={project.link || ''} onChange={(e) => updateProject(index, 'link', e.target.value)} type='text' placeholder='Project Link' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#a75296] focus:border-[#a75296] outline-none transition-colors text-sm' />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default ProjectForm