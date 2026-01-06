export type UserRole = "admin" | "member";

export interface DbUser {
  id: string;
  fullname: string;
  email: string;
  password?: string;
  role: string;
  image?: string | null;
}

export interface GoogleLoginInput {
  fullname: string | null;
  email: string | null;
  image: string | null;
  type: string;
}
