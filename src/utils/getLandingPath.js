// Chọn trang mặc định sau khi đăng nhập / khi bấm "Trang chủ"
export default function getLandingPath(user) {
  const roles = user?.roles || [];
  if (roles.includes("ROLE_ADMIN")) return "/admin/dashboard";
  if (roles.includes("ROLE_TEACHER")) return "/classes"; // hoặc `/teachers/${user?.id}/profile`
  return "/home"; // fallback nếu sau này có role khác (học viên/phụ huynh)
}
