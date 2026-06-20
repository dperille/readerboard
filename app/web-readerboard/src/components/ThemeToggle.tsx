"use client";

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/app/ThemeProvider";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const isDark =
    theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />

      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />

      <Moon className="h-4 w-4" />
    </div>
  );
}
