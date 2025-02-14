"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps extends Omit<DialogPrimitive.DialogProps, 'modal'> {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface ModalContentProps 
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  preventClose?: boolean;
}

const Modal = ({ children, onOpenChange, ...props }: ModalProps) => (
  <DialogPrimitive.Root
    modal={true}
    onOpenChange={(open) => {
      onOpenChange?.(open);
    }}
    {...props}
  >
    {children}
  </DialogPrimitive.Root>
);
Modal.displayName = "Modal";

const ModalTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    className={cn("", className)}
    {...props}
  />
));
ModalTrigger.displayName = "ModalTrigger";

const ModalPortal = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogPortalProps & { className?: string }) => (
  <DialogPrimitive.Portal {...props}>
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      className
    )}>
      {children}
    </div>
  </DialogPrimitive.Portal>
);
ModalPortal.displayName = "ModalPortal";

const ModalOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out",
      "data-[state=open]:animate-in data-[state=open]:fade-in",
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

const ModalContent = React.forwardRef<
  HTMLDivElement,
  ModalContentProps
>(({ className, children, preventClose = false, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      onPointerDownOutside={(e) => preventClose && e.preventDefault()}
      onEscapeKeyDown={(e) => preventClose && e.preventDefault()}
      className={cn(
        "fixed z-50 rounded-lg bg-white shadow-lg outline-none",
        "w-[90vw] max-w-3xl max-h-[85vh]", // Set max width and height
        "dark:bg-gray-800 dark:border dark:border-gray-700",
        "data-[state=open]:animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10",
        "sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0",
        className
      )}
      {...props}
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {children}
      </div>
      <DialogPrimitive.Close 
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-2",
          "transition-opacity hover:opacity-100",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:pointer-events-none",
          "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
          "z-50"
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = "ModalContent";

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left p-6",
      "border-b",
      className
    )}
    {...props}
  />
));
ModalHeader.displayName = "ModalHeader";

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      "p-6 border-t bg-white dark:bg-gray-800",
      className
    )}
    {...props}
  />
));
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

export {
  type ModalProps,
  type ModalContentProps,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
}