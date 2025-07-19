import { useTheme } from "next-themes";

export const useCurrentTheme = () => {
  const { theme, systemTheme } = useTheme();

  // Determine the current theme based on user preference and system setting

  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return systemTheme;
};
