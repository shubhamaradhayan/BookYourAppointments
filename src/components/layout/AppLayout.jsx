import { CalendarDays, Clock3, LayoutDashboard, LogOut, UserRound, Wrench, } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   label: "Appointments",
  //   path: "/appointments",
  //   icon: LayoutDashboard,
  // },
  {
    label: "Services",
    path: "/services",
    icon: Wrench,
  },
  {
    label: "Availability",
    path: "/availability",
    icon: Clock3,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
];

function AppLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          {/* <div className="brand-mark">B</div> */}
          <div>
            {/* <strong>BookYour</strong> */}
            <strong>BookYourAppointments</strong>
            {/* <span>Appointments</span> */}
            {/* <strong>BookFlow</strong>
            <span>Appointment SaaS</span> */}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <strong>{user?.name || "Professional"}</strong>
              <span>{user?.email || ""}</span>
            </div>
          </div>

          <button className="logout-button" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="mobile-topbar">
          <div className="brand">
            <div className="brand-mark">B</div>
            <div>
              <strong>BookYourAppointments</strong>
              {/* <span>Appointment SaaS</span> */}
              {/* <strong>BookFlow</strong>
              <span>Appointment SaaS</span> */}
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

export default AppLayout;
