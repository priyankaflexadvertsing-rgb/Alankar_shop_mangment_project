import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../store/redux";
import {
  setIsSidebarCollapsed,
  setTheme,
} from "../../../../store/slice/global";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const theme = useAppSelector((state) => state.global.theme);
  const resolvedTheme = useAppSelector(
    (state) => state.global.resolvedTheme
  );

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    dispatch(setTheme(isDark ? "light" : "dark"));
  };

  const currentUser = {
    userDetails: {
      username: "saumil athya",
      profilePictureUrl:
        "https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2024/12/aiarty-image-enhancer-img5-1.jpg",
    },
  };

  const currentUserDetails = currentUser.userDetails;

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Search */}
      <div className="flex items-center gap-8">
        {isSidebarCollapsed && (
          <button
            onClick={() =>
              dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
            }
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}

        <div className="relative w-[200px]">
          <Search className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 dark:text-white" />
          <input
            className="w-full rounded bg-gray-100 p-2 pl-8 dark:bg-gray-700 dark:text-white"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          title={
            theme === "system"
              ? "System theme"
              : isDark
              ? "Dark mode"
              : "Light mode"
          }
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-white" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </button>

        <a
          href="/settings"
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="h-6 w-6 dark:text-white" />
        </a>

        <div className="mx-3 hidden h-6 w-px bg-gray-300 md:block" />

        <div className="hidden items-center md:flex">
          <img
            src={currentUserDetails.profilePictureUrl}
            alt={currentUserDetails.username}
            className="h-9 w-9 rounded-full object-cover"
          />

          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails.username}
          </span>

          <button className="rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
