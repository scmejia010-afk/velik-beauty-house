import { cn } from "@/lib/utils"

interface GradientButtonProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  onClick?: () => void
}

export function GradientButton({ children, className, innerClassName, onClick }: GradientButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn("gradient-border-btn group cursor-pointer", className)}
    >
      <span className={cn("gradient-border-btn-inner", innerClassName)}>
        {children}
      </span>
    </button>
  )
}
