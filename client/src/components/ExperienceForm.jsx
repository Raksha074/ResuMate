import { Briefcase, Loader2, Plus, Sparkles, Trash2, } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ExperienceForm = ({ data, onChange }) => {

    const { token } = useSelector(state => state.auth)
    const [generatingIndex, setGeneratingIndex] = useState(-1)

const addExperience = () =>{
    const newExperience = {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        is_current: false
    };
    onChange([...data, newExperience])
}

const removeExperience = (index)=>{
    const updated = data.filter((_, i)=> i !== index);
    onChange(updated)
}

const updateExperience = (index, field, value)=>{
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value}
    onChange(updated)
}

 const generateDescription = async (index) => {
    // 1. Guard against empty data
    const experience = data[index];
    if (!experience.position || !experience.company) {
        toast.error("Please enter Job Title and Company first");
        return;
    }

    setGeneratingIndex(index);
    const prompt = `Enhance this job description: ${experience.description || 'new role'} for ${experience.position} at ${experience.company}`;

    try {
        // 2. Use a unique name for the response (res) to avoid prop conflict
        const res = await api.post('/ai/enhance-job-desc', 
            { userContent: prompt }, 
            { headers: { Authorization: token } }
        );

        // 3. Update the state using the specific response key
        if (res.data?.enhancedContent) {
            updateExperience(index, "description", res.data.enhancedContent);
            toast.success("AI Enhancement Complete!");
        }
    } catch (error) {
        console.error("AI Error:", error);
        toast.error(error.response?.data?.message || "AI Service Unavailable");
    } finally {
        setGeneratingIndex(-1);
    }
};

    return (
        <div className='space-y-6'>

            <div className='flex items-center justify-between'>

                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
                    <p className='text-sm text-gray-500'>Add your professional experience here</p>
                </div>
                <button onClick={addExperience} className='flex items-center gap-2 px-3 py-1 text-sm bg-[#f9eef8] text-[#8a4179] rounded-lg hover:bg-[#e7c0e0] transition-colors '>
                    <Plus className='size-4' />
                    Add Experience
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p >No work experience added yet.</p>
                    <p className='text-sm'>Click the "Add Experience" to get started.</p>
                </div>
            ) : (
                <div>
                    {data.map((experience, index) => (
                        <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                            <div className='flex items-start justify-between'>

                                <h4 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Experience #{index + 1}</h4>

                                <button onClick={() => removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors '>
                                    <Trash2 className='size-4' />

                                </button>

                            </div>

                            <div className='grid md:grid-cols-2 gap-3'>
                                <input value={experience.position || ''} onChange={(e) => updateExperience(index, 'position', e.target.value)} type='text' placeholder='Job Title' className='px-3 py-2 text-sm rounded-lg' />

                                <input value={experience.company || ''} onChange={(e) => updateExperience(index, 'company', e.target.value)} type='text' placeholder='Company Name' className='px-3 py-2 text-sm rounded-lg' />

                                <input value={experience.start_date || ''} onChange={(e) => updateExperience(index, 'start_date', e.target.value)} type='month' className='px-3 py-2 text-sm rounded-lg' />

                                <input value={experience.end_date || ''} onChange={(e) => updateExperience(index, 'end_date', e.target.value)} type='month' disabled={experience.is_current} className='px-3 py-2 text-sm rounded-lg disabled:bg-gray-100' />
                            </div>

                            <label className='flex items-center gap-2'>
                                <input type='checkbox' checked={experience.is_current || false} onChange={(e) => { updateExperience(index, 'is_current', e.target.checked ? true : false); }} className='rounded border-gray-300 text-purple-600 focus:ring-purple-500' />
                                <span className='text-sm text-gray-700'>currently working here</span>

                            </label>

                            <div className="space-y-2">
                               <div className='flex items-center justify-between'>
                                  <label className='text-sm font-medium text-gray-700'>Job Description</label>
                                  <button onClick={()=> generateDescription(index)} disabled={generatingIndex === index || !experience.position || !experience.company} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-200 text-purple-900 rounded hover:bg-purple-300 transition-colors disabled:opacity-50'>
                                      {generatingIndex === index ? (
                                      <Loader2 className="w-3 h-3 animate-spin"/>
                                       ): (
                                      <Sparkles className='w-3 h-3'/>
                                     )}
                                
                                       Enhance with AI
                                    </button>
                                </div>
                               <textarea value={experience.description || ""} onChange={(e)=> updateExperience(index, "description", e.target.value)} rows={4} className="w-full text-sm px-3 py-2 rounded-lg resize-none" placeholder="Describe your key responsibilities and achievements..."/>
                            </div>

                        </div>

                    ))}
                </div>
            )}

        </div>
    )
}

export default ExperienceForm