export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthSuccessData {
  token: string;
  user: UserProfileResponse;
}
