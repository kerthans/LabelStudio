declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_APP_ENV: "development" | "production" | "staging";
    NEXT_PUBLIC_API_URL: string;
    API_SECRET_KEY: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
    NEXT_PUBLIC_DEBUG_MODE: "true" | "false";
    NEXT_PUBLIC_ENABLE_DEVTOOLS: "true" | "false";
    NEXT_PUBLIC_ENABLE_ANTI_DEBUG: "true" | "false";
    NEXT_PUBLIC_ENABLE_ANALYTICS: "true" | "false";
    NEXT_PUBLIC_ENABLE_ERROR_REPORTING: "true" | "false";
  }
}