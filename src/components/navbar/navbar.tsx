
import { User, UserData } from "@/types/User"
import { SidebarTrigger, useSidebar } from "../ui/sidebar"
import NavbarUserInfo from './navbarUserInfo'

export default function Navbar({ user }: { user: User }) {
    return (
        <nav className="navbar bg-kpmg-blue justify-between sticky top-0">
            {/* Sidebar Trigger */}
            <div className="flex-1 ms-1">
                <SidebarTrigger className="text-white"/>
            </div>
            <NavbarUserInfo user={user}/>
        </nav>
    )
}