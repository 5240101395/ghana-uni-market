"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider 
      {...props} 
      // This prevents the React 19 "script tag" error!
      scriptProps={{ type: "application/json" }} 
    >
      {children}
    </NextThemesProvider>
  );
}