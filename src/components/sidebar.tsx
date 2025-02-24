import Link from "next/link";
import { Home, Users, Briefcase, GraduationCap, Settings, X, CalendarClock,ContactRound,ShieldAlert
  ,ShieldQuestion, ThermometerSun,WavesLadder} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Permissions } from "@/lib/types/permissions";
import { Logo } from "./logo";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const menuItems = [
 // { icon: Home, text: "Dashboard", href: "/", permission: "view_dashboard" },
 //{ icon: ContactRound, text: "Profile", href: "/profile", permission: Permissions.GET_ALL_CONTACT },
  { icon: Users, text: "Contacts", href: "/contacts", permission: Permissions.VIEW_CONTACT },
  { icon: Briefcase, text: "Projects", href: "/projects", permission:Permissions.VIEW_PROJECT},
  { icon: GraduationCap, text: "Inductions", href: "/inductions", permission:Permissions.VIEW_INDUCTION },
  { icon: ShieldAlert, text: "Daily Inspections", href: "/dailyinspection", permission:Permissions.VIEW_WEEKLY_CHECK },
  { icon: ShieldQuestion , text: "Weekly Inspections", href: "/weeklyinspection", permission:Permissions.VIEW_WEEKLY_CHECK },
  { icon: ThermometerSun, text: "Hot Work Permit", href: "/hotworkpermit", permission:Permissions.VIEW_WEEKLY_CHECK },
  { icon: WavesLadder, text: "Height Work Permit", href: "/heightpermit", permission:Permissions.VIEW_WEEKLY_CHECK },
  
  { icon: CalendarClock, text: "Timesheet", href: "/timesheet", permission:Permissions.VIEW_TIMESHEET},
];

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { hasPermission } = useAuth();

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } xl:translate-x-0`}
    >
      <div
        className="h-full px-3 py-4 overflow-y-auto bg-gray-800"
        style={{
          background: "rgba(31, 41, 55, 0.8)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
           <span className="text-lg  font-extralight text-orange-500">R.S <span className="text-teal-500">Electrical</span></span> 
          
          
          <button onClick={() => setIsOpen(false)} className="xl:hidden text-white">
            <X size={24} />
          </button>
        </div>
        <ul className="space-y-2">
          {filteredMenuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} onClick={() => setIsOpen(false)} className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-accent group">
                <item.icon className="w-5 h-5 transition duration-75" />
                <span className="ml-3">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
