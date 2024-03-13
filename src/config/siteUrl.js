export const siteUrl =
  process.env.NODE_ENV === "http://localhost:3000"
    ? process.env.NEXT_PUBLIC_APP_URL_DEV
    : process.env.NEXT_PUBLIC_APP_URL_PROD;
