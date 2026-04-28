import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-md bg-scarlet-primary px-3 py-2 text-sm font-medium text-white hover:bg-scarlet-deep disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
