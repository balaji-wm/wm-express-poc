import { defineConfig, CookieSessionStorage } from "@shopify/hydrogen/config";

export default defineConfig({
  shopify: {
    defaultCountryCode: "IN",
    defaultLanguageCode: "EN",
    storeDomain: "whoemarktech.myshopify.com",
    storefrontToken: "d4d26a825013b35dbd84c694bc7665fd",
    storefrontApiVersion: "2022-07",
  },
  session: CookieSessionStorage("__session", {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "Strict",
    maxAge: 60 * 60 * 24 * 30,
  }),
});
