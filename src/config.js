export const CONFIG = {
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_PROJECT_ID || 'your-project-id',
  location: process.env.GOOGLE_LOCATION || 'us-central1',
  modelName: process.env.GOOGLE_MODEL || 'gemini-1.5-pro-latest',
  fastModelName: process.env.GOOGLE_FAST_MODEL || 'gemini-1.5-flash-latest',
  maxTokens: 8192,
  temperature: 0.2,
  scratchpadTokens: 4000, // Default thinking tokens
};

// Validate required config
if (!CONFIG.credentials) {
  console.warn('Warning: GOOGLE_APPLICATION_CREDENTIALS not set');
}
if (CONFIG.projectId === 'your-project-id') {
  console.warn('Warning: GOOGLE_PROJECT_ID not set');
}
