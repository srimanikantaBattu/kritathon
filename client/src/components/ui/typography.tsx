import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function TypographyH1({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h1 className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className
    )}>
      {children}
    </h1>
  )
}

export function TypographyP({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn(
      "leading-7 [&:not(:first-child)]:mt-6",
      className
    )}>
      {children}
    </p>
  )
}