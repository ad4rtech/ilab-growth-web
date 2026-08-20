import { Briefcase, Target, Users, Award, Rocket, Lightbulb, TrendingUp, Star, type LucideIcon } from "lucide-react";

export const SERVICE_ICON_OPTIONS: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "Briefcase", label: "Briefcase", Icon: Briefcase },
  { value: "Target", label: "Target", Icon: Target },
  { value: "Users", label: "Users", Icon: Users },
  { value: "Award", label: "Award", Icon: Award },
  { value: "Rocket", label: "Rocket", Icon: Rocket },
  { value: "Lightbulb", label: "Lightbulb", Icon: Lightbulb },
  { value: "TrendingUp", label: "Trending Up", Icon: TrendingUp },
  { value: "Star", label: "Star", Icon: Star },
];

export function ServiceIcon({ name, className }: { name: string | null; className?: string }) {
  const match = SERVICE_ICON_OPTIONS.find((o) => o.value === name);
  const Icon = match?.Icon ?? Briefcase;
  return <Icon className={className} />;
}