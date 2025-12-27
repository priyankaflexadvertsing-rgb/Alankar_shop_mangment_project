import React, { useEffect, useState } from "react";
import { convertPrintingToFiles, FileViewer } from "../../FileViewer";
import { SummaryTable } from "../../SummaryTable";
import useStore from "../../../store/store";
import Sidebar from "../../global/Sidebar";
import { SERVER_URI } from "../../../uri/uril";
import "../../Auth/style.css";
import { apiFetch } from "../../../src/hooks/fetchInstance";
import UserProfileCard from "./UserProfileCard";

const UserDetails = () => {
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [printingFiles, setPrintingFiles] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        await new Promise((res) => setTimeout(res, 400)); // smooth loader
        await fetchAllFiles();
      } finally {
        if (user) {
          setUserDetails(user);
        }
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const fetchAllFiles = async () => {
    try {
      const res = await apiFetch("/printing");
      const json = await res.json();

      if (!res.ok) return [];

      const files = convertPrintingToFiles(json.prints);

      setPrintingFiles(files);
      setPaymentDetails(json.prints);

      return files;
    } catch (err) {
      console.error("Error fetching files:", err);
      return [];
    }
  };


  // 🔥 FIXED: Loader shows **any time loading = true**
  if (loading || !userDetails) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  // Main content once loaded
  return (
    <div className="flex  relative">
      <div className="flex-1 px-4">
        <h2 className="text-xl text-center font-bold my-4">
          Payment Details for{" "}
          <span className="text-red-600 text-3xl">{userDetails.name}</span>
        </h2>
          <UserProfileCard user={userDetails} />

        

        <div className=" w-full justify-between space-x-4">
          <div className="w-[100%]">
            <SummaryTable
              printing={paymentDetails}
              name={userDetails.name}
              role={userDetails.role}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDetails;
