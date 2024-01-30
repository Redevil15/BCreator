import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

interface NavigationProps {
  user?: null | User;
}

export const Navigation = ({
  user
}: NavigationProps) => {
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image
          src={'/assets/plura-logo.svg'}
          width={40}
          height={40}
          alt="Logo"
        />
        <span className="text-xl font-bold">
          BCreator.
        </span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center  justify-center gap-8">
          <Link href="/">Pricing</Link>
          <Link href="/">absolute</Link>
          <Link href="/">Documentacion</Link>
          <Link href="/">Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link
          href={'/agency'}
          className="bg-primary text-white rounded-md p-2 px-4 hover:bg-primary/80"
        >
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  )
}