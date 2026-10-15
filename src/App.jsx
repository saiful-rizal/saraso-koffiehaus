import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ShopProvider, useShop } from "./lib/store";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Pesan from "./pages/Pesan";
import Register from "./pages/Register";

function GuestOnly({ children }) {
  const { user } = useShop();
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AuthOnly({ children }) {
  const { user } = useShop();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0c0a09] text-[#f5e6d0]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <Login />
                </GuestOnly>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnly>
                  <Register />
                </GuestOnly>
              }
            />
            <Route
              path="/pesan"
              element={
                <AuthOnly>
                  <Pesan />
                </AuthOnly>
              }
            />
            <Route
              path="/order"
              element={
                <AuthOnly>
                  <Pesan />
                </AuthOnly>
              }
            />
            <Route
              path="/pesanan"
              element={
                <AuthOnly>
                  <Orders />
                </AuthOnly>
              }
            />
            <Route
              path="/orders"
              element={
                <AuthOnly>
                  <Orders />
                </AuthOnly>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}
