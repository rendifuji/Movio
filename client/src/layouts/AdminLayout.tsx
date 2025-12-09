import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full p-4 border-b border-gray-200 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        </div>
      </header>

      <main className="flex-1 p-6 container mx-auto">
        <Outlet />
      </main>

      <footer className="w-full p-4 border-t border-gray-200 bg-white">
        <div className="container mx-auto">
          <small className="text-sm text-gray-600">Admin • Movio</small>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
