export const __DEV__ = process.env.NODE_ENV
  ? process.env.NODE_ENV == "development"
  : location.hostname == "localhost"
