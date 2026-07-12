"use client";

import { useEffect, useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useProfile } from "@/contexts/profile-context";
import {
  createDeliveryAddress,
  ensureSingleDefaultAddress,
} from "@/lib/b2b/profile";
import type { B2BProfile, DeliveryAddress } from "@/lib/b2b/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm() {
  const { profile, isHydrated, saveProfile } = useProfile();
  const [formData, setFormData] = useState<B2BProfile>(profile);
  const [savedMessage, setSavedMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(
    null
  );
  const [addressLabel, setAddressLabel] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [addressIsDefault, setAddressIsDefault] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      setFormData(profile);
    }
  }, [profile, isHydrated]);

  function updateField<K extends keyof B2BProfile>(
    field: K,
    value: B2BProfile[K]
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function openAddAddressDialog() {
    setEditingAddress(null);
    setAddressLabel("");
    setAddressValue("");
    setAddressIsDefault(formData.deliveryAddresses.length === 0);
    setAddressDialogOpen(true);
  }

  function openEditAddressDialog(address: DeliveryAddress) {
    setEditingAddress(address);
    setAddressLabel(address.label);
    setAddressValue(address.address);
    setAddressIsDefault(Boolean(address.isDefault));
    setAddressDialogOpen(true);
  }

  function saveAddressDialog() {
    if (!addressLabel.trim() || !addressValue.trim()) {
      setError("Uzupełnij nazwę i adres dostawy.");
      return;
    }

    setError(null);

    let nextAddresses = [...formData.deliveryAddresses];

    if (editingAddress) {
      nextAddresses = nextAddresses.map((item) =>
        item.id === editingAddress.id
          ? {
              ...item,
              label: addressLabel.trim(),
              address: addressValue.trim(),
              isDefault: addressIsDefault,
            }
          : addressIsDefault
            ? { ...item, isDefault: false }
            : item
      );
    } else {
      const newAddress = createDeliveryAddress(
        addressLabel,
        addressValue,
        addressIsDefault || nextAddresses.length === 0
      );
      nextAddresses = addressIsDefault
        ? [...nextAddresses.map((item) => ({ ...item, isDefault: false })), newAddress]
        : [...nextAddresses, newAddress];
    }

    updateField(
      "deliveryAddresses",
      ensureSingleDefaultAddress(nextAddresses)
    );
    setAddressDialogOpen(false);
  }

  function deleteAddress(addressId: string) {
    const nextAddresses = formData.deliveryAddresses.filter(
      (item) => item.id !== addressId
    );
    updateField(
      "deliveryAddresses",
      ensureSingleDefaultAddress(nextAddresses)
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!formData.companyName.trim()) {
      setError("Nazwa firmy jest wymagana.");
      return;
    }

    if (!formData.nip.trim()) {
      setError("NIP jest wymagany.");
      return;
    }

    if (formData.deliveryAddresses.length === 0) {
      setError("Dodaj co najmniej jeden adres dostawy.");
      return;
    }

    saveProfile({
      ...formData,
      companyName: formData.companyName.trim(),
      nip: formData.nip.trim(),
      regon: formData.regon.trim(),
      contactPerson: formData.contactPerson.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      deliveryAddresses: ensureSingleDefaultAddress(formData.deliveryAddresses),
    });

    setSavedMessage(true);
    window.setTimeout(() => setSavedMessage(false), 3000);
  }

  if (!isHydrated) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Ładowanie danych profilu…
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {savedMessage && (
          <Alert className="border-turquoise-500/30 bg-turquoise-500/10">
            <AlertDescription>
              Dane zostały zapisane. Zmiany są widoczne w całym portalu B2B.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Dane firmy</CardTitle>
            <CardDescription>
              Informacje widoczne na fakturach i w zamówieniach hurtowych.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="companyName">Nazwa firmy</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                value={formData.nip}
                onChange={(e) => updateField("nip", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regon">REGON</Label>
              <Input
                id="regon"
                value={formData.regon}
                onChange={(e) => updateField("regon", e.target.value)}
                placeholder="Opcjonalnie"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contactPerson">Osoba kontaktowa</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => updateField("contactPerson", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Adresy dostawy</CardTitle>
              <CardDescription>
                Lista adresów dostępnych przy składaniu zamówienia.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openAddAddressDialog}
            >
              <Plus className="size-4" />
              Dodaj adres
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.deliveryAddresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Brak zapisanych adresów. Dodaj pierwszy adres dostawy.
              </p>
            ) : (
              formData.deliveryAddresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border p-4"
                >
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-turquoise-600" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{address.label}</p>
                        {address.isDefault && (
                          <Badge className="bg-turquoise-500/15 text-turquoise-700">
                            Domyślny
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {address.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEditAddressDialog(address)}
                      aria-label={`Edytuj ${address.label}`}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteAddress(address.id)}
                      aria-label={`Usuń ${address.label}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-turquoise-500 hover:bg-turquoise-600"
          >
            Zapisz zmiany
          </Button>
        </div>
      </form>

      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edytuj adres" : "Dodaj adres dostawy"}
            </DialogTitle>
            <DialogDescription>
              Adres będzie dostępny w formularzu składania zamówienia.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address-label">Nazwa adresu</Label>
              <Input
                id="address-label"
                placeholder="Np. Siedziba, Magazyn, Punkt odbioru"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-value">Adres</Label>
              <Textarea
                id="address-value"
                placeholder="Ulica, kod pocztowy, miasto"
                value={addressValue}
                onChange={(e) => setAddressValue(e.target.value)}
                rows={3}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={addressIsDefault}
                onChange={(e) => setAddressIsDefault(e.target.checked)}
                className="size-4 accent-turquoise-500"
              />
              Ustaw jako domyślny adres dostawy
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddressDialogOpen(false)}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              className="bg-turquoise-500 hover:bg-turquoise-600"
              onClick={saveAddressDialog}
            >
              {editingAddress ? "Zapisz adres" : "Dodaj adres"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}