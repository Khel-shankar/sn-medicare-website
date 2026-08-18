import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | S.N. Medicare",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(0,180,245,0.16), transparent 60%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(0,212,170,0.08), transparent 55%)",
        }}
      />
      {children}
    </div>
  );
}
