import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  RiDashboardLine, 
  RiImageLine, 
  RiCalendarEventLine, 
  RiLogoutBoxRLine,
  RiArrowLeftSLine,
  RiUserSettingsLine,
  RiTicketLine,
  RiLineChartLine,
  RiArticleLine,
  RiFolderVideoLine,
  RiMailSendLine,
  RiRobot2Line,
  RiMoneyDollarCircleLine
} from 'react-icons/ri';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <RiDashboardLine /> },
    { name: 'Manage Gallery', path: '/admin/gallery', icon: <RiImageLine /> },
    { name: 'Media Library', path: '/admin/assets', icon: <RiFolderVideoLine /> },
    { name: 'Manage Events', path: '/admin/events', icon: <RiCalendarEventLine /> },
    { name: 'Manage Users', path: '/admin/users', icon: <RiUserSettingsLine /> },
    { name: 'Manage Results & News', path: '/admin/news', icon: <RiArticleLine /> },
    { name: 'Manage Coupons', path: '/admin/coupons', icon: <RiTicketLine /> },
    { name: 'Daily Report', path: '/admin/report', icon: <RiLineChartLine /> },
    { name: 'Inquiries', path: '/admin/inquiries', icon: <RiMailSendLine /> },
    { name: 'AI Chatbot', path: '/admin/chatbot', icon: <RiRobot2Line /> },
    { name: 'Registration Settings', path: '/admin/registration', icon: <RiMoneyDollarCircleLine /> },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col p-6">
        {/* Sidebar Header */}
        <div className="mb-10 flex items-center gap-3 px-2 flex-shrink-0">
          <div className="rounded-lg bg-blue-600 p-2 text-white">
            <RiDashboardLine size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Admin CMS</h2>
        </div>
        
        {/* Scrollable Navigation Area */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-gray-100 flex-shrink-0 mt-auto">
          <button
            onClick={() => navigate('/')}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl transition-all"
          >
            <RiArrowLeftSLine className="text-lg" />
            Back to Website
          </button>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <RiLogoutBoxRLine className="text-lg" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
