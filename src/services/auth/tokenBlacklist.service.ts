import prisma from "../../prisma";

/**
 * Add a token to the blacklist
 * @param token - The JWT token to blacklist
 * @param expiresAt - The expiration date of the token
 */
export const addTokenToBlacklist = async (
  token: string,
  expiresAt: Date
): Promise<void> => {
  await prisma.tokenBlacklist.create({
    data: {
      token,
      expiresAt,
    },
  });
};

/**
 * Check if a token is blacklisted
 * @param token - The JWT token to check
 * @returns true if the token is blacklisted, false otherwise
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const blacklistedToken = await prisma.tokenBlacklist.findUnique({
    where: { token },
  });

  return !!blacklistedToken;
};

/**
 * Clean up expired tokens from the blacklist
 */
export const cleanupExpiredTokens = async (): Promise<void> => {
  await prisma.tokenBlacklist.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
};
