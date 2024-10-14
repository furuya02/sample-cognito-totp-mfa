import { fetchAuthSession, JWT } from "aws-amplify/auth";

// IdTokenからメールアドレスを取得する
export function getEmail(idToken: JWT): string {
  return idToken.payload["email"]?.toString() ?? "";
}

// IdTokenからユーザー名を取得する
export function getUserName(idToken: JWT): string {
  return idToken.payload["sub"]?.toString() ?? "";
}

// IdTokenから失効日時を取得する
export function getExpirationTime(idToken: JWT): string {
  return new Date((idToken.payload["exp"] ?? 0) * 1000).toString();
}

export async function getAccessToken(): Promise<JWT | undefined> {
  const session = await fetchAuthSession();
  if (session && session.tokens && session.tokens.accessToken) {
    return session.tokens.accessToken;
  }
  return undefined;
}

export async function getIdToken(): Promise<JWT | undefined> {
  const session = await fetchAuthSession();
  if (session && session.tokens && session.tokens.idToken) {
    return session.tokens.idToken;
  }
  return undefined;
}
