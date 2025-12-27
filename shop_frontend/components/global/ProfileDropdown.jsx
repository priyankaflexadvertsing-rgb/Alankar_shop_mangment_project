import { NavLink } from "react-router-dom";
import { apiFetch } from "../../src/hooks/fetchInstance";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/store";


const ProfileDropdown = ({ user, show, setShow }) => {
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
          navigate("/auth", { replace: true });
          window.location.reload();
        });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };


  return (
    show && (<div className="w-64  bg-[#0f0f0f] text-white rounded-2xl  shadow-lg p-4 ">
      <span className="text-sm text-gray-400">Signed in as</span>
      <div className="font-semibold text-white text-lg mb-0! mt-1">
        {user.name}
      </div>
      <span className="text-sm text-gray-400">{user.email}</span>
      <hr className="border-gray-700 my-2" />

      <div className="flex flex-col space-y-3 pt-0.5">
        <DropdownLink href="/userDetails" label="My Profile" />
        {user?.role === "admin" && <DropdownLink href="/AllUser" label="Admin" />}
        <DropdownLink href="/help" label="Help & Feedback"/>
        <h2 className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors" onClick={() => logout()}>Log Out</h2>

      </div>
    </div>)
  );
};

const DropdownLink = ({ href, label }) => (
  <NavLink
    to={href}
     onClick={()=>setShow(false)}
    className="text-sm text-gray-300 hover:text-white transition-colors"
  >
    {label}
  </NavLink>
);

export default ProfileDropdown;