import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaPhone, FaWhatsapp } from "react-icons/fa";
import useStore from "../../store/store";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
    const user = useStore((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const [show, setShow] = useState(false);



    const navItems = [
        { name: "Home", path: "/" },
        { name: "Service", path: "/service" },
        { name: "Upload Printing", path: "/upload-printing" },
        { name: "About", path: "/about" },
    ];

    return <>
        <nav className="bg-white border-b border-gray-200 fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-black cursor-pointer select-none">
                        Printify
                    </h1>
                </div>

                {/* Center: Nav Links (Desktop) */}
                <ul className="hidden md:flex space-x-8 font-medium text-gray-800">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                onClick={() => setShow(false)}
                                className={({ isActive }) =>
                                    `transition-colors duration-200 hover:text-black ${isActive ? "text-black font-semibold underline" : "text-gray-600"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Right: Icons */}
                <div className="hidden md:flex items-center space-x-4 text-gray-700">
                     <NavLink to={"https://wa.me/+916267493542?text=Hi+there%21+I+discovered+your+services+through+alankar-flex-printing.grexa.site+and+I%27m+interested+in+what+you+offer."}>
                            <FaWhatsapp className="text-xl" />
                        </NavLink>
                    <button
                        aria-label="Contact"
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                    >
                        {user ? <img
                            src={user.image ? user.image : "https://cdn.imgbin.com/11/22/7/imgbin-printing-press-logo-graphic-design-design-YY7N70s3APKrmznA8gb6pYd1r.jpg"} // Replace this with your image path or URL
                            alt="Printing & Advertising" onClick={() => setShow(!show)}
                            className="w-10 h-10 rounded-full cursor-pointer object-cover"
                        /> : <NavLink to={"/auth"} ><FaUser className="text-lg cursor-pointer " /></NavLink>}

                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    aria-label="Toggle menu"
                    className="md:hidden text-gray-700 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div
                className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
                    }`}
            >
                <ul className="flex flex-col items-center space-y-4 font-medium text-gray-800">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `block px-3 py-2 hover:text-black transition ${isActive ? "text-black font-semibold underline" : "text-gray-600"
                                    }`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                    <div className="flex space-x-6 mt-2 text-gray-700">
                        <NavLink to={"https://wa.me/+916267493542?text=Hi+there%21+I+discovered+your+services+through+alankar-flex-printing.grexa.site+and+I%27m+interested+in+what+you+offer."}>
                            <FaWhatsapp className="text-xl" />
                        </NavLink>
                        <button
                            aria-label="Contact"
                            className="p-1 rounded-full hover:bg-gray-100 transition"
                        >
                            {user ? <img
                                src={user.image ? user.image : "https://cdn.imgbin.com/11/22/7/imgbin-printing-press-logo-graphic-design-design-YY7N70s3APKrmznA8gb6pYd1r.jpg"} // Replace this with your image path or URL
                                alt="Printing & Advertising" onClick={() => setShow(!show)}
                                className="w-10 h-10 rounded-full cursor-pointer object-cover"
                            /> : <NavLink to={"/auth"} ><FaUser className="text-lg cursor-pointer " /></NavLink>}

                        </button>
                    </div>
                </ul>
            </div>
            <div className=" absolute z-2 top-13 right-14"><ProfileDropdown user={user} show={show} setShow={setShow} /></div>

        </nav>

    </>


};

export default Navbar;
