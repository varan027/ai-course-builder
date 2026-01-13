// app/(app)/layout.tsx
import NavBar from "@/components/NavBar";
import { NetworkStatus } from "@/components/NetworkStatus";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <NetworkStatus />
      <NavBar />
      <main className="">
        {children}
      </main>
    </div>
  );
}