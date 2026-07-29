"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Check, ChevronDown, X } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import { useSiteTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ThemePreference, themeGroups } from "@/lib/theme-registry";
import { cn } from "@/lib/utils";

interface ThemeSwitcherLabels {
  apply: string;
  cancel: string;
  close: string;
  title: string;
  trigger: string;
}

const subscribe = () => () => {};
const getMountedSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeSwitcher({ labels }: { labels: ThemeSwitcherLabels }) {
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
    <Dialog.Root modal="trap-focus" open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        aria-label={labels.trigger}
        className={cn(buttonVariants({ variant: "outline" }), "border-border")}
      >
        {mounted ? activeTheme.label : labels.trigger}
        <ChevronDown className="size-3.5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop
          className="fixed inset-0 z-[90] bg-background/50 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0"
          style={{ willChange: "opacity" }}
        />
        <Dialog.Viewport className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <Dialog.Popup
            className="flex h-[30rem] max-h-[calc(100svh-2rem)] w-full max-w-md flex-col overflow-hidden border bg-popover text-popover-foreground shadow-2xl outline-none transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0"
            style={{ willChange: "opacity" }}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <Dialog.Title className="font-semibold text-lg tracking-tight">
                  {labels.title}
                </Dialog.Title>
                <Badge variant="secondary">{activeTheme.label}</Badge>
              </div>
              <Dialog.Close
                aria-label={labels.close}
                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
              >
                <X />
              </Dialog.Close>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <RadioGroup<ThemePreference>
                aria-label={labels.title}
                className="space-y-3 px-5 py-4 sm:px-6"
                onValueChange={previewTheme}
                value={pendingTheme}
              >
                <div className="space-y-3">
                  {themeGroups.map((group) => (
                    <section key={group.label}>
                      <h3 className="mb-1 px-1 font-medium text-muted-foreground text-xs uppercase tracking-[0.12em]">
                        {group.label}
                      </h3>
                      <div className="space-y-0.5">
                        {group.themes.map((theme) => {
                          const selected = pendingTheme === theme.id;

                          return (
                            <Radio.Root
                              className={cn(
                                "flex cursor-pointer items-center gap-3 px-3 py-2 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                selected ? "bg-primary/8" : "hover:bg-muted/60",
                              )}
                              key={theme.id}
                              nativeButton
                              render={<button type="button" />}
                              value={theme.id}
                            >
                              <span className="min-w-0 flex-1 font-medium text-sm">
                                {theme.label}
                              </span>
                              {selected ? <Check className="size-4 shrink-0 text-primary" /> : null}
                            </Radio.Root>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </RadioGroup>
            </ScrollArea>

            <div className="flex shrink-0 justify-end gap-2 border-t px-5 py-4 sm:px-6">
              <Button
                onClick={() => {
                  restoreTheme();
                  setOpen(false);
                }}
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
                type="button"
              >
                {labels.apply}
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
