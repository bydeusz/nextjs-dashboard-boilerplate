import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

type TranslationObject = {
  [key: string]: TranslationObject | string;
};

// Function to recursively get all JSON files in a directory
function getJsonFiles(dir: string): string[] {
  const files: string[] = [];
  
  readdirSync(dir).forEach(file => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      files.push(...getJsonFiles(fullPath));
    } else if (file.endsWith('.json')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

// Function to convert file path to namespace
function filePathToNamespace(filePath: string, basePath: string): string {
  const relativePath = filePath
    .replace(basePath, '')
    .replace(/^\//, '')
    .replace(/\.json$/, '');
  return relativePath;
}

// Function to merge translation objects
function mergeDeep(target: TranslationObject, source: TranslationObject): TranslationObject {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(
            target[key] as TranslationObject,
            source[key] as TranslationObject
          );
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: unknown): item is TranslationObject {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

// Main function to load all translations
export async function loadTranslations(locale: string): Promise<TranslationObject> {
  const translationsDir = join(process.cwd(), 'translations', locale);
  const files = getJsonFiles(translationsDir);
  
  const messages: TranslationObject = {};
  
  for (const file of files) {
    const namespace = filePathToNamespace(file, translationsDir);
    const content = JSON.parse(readFileSync(file, 'utf-8'));
    
    // Handle nested namespaces
    const parts = namespace.split('/');
    let current = messages;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = current[parts[i]] || {};
      current = current[parts[i]] as TranslationObject;
    }
    
    const lastPart = parts[parts.length - 1];
    current[lastPart] = mergeDeep(
      (current[lastPart] || {}) as TranslationObject,
      content
    );
  }
  
  return messages;
} 