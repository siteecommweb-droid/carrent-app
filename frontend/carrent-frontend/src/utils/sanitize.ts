export function sanitizeHtml(html: string): string {
  if (!html) return "";
  // Remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/onerror=/gi, "data-error=")
    .replace(/onload=/gi, "data-load=")
    .replace(/onclick=/gi, "data-click=");
}

export function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[<>]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function sanitizeEmail(email: string): string {
  if (!email) return "";
  return email.toLowerCase().trim();
}

export function sanitizeFileName(filename: string): string {
  if (!filename) return "";
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\s+/g, "_");
}

export function validateAndSanitizeTicketInput(data: {
  title: string;
  description: string;
  customer_name: string;
  customer_email: string;
}): {
  title: string;
  description: string;
  customer_name: string;
  customer_email: string;
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  const title = sanitizeText(data.title);
  const description = sanitizeText(data.description);
  const customer_name = sanitizeText(data.customer_name);
  const customer_email = sanitizeEmail(data.customer_email);
  
  if (!title || title.length < 3) errors.push("Title must be at least 3 characters");
  if (title.length > 200) errors.push("Title cannot exceed 200 characters");
  if (!description || description.length < 10) errors.push("Description must be at least 10 characters");
  if (description.length > 5000) errors.push("Description cannot exceed 5000 characters");
  if (!customer_name || customer_name.length < 2) errors.push("Customer name is required");
  if (!customer_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) errors.push("Valid email is required");
  
  return {
    title,
    description,
    customer_name,
    customer_email,
    isValid: errors.length === 0,
    errors,
  };
}