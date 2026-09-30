import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function DashboardLayout() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="dashboard-body">
        <Sidebar />

        <div className="content-wrapper">
          <main className="main-content">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}