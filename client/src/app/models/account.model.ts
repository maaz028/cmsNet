
export interface Account {
  id?: string;
  email: string;
  password?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  profilePhoto?: string;
  invalidCredentials?: boolean;
}

