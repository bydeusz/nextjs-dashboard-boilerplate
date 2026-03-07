export interface User {
  id: string;
  email: string;
  firstname: string | null;
  surname: string | null;
  role: string | null;
  password: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: Date | null;
  avatar: string | null;
}
