import { dark } from "@clerk/themes";
import { Navigation } from "./_components/navigation";
import { ClerkProvider } from "@clerk/nextjs";

const SiteLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider
      appearance={{ baseTheme: dark }}
    >
      <main className="h-full">
        <Navigation />
        {children}

      </main>
    </ClerkProvider>
  )
}

export default SiteLayout;