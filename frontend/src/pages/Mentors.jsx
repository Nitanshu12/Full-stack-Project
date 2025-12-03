import Logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';

const Mentors = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/dashboard')}
                    >
                        <img
                            src={Logo}
                            alt="CollabSphere Logo"
                            className="h-10 w-10 object-contain"
                        />
                        <div>
                            <p className="text-lg font-semibold text-gray-900">CollabSphere</p>
                            <p className="text-xs text-gray-500">Mentorship hub</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 space-y-5">
                        <p className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 uppercase tracking-wide">
                            Coming soon
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Mentor network is on the way
                        </h1>
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                            Soon you&apos;ll be able to connect with industry experts and senior students
                            who can review your projects, unblock you faster, and guide your capstone
                            journey.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="rounded-2xl border border-purple-100 bg-purple-50/60 px-4 py-3">
                                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
                                    1:1 sessions
                                </p>
                                <p className="text-sm text-gray-700">
                                    Book focused mentorship slots for code reviews and project feedback.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                                    Expert pools
                                </p>
                                <p className="text-sm text-gray-700">
                                    Browse mentors by domain—AI, web, mobile, design, and more.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 max-w-sm w-full">
                        <div className="relative rounded-3xl bg-gradient-to-br from-purple-600 to-blue-500 text-white px-6 py-8 shadow-xl overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-400/30 rounded-full blur-3xl" />
                            <div className="absolute -left-8 bottom-0 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl" />

                            <div className="relative space-y-4">
                                <p className="text-sm font-medium text-white/80">
                                    Be the first to know
                                </p>
                                <h2 className="text-2xl font-semibold">
                                    Mentors will be available soon on CollabSphere
                                </h2>
                                <p className="text-sm text-white/80">
                                    We&apos;re onboarding mentors right now. Keep collaborating on projects
                                    and checking back here.
                                </p>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-sm hover:bg-white transition"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Mentors;


