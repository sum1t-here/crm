import { Nav, NavLink } from "@/components/Nav";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/quiz">Quiz</NavLink>
      </Nav>
      <div className="flex justify-center">
        <div className="container mt-8">{children}</div>
      </div>
    </div>
  );
}
