export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
  pivot?: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface PageProps {
  auth: {
    user: User;
  };
  errors: Record<string, string>;
}
