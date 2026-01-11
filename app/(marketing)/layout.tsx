import NavBar from "@/components/NavBar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}