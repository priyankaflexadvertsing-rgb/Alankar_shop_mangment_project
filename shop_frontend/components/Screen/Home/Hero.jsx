import React, { useState, useEffect } from 'react';
import { Sun, Moon, Zap, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from './Footer';
import Navbar from '../../global/Navbar';
import Category from './categories';

const Hero = () => {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    const SERVICES = [
        { title: "Flex & Banners", desc: "High-speed large format flex printing for outdoor ads.", icon: "🏗️" },
        { title: "3D Letter Cutting", desc: "Premium Acrylic & CNC cutting for 3D glow signs.", icon: "✨" },
        { title: "Wedding & Shadi Cards", desc: "Multicolour & single colour premium wedding invitations.", icon: "💍" },
        { title: "Business Stationery", desc: "Visiting cards, bill books, and pamphlets.", icon: "💼" },
        { title: "Acrylic Work", desc: "Custom acrylic sheet design and laser engraving.", icon: "🛡️" },
        { title: "Bulk Prints", desc: "Single colour flyers and high-volume handbills.", icon: "📄" },
    ];

    // Animation variants for framer-motion
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.6 },
        }),
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
            <Navbar />
    
            {/* --- HERO SECTION --- */}
            <header className="max-w-4xl mx-auto pt-24 pb-16 px-6 text-center">
                <motion.div
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-tighter"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <Zap size={16} /> Fast Turnaround in Damoh & Beyond
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-black tracking-tight mb-6"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    custom={1}
                >
                    Printify: <span className="text-blue-600">Premium Print</span> & <br />
                    Signage Solutions
                </motion.h1>

                <motion.p
                    className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    custom={2}
                >
                    Established in 2009, Printify provides high-quality printing solutions for banners, business stationery, wedding cards, acrylic work, and more, catering to both personal and advertising needs.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row justify-center gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    custom={3}
                >
                    <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-xl font-bold hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition shadow-xl">
                        Get a Quote
                    </button>
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-10 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                        View Work
                    </button>
                </motion.div>
            </header>

            <Category />

            {/* --- SERVICE GRID --- */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((service, i) => (
                        <motion.div
                            key={i}
                            className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeInUp}
                            custom={i * 0.3}
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- RECENT PROJECTS --- */}
            <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-10">
                    <motion.h2
                        className="text-2xl font-black uppercase tracking-widest"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Recent Projects
                    </motion.h2>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 mx-8 hidden sm:block"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item, i) => (
                        <motion.div
                            key={item}
                            className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2, duration: 0.5 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <img
                                src={`https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=400&q=80`}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
                                alt="Project work"
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- FOOTER --- */}
            <Footer />
        </div>
    );
};

export default Hero;
