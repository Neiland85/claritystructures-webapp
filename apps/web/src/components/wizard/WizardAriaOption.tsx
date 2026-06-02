import type { ReactNode } from "react";

type WizardAriaOptionProps = {
  readonly role: "radio" | "checkbox";
  readonly checked: boolean;
  readonly onClick: () => void;
  readonly className: string;
  readonly children: ReactNode;
  readonly type?: "button";
};

export function WizardAriaOption({
  role,
  checked,
  onClick,
  className,
  children,
}: WizardAriaOptionProps) {
  if (checked) {
    return (
      <button
        type="button"
        role={role}
        aria-checked="true"
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      role={role}
      aria-checked="false"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
