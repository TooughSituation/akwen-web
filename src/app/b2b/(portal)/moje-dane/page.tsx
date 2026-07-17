import { B2BHeader } from "@/components/b2b/b2b-header";
import { LoyaltyPanel } from "@/components/b2b/loyalty-panel";
import { ProfileForm } from "@/components/b2b/profile-form";

export default function B2BProfilePage() {
  return (
    <>
      <B2BHeader
        title="Moje dane"
        description="Dane firmy, program lojalnościowy, adresy dostawy"
      />
      <div className="space-y-10 p-6">
        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Program lojalnościowy
          </h2>
          <LoyaltyPanel />
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Dane firmy i adresy
          </h2>
          <ProfileForm />
        </section>
      </div>
    </>
  );
}
