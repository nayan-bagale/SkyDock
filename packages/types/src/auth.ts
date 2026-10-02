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

export interface PKCELoginBody {
  email: string;
  password: string;
  code_challenge: string;
  code_challenge_method: string;
}

export interface PKCESessionBody {
  code_challenge: string;
  code_challenge_method: string;
}

export interface PKCEExchangeBody {
  code: string;
  code_verifier: string;
  redirect_uri?: string;
}

export interface PKCERefreshBody {
  refresh_token: string;
}
export interface LoginResponse {
  email?: string;
  name?: string;
  id: string;
}

export interface UserInfo {
  email: string;
  name: string;
  id: string;
  picture: string | null;
  authMethod: string;
  usedStorage: number;
  verified: boolean;
  plan: {
    name: string;
    storageLimit: number;
    startDate: string;
    endDate: string;
  };
}
