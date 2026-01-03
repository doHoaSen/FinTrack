import { Outlet } from "react-router-dom";
import Header from "../components/dashboard/layout/Header";

function ProtectedLayout() {
  return (
    <div>
      <Header />
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedLayout;
