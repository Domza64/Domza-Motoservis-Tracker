export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full bg-slate-200 flex justify-center">
      {children}
    </section>
  );
}
