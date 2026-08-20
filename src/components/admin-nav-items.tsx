import {
  LayoutGrid,
  Package,
  Briefcase,
  GraduationCap,
  FileText,
  Users,
  BarChart3,
  Mail,
  Bell,
  MessageCircle,
  Settings,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageCircle },
  { href: "/admin/courses", label: "Courses", icon: GraduationCap },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sales-reports", label: "Sales Reports", icon: BarChart3 },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];