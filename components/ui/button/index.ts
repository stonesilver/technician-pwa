import { cva, type VariantProps } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        default_light: "bg-primary-50 text-mca hover:bg-primary/20",
        destructive: "bg-destructive text-destructive-foreground  hover:bg-destructive/90",
        outline: "border border-input bg-background  hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground  hover:bg-secondary/80",
        secondary_soft: "bg-gray-100 text-gray-700  hover:bg-gray-100/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2",
        xs: "h-7 rounded px-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
