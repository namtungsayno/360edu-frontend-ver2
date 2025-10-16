import { AuthProvider } from "context/app";

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
