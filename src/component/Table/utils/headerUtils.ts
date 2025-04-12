// headerUtils.ts - Utilities for header formatting and parsing

/**
 * Represents parts of a header (e.g., for "2023 - Goal", prefix="2023", separator=" - ", value="Goal")
 */
export interface HeaderParts {
  prefix: string;
  separator: string;
  value: string;
  fullText: string;
}

/**
 * Parse a header name into its component parts
 * Detects common patterns like Year-Value, Category-Value, etc.
 *
 * @param headerName The header text to parse
 * @returns HeaderParts object with prefix, separator, and value
 */
export function parseHeaderName(headerName: string): HeaderParts {
  // Year-Value format (e.g., "2023 - Goal")
  const yearValueMatch = headerName.match(/^(\d{4})\s*-\s*(.+)$/);
  if (yearValueMatch) {
    return {
      prefix: yearValueMatch[1],
      separator: ' - ',
      value: yearValueMatch[2],
      fullText: headerName,
    };
  }

  // Category-Value format (e.g., "Category: Value")
  const categoryMatch = headerName.match(/^([^:]+):\s*(.+)$/);
  if (categoryMatch) {
    return {
      prefix: categoryMatch[1],
      separator: ': ',
      value: categoryMatch[2],
      fullText: headerName,
    };
  }

  // Type-Value format (e.g., "Type | Value")
  const typeMatch = headerName.match(/^([^|]+)\|\s*(.+)$/);
  if (typeMatch) {
    return {
      prefix: typeMatch[1],
      separator: ' | ',
      value: typeMatch[2],
      fullText: headerName,
    };
  }

  // No format detected, treat entire header as value
  return {
    prefix: '',
    separator: '',
    value: headerName,
    fullText: headerName,
  };
}

/**
 * Format header parts back into a full header string
 *
 * @param parts HeaderParts object
 * @returns Formatted header string
 */
export function formatHeaderFromParts(parts: HeaderParts): string {
  if (parts.prefix && parts.separator) {
    return `${parts.prefix}${parts.separator}${parts.value}`;
  }
  return parts.value;
}

/**
 * Determine if a header has a special format that requires partial editing
 *
 * @param headerName Header text to check
 * @returns True if the header has a special format requiring partial editing
 */
export function isPartialEditFormat(headerName: string): boolean {
  const parts = parseHeaderName(headerName);
  return parts.prefix !== '' && parts.separator !== '';
}

/**
 * Format a header value while preserving its structure
 *
 * @param headerName Original header text
 * @param newValue New value (just the editable part)
 * @returns Updated header text with the new value
 */
export function updateHeaderValue(
  headerName: string,
  newValue: string
): string {
  const parts = parseHeaderName(headerName);
  parts.value = newValue;
  return formatHeaderFromParts(parts);
}

/**
 * Get just the editable part of a header
 *
 * @param headerName Header text
 * @returns The editable part of the header
 */
export function getEditableValue(headerName: string): string {
  return parseHeaderName(headerName).value;
}

/**
 * Validate a header value based on header type
 *
 * @param headerName Current header text
 * @param newValue New value to validate
 * @returns True if the value is valid, false otherwise
 */
export function validateHeaderValue(
  headerName: string,
  newValue: string
): boolean {
  // For Year-Value format, validate that the value isn't empty
  if (isPartialEditFormat(headerName)) {
    return newValue.trim().length > 0;
  }

  // For regular headers, just check it's not empty
  return newValue.trim().length > 0;
}

export const customHeaderEditFormatter = (value: string): string => {
  let formatted = '';
  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);
    // Allow digits
    if (/\d/.test(char)) {
      formatted += char;
    }
    // Allow special characters: parentheses, brackets, hyphen
    else if ('()[]-'.includes(char)) {
      formatted += char;
    }
    // Allow space if the last character is not already a space
    else if (char === ' ') {
      if (!formatted.endsWith(' ')) {
        formatted += char;
      }
    }
    // Otherwise, skip the character
  }
  return formatted;
};
