export const ENVIRONMENT = process.env.APP_ENV || "dev";
export const IS_PRODUCTION = ENVIRONMENT === "production";
export const APP_PORT = Number(process.env.APP_PORT) || 3000;
export const APP_PREFIX_PATH = process.env.APP_PREFIX_PATH || "/";
export const DB_URI =
  process.env.DB_URI ||
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.nlxbj.mongodb.net/?retryWrites=true&w=majority`;
export const DB = {
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_USER_PWD,
};
