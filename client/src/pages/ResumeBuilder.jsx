import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummary from '../components/ProfessionalSummary'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'



const ResumeBuilder = () => {

    const { resumeId } = useParams()
    const {token} = useSelector(state => state.auth)


    const [resumeData, setResumeData] = useState({
        id: "",
        title: "",
        personal_info: {},
        professional_summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
        template: 'classic',
        accent_color: "#00abc2ff",
        public: false,

    })

    
  const loadExistingResume = async () => {
   try {
    const {data} = await api.get('/resumes/get/' + resumeId, {headers: { Authorization: token }})
    if(data.resume){

        const normalizedData = {
                ...data.resume,
                projects: data.resume.projects || data.resume.project || []
            };
            
      setResumeData(normalizedData)
      document.title = data.resume.title;
    }
   } catch (error) {
    console.log(error.message)
   }
  }

    const [activeSectionIndex, setActiveSectionIndex] = useState(0)
    const [removeBackground, setRemoveBackground] = useState(false);

    const sections = [
        { id: 'personal', name: 'Personal Info', icon: User },
        { id: 'summary', name: 'Professional Summary', icon: FileText },
        { id: 'experience', name: 'Experience', icon: Briefcase },
        { id: 'education', name: 'Education', icon: GraduationCap },
        { id: 'projects', name: 'Projects', icon: FolderIcon },
        { id: 'skills', name: 'Skills', icon: Sparkles },
    ]

    const activeSection = sections[activeSectionIndex]


    useEffect(() => {
        loadExistingResume()
    }, [])

    
    const changeResumeVisibility = async () => {
    try {
       const formData = new FormData()
       formData.append("resumeId", resumeId)
       formData.append("resumeData", JSON.stringify({public: !resumeData.public}))

       const {data} = await api.put('/resumes/update', formData, {headers: { Authorization: token }})

       setResumeData({...resumeData, public: !resumeData.public})
       toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }


    const handleShare = async () => {
        const frontendUrl = window.location.href.split('/app/')[0]
        const resumeUrl = frontendUrl + '/view/' + resumeData._id

        if (navigator.share) {

            navigator.share({ url: resumeUrl, text: 'My Resume' })
        } else {
            alert('Share is not supportedon this browser.')
        }
    }

    const downloadResume = () => {
        window.print();
    }

    
const saveResume = async () => {
  try {
    let updatedResumeData = structuredClone(resumeData)

    // Ensure we don't send the local preview blob to the backend
    if(typeof resumeData.personal_info.image === 'object'){
      delete updatedResumeData.personal_info.image
    }

    const formData = new FormData();
    formData.append("resumeId", resumeId)
    formData.append('resumeData', JSON.stringify(updatedResumeData))
    
    // This tells your backend whether to trigger the AI or not
    if (removeBackground) {
        formData.append("removeBackground", "true");
    }
    
    // Only append the image file if the user actually selected a new one
    if (typeof resumeData.personal_info.image === 'object') {
        formData.append("image", resumeData.personal_info.image)
    }

    const { data } = await api.put('/resumes/update', formData, {headers: { Authorization: token }})

    const savedData = {
            ...data.resume,
            projects: data.resume.projects || data.resume.project || []
        };

    // Update local state with the saved data from the server
    setResumeData(savedData)
    toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume:", error)
    toast.error("Failed to save changes")
  }
}



    return (
        <div>
            <div className='max-w-7xl mx-auto px-4 py-6 flex justify-between items-center'>
                <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
                    <ArrowLeftIcon className='size-4' />Back to Dashboard
                </Link>
                <div className='flex items-center justify-end gap-2'>
                    {resumeData.public && (
                        <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-[#d6eaff] to-[#b6dbff] text-[#034de3] rounded-lg ring-[#84c6ff] hover:ring transition-colors'>
                            <Share2Icon className='size-4' />Share
                        </button>
                    )}
                    <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-[#f8e1ff] to-[#f3c3ff] text-[#c500d9] rounded-lg ring-[#e016ff] hover:ring transition-colors'>
                        {resumeData.public ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />}
                        {resumeData.public ? 'Public' : 'Private'}
                    </button>
                    <button onClick={downloadResume} className='flex items-center py-2 px-6 gap-2 text-xs bg-gradient-to-br from-[#f2dcef] to-[#e7c0e0] text-[#8a417a] rounded-lg ring-[#c471b5] hover:ring transition-colors'>
                        <DownloadIcon className='size-4' />
                        Download
                    </button>
                </div>
            </div>

            <div className='max-w-7xl mx-auto px-4 pb-8'>
                <div className='grid lg:grid-cols-12 gap-8'>

                    {/* Left Panel - Form*/}
                    <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
                        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
                            {/* progress bar using activeSectionIndex*/}
                            <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
                            <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-[#c471b5] to-[#a75296] border-none transition-allduration-2000' style={{ width: `${(activeSectionIndex * 100) / (sections.length - 1)}%` }} />

                            {/* section Navigation */}
                            <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>

                                <div className='flex items-center gap-2'>
                                    <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                                    <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
                                </div>

                                <div className='flex items-center'>
                                    {activeSectionIndex !== 0 && (
                                        <button onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                                            <ChevronLeft className='size-4' />Previous
                                        </button>
                                    )}
                                    <button onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                                        next   <ChevronRight className='size-4' />
                                    </button>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className='space-y-6'>
                                {activeSection.id === 'personal' && (

                                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                                )}

                                {activeSection.id === 'summary' && (
                                    <ProfessionalSummary data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} />
                                )}
                                {activeSection.id === 'experience' && (
                                    <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} />
                                )}
                                {activeSection.id === 'education' && (
                                    <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
                                )}
                                {activeSection.id === 'projects' && (
                                    <ProjectForm data={resumeData.projects} onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))} />
                                )}
                                {activeSection.id === 'skills' && (
                                    <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />
                                )}

                            </div>
                            <button onClick={()=> {toast.promise(saveResume, {loading: 'Saving...'})}} className='px-6 py-3 bg-gradient-to-r from-[#5beec8] to-[#05c49f] text-[#015349] ring hover:ring-2 hover:ring-[#00806d] rounded-md transition-all mt-6 text-sm'>
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Preview*/}
                    <div className='lg:col-span-7 max-lg:mt-6'>


                        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />

                    </div>


                </div>

            </div>
        </div>


    )
}

export default ResumeBuilder
