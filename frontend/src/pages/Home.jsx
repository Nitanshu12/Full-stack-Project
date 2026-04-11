import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import HeroImage from '../assets/Hero-image.png';
import Logo from '../assets/Logo.png';

const Home = () => {
    const navigate = useNavigate();

    const logoRef       = useRef(null);
    const heroHeadingRef = useRef(null);
    const heroSubRef    = useRef(null);
    const heroButtonRef = useRef(null);
    const heroImageRef  = useRef(null);
    const card1Ref      = useRef(null);
    const card2Ref      = useRef(null);
    const card3Ref      = useRef(null);

    useEffect(() => {
        // gsap.context scopes animations to this component.
        // ctx.revert() on cleanup kills tweens and resets inline styles,
        // preventing the "stuck at opacity:0 on refresh" bug.
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(logoRef.current,        { opacity: 0, y: -40, duration: 0.8 })
              .from(heroHeadingRef.current,  { opacity: 0, y:  60, duration: 0.9 }, '-=0.4')
              .from(heroSubRef.current,      { opacity: 0, y:  50, duration: 0.8 }, '-=0.5')
              .from(heroButtonRef.current,   { opacity: 0, y:  40, duration: 0.7, scale: 0.9 }, '-=0.4')
              .from(heroImageRef.current,    { opacity: 0, x: 120, duration: 1.0, ease: 'power4.out' }, '-=0.8')
              .from(
                [card1Ref.current, card2Ref.current, card3Ref.current],
                { opacity: 0, y: 60, duration: 0.7, stagger: 0.15, ease: 'back.out(1.7)' },
                '-=0.3'
              );
        });

        return () => ctx.revert(); // cleanup on unmount / HMR refresh
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden" style={{
            background: 'linear-gradient(to right, #DDE9F6 0%, rgba(102, 126, 153, 0.6) 46%)'
        }}>

            {/* ──────────── Header ──────────── */}
            <header className="px-6 md:px-12 py-6 flex justify-between items-center">
                {/* Logo — animated via logoRef */}
                <div ref={logoRef} className="flex items-center gap-2">
                    <img
                        src={Logo}
                        alt="CollabSphere Logo"
                        className="h-10 w-10 object-contain"
                    />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">COLLABSPHERE</h1>
                        <p className="text-xs text-gray-600">Where Student Ideas Find Teammates</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* ──────────── Hero ──────────── */}
            <main className="px-6 md:px-12 py-12 md:py-20">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    <div className="space-y-6">
                        {/* heroHeadingRef */}
                        <h2
                            ref={heroHeadingRef}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                        >
                            Find Collaborators
                            <br />
                            &amp; Mentors Easily
                        </h2>

                        {/* heroSubRef */}
                        <p
                            ref={heroSubRef}
                            className="text-lg md:text-xl text-gray-600 leading-relaxed"
                        >
                            A platform connecting students with like-minded peers
                            <br />
                            and experienced mentors
                        </p>

                        {/* heroButtonRef */}
                        <button
                            ref={heroButtonRef}
                            onClick={() => navigate('/signup')}
                            className="px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Find Collaborators
                        </button>
                    </div>

                    {/* heroImageRef */}
                    <div ref={heroImageRef} className="flex justify-center md:justify-end">
                        <img
                            src={HeroImage}
                            alt="Collaboration illustration"
                            className="w-full max-w-lg h-auto"
                        />
                    </div>
                </div>
            </main>

            {/* ──────────── Features ──────────── */}
            <section className="px-6 md:px-12 py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                        Key Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">

                        {/* card1Ref */}
                        <div ref={card1Ref} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Teammates</h3>
                            <p className="text-gray-600">Connect with students who share your interests and project goals</p>
                        </div>

                        {/* card2Ref */}
                        <div ref={card2Ref} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Mentors</h3>
                            <p className="text-gray-600">Get guidance from experienced mentors in your field of study</p>
                        </div>

                        {/* card3Ref */}
                        <div ref={card3Ref} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Collaboration</h3>
                            <p className="text-gray-600">Streamlined tools to manage projects and communicate effectively</p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
