import { useState, useEffect, useRef } from "react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";

export const SearchCommand = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !(searchRef.current as Node).contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Implement your search logic here
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  if (!isMounted) return null;

  return (
    <div className="relative" ref={searchRef}>
      <Command className="rounded-lg border">
        <CommandInput
          placeholder="Click or Press ⌘ K to Search"
          value={searchTerm}
          onValueChange={handleSearch}
          onFocus={handleFocus}
        />
        {(isFocused || searchTerm) && (
          <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <span>Search Emoji</span>
                </CommandItem>
                <CommandItem disabled>
                  <span>Calculator</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </CommandList>
          </div>
        )}
      </Command>

      <CommandDialog open={isOpen} onOpenChange={onClose}>
        <CommandInput placeholder="Search Events" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Documents">
            <CommandItem>
              <span>Calendar</span>
            </CommandItem>
            {/* Add more items based on your search results */}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
