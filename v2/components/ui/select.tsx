import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/* Simple native-select wrapper matching the shadcn Select API surface used in the app */

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  disabled?: boolean
}

const SelectContext = React.createContext<{ value: string; onValueChange: (v: string) => void }>({ value: '', onValueChange: () => {} })

function Select({ value: controlled, defaultValue = '', onValueChange, children, disabled }: SelectProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const value = controlled ?? internal
  const onChange = (v: string) => { setInternal(v); onValueChange?.(v) }
  return <SelectContext.Provider value={{ value, onValueChange: onChange }}>{children}</SelectContext.Provider>
}

function SelectTrigger({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm cursor-pointer", className)} {...props}>
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  return <span className={value ? '' : 'text-muted-foreground'}>{value || placeholder}</span>
}

function SelectContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("hidden", className)}>{children}</div>
}

function SelectItem({ value, children, className }: { value: string; children?: React.ReactNode; className?: string }) {
  return <div data-value={value} className={cn("hidden", className)}>{children}</div>
}

function SelectGroup({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function SelectLabel({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("text-xs font-semibold", className)}>{children}</div>
}

/* Native select — used directly in the app forms */
const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  )
)
NativeSelect.displayName = "NativeSelect"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, NativeSelect }
