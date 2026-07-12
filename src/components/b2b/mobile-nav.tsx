"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { B2BSidebarContent } from "@/components/b2b/sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function B2BMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center border-b border-navy-800/50 bg-navy-900 px-4 py-3 text-white lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/10 hover:text-white"
            />
          }
        >
          <Menu className="size-5" />
          <span className="sr-only">Otwórz menu</span>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-72 flex-col border-navy-800/50 bg-navy-900 p-0 text-white"
          showCloseButton
        >
          <SheetTitle className="sr-only">Menu nawigacji B2B</SheetTitle>
          <B2BSidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <span className="ml-3 text-sm font-medium tracking-wide text-turquoise-300 uppercase">
        Portal hurtowy Akwen
      </span>
    </div>
  );
}