// Button, Input, Text, Badge, Switch, Dialog, Pagination, Table, Utils, Card...
export * from "./button";
export * from "./card";
export * from "./input";
export * from "./badge";
export * from "./label";
export * from "./switch";
export * from "./textarea";
export * from "./dialog";
export * from "./pagination";
export * from "./table";
export * from "./utils";

// 👉 Export Sidebar (bạn vừa tạo)
export { default as Sidebar } from "./Sidebar";

// 👉 Alias để tương thích code cũ đang dùng THead/TBody/TR/TH/TD
//    (map từ tên chuẩn shadcn sang tên cũ)
export {
  Table as BaseTable,
  TableHeader as THead,
  TableBody as TBody,
  TableRow as TR,
  TableHead as TH,
  TableCell as TD,
} from "./table";
