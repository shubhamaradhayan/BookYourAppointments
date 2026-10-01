import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, XCircle, LinkIcon, ExternalLink } from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/ui/Card";
import { apiGet } from "../../api/client";
import { NavLink } from "react-router-dom";
function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const [appointmentsResponse, calendarResponse] = await Promise.all([
        apiGet("appointments"),
        apiGet("calendar/status"),
      ]);

      setAppointments(appointmentsResponse.data?.appointments || []);
      setCalendarConnected(Boolean(calendarResponse.data?.connected));
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const todayAppointments = appointments.filter(
    (appointment) => appointment.appointment_date === today
  );

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p>Keep track of your upcoming bookings and calendar connection.</p>
        </div>

        <div className="status-pill">
          <span className={calendarConnected ? "status-dot" : "status-dot muted"} />
          Google Calendar {calendarConnected ? "connected" : "not connected"}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={CalendarDays}
          label="Today's appointments"
          value={todayAppointments.length}
        />
        <StatCard
          icon={CheckCircle2}
          label="Confirmed"
          value={confirmedCount}
        />
        <StatCard
          icon={Clock3}
          label="Pending"
          value={pendingCount}
        />
        <StatCard
          icon={XCircle}
          label="Cancelled"
          value={appointments.filter((item) => item.status === "cancelled").length}
        />
      </div>

      <Card
        title="Recent appointments"
        description="Your latest client bookings."
        actions={
    <a 
      href="/appointments" 
      rel="noopener noreferrer"
      className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
    >
      View All &nbsp;
       <ExternalLink size={17} />
    </a>
  }
      >
        {loading ? (
          <div className="empty-state">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={28} />
            <strong>No appointments yet</strong>
            <span>New bookings will appear here.</span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Phone No.</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                                    
                  <tr key={appointment.id}>
                    <td>
                      <strong>{appointment.client_name}</strong>
                      <small>{appointment.client_email}</small>
                    </td>
                    <td>
                      <strong>{appointment.client_phone}</strong>
                      {/* <small>{appointment.email}</small> */}
                    </td>
                    <td>{appointment.service_name}</td>
                    <td>{appointment.appointment_date}</td>
                    <td>
                      {appointment.start_time} - {appointment.end_time}
                    </td>
                    <td>
                      <span className={`badge badge-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default Dashboard;
