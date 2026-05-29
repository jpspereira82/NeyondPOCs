import clsx from "clsx";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, className, ...rest }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      <input
        ref={ref}
        className={clsx(
          "w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
          "placeholder:text-slate-400 transition-all duration-200",
          error && "border-rose-400 focus:ring-rose-500",
          className
        )}
        {...rest}
      />
      {helper && !error && <p className="text-xs text-slate-500">{helper}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helper, className, ...rest }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      <textarea
        ref={ref}
        className={clsx(
          "w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
          "placeholder:text-slate-400 transition-all duration-200 resize-none",
          className
        )}
        {...rest}
      />
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";