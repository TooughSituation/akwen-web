"use client";

import { useProfile } from "@/contexts/profile-context";
import { B2BHeader } from "@/components/b2b/b2b-header";

export function DashboardHeader() {
  const { profile, isHydrated } = useProfile();
  const firstName = isHydrated
    ? profile.contactPerson.split(" ")[0]
    : profile.contactPerson.split(" ")[0];

  return (
    <B2BHeader
      title={`Witaj, ${firstName}!`}
      description={`${profile.companyName} · Panel partnera handlowego Akwen`}
    />
  );
}