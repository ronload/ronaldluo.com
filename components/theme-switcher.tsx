"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Check, ChevronDown, X } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSiteTheme } from "@/hooks/use-site-theme";
import { type ThemePreference, themeGroups } from "@/lib/theme-registry";
import { cn } from "@/lib/utils";

interface ThemeSwitcherLabels {
  apply: string;
  cancel: string;
  close: string;
  title: string;
  trigger: string;
}

interface ThemeSwitcherProps {
  labels: ThemeSwitcherLabels;
  trigger?: "button" | "badge";
}

const subscribe = () => () => {};
const getMountedSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeSwitcher({ labels, trigger = "button" }: ThemeSwitcherProps) {
  const { activeTheme, preference, setPreference } = useSiteTheme();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getMountedSnapshot, getServerSnapshot);
  const [pendingTheme, setPendingTheme] = useState<ThemePreference>(preference);
  const initialTheme = useRef<ThemePreference>(preference);

  const restoreTheme = () => {
    setPendingTheme(initialTheme.current);
    setPreference(initialTheme.current);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      initialTheme.current = preference;
      setPendingTheme(preference);
    } else {
      restoreTheme();
    }
    setOpen(nextOpen);
  };

  const previewTheme = (nextTheme: ThemePreference) => {
    setPendingTheme(nextTheme);
    setPreference(nextTheme);
  };

  return (
    <Dialog modal="trap-focus" open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        aria-label={labels.trigger}
        className={cn(
          trigger === "badge"
            ? "group inline-flex cursor-pointer items-stretch outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            : cn(buttonVariants({ variant: "outline" }), "border-border/[0.32] px-3 sm:px-4"),
        )}
      >
        {trigger === "badge" ? (
          <>
            <span className="flex items-center bg-foreground px-2 text-[0.625rem] font-semibold tracking-widest text-background">
              {labels.title}
            </span>
            <span className="flex items-center gap-1.5 border border-l-0 border-border/[0.32] px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:border-foreground/50 group-hover:text-foreground group-data-popup-open:border-foreground/50 group-data-popup-open:text-foreground">
              {mounted ? activeTheme.label : labels.trigger}
              <ChevronDown className="size-3" />
            </span>
          </>
        ) : (
          <>
            <span className="sm:hidden">{labels.title}</span>
            <span className="hidden sm:inline">{mounted ? activeTheme.label : labels.trigger}</span>
            <ChevronDown className="size-3.5" />
          </>
        )}
      </DialogTrigger>
      <DialogContent
        className="top-1/2 h-[30rem] max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-none -translate-y-1/2 gap-0 overflow-hidden border-border p-0 shadow-2xl sm:w-[42rem]"
        showCloseButton={false}
      >
        <div className="flex size-full min-h-0 flex-col">
          <div className="relative shrink-0 border-b p-1">
            <div className="flex h-9 min-w-0 items-center gap-2 px-3 pe-12">
              <DialogTitle className="shrink-0 text-sm tracking-normal normal-case">
                {labels.title}
              </DialogTitle>
              <Badge variant="secondary">{activeTheme.label}</Badge>
            </div>
            <DialogClose
              aria-label={labels.close}
              render={
                <Button
                  className="absolute end-1.5 top-1.5 z-10"
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                />
              }
            >
              <X />
              <span className="sr-only">{labels.close}</span>
            </DialogClose>
          </div>

          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-1 py-1">
            <RadioGroup<ThemePreference>
              aria-label={labels.title}
              onValueChange={previewTheme}
              value={pendingTheme}
            >
              {themeGroups.map((group, index) => (
                <section
                  className={cn(index > 0 && "mt-1.5 border-t border-border/50 pt-1.5")}
                  key={group.label}
                >
                  <h3 className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {group.label}
                  </h3>
                  {group.themes.map((theme) => {
                    const selected = pendingTheme === theme.id;

                    return (
                      <Radio.Root
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm outline-hidden transition-colors select-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          selected ? "bg-muted text-foreground" : "hover:bg-muted",
                        )}
                        key={theme.id}
                        nativeButton
                        render={<button type="button" />}
                        value={theme.id}
                      >
                        <span className="min-w-0 flex-1">{theme.label}</span>
                        {selected ? <Check className="ms-auto size-3.5 shrink-0" /> : null}
                      </Radio.Root>
                    );
                  })}
                </section>
              ))}
            </RadioGroup>
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t px-4 py-2">
            <Button
              onClick={() => {
                restoreTheme();
                setOpen(false);
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              {labels.cancel}
            </Button>
            <Button
              onClick={() => {
                initialTheme.current = pendingTheme;
                setOpen(false);
              }}
              size="sm"
              type="button"
            >
              {labels.apply}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
