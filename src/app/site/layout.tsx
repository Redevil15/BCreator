import { Navigation } from "./_components/navigation";

const SiteLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="h-full">
      <Navigation />
      {children}
    </main>
  )
}

export default SiteLayout;