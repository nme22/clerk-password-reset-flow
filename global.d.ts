export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      requirePassReset?: boolean;
    };
  }
}
