import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type TdProps = ComponentProps<"td">;

export default function Td({ className, children, ...rest }: TdProps) {
  return (
    <td className={cn("border px-2 py-1", className)} {...rest}>
      {children}
    </td>
  );
}
