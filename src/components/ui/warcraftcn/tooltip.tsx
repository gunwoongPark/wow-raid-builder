"use client"

import {
  Content as RadixTooltipContent,
  Portal as RadixTooltipPortal,
  Provider as RadixTooltipProvider,
  Root as RadixTooltipRoot,
  Trigger as RadixTooltipTrigger,
} from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"
import { type ComponentProps, createContext, useContext } from "react"

import { cn } from "@/lib/utils"

import "@/components/ui/warcraftcn/styles/warcraft.css"

type TooltipVariant = "default" | "epic" | "legendary" | "rare" | "uncommon"

const TooltipVariantContext = createContext<TooltipVariant>("default")

const tooltipContentVariants = cva(
  "fantasy z-50 w-fit max-w-xs rounded px-4 py-3 text-sm text-stone-800 dark:text-amber-100 [background:var(--wc-tooltip-bg)]",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        default: "wc-tooltip",
        epic: "wc-tooltip-epic",
        legendary: "wc-tooltip-legendary",
        rare: "wc-tooltip-rare",
        uncommon: "wc-tooltip-uncommon",
      },
    },
  }
)

const TOOLTIP_TITLE_COLORS: Record<TooltipVariant, string> = {
  default: "text-amber-700 dark:text-amber-400",
  epic: "text-purple-700 dark:text-purple-400",
  legendary: "text-orange-600 dark:text-orange-400",
  rare: "text-blue-700 dark:text-blue-400",
  uncommon: "text-green-700 dark:text-green-400",
}

const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: Readonly<ComponentProps<typeof RadixTooltipProvider>>) => (
  <RadixTooltipProvider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
)

const Tooltip = ({ ...props }: Readonly<ComponentProps<typeof RadixTooltipRoot>>) => (
  <TooltipProvider>
    <RadixTooltipRoot data-slot="tooltip" {...props} />
  </TooltipProvider>
)

const TooltipTrigger = ({ ...props }: ComponentProps<typeof RadixTooltipTrigger>) => (
  <RadixTooltipTrigger data-slot="tooltip-trigger" {...props} />
)

const TooltipContent = ({
  children,
  className,
  sideOffset = 8,
  variant = "default",
  ...props
}: ComponentProps<typeof RadixTooltipContent> & VariantProps<typeof tooltipContentVariants>) => (
  <RadixTooltipPortal>
    <RadixTooltipContent
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        tooltipContentVariants({ variant }),
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      <TooltipVariantContext.Provider value={variant ?? "default"}>
        {children}
      </TooltipVariantContext.Provider>
    </RadixTooltipContent>
  </RadixTooltipPortal>
)

const TooltipTitle = ({ className, ...props }: ComponentProps<"p">) => {
  const variant = useContext(TooltipVariantContext)
  return (
    <p
      data-slot="tooltip-title"
      className={cn("font-bold", TOOLTIP_TITLE_COLORS[variant], className)}
      {...props}
    />
  )
}

const TooltipBody = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    data-slot="tooltip-body"
    className={cn("mt-1 text-xs text-stone-600 dark:text-amber-100/80", className)}
    {...props}
  />
)

export {
  Tooltip,
  TooltipBody,
  TooltipContent,
  tooltipContentVariants,
  TooltipProvider,
  TooltipTitle,
  TooltipTrigger,
}
