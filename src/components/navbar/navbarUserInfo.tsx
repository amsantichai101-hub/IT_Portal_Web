import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User } from "@/types/User";
import { Mail, Tag } from "lucide-react";

export default function NavbarUserInfo({ user } : { user: User }) {
  return (
    <div className="flex items-center gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer">
            <AvatarFallback className="bg-neutral-700">
              <span className="font-semibold text-white">{ user.initialFullName }</span>
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-2 pb-2" sideOffset={10}>
          {/* Full Name */}
          <DropdownMenuLabel>{ user.name }</DropdownMenuLabel>
          <DropdownMenuSeparator className="mx-2"/>
          <div>
            {/* Email */}
            <span className="text-sm flex justify-center items-center gap-2">
                <Mail size={15}/>
                { user.email }
            </span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <label className="text-sm hidden sm:block text-white">{ user.displayName }</label>
    </div>
  );
}
