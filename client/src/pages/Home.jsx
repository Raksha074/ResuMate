import React, { useEffect, useRef, useState } from 'react'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Testimonial from '../components/home/Testimonial'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'

const FadeIn = ({ children, delay = 0 }) => {
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
            className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-[0.95]'}`}
            style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
        >
            {children}
        </div>
    )
}

const Home = () => {
    return (
        <div className="relative overflow-hidden bg-[#fcf9fc] selection:bg-[#8a4179]/20">
            {/* Global Attractive Background Glows for Home */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-gradient-to-r from-[#e7c0e0] to-[#f9dcf0] blur-[120px] rounded-full mix-blend-multiply animate-[pulse_10s_ease-in-out_infinite] opacity-60"></div>
                <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-gradient-to-l from-[#8a4179] to-[#713763] blur-[150px] rounded-full mix-blend-multiply animate-[pulse_12s_ease-in-out_infinite] opacity-20"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-[#ecc8e5] blur-[130px] rounded-full mix-blend-multiply animate-[pulse_15s_ease-in-out_infinite] opacity-40"></div>
            </div>

            <div className="relative z-10 w-full">
                <FadeIn delay={0}>
                    <Banner />
                </FadeIn>
                <FadeIn delay={100}>
                    <Hero />
                </FadeIn>
                <FadeIn delay={0}>
                    <Features />
                </FadeIn>
                <FadeIn delay={0}>
                    <Testimonial />
                </FadeIn>
                <FadeIn delay={0}>
                    <CallToAction />
                </FadeIn>
                <FadeIn delay={0}>
                    <Footer />
                </FadeIn>
            </div>
        </div>
    )
}

export default Home