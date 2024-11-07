import { Nav, NavLink } from "@/components/Nav";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: AuthLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div>
        <Nav>
          <NavLink href="/participants/dashboard">Dashboard</NavLink>
          <NavLink href="/participants/dashboard/performance">
            Performance
          </NavLink>
        </Nav>
      </div>
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex w-full">
          <Button className="bg-destructive ml-0">Log out</Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
