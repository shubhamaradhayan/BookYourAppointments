import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, Phone, UserRound } from "lucide-react";
import { useParams } from "react-router-dom";

import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import { apiGet, apiPost } from "../../api/client";

function PublicBooking() {
  const { slug } = useParams();

  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const minimumDate = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  useEffect(() => {
    async function loadPublicProfile() {
      try {
        const response = await apiGet(`public/${slug}`);

        if (!response.data?.success) {
          setError(response.data?.message || "Profile not found.");
          return;
        }

        setProfile(response.data.profile);
        setServices(response.data.services || []);

        if (response.data.services?.length) {
          setSelectedService(String(response.data.services[0].id));
        }
      } catch {
        setError("Unable to load this booking page.");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadPublicProfile();
  }, [slug]);

  useEffect(() => {
    if (!selectedService || !date) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }

    async function loadSlots() {
      setLoadingSlots(true);
      setError("");
      setSelectedSlot("");

      try {
        const response = await apiGet(`public/${slug}/slots`, {
          date,
          service_id: selectedService,
        });

        setSlots(response.data?.slots || []);
      } catch {
        setError("Unable to load available times.");
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [slug, selectedService, date]);

  function updateClient(event) {
    setClient({
      ...client,
      [event.target.name]: event.target.value,
    });
  }

  async function handleBooking(event) {
    event.preventDefault();

    if (!selectedSlot) {
      setError("Please select an available time.");
      return;
    }

    setBooking(true);
    setError("");
    setSuccess(null);

    try {
      const response = await apiPost(`public/${slug}/book`, {
        service_id: selectedService,
        appointment_date: date,
        start_time: selectedSlot,
        client_name: client.name,
        client_email: client.email,
        client_phone: client.phone,
        client_notes: client.notes,
      });

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to book appointment.");
        return;
      }

      setSuccess(response.data);
      setSelectedSlot("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to complete the booking."
      );
    } finally {
      setBooking(false);
    }
  }

  if (loadingProfile) {
    return <div className="page-loader">Loading profile...</div>;
  }

  if (error && !profile) {
    return (
      <div className="public-page">
        <div className="public-error">
          <h1>Profile unavailable</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-page">
      <div className="public-container">
        {/* <header className="public-header">
          <div className="brand">
            <div className="brand-mark">B</div>
            <div>
              <strong>BookFlow</strong>
              <span>Appointment booking</span>
            </div>
          </div>
        </header> */}

        <div className="booking-layout">
          <section className="professional-card">
            <div className="professional-cover">
              <span>BookYourAppointments</span>
            </div>

            <div className="professional-main">
              <div className="large-profile-photo">
                {profile.profile_photo ? (
                  <img
                    src={'http://localhost/'+profile.profile_photo}
                    alt={profile.display_name || "Professional"}
                  />
                ) : (
                  profile.name?.charAt(0)?.toUpperCase() ||
                  profile.business_name?.charAt(0)?.toUpperCase() ||
                  "P"
                )}
              </div>

              <div className="professional-identity">
                <span className="verified-label">VERRIFIED PROFILE</span>

                <h1>
                  {profile.name || profile.business_name || "Professional"}
                </h1>

                {profile.profession && (
                  <p className="professional-role">{profile.profession}</p>
                )}

                {profile.business_name && (
                  <p className="professional-business">
                    {profile.business_name}
                  </p>
                )}
              </div>
            </div>

            {profile.bio && (
              <div className="professional-about">
                <h3>About</h3>
                <p className="profile-bio">{profile.bio}</p>
              </div>
            )}

            <div className="profile-details">
              {profile.address && (
                <span>
                  <MapPin size={17} />
                  {profile.address}
                </span>
              )}

              {profile.phone && (
                <span>
                  <Phone size={17} />
                  {profile.phone}
                </span>
              )}
            </div>
          </section>

          <section className="booking-card">
            <div className="booking-heading">
              <p className="eyebrow">Book an appointment</p>
              {/* <h2>Choose a time that works for you</h2> */}
            </div>

            {success ? (
              <div className="booking-success">
                <CalendarDays size={36} />
                <h2>Appointment booked</h2>
                <p>
                  Your appointment request has been successfully created.
                </p>

                {success.google_calendar_url && (
                  <a
                    className="button button-primary"
                    href={success.google_calendar_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Add to Google Calendar
                  </a>
                )}

                <button
                  className="text-button"
                  // onClick={() => setSuccess(null)}
                  onClick={() => window.location.reload()}
                >
                  Book another appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="form-stack">
                {error && <div className="alert alert-error">{error}</div>}

                <label className="field">
                  <span className="field-label">Service</span>
                  <select
                    className="input"
                    value={selectedService}
                    onChange={(event) =>
                      setSelectedService(event.target.value)
                    }
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} · {service.duration_minutes} min
                        {service.price ? ` · ₹${service.price}` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <Field
                  label="Date"
                  name="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />

                <div>
                  <span className="field-label">Available times</span>

                  {!date || !selectedService ? (
                    <div className="slot-message">
                      Select a service and date to see available times.
                    </div>
                  ) : loadingSlots ? (
                    <div className="slot-message">Loading available times...</div>
                  ) : slots.length === 0 ? (
                    <div className="slot-message">
                      No available times for this date.
                    </div>
                  ) : (
                    <div className="slot-grid">
                      {slots.map((slot) => (
                        <button
                          type="button"
                          key={slot.start_time}
                          className={`slot-button ${
                            selectedSlot === slot.start_time ? "selected" : ""
                          }`}
                          onClick={() => setSelectedSlot(slot.start_time)}
                        >
                          <Clock3 size={15} />
                          {slot.start_time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="divider" />

                <div className="booking-section-title">
                  <h3>Your details</h3>
                  <span>We will use these details for your appointment confirmation.</span>
                </div>

                <div className="form-grid">
                  <Field
                    label="Your name"
                    name="name"
                    value={client.name}
                    onChange={updateClient}
                    placeholder="Your full name"
                    required
                  />

                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={client.email}
                    onChange={updateClient}
                    placeholder="you@example.com"
                    required
                  />

                  <Field
                    label="Phone"
                    name="phone"
                    value={client.phone}
                    onChange={updateClient}
                    placeholder="9876543210"
                    required
                  />
                  
                  <Field
                    label="Notes"
                    name="notes"
                    value={client.notes}
                    onChange={updateClient}
                    placeholder="write your notes"
                    required
                  />

                  <div className="form-grid-full">
                    <Button type="submit" loading={booking} disabled={!selectedSlot}>
                      <UserRound size={17} />
                      Confirm appointment
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default PublicBooking;
