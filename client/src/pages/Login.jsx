import { Lock, Mail, User2Icon } from 'lucide-react'
import React from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'

const Login = () => {

    const dispatch = useDispatch()
  const query = new URLSearchParams(window.location.search)
  const urlState = query.get('state')


  const [state, setState] = React.useState(urlState || "login")
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
        setIsVisible(true);
    }, []);

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post(`/users/${state}`, formData)
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            toast.success(data.message)
        } catch (error) {
            toast(error?.response?.data?.message || error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    return (
        <div className='relative flex items-center justify-center min-h-screen bg-slate-50 overflow-hidden'>
            {/* Background Decorations */}
            <div className="absolute top-20 -left-10 w-[400px] h-[400px] bg-[#e7c0e0] blur-[120px] opacity-60 rounded-full mix-blend-multiply transition-transform duration-1000 origin-center animate-pulse"></div>
            <div className="absolute bottom-10 -right-20 w-[400px] h-[400px] bg-[#8a4179] blur-[120px] opacity-20 rounded-full mix-blend-multiply transition-transform duration-1000 origin-center animate-pulse delay-700"></div>

            <form
                onSubmit={handleSubmit}
                className={`relative sm:w-[400px] w-full text-center border border-white/50 rounded-[2rem] px-8 py-10 bg-white/70 backdrop-blur-xl shadow-2xl z-10 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <h1 className="text-slate-900 text-4xl mt-4 font-semibold tracking-tight">{state === "login" ? "Welcome back" : "Create account"}</h1>
                <p className="text-slate-500 text-sm mt-3 mb-8">Please {state} to continue your journey</p>

                {state !== "login" && (
                    <div className="flex items-center mt-5 w-full bg-white/80 border border-slate-200 h-12 rounded-full overflow-hidden pl-5 gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#8a4179]/30 focus-within:border-[#8a4179] hover:border-[#8a4179]/50 shadow-sm">
                        <User2Icon size={18} className="text-slate-400" />
                        <input type="text" name="name" placeholder="Full Name" className="w-full h-full bg-transparent border-none outline-none ring-0 text-slate-700 placeholder:text-slate-400 text-sm" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className={`flex items-center w-full bg-white/80 border border-slate-200 h-12 rounded-full overflow-hidden pl-5 gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#8a4179]/30 focus-within:border-[#8a4179] hover:border-[#8a4179]/50 shadow-sm ${state === "login" ? "mt-2" : "mt-4"}`}>
                    <Mail size={18} className="text-slate-400" />
                    <input type="email" name="email" placeholder="Email Address" className="w-full h-full bg-transparent border-none outline-none ring-0 text-slate-700 placeholder:text-slate-400 text-sm" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-white/80 border border-slate-200 h-12 rounded-full overflow-hidden pl-5 gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#8a4179]/30 focus-within:border-[#8a4179] hover:border-[#8a4179]/50 shadow-sm">
                    <Lock size={18} className="text-slate-400" />
                    <input type="password" name="password" placeholder="Password" className="w-full h-full bg-transparent border-none outline-none ring-0 text-slate-700 placeholder:text-slate-400 text-sm" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="mt-5 text-right w-full">
                    <button className="text-sm font-medium text-[#713763] hover:text-[#4b1d3f] transition-colors" type="button">Forgot password?</button>
                </div>

                <button type="submit" className="mt-6 w-full h-12 rounded-full text-white bg-[#8a4179] hover:bg-[#4b1d3f] focus:ring-4 focus:ring-[#8a4179]/30 active:scale-[0.98] transition-all font-medium text-base shadow-md hover:shadow-lg">
                    {state === "login" ? "Log in" : "Sign up"}
                </button>

               <p className="text-gray-500 text-sm mt-3 mb-11">
                  {state === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
               <span 
                   onClick={() => setState(prev => prev === "login" ? "register" : "login")} 
                   className="text-[#4b1d3f] hover:underline cursor-pointer"
               >
                  click here
               </span>
               </p>
                
            </form>
        </div>
    )
}

export default Login