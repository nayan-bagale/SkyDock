export interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  email?: string;
  name?: string;
  id: string;
}
