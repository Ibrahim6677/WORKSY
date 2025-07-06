import SettingSidebar from '../../components/organisms/Sidebar/SettingSidebar';
import { Outlet } from 'react-router-dom';

const SettingsLayout = () => {
  return (
    <div className="flex">
      <div className="fixed top-0 left-20 h-screen w-64 bg-white border-r shadow">
        <SettingSidebar />
      </div>
      <main className="ml-64 flex-1 h-screen overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;
