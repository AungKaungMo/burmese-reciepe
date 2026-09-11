import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { useColorScheme as useSystemColorScheme } from "./use-color-scheme";

type AppColorScheme = "light" | "dark";

type AppColorSchemeContextValue = {
  colorScheme: AppColorScheme;
  setColorScheme: (colorScheme: AppColorScheme) => void;
};

const AppColorSchemeContext = createContext<AppColorSchemeContextValue | null>(
  null,
);

export function AppColorSchemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useSystemColorScheme();
  const [selectedColorScheme, setColorScheme] = useState<AppColorScheme | null>(
    null,
  );
  const colorScheme =
    selectedColorScheme ?? (systemColorScheme === "dark" ? "dark" : "light");

  const value = useMemo(
    () => ({ colorScheme, setColorScheme }),
    [colorScheme, setColorScheme],
  );

  return (
    <AppColorSchemeContext.Provider value={value}>
      {children}
    </AppColorSchemeContext.Provider>
  );
}

export function useAppColorScheme() {
  const context = useContext(AppColorSchemeContext);

  if (!context) {
    throw new Error(
      "useAppColorScheme must be used within AppColorSchemeProvider",
    );
  }

  return context;
}
