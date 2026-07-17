import { B2BHeader } from "@/components/b2b/b2b-header";
import { ProfileForm } from "@/components/b2b/profile-form";

export default function B2BProfilePage() {
  return (
    <>
      <B2BHeader
        title="Moje dane"
        description="Dane firmy, adresy dostawy i ustawienia konta"
      />
      <div className="p-6">
        <ProfileForm />
      </div>
    </>
  );
}