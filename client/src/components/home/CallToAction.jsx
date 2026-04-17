import React from 'react'

const CallToAction = () => {
    return (
        <div id='cta' className='border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-10 sm:px-16 mt-25'>
            <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-16 sm:py-20 -mt-10 -mb-10 w-full">
                <p className="text-xl font-medium max-w-md text-slate-800">Build a Professional Resume That Helps You Stand Out and Get Hired.</p>
                <a href="/app?state=login" className="flex items-center gap-2 rounded-full py-3 px-8 bg-[#8a4179] hover:bg-[#4b1d3f] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(138,65,121,0.5)] text-white group active:scale-95">
                    <span className="font-medium">Get Started</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5 group-hover:translate-x-1 transition-transform duration-300"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </a>
            </div>
        </div>
    )
}

export default CallToAction