// components/profile/tabs.tsx
import { User, FileText, Mail, Briefcase } from "lucide-react";
import { TabProps } from "@/lib/types/profile";

export const tabs = [
  { id: "personal", icon: User, label: "Personal" },
  { id: "contact", icon: Mail, label: "Contact" },
  { id: "employment", icon: Briefcase, label: "Employment" },
  { id: "documents", icon: FileText, label: "Documents" }
] as const;

export const ProfileTabs: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-2 mb-6 border-b w-full overflow-x-auto">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex items-center px-4 py-2 space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === id 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};