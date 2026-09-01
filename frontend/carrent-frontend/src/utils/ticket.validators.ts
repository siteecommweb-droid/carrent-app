import { ALLOWED_ATTACHMENT_TYPES, TICKET_MAX_ATTACHMENTS, TICKET_MAX_ATTACHMENT_SIZE } from "@/constants/ticket.constants";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTicketTitle(title: string): ValidationResult {
  const errors: string[] = [];
  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  } else if (title.length < 3) {
    errors.push("Title must be at least 3 characters");
  } else if (title.length > 200) {
    errors.push("Title cannot exceed 200 characters");
  }
  return { valid: errors.length === 0, errors };
}

export function validateTicketDescription(description: string): ValidationResult {
  const errors: string[] = [];
  if (!description || description.trim().length === 0) {
    errors.push("Description is required");
  } else if (description.length < 10) {
    errors.push("Description must be at least 10 characters");
  } else if (description.length > 5000) {
    errors.push("Description cannot exceed 5000 characters");
  }
  return { valid: errors.length === 0, errors };
}

export function validateCustomerEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }
  return { valid: errors.length === 0, errors };
}

export function validateCustomerName(name: string): ValidationResult {
  const errors: string[] = [];
  if (!name || name.trim().length === 0) {
    errors.push("Customer name is required");
  } else if (name.length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (name.length > 100) {
    errors.push("Name cannot exceed 100 characters");
  }
  return { valid: errors.length === 0, errors };
}

export function validateAttachment(file: File): ValidationResult {
  const errors: string[] = [];
  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed: ${ALLOWED_ATTACHMENT_TYPES.join(", ")}`);
  }
  if (file.size > TICKET_MAX_ATTACHMENT_SIZE) {
    errors.push(`File size exceeds ${TICKET_MAX_ATTACHMENT_SIZE / 1024 / 1024}MB limit`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateAttachments(files: File[]): ValidationResult {
  const errors: string[] = [];
  if (files.length > TICKET_MAX_ATTACHMENTS) {
    errors.push(`Cannot upload more than ${TICKET_MAX_ATTACHMENTS} files`);
  }
  files.forEach((file, index) => {
    const result = validateAttachment(file);
    if (!result.valid) {
      errors.push(`File "${file.name}": ${result.errors.join(", ")}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

export function validateTicketMessage(message: string): ValidationResult {
  const errors: string[] = [];
  if (!message || message.trim().length === 0) {
    errors.push("Message cannot be empty");
  } else if (message.length > 5000) {
    errors.push("Message cannot exceed 5000 characters");
  }
  return { valid: errors.length === 0, errors };
}

// ✅ ADD THIS MISSING FUNCTION
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

// Helper functions for sanitization
function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[<>]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeEmail(email: string): string {
  if (!email) return "";
  return email.toLowerCase().trim();
}