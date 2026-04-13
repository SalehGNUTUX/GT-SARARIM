import * as React from "react"
import { cn } from "@/lib/utils"

/* ─── Context ─── */
interface DialogCtx { open: boolean; onOpenChange: (v: boolean) => void }
const DialogContext = React.createContext<DialogCtx>({ open: false, onOpenChange: () => {} })

/* ─── Dialog (root) ─── */
interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  defaultOpen?: boolean
}
function Dialog({ open: controlledOpen, onOpenChange, children, defaultOpen = false }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

/* ─── Trigger ─── */
function DialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { onOpenChange } = React.useContext(DialogContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { onClick: () => onOpenChange(true) })
  }
  return <span onClick={() => onOpenChange(true)}>{children}</span>
}

/* ─── Portal / Overlay / Content ─── */
function DialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function DialogOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { onOpenChange } = React.useContext(DialogContext)
  return (
    <div
      className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext)
    if (!open) return null
    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
        <div
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border bg-background p-6 shadow-xl",
            "max-h-[90vh] overflow-y-auto",
            className
          )}
          onClick={e => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)
DialogContent.displayName = "DialogContent"

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-right mb-4", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)} {...props} />
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
DialogDescription.displayName = "DialogDescription"

function DialogClose({ children, ...props }: React.HTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) {
  const { onOpenChange } = React.useContext(DialogContext)
  return <button onClick={() => onOpenChange(false)} {...props}>{children}</button>
}

export {
  Dialog, DialogPortal, DialogOverlay, DialogTrigger,
  DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription, DialogClose
}
