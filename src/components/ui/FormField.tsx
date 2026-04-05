import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

interface LabelProps {
  htmlFor?: string
  children: React.ReactNode
}

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs uppercase tracking-widest text-text-muted mb-1"
    >
      {children}
    </label>
  )
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={[
        'w-full bg-bg-base border border-border-bright text-text-primary font-mono text-sm px-3 py-2',
        'focus:outline-none focus:border-accent-cyan focus:shadow-glow',
        'placeholder:text-text-muted',
        'disabled:opacity-40',
        className,
      ].join(' ')}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={[
        'w-full bg-bg-base border border-border-bright text-text-primary font-mono text-sm px-3 py-2',
        'focus:outline-none focus:border-accent-cyan focus:shadow-glow',
        'disabled:opacity-40',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={[
        'w-full bg-bg-base border border-border-bright text-text-primary font-mono text-sm px-3 py-2',
        'focus:outline-none focus:border-accent-cyan focus:shadow-glow',
        'placeholder:text-text-muted resize-y',
        'disabled:opacity-40',
        className,
      ].join(' ')}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

interface FieldProps {
  label: string
  id?: string
  error?: string
  children: React.ReactNode
}

export function Field({ label, id, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-accent-red">{error}</p>}
    </div>
  )
}
