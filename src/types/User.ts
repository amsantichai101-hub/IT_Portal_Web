export interface User {
  name: string;
  email: string;
  displayName: string;
  initialFullName: string;
}

export interface Permission {
  isPRAdmin: boolean | false,
  isPRiSolution: boolean | false,
  isSystemConfig: boolean | false
}

export interface UserData {
  user: User;
  permission: Permission
}
