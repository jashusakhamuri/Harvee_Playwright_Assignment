import fs from 'node:fs';
import path from 'node:path';

export function loadProperties(
  relativePath: string,
): Record<string, string> {
  const filePath = path.resolve(process.cwd(), relativePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Properties file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const result: Record<string, string> = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (
      !trimmedLine ||
      trimmedLine.startsWith('#') ||
      trimmedLine.startsWith('!')
    ) {
      continue;
    }

    const separatorIndex = trimmedLine.search(/[=:]/);

    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    result[key] = value;
  }

  return result;
}