import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { TOOLS_REGISTRY } from "@/data/toolsRegistry";

const Ctx = createContext({ open: false, setOpen: () => {} });

export function CommandPaletteProvider({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen} data-testid="command-palette">
        <CommandInput placeholder="Search tools, services, pages…" data-testid="command-palette-input" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => go("/")}>Home</CommandItem>
            <CommandItem onSelect={() => go("/tools")}>All Tools</CommandItem>
            <CommandItem onSelect={() => go("/services")}>Services</CommandItem>
            <CommandItem onSelect={() => go("/blog")}>Blog</CommandItem>
            <CommandItem onSelect={() => go("/contact")}>Contact</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tools">
            {TOOLS_REGISTRY.map((t) => (
              <CommandItem key={t.slug} onSelect={() => go(`/tools/${t.slug}`)} value={`${t.name} ${t.slug}`}>
                <Search className="h-4 w-4 mr-2 opacity-60" /> {t.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Ctx.Provider>
  );
}

export const useCommandPalette = () => useContext(Ctx);
