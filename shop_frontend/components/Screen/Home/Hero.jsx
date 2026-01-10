import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Category from "./categories";
import Navbar from "../../global/Navbar";

const Hero = () => {
    const [show, setShow] = useState(false);
    return <>
        <Navbar />
        <section className="relative bg-white overflow-hidden min-h-screen flex items-center" onClick={() => setShow(false)}>
            <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col-reverse md:flex-row items-center">
                {/* Left Content */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-black leading-tight mb-2">
                        PRINTIFY
                    </h1>
                    <h2 className="text-3xl sm:text-4xl font-bold text-black leading-tight mb-6">
                        Advertising & Flex Printing Agency
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-8 max-w-lg">
                        Since 2009, Printify has been delivering top-quality printing and advertising services.
                        Our expertise covers a broad spectrum of solutions including banners, business cards,
                        promotional materials, vinyl printing, and custom signage — designed to meet the needs
                        of businesses and individuals alike.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                        <a
                            href="#contact"
                            className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
                        >
                            {/* WhatsApp Icon SVG */}
                            <FaWhatsapp className="mr-2" />
                            Contact
                        </a>
                        <a
                            href="#explore"
                            className="inline-flex items-center px-6 py-3 bg-gray-200 text-black font-semibold rounded hover:bg-gray-300 transition"
                        >
                            Explore
                        </a>
                    </div>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-1/2 mb-12 md:mb-0 relative">
                    <img
                        src="/path-to-your-image.png" // Replace this with your image path or URL
                        alt="Printing & Advertising"
                        className="w-full max-w-md mx-auto md:mx-0"
                    />
                    {/* Optional: Add some subtle overlay shapes or shadows using absolute divs if you want */}
                </div>
            </div>
        </section>
        <Category />
    </>
};

export default Hero;
