const API_BASE_URL = "http://localhost:4000";

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    name: string | null;
  };
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  name: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * Đăng nhập người dùng
 * @param credentials - Email và password
 * @returns Thông tin user và token
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  return data;
}

/**
 * Đăng ký người dùng mới
 * @param userData - Email, password và name
 * @returns Thông tin user đã tạo
 */
export async function register(
  userData: RegisterRequest
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }

  return data;
}
