import { use, useEffect } from "react";
import UploadPrinting from "../components/UploadPrinting";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/global/Navbar";
import AuthForm from "../components/Auth/Auth";
import Hero from "../components/Screen/Home/Hero";
import Verification from "../components/Auth/Verification";
import useStore from "../store/store";
import UserDetails from "../components/Screen/UserDetails/UserDetails";
import AllUser from "../components/Admin/User/AllUser";
import { SOCKET_URI } from "../uri/uril";
import socketIO from "socket.io-client"
import { useUser } from "./hooks/useUser";
import Admin from "./admin/admin";

import Printing from "./admin/screen/printing/printing";

import ThemeProvider from "./utils/ThemeProvider";
import { useSystemTheme } from "./utils/useSystemTheme";
import Product from "./admin/screen/cdr/cdr";
const ENDPOINT = SOCKET_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })

function App() {
  const { data, isLoading, isEror } = useUser();
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user)

  if (data && !isLoading && !isEror) {
    setUser(data.user);
  }
 useSystemTheme()

  useEffect(() => {
    socketId.on("connection", () => { })
  }, []);


  return (
  
      <ThemeProvider>
      <Router>
        <div className="">
          <Routes>
            <Route path="/" element={<Hero />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/product" element={<Product />} />
            <Route path="/verification" element={<Verification length={4} />} />
            <Route path="/userDetails" element={<UserDetails />} />
            <Route path="/upload-printing" element={<UploadPrinting />} />
            <Route path="/admin/AllUser" element={<AllUser user={user} />} />
            <Route path="/auth" element={<AuthForm />} />
             <Route path="/admin/printing" element={<Printing />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </Router>
      </ThemeProvider>
 

  );
}

export default App;
