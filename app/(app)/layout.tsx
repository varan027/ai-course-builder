import NavBar from "@/components/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-20"> {/* Padding for fixed Navbar */}
        {children}
      </main>
    </div>
  );
}