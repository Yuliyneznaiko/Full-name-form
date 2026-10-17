import { useId, useState, type ChangeEvent, type ClipboardEvent } from "react";
import { validateFullName } from "./validateFullName";

interface FullNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Reports the current validation error (null when valid). */
  onValidate?: (error: string | null) => void;
  /** Set true after a failed submit to show errors on an untouched field. */
  forceShowError?: boolean;
}

export function FullNameField({
  value,
  onChange,
  onValidate,
  forceShowError = false,
}: FullNameFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [touched, setTouched] = useState(false);

  const { error } = validateFullName(value);
  const showError = (touched || forceShowError) && error !== null;

  const report = (raw: string) => onValidate?.(validateFullName(raw).error);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    report(e.target.value);
  };

  // Paste: validate instantly, without waiting for blur.
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    const el = e.currentTarget;
    const next =
      el.value.slice(0, el.selectionStart ?? 0) +
      pasted +
      el.value.slice(el.selectionEnd ?? 0);
    setTouched(true);
    report(next);
  };

  // Blur: trim, collapse inner spaces, then validate.
  const handleBlur = () => {
    const { value: normalized, error: err } = validateFullName(value);
    setTouched(true);
    if (normalized !== value) onChange(normalized);
    onValidate?.(err);
  };

  return (
    <div className="field">
      <label htmlFor={id}>
        Full name <span aria-hidden="true">*</span>
      </label>
      <input
        id={id}
        name="fullName"
        type="text"
        placeholder="Eddie Hearn"
        autoComplete="name"
        required
        aria-required="true"
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        onBlur={handleBlur}
      />
      {/* Always rendered so screen readers announce changes reliably */}
      <p id={errorId} role="alert" className="field-error">
        {showError ? error : ""}
      </p>
    </div>
  );
}
