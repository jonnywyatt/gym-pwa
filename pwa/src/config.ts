/**
 * Application configuration
 * Reads environment variables and provides typed config throughout the app
 */

function getRequiredEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnv(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}

export const config = {
  apiUrl: getRequiredEnv('VITE_API_URL'),
  // Add more config values as needed
  // isDev: import.meta.env.DEV,
  // isProd: import.meta.env.PROD,
} as const;

export type Config = typeof config;
