import Link from "next/link";
import { Clock } from "lucide-react";
import { B2BHeader } from "@/components/b2b/b2b-header";
import { getMockCustomer } from "@/lib/b2b/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function B2BPlaceholderPage({ title, description }: PlaceholderPageProps) {
  const customer = getMockCustomer();

  return (
    <>
      <B2BHeader customer={customer} title={title} description={description} />
      <div className="p-6">
        <Card className="max-w-lg border-turquoise-500/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clock className="size-6 text-turquoise-600" />
              <div>
                <CardTitle>Moduł w przygotowaniu</CardTitle>
                <CardDescription className="mt-1">
                  Ten moduł zostanie dodany w kolejnej iteracji MVP.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/b2b/katalog" />}>
              Przejdź do katalogu
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}