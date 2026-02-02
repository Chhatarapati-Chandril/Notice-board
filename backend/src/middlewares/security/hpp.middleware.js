import hpp from "hpp";

export const hppProtection = hpp({
  whitelist: [
    // Only allow arrays where it makes sense
    "tags",
    "categories",
    "roles",
  ],
});
