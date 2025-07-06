import { Outlet } from "react-router-dom";
import MainSidebar from "../../components/organisms/Sidebar/MainSidebar";

export default function WorkspaceLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-0 left-0 h-screen w-20 bg-[#F6F1FE]">
        <MainSidebar />
      </aside>
      <main className="flex-1 h-screen overflow-y-auto ml-20 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
