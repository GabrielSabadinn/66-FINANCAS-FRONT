import jwt_decode from "jwt-decode";

interface JwtPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

type JwtDecodeFunction = <T = unknown>(token: string) => T;

// Use in login and validateToken
const decoded: JwtPayload = (jwt_decode as JwtDecodeFunction)(accessToken);
