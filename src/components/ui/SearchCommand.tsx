import React, { useState, useEffect, useRef } from "react";

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
import { EventData } from "@/types";

export const SearchCommand = ({
  events,
  onSelectEvent,
}: {
  events: EventData[] | null;
  onSelectEvent: (event: EventData) => void;
}) => {
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const filteredEvents = React.useMemo(() => {
    if (!events) return [];
    return events.filter((event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [events, searchTerm]);

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
              <CommandGroup heading="All Events">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <CommandItem
                      key={event.id}
                      onSelect={() => {
                        onSelectEvent(event);
                        setIsFocused(false);
                      }}
                    >
                      <span>{event.eventName}</span>
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No events found.</CommandEmpty>
                )}
              </CommandGroup>
              <CommandSeparator />
            </CommandList>
          </div>
        )}
      </Command>

      <CommandDialog open={isOpen} onOpenChange={onClose}>
        <CommandInput
          placeholder="Search Events"
          value={searchTerm}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Events">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <CommandItem
                  key={event.id}
                  onSelect={() => onSelectEvent(event)}
                >
                  <span>{event.eventName}</span>
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>No events found.</CommandEmpty>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
