import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";

const Sidebar = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await apiFetch("/logged-out")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          setUser(null);
          navigate("/", { replace: true });
        });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { icon: "person", label: "All Customer", url: "/AllUser" },
    { icon: "calendar_today", label: "Printing" },
    { icon: "notifications", label: "Notifications" },
    { icon: "group", label: "Team" },
    { icon: "insert_chart", label: "Analytics" },
    { icon: "star", label: "Bookmarks" },
    { icon: "settings", label: "Settings" },
  ];

  const bottomItems = [
    { icon: "account_circle", label: "Profile", onclick: () => navigate("/userDetails") },
    { icon: "logout", label: "Logout", onclick: () => logout() },
  ];

  // Responsive effect
  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false); // always expanded on mobile
      }
    };
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <aside
      className={`
        fixed bg-[#1e2939] text-white h-[calc(100vh-32px)] 
        rounded-2xl ml-2 transition-all duration-300 
        flex flex-col
        ${collapsed ? "w-[85px]" : "w-[200px]"}
        ${menuOpen ? "max-h-screen" : "max-h-[56px] lg:max-h-screen"}
        overflow-hidden lg:overflow-visible
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 relative">
        <img
          src="https://cdn.imgbin.com/11/22/7/imgbin-printing-press-logo-graphic-design-design-YY7N70s3APKrmznA8gb6pYd1r.jpg"
          className="w-11 h-11 rounded-full object-cover"
          alt="logo"
        />

        {/* Collapse toggle - Desktop only */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="hidden lg:flex  text-white w-9 h-9 rounded-lg items-center justify-center absolute right-4 cursor-pointer transition"
        >
          <span
            className={`material-symbols-rounded text-2xl transition ${collapsed ? "rotate-180" : ""
              }`}
          >
            chevron_left
          </span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="lg:hidden  text-[#151A2D] w-8 h-8 rounded-lg flex items-center justify-center "
        >
          <span className="material-symbols-rounded text-xl">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* NAVIGATION */}
      <nav
        className={`flex flex-col transition-all duration-300 ${collapsed ? "px-2" : "px-4"
          }`}
      >
        {/* Main navigation */}
        <ul className="flex flex-col gap-2 mt-2">
          {navItems.map((item) => (
            <li key={item.label} className="relative group">
              <a
                href={item.url}
                className={`flex items-center gap-3 p-3 rounded-lg transition
                  hover:bg-white hover:text-[#151A2D]
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <span className="material-symbols-rounded text-[22px]">
                  {item.icon}
                </span>

                {/* Hide label in collapsed mode */}
                {!collapsed && <span>{item.label}</span>}
              </a>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span
                  className="absolute left-16 top-1/2 -translate-y-1/2 
                    bg-white text-[#151A2D] px-3 py-1 text-sm rounded-lg 
                    opacity-0 group-hover:opacity-100 whitespace-nowrap 
                    shadow-md transition"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Bottom Navigation */}
        <ul className="mt-auto mb-6 flex flex-col gap-2">
          {bottomItems.map((item) => (
            <li key={item.label} className="relative group" onclick={item.onclick}>

              <span className="material-symbols-rounded text-[22px]">
                {item.icon}
              </span>

              {!collapsed && <span>{item.label}</span>}


              {/* Tooltip */}
              {collapsed && (
                <span
                  className="absolute left-16 top-1/2 -translate-y-1/2 
                    bg-white text-[#151A2D] px-3 py-1 text-sm rounded-lg 
                    opacity-0 group-hover:opacity-100 whitespace-nowrap shadow-md transition"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;