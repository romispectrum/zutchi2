// server-only helpers: DO NOT import this file from client components/pages
import type { NextApiRequest, NextApiResponse } from "next";
import type { AuthTokenClaims } from "@privy-io/server-auth";
import { PrivyClient } from "@privy-io/server-auth";

export type APIError = {
  error: string;
  cause?: string;
};

export const createPrivyClient = () => {
  return new PrivyClient(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
    process.env.PRIVY_APP_SECRET as string,
    {
      walletApi: {
        authorizationPrivateKey: process.env.SESSION_SIGNER_SECRET,
      },
    }
  );
};

export const fetchAndVerifyAuthorization = async (
  req: NextApiRequest,
  res: NextApiResponse,
  client: PrivyClient
): Promise<AuthTokenClaims | void> => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Missing auth token." });
  }
  const authToken = header.replace(/^Bearer /, "");
  try {
    return await client.verifyAuthToken(authToken);
  } catch (err: unknown) {
    const cause = err instanceof Error ? err.message : undefined;
    return res.status(401).json({ error: "Invalid auth token.", cause });
  }
};
