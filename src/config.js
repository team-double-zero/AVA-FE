// src/config.js
const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

export const config = {
  isDevMode,
};
