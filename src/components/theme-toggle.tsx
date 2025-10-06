import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation("sidebar");

  return (
    <Button
      className={cn("cursor-pointer", className)}
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <MoonIcon aria-hidden="true" />
      ) : (
        <SunIcon aria-hidden="true" />
      )}

      <span className="sr-only">{t("toggleTheme")}</span>
    </Button>
  );
};
