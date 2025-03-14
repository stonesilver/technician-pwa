import type { HTMLAttributes } from "vue"

export type ListItemContext = {
  label?: string
  value?: string
  valueClass?: HTMLAttributes["class"]
  labelClass?: HTMLAttributes["class"]
}

export type Options = { label: string; value: string }

export type SelectProps = {
  modelValue: Options[] | Options
  options: Options[]
  placeholder: string
  emptyText?: string
}

export type IconProps = { name: string | undefined; className?: HTMLAttributes["class"] }
