// import { Button } from "@/components/ui/button";
// import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: AuthLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-start items-center w-full">
          {/* <Image src="/logo.svg" alt="logo" width={152} height={56} /> */}
          {/* <Button>Sign Up</Button> */}
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
