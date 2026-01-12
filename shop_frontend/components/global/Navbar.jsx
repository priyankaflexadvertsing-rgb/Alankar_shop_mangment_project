import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaPhone, FaWhatsapp, FaSun, FaMoon } from "react-icons/fa";
import useStore from "../../store/store";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const user = useStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize theme based on localStorage or prefers-color-scheme
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Service", path: "/service" },
    { name: "Upload Printing", path: "/upload-printing" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <nav className="fixed w-full top-0 left-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold cursor-pointer select-none text-gray-900 dark:text-white transition-colors duration-300">
              Printify
            </h1>
          </div>

          {/* Center: Nav Links (Desktop) */}
          <ul className="hidden md:flex space-x-8 font-medium text-gray-800 dark:text-gray-300">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setShow(false)}
                  className={({ isActive }) =>
                    `transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-semibold underline"
                        : "text-gray-600 dark:text-gray-400"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right: Icons */}
          <div className="hidden md:flex items-center space-x-4 text-gray-700 dark:text-gray-300">
            {/* WhatsApp Link */}
            <a
              href="https://wa.me/+916267493542?text=Hi+there%21+I+discovered+your+services+through+printify.grexa.site+and+I%27m+interested+in+what+you+offer."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Contact"
              className="hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
            >
              <FaWhatsapp className="text-xl" />
            </a>

            {/* User/Profile */}
            <button
              aria-label="User profile"
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
              {user ? (
                <img
                  src={
                    user.image
                      ? user.image
                      : "https://cdn.imgbin.com/11/22/7/imgbin-printing-press-logo-graphic-design-design-YY7N70s3APKrmznA8gb6pYd1r.jpg"
                  }
                  alt="User Profile"
                  onClick={() => setShow(!show)}
                  className="w-10 h-10 rounded-full cursor-pointer object-cover"
                />
              ) : (
                <NavLink to={"/auth"}>
                  <FaUser className="text-lg cursor-pointer" />
                </NavLink>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400" size={20} />
              ) : (
                <FaMoon className="text-gray-700" size={20} />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle menu"
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
          }`}
        >
          <ul className="flex flex-col items-center space-y-4 font-medium text-gray-800 dark:text-gray-300">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-semibold underline"
                        : "text-gray-600 dark:text-gray-400"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            <div className="flex space-x-6 mt-2 text-gray-700 dark:text-gray-300">
              <a
                href="https://wa.me/+916267493542?text=Hi+there%21+I+discovered+your+services+through+printify.grexa.site+and+I%27m+interested+in+what+you+offer."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Contact"
                className="hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
              >
                <FaWhatsapp className="text-xl" />
              </a>
              <button
                aria-label="User profile"
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                {user ? (
                  <img
                    src={
                      user.image
                        ? user.image
                        : "https://cdn.imgbin.com/11/22/7/imgbin-printing-press-logo-graphic-design-design-YY7N70s3APKrmznA8gb6pYd1r.jpg"
                    }
                    alt="User Profile"
                    onClick={() => setShow(!show)}
                    className="w-10 h-10 rounded-full cursor-pointer object-cover"
                  />
                ) : (
                  <NavLink to={"/auth"}>
                    <FaUser className="text-lg cursor-pointer" />
                  </NavLink>
                )}
              </button>
            </div>
          </ul>
        </div>
        {/* Profile Dropdown */}
        <div className="absolute z-50 top-16 right-6 md:right-14">
          <ProfileDropdown user={user} show={show} setShow={setShow} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
