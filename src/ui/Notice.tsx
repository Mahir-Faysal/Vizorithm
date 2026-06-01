/**
 * Notice renders an inline, accessible status message in a polite live region
 * so screen readers announce clamp notices and load errors without stealing
 * focus.
 */
export type NoticeVariant = 'info' | 'error';

interface NoticeProps {
  message: string | null;
  variant?: NoticeVariant;
}

export function Notice({ message, variant = 'info' }: NoticeProps) {
  return (
    <div
      className={`notice notice--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-hidden={message ? undefined : true}
    >
      {message}
    </div>
  );
}
