export function mailtoFallbackUrl(subject: string, body: string): string {
  const to = process.env.NEXT_PUBLIC_MAIL_TO || "info@thetrueword.com";
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
