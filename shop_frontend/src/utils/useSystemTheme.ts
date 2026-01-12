import { useEffect } from "react";
import { useAppDispatch } from "../../store/redux";
import { syncSystemTheme } from "../../store/slice/global";


export const useSystemTheme = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => dispatch(syncSystemTheme());

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [dispatch]);
};
