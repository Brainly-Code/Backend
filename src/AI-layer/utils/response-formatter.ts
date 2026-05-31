/**
 * Utility functions to format AI responses before sending to the UI
 */

/**
 * Formats the AI response text for better display in the UI
 * Handles code blocks, markdown, spacing, and structure
 */
export function formatAiResponse(response: string): string {
  if (!response || typeof response !== 'string') {
    return response || '';
  }

  let formatted = response;

  // 1. Normalize line breaks (ensure consistent \n)
  formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Clean up excessive whitespace (more than 2 consecutive newlines)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // 3. Ensure proper spacing around code blocks
  formatted = formatted.replace(/([^\n])\n```/g, '$1\n\n```');
  formatted = formatted.replace(/```\n([^\n])/g, '```\n\n$1');

  // 4. Ensure proper spacing around headers (if using markdown)
  formatted = formatted.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
  formatted = formatted.replace(/(#{1,6}[^\n]+)\n([^\n#])/g, '$1\n\n$2');

  // 5. Ensure proper spacing around lists
  formatted = formatted.replace(/([^\n])\n([-*+]\s|\d+\.\s)/g, '$1\n\n$2');
  formatted = formatted.replace(/([-*+]\s[^\n]+|\d+\.\s[^\n]+)\n([^-*+\d\n])/g, '$1\n\n$2');

  // 6. Trim whitespace at the beginning and end
  formatted = formatted.trim();

  // 7. Ensure proper spacing after sentences (optional - can be customized)
  // This helps with readability in chat format
  formatted = formatted.replace(/([.!?])\s*([A-Z])/g, '$1 $2');

  return formatted;
}

/**
 * Formats code blocks with consistent spacing
 */
export function formatCodeBlocks(response: string): string {
  if (!response || typeof response !== 'string') {
    return response || '';
  }

  let formatted = response;

  // Ensure code blocks have proper spacing around them
  formatted = formatted.replace(/([^\n])\n```(\w*)/g, '$1\n\n```$2');
  formatted = formatted.replace(/```(\w*)\n([^\n])/g, '```$1\n\n$2');

  return formatted;
}

/**
 * Removes unnecessary markdown artifacts that might not render well
 * or converts them to plain text equivalents
 */
export function cleanMarkdown(response: string): string {
  if (!response || typeof response !== 'string') {
    return response || '';
  }

  let formatted = response;

  // Keep markdown but ensure proper formatting
  // If you want to remove markdown entirely, uncomment these:
  // formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '$1'); // Bold
  // formatted = formatted.replace(/\*([^*]+)\*/g, '$1'); // Italic
  // formatted = formatted.replace(/#{1,6}\s+(.+)/g, '$1'); // Headers

  return formatted;
}

/**
 * Main formatting function - applies all formatting rules
 */
export function formatResponseForUI(response: string): string {
  if (!response || typeof response !== 'string') {
    return response || '';
  }

  let formatted = response;

  // Apply all formatting steps
  formatted = formatAiResponse(formatted);
  formatted = formatCodeBlocks(formatted);
  formatted = cleanMarkdown(formatted);

  return formatted;
}

