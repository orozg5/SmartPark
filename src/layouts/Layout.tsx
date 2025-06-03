import { Outlet } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";

export function Layout() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="p-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
