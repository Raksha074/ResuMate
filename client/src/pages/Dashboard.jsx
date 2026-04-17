import React, { useEffect, useState, useRef } from 'react'
import { FilePenLineIcon, Loader2, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'
import Tesseract from 'tesseract.js'


const FadeIn = ({ children, delay = 0, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false)
    const domRef = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                setIsVisible(entry.isIntersecting)
            })
        }, { threshold: 0.15 })

        if (domRef.current) {
            observer.observe(domRef.current)
        }

        return () => {
            if (domRef.current) {
                observer.unobserve(domRef.current)
            }
        }
    }, [])

    return (
        <div
            ref={domRef}
            className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-[0.95]'} ${className}`}
            style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
        >
            {children}
        </div>
    )
}

const Dashboard = () => {

    const { user, token } = useSelector(state => state.auth)

    const colors = ["#e20066", "#0486ab", "#a70c04", "#0284c7", "#bf0163"]
    const [allResumes, setAllResumes] = useState([])
    const [showCreateResume, setShowCreateResume] = useState(false)
    const [showUploadResume, setShowUploadResume] = useState(false)
    const [title, setTitle] = useState("")
    const [resume, setResume] = useState(null)
    const [editResumeId, setEditResumeId] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const loadAllResumes = async () => {
        try {
            const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
            setAllResumes(data.resumes)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const createResume = async (event) => {
        try {
            event.preventDefault()
            const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
            setAllResumes([...allResumes, data.resume])
            setTitle('')
            setShowCreateResume(false)
            navigate(`/app/builder/${data.resume._id}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
        const pdfParser = typeof pdfToText === 'function' ? pdfToText : pdfToText.default;
        const resumeText = await pdfParser(resume)

        if (!resumeText || resumeText.trim().length < 20) {
            toast.error('Could not extract text. Please use a text-based PDF.')
            setIsLoading(false)
            return
        }

        const { data } = await api.post('/api/ai/upload-resume',
            { title, resumeText },
            { headers: { Authorization: token } }
        )
        setTitle('')
        setResume(null)
        setShowUploadResume(false)
        navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
}

    const editTitle = async (event) => {
        try {
            event.preventDefault()
            const { data } = await api.put(`/api/resumes/update`, { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } })
            setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume))
            setTitle('')
            setEditResumeId('')
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }

    }

    const deleteResume = async (resumeId) => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this resume?')
            if (confirm) {
                const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
                setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }

    }

    useEffect(() => {
        loadAllResumes()
    }, [])

    return (
        <div>
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <FadeIn delay={0}>
                    <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Welcome, Raksha Narware</p>
                </FadeIn>

                <FadeIn delay={100}>
                    <div className='flex gap-4'>
                        <button onClick={() => setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg text-slate-600 gap-2 border border-dashed border-slate-350 group-hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer '>
                            <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full' />
                            <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
                        </button>
                        <button onClick={() => setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg text-slate-600 gap-2 border border-dashed border-slate-350 group-hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer '>
                            <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
                            <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload Existing</p>
                        </button>

                    </div>
                </FadeIn>

                <FadeIn delay={200}>
                    <hr className='border-slate-300 my-6 sm:w-[305px]' />
                </FadeIn>

                <div className='grid grid-cols-2 sm:flex flex-wrap gap-4 '>
                    {allResumes.map((resume, index) => {
                        const baseColor = colors[index % colors.length];

                        return (
                            <FadeIn key={index} delay={index * 100 + 300} className="w-full sm:max-w-36">
                                <button onClick={() => navigate(`/app/builder/${resume._id}`)} className='relative w-full h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer ' style={{ background: `linear-gradient( 135deg,${baseColor}10,${baseColor}40)`, borderColor: baseColor + '40' }}>

                                    <FilePenLineIcon className='size-7 group-hover:scale-105 transition-all' style={{ color: baseColor }} />
                                    <p className='text-sm group-hover:scale-105 px-2 transition-all text-center' style={{ color: baseColor }}>{resume.title}</p>
                                    <p className='absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center' style={{ color: baseColor + '90' }}>Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                                    </p>

                                    <div onClick={(e) => e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                                        <TrashIcon onClick={() => deleteResume(resume._id)} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                                        <PencilIcon onClick={() => { setEditResumeId(resume._id); setTitle(resume.title) }} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />

                                    </div>

                                </button>
                            </FadeIn>
                        )
                    })}

                </div>

                {
                    showCreateResume && (
                        <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                                <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
                                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter your professional profile' className='w-full px-4 py-2 mb-4 focus:border-[#713763] ring-[#713763]' required />
                                <button className='w-full py-2 bg-[#8a4179] text-white rounded hover:bg-[#713763] transition-colors'>Create Resume</button>
                                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text slate-600 cursor-pointer transition-colors' onClick={() => { setShowCreateResume(false); setTitle("") }} />
                            </div>
                        </form>
                    )
                }


                {
                    showUploadResume && (
                        <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                                <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
                                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter your professional profile' className='w-full px-4 py-2 mb-4 focus:border-[#8a4179] ring-[#8a4179]' required />

                                <div>
                                    <label htmlFor='resume-input' className='block text-sm text-slate-700'>
                                        Select resume File
                                        <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-[#8a4179] hover:text-[#8a4179] cursor-pointer transition-colors'>
                                            {resume ? (
                                                <p className='text-[#8a4179]'>{resume.name}</p>
                                            ) : (
                                                <>
                                                    <UploadCloudIcon className='size-14 stroke-1' />
                                                    <p className='text-sm group-hover:text-[#8a4179] transition-all duration-300'>Upload Resume</p>
                                                </>

                                            )}

                                        </div>
                                    </label>
                                    <input type='file' id='resume-input' accept='.pdf' hidden onChange={(e) => setResume(e.target.files[0])} />
                                </div>

                                <button disabled={isLoading} className='w-full py-2 bg-[#8a4179] text-white rounded hover:bg-[#713763] transition-colors flex items-center justify-center gap-2'>
                                    {isLoading && <Loader2 className='animate-spin size-4 text-white' />}
                                    {isLoading ? 'Uploading...' : 'Upload Resume'}
                                </button>
                                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text slate-600 cursor-pointer transition-colors' onClick={() => { setShowUploadResume(false); setTitle('') }} />
                            </div>
                        </form>
                    )

                }

                {
                    editResumeId && (
                        <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
                            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                                <h2 className='text-xl font-bold mb-4'>Edit Professional Profile</h2>
                                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Edit your professsional Profile' className='w-full px-4 py-2 mb-4 focus:border-[#8a4179] ring-[#8a4179]' required />
                                <button className='w-full py-2 bg-[#8a4179] text-white rounded hover:bg-[#713763] transition-colors'>Update</button>
                                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text slate-600 cursor-pointer transition-colors' onClick={() => { setEditResumeId(''); setTitle("") }} />
                            </div>
                        </form>
                    )
                }

            </div>
        </div>
    )
}

export default Dashboard