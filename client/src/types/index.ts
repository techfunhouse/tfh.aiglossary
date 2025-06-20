export interface User {
  id: number;
  username: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Term {
  id: number;
  term: string;
  category: string;
  aliases?: string[] | null;
  definition: string;
  related?: string[] | null;
  tags?: string[] | null;
  references?: string[] | null;
  learningpaths?: { [key: string]: number } | null;
}

export interface CreateTermRequest {
  term: string;
  category: string;
  aliases?: string[];
  definition: string;
  related?: string[];
  tags?: string[];
  references?: string[];
}

export interface UpdateTermRequest extends CreateTermRequest {
  id: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}
