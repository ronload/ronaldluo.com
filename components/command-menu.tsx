"use client";

import {
  CircleHelp,
  House,
  Languages,
  Mail,
  NotebookText,
  Paintbrush,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { useSiteTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogClose } from "@/components/ui/dialog";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ACTIVE_CHANNELS } from "@/lib/contact-channels";
import { themeDefinitions } from "@/lib/theme-registry";

export interface CommandMenuNote {
  slug: string;
  title: string;
  description: string;
}

export interface CommandMenuLabels {
  close: string;
  contact: string;
  contacts: string;
  description: string;
  empty: string;
  faq: string;
  forLlms: string;
  home: string;
  navigate: string;
  navigation: string;
  notes: string;
  placeholder: string;
  select: string;
  settings: string;
  switchLanguage: string;
  themes: string;
  title: string;
  trigger: string;
}

interface CommandMenuProps {
  labels: CommandMenuLabels;
  notes: CommandMenuNote[];
}

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getAppleDeviceSnapshot = () =>
  typeof navigator !== "undefined" &&
  /Macintosh|Mac OS X|iPhone|iPad|iPod/.test(navigator.userAgent);

export function CommandMenu({ labels, notes }: CommandMenuProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { preference, setPreference } = useSiteTheme();
  const isAppleDevice = useSyncExternalStore(subscribe, getAppleDeviceSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const nextLocale = locale === "en" ? "zh-TW" : "en";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isEditable =
        target instanceof HTMLElement &&
        target.closest(
          "input, textarea, select, [contenteditable='true'], [contenteditable='plaintext-only']",
        );

      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        isEditable ||
        event.key.toLowerCase() !== "k" ||
        (!event.metaKey && !event.ctrlKey) ||
        document.querySelector('[role="dialog"][aria-modal="true"]')
      ) {
        return;
      }

      event.preventDefault();
      setOpen(true);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeMenu = () => {
    setOpen(false);
    setSearch("");
  };

  const navigate = (href: string) => {
    closeMenu();
    startTransition(() => router.push(href));
  };

  const openContact = (href: string) => {
    closeMenu();

    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.assign(href);
  };

  const pageCommands = [
    { href: "/", icon: House, id: "home", label: labels.home },
    { href: "/notes", icon: NotebookText, id: "notes", label: labels.notes },
    {
      href: "/contact",
      icon: Mail,
      id: "contact",
      keywords: [labels.contacts, "contact"],
      label: labels.contact,
    },
    { href: "/faq", icon: CircleHelp, id: "faq", label: labels.faq },
    { href: "/for-llms", icon: Sparkles, id: "for-llms", label: labels.forLlms },
  ];

  return (
    <>
      <Button
        aria-keyshortcuts="Control+K Meta+K"
        aria-label={labels.trigger}
        className="flex-1 justify-start border-border/[0.32] px-3 lg:w-52 lg:flex-none"
        onClick={() => setOpen(true)}
        size="default"
        type="button"
        variant="outline"
      >
        <Search />
        <span className="ms-1 text-muted-foreground">{labels.title}</span>
        <kbd className="ms-auto shrink-0 border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {isAppleDevice ? "⌘" : "⌃"} K
        </kbd>
      </Button>

      <CommandDialog
        className="top-1/2 w-[calc(100%-2rem)] max-w-none -translate-y-1/2 gap-0 border-border p-0 shadow-2xl sm:w-[42rem]"
        description={labels.description}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setSearch("");
        }}
        open={open}
        showCloseButton={false}
        title={labels.title}
      >
        <Command className="relative" label={labels.title} loop vimBindings>
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
          <CommandInput
            aria-label={labels.placeholder}
            autoFocus
            className="command-menu-search-input"
            onKeyDown={(event) => {
              if (
                event.ctrlKey &&
                !event.metaKey &&
                !event.altKey &&
                !event.nativeEvent.isComposing &&
                event.key.toLowerCase() === "u"
              ) {
                event.preventDefault();
                setSearch("");
              }
            }}
            onValueChange={setSearch}
            placeholder={labels.placeholder}
            value={search}
          />
          <CommandList
            aria-label={labels.title}
            className="max-h-[calc(100svh-17rem)] px-1 py-1 sm:max-h-96"
          >
            <CommandEmpty>{labels.empty}</CommandEmpty>
            <CommandGroup heading={labels.navigation}>
              {pageCommands.map(({ href, icon: Icon, id, keywords = [], label }) => (
                <CommandItem
                  key={id}
                  keywords={[label, ...keywords]}
                  onSelect={() => navigate(href)}
                  value={`page ${label}`}
                >
                  <Icon />
                  <span>{label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {notes.length > 0 ? <CommandSeparator /> : null}
            {notes.length > 0 ? (
              <CommandGroup heading={labels.notes}>
                {notes.map((note) => (
                  <CommandItem
                    className="items-start py-2.5"
                    key={note.slug}
                    keywords={[note.title, note.description]}
                    onSelect={() => navigate(`/notes/${note.slug}`)}
                    value={`note ${note.slug}`}
                  >
                    <NotebookText className="mt-0.5" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{note.title}</span>
                      <span className="block truncate text-muted-foreground text-xs">
                        {note.description}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            <CommandSeparator />
            <CommandGroup heading={labels.settings}>
              <CommandItem
                disabled={isPending}
                keywords={[labels.switchLanguage]}
                onSelect={() => {
                  closeMenu();
                  startTransition(() => router.replace(pathname, { locale: nextLocale }));
                }}
                value={`language ${labels.switchLanguage}`}
              >
                <Languages />
                <span>{labels.switchLanguage}</span>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading={labels.themes}>
              {themeDefinitions.map((theme) => (
                <CommandItem
                  data-checked={preference === theme.id || undefined}
                  key={theme.id}
                  keywords={[labels.themes, theme.label]}
                  onSelect={() => {
                    setPreference(theme.id);
                    closeMenu();
                  }}
                  value={`theme ${theme.id}`}
                >
                  <Paintbrush />
                  <span>{theme.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={labels.contacts}>
              {ACTIVE_CHANNELS.map(({ href, icon: Icon, label }) => (
                <CommandItem
                  key={href}
                  keywords={[label]}
                  onSelect={() => openContact(href)}
                  value={`contact ${label}`}
                >
                  <Icon />
                  <span>{label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div
            aria-hidden="true"
            className="command-menu-keyboard-hints flex items-center justify-between border-t px-4 py-2 font-mono text-[10px] text-muted-foreground"
          >
            <span>
              <kbd className="me-1 border border-border/60 bg-muted px-1 py-0.5">Up/Down</kbd>
              {labels.navigate}
            </span>
            <span>
              <kbd className="me-1 border border-border/60 bg-muted px-1 py-0.5">Enter</kbd>
              {labels.select}
            </span>
            <span>
              <kbd className="me-1 border border-border/60 bg-muted px-1 py-0.5">Esc</kbd>
              {labels.close}
            </span>
          </div>
        </Command>
      </CommandDialog>
    </>
  );
}
