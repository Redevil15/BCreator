import { User } from "@clerk/nextjs/server";
import Image from "next/image";

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
    </div>
  )
}