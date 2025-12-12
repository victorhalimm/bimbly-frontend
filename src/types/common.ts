export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  current?: boolean;
  badge?: {
    text: string;
    type: 'success' | 'warning' | 'error' | 'info';
  };
}

export interface HeaderUser {
  name: string;
  email?: string;
  avatar?: string;
  role: 'student' | 'tutor' | 'admin';
}

export interface SidebarUser {
  name: string;
  role: 'student' | 'tutor' | 'admin';
  avatar?: string;
}
