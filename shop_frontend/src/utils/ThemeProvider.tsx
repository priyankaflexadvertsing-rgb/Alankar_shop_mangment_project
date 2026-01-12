import { useEffect } from "react";
import { useAppSelector } from "../../store/redux";


const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const resolvedTheme = useAppSelector(
    (state) => state.global.resolvedTheme
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
