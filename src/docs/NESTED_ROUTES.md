# Nested Routes Configuration

## Cấu trúc Nested Routes đã được thiết lập

### 1. MainLayout Component
- **File**: `src/components/layout/MainLayout.jsx`
- **Chức năng**: Layout chính với sidebar và header cố định
- **Sử dụng**: `<Outlet />` để render nested routes

### 2. HomePage Component  
- **File**: `src/pages/home/HomePage.jsx`
- **Chức năng**: Wrapper component sử dụng MainLayout
- **Sử dụng**: `<Outlet />` để render content

### 3. Dashboard Component
- **File**: `src/pages/dashboard/Dashboard.jsx`
- **Chức năng**: Trang dashboard chính với thống kê
- **Route**: `/home` (default) và `/home/dashboard`

### 4. Router Configuration
- **File**: `src/router/index.jsx`
- **Cấu trúc**:
  ```jsx
  <Route path="/home" element={<HomePage />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
  </Route>
  
  <Route path="/subjects/*" element={<HomePage />}>
    <Route path="*" element={<SubjectRoutes />} />
  </Route>
  ```

### 5. Sidebar Navigation
- **File**: `src/components/common/Sidebar.jsx`
- **Chức năng**: Navigation với active state detection
- **Sử dụng**: `useLocation()` để detect active route

## Cách hoạt động

1. **Layout cố định**: Sidebar và header luôn hiển thị
2. **Content động**: Phần content thay đổi theo route
3. **Nested routing**: Các route con được render trong `<Outlet />`
4. **Active state**: Sidebar tự động highlight route hiện tại

## Routes hiện có

- `/home` → Dashboard (default)
- `/home/dashboard` → Dashboard
- `/home/subject` → SubjectManagement (với layout)
- `/users` → UserListPage (không có layout)
- `/courses` → CourseListPage (không có layout)
- `/classes` → ClassListPage (không có layout)

## Navigation Features

### React Router Navigation
- **Sidebar**: Sử dụng `Link` component thay vì `<a>` tags
- **No Page Reload**: Navigation không reload trang
- **Active State**: Tự động highlight route hiện tại
- **Nested Routes**: Content thay đổi mượt mà trong cùng layout

### Navigation Features
1. **Client-side Routing**: Không reload trang khi chuyển đổi
2. **Active State Detection**: Sidebar tự động highlight route hiện tại
3. **Layout Persistence**: Sidebar và header luôn hiển thị
4. **Fast Navigation**: Chuyển đổi content nhanh chóng

## Thêm route mới

Để thêm route mới với layout:

```jsx
<Route path="/new-feature/*" element={<HomePage />}>
  <Route path="*" element={<NewFeatureRoutes />} />
</Route>
```

Để thêm route mới không có layout:

```jsx
<Route path="/standalone" element={<StandalonePage />} />
```
