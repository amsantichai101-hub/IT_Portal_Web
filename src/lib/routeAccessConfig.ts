import { Permission } from "@/types/User"

type PermissionKey = keyof Permission

export interface RequiredPath {
  path: string
  roles: PermissionKey[]
}

export const routeAccessConfig: RequiredPath[] = [
  { path: '/projectRequest/manageData', roles: ['isPRAdmin'] },
  { path: '/role', roles: ['isSystemConfig'] },
  { path: '/permission', roles: ['isSystemConfig'] },
]