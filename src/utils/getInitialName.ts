export const getInitials = (name?: string) => {
  if (!name) return "";
  const parts = name
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (parts.length === 0) return "";

  const initials =
    parts.length > 1
      ? `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`
      : parts[0].slice(0, 2);

  return initials.toUpperCase();
};
