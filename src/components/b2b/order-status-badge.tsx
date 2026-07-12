import { getOrderStatusLabel } from "@/lib/b2b/orders";
import type { B2BOrder } from "@/lib/b2b/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<B2BOrder["status"], string> = {
  new: "bg-turquoise-500/15 text-turquoise-700 dark:text-turquoise-300",
  processing: "bg-coral-500/15 text-coral-700 dark:text-coral-400",
  shipped: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  delivered: "bg-green-500/15 text-green-700 dark:text-green-400",
  cancelled: "bg-muted text-muted-foreground",
};

interface OrderStatusBadgeProps {
  status: B2BOrder["status"];
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge className={cn(statusStyles[status], className)}>
      {getOrderStatusLabel(status)}
    </Badge>
  );
}