import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          enum: ["ADMIN", "USER"],
        },
        phone: {
          type: "string",
        },
        kyc_verified: {
          type: "boolean",
        },
      },
    }),
  ],
  baseURL: "https://api.resonantfinance.org",
  fetchOptions: {
    credentials: "include",
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        console.log(`Too fast!. Retry after ${retryAfter} seconds`);
      }
    },
  },
});
