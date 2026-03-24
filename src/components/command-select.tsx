"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "./ui/command";

interface Props{
    //options is array of objects..
    options: Array<{
        id: string;
        value: string;
        children: string
    }>;
    onSelect: (value: string) => void;
    onSearch: (value: string) => void;
    value: string;
    placeholder: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommandSelect = ({
    options,
    onSearch,
    onSelect,
    value,
    placeholder = "select an option",
    isSearchable,
    className
}: Props) => {
    const [open, setOpen] = useState(false)
    const selectOptions = options.find((option) => option.value === value)

    return (
        <>
        <Button type="button" onClick={() => setOpen(true)} variant={"outline"} className={cn("h-9 justify-between font-normal px-2", !selectOptions && "text-muted-foreground", className)}>
            <div>
                {selectOptions?.children ?? placeholder}
            </div>
            <ChevronsUpDownIcon />
         </Button>

         <CommandResponsiveDialog shouldFilter={!onSearch} open={open} onOpenChange={setOpen}>
            <Command shouldFilter={!onSearch}>
            <CommandInput placeholder="Search..." onValueChange={onSearch} />
            <CommandList>
                <CommandEmpty>
                    <span className="text-muted-foreground text-sm">No option found</span>
                </CommandEmpty>
                {options.map((option) => (
                    <CommandItem key={option.id}
                    onSelect={() => {
                        onSelect(option.value)
                        setOpen(false)
                    }}
                    >
                        {option.children}
                    </CommandItem>
                ))}
            </CommandList>
            </Command>
         </CommandResponsiveDialog>
        </>
    )
}