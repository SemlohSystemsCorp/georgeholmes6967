const DISPOSABLE_DOMAINS = [
  "tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com",
  "yopmail.com", "10minutemail.com", "trashmail.com", "dispostable.com",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "temp-mail.org",
];

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required." };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 254) {
    return { valid: false, error: "Email address is too long." };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  const domain = trimmed.split("@")[1];
  if (!domain || !domain.includes(".")) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { valid: false, error: "Disposable email addresses are not allowed." };
  }

  return { valid: true };
}

export function validateFullName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Full name is required." };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: "Full name must be at least 2 characters." };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "Full name is too long." };
  }

  // Only letters, spaces, hyphens, and apostrophes allowed
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { valid: false, error: "Full name can only contain letters, spaces, hyphens, and apostrophes." };
  }

  // Must have at least two separate parts (first and last name)
  const parts = trimmed.split(/\s+/).filter((p) => p.length > 0);
  if (parts.length < 2) {
    return { valid: false, error: "Please enter your first and last name." };
  }

  // Each part must be at least 1 character
  if (parts.some((p) => p.length < 1)) {
    return { valid: false, error: "Each name must be at least 1 character." };
  }

  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required." };
  }

  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters." };
  }

  if (password.length > 128) {
    return { valid: false, error: "Password is too long." };
  }

  return { valid: true };
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required." };
  }

  const trimmed = username.trim().toLowerCase();

  if (trimmed.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters." };
  }

  if (trimmed.length > 30) {
    return { valid: false, error: "Username must be 30 characters or less." };
  }

  if (!/^[a-z][a-z0-9._-]*$/.test(trimmed)) {
    return { valid: false, error: "Username must start with a letter and can only contain letters, numbers, dots, hyphens, and underscores." };
  }

  const reserved = ["admin", "root", "system", "chatterbox", "support", "help", "api", "www", "mail"];
  if (reserved.includes(trimmed)) {
    return { valid: false, error: "This username is reserved." };
  }

  return { valid: true };
}

export function generateWorkspaceId(): string {
  // Generate a 10-digit numeric ID
  const min = 1000000000;
  const max = 9999999999;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}
