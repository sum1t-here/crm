"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode, useEffect, useState } from "react";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-slate-500 text-primary-foreground flex justify-center px-4">
      {children}
    </nav>
  );
}
// create a new type based on the props of the Link component, while omitting the classname prop
export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent rendering on the server

  return (
    <Link
      {...props}
      className={cn(
        "p-4 text-white font-bold hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathname === props.href && "bg-background text-foreground"
      )}
    />
  );
}
