export interface ICurrentUser {
  email: string;
  sub: number;
  iat: number;
  exp: number;
  refreshToken: string;
}
