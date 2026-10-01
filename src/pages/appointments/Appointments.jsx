import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, XCircle, CircleX, CircleCheckBig, MoveDiagonal } from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import Card from "../../components/ui/Card";
import { apiGet } from "../../api/client";
import Modal from "../../components/ui/Modal";
function Appointments() {
  const getTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState(getTodayDate());
  const [todayAppointmentCount, setTodayAppointmentCount] = useState(0)
  const [confirmedAppointmentsCount, setConfirmedAppointmentsCount] = useState(0)
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0)
  const [cancelledAppointmentsCount, setCancelledAppointmentsCount] = useState(0)
  const [checkupDoneCount, setCheckupDoneCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [id, setId] = useState();
  const [renderBy, setRenderBy] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  async function loadAppointments(date, pageNum, limitNum) {
    setLoading(true);
    try {
      const response = await apiGet("appointments", {
        date: selectedDate,
        page: pageNum,
        limit: limitNum,
        id: id,
        name: name,
        phone: phone,
        status: status
      });
      console.log(response.data);

      setAppointments(response.data?.appointments || []);
      setTodayAppointmentCount(response.data?.today_appointment || 0)
      setConfirmedAppointmentsCount(response.data?.confirmed_appointments || 0)
      setCheckupDoneCount(response.data?.completed_appointments || 0)
      setPendingAppointmentsCount(response.data?.pending_appointments || 0)
      setCancelledAppointmentsCount(response.data?.cancelled_appointments || 0)
      setTotalPages(response.data?.total_pages || 1)
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  // Automatically trigger fetch whenever date, page, or limit changes
  useEffect(() => {
    loadAppointments(selectedDate, page, limit);
  }, [selectedDate, page, limit, id, name, phone, status, renderBy]);


  //   // Automatically trigger fetch whenever date, page, or limit changes
  // useEffect(() => {
  //   loadAppointments(selectedDate, 1, limit);
  // }, [selectedDate, limit, id, name, phone, status]);

  // // Automatically trigger fetch whenever date, page, or limit changes
  // useEffect(() => {
  //   loadAppointments(selectedDate, page, limit);
  // }, [page, renderBy]);


  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setAppointmentDate(e.target.value);
    setPage(1); // Reset to page 1 when changing dates
  };

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

  const handleCancelAppointment = async (id) => {
    let result = confirm("Are you sure to Cancel this Appointment ?")
    // console.log(result, id);
    if (result) {
      try {
        const response = await apiGet("cancel-appointment", {
          appointment_id: id
        });
        if (response.data.message) {
          alert(response.data.message)
          setRenderBy("handleCancelAppointment")
        } else {
          alert("There is some error. Please try after Some time")
        }
      } catch (err) {
        console.error(err);

        // setAppointments([]);
      } finally {
        // setLoading(false);
      }
    }

  }

  const handleCheckUpDone = async (id) => {
    let result = confirm("Are you sure to Mark as done for this Appointment ?")
    // console.log(result, id);
    if (result) {
      try {
        const response = await apiGet("mark-as-done", {
          appointment_id: id
        });
        if (response.data.message) {
          alert(response.data.message)
          setRenderBy("handleCheckUpDone")
        } else {
          alert("There is some error. Please try after Some time")
        }
      } catch (err) {
        console.error(err);

        // setAppointments([]);
      } finally {
        // setLoading(false);
      }
    }

  }

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          {/* <p className="eyebrow">Overview</p> */}
          <h1>Appointments : <small>{appointmentDate}</small></h1>

          <p>Keep track of your upcoming bookings and calendar connection.</p>
        </div>

        <div className="status-pill">
          <span className="status-dot" />
          {/*Google Calendar {calendarConnected ? "connected" : "not connected"} */}
          Date : <input type="date" name="date" id="date" onChange={handleDateChange} />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={CalendarDays}
          label="Today's appointments"
          value={todayAppointmentCount}
        />
        <StatCard
          icon={CheckCircle2}
          label="Confirmed"
          value={confirmedAppointmentsCount}
        />
        {/* <StatCard
          icon={Clock3}
          label="Pending"
          value={pendingAppointmentsCount}
        /> */}
        <StatCard
          icon={Clock3}
          label="Checkup-Done"
          value={checkupDoneCount}
        />
        <StatCard
          icon={XCircle}
          label="Cancelled"
          value={cancelledAppointmentsCount}
        />
      </div>

      <Card
        title="Recent appointments"
        description="Your latest client bookings."
      >
        <div className="table-wrapper" style={{ marginTop: -20 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID <br /><input type="text" placeholder="Search by ID" value={id} onChange={(e) => {setPage(1); setId(e.target.value)}} style={{ maxWidth: 80 }} className="border px-1" /></th>
                <th>Client <br /><input type="text" placeholder="Search by Name" value={name} onChange={(e) => {setPage(1); setName(e.target.value)}} className="border px-1" /></th>
                <th>Phone No. <br /> <input type="text" placeholder="Search by Phone" value={phone} onChange={(e) => {setPage(1); setPhone(e.target.value)}} className="border px-1" style={{ maxWidth: 120 }} /> </th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status <br />
                  <select name="checkupStatus" id="" className="border px-1" value={status} onChange={(e) => {setPage(1); setStatus(e.target.value)}}>
                    <option value="">All</option>
                    <option value="completed">CheckUp Done({checkupDoneCount})</option>
                    <option value="confirmed">Confirmed({confirmedAppointmentsCount})</option>
                    <option value="pending">Pending({pendingAppointmentsCount})</option>
                    <option value="cancelled">Cancelled({cancelledAppointmentsCount})</option>
                  </select></th>
                <th>Actions</th>
              </tr>
            </thead>

            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state ">Loading appointments...</div>
                  </td>
                </tr>

              </tbody>
            ) : appointments.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={8}>

                    <div className="empty-state " >
                      <CalendarDays size={28} />
                      <strong>No appointments yet</strong>
                      <span>New bookings will appear here.</span>
                    </div>
                  </td>
                </tr>

              </tbody>
            ) : (

              <tbody>
                {appointments.map((appointment) => (

                  <tr onClick={() => { setIsModalOpen(true); setClientNotes({ id: appointment.id, notes: appointment.notes }) }} key={appointment.id} style={{ backgroundColor: appointment.status == "cancelled" ? "purple" : appointment.status == "completed" ? "yellow" : "" }}>
                    <td>
                      <strong><i>{appointment.id}</i></strong>
                    </td>
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
                    <td>
                      <span className={`badge badge-pending`} style={{ cursor: appointment.status == "cancelled" || appointment.status == "completed" ? "" : "pointer" }}>
                        <CircleX onClick={() => {
                          if (appointment.status !== "cancelled" && appointment.status !== "completed") {
                            handleCancelAppointment(appointment.id);
                          }
                        }} />
                      </span>
                      &nbsp;
                      <span className={`badge badge-confirmed`} style={{ cursor: appointment.status == "cancelled" || appointment.status == "completed" ? "" : "pointer" }}>
                        <CircleCheckBig onClick={() => {
                          if (appointment.status !== "cancelled" && appointment.status !== "completed") {
                            handleCheckUpDone(appointment.id);
                          }
                        }} />
                      </span>
                      {/* <strong><button className={`badge`} style={{backgroundColor:"red"}}>
                        Cancel
                      </button></strong>
                      <br />
                      <strong><button className={`badge badge-${appointment.status}`}>
                        Checkup-done
                      </button></strong> */}


                    </td>

                  </tr>


                  // <tr>
                  //   <td>1</td>
                  //   <td>1</td>
                  //   <td>1</td>
                  //   <td>1</td>
                  //   <td>1</td>
                  //   <td>1</td>
                  //   <td>1</td>
                  //   <td>1</td>

                  // </tr>
                ))}
              </tbody>
            )}
          </table>
          <Modal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setClientNotes("") }}
            title={`Appointment ID: ${clientNotes?.id || ''} Client-Notes`}
          >
            <p className="text-gray-600 mb-4">
              {clientNotes.notes !== "" ? clientNotes.notes : "There is no any notes left by the client"}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setIsModalOpen(false); setClientNotes("") }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              {/* <button
                          onClick={() => {
                            // Yahan apna action/API call likhein
                            alert("Action Confirmed!");
                            setIsModalOpen(false);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Confirm
                        </button> */}
            </div>
          </Modal>

        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 dark:bg-gray-900">
  {/* Page info */}
  <div className="text-sm text-gray-600 dark:text-gray-400">
    Page{" "}
    <span className="font-semibold text-gray-900 dark:text-white">
      {page}
    </span>{" "}
    of{" "}
    <span className="font-semibold text-gray-900 dark:text-white">
      {totalPages}
    </span>
  </div>

  <div className="flex flex-wrap items-center justify-center gap-2">
    {/* Previous */}
    <button
      disabled={page === 1}
      onClick={() => setPage((prev) => prev - 1)}
      className="group inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-x-0.5 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
    >
      <svg
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>

      <span className="hidden sm:inline">Previous</span>
    </button>

    {/* Page numbers */}
    <div className="flex items-center gap-1">
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`min-w-[38px] rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              page === pageNumber
                ? "scale-105 bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                : "border border-gray-300 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>

    {/* Next */}
    <button
      disabled={page >= totalPages}
      onClick={() => setPage((prev) => prev + 1)}
      className="group inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:translate-x-0.5 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
    >
      <span className="hidden sm:inline">Next</span>

      <svg
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
</div>


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

export default Appointments;
