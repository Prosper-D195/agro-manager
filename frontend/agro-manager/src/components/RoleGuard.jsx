export function RoleGuard({ roles, user, children }) {
  if (!user) return null;
  if (!roles.includes(user.role)) return null;
  return children;
}