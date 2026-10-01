import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, ExternalLink, Upload, User } from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Field from "../../components/ui/Field";
import { apiGet, apiPost, apiPut, uploadFile } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const initialProfile = {
  name: "",
  profession: "",
  business_name: "",
  phone: "",
  address: "",
  bio: "",
  slug: "",
  profile_photo: "",
};

function Profile() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(initialProfile);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [slugError, setSlugError] = useState("");
  const [slugColor, setSlugColor] = useState("");
  const [saving, setSaving] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (searchParams.get("calendar") === "connected") {
      setMessage("Google Calendar connected successfully.");
    }

    async function loadProfile() {
      try {
        const [profileResponse, calendarResponse] = await Promise.all([
          apiGet("profile"),
          apiGet("calendar/status"),
        ]);

        if (profileResponse.data?.profile) {
          setProfile({
            ...initialProfile,
            ...profileResponse.data.profile,
          });
        }

        setCalendarConnected(Boolean(calendarResponse.data?.connected));
      } catch {
        setError("Unable to load your profile.");
      }
    }

    loadProfile();
  }, [searchParams]);

async  function handleChange(event) {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.name);
    if (event.target.name === "slug") {
      try {
      const response = await apiGet("check-slug", {slug:event.target.value});
      if (!response.data?.success) {
        setSlugError(response.data?.message || "There is some error please try again");
        setSlugColor("red")
        return;
      }
      setSlugError(response.data?.exists?`${response.data.slug} is already taken.`:`${response.data.slug} is available.`)
      setSlugColor(response.data?.exists?`red`:`green`)
      // setSlugError("")
    } catch(err){
      setSlugError("")
      console.error(err)
    } 
    }
    
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await apiPut("profile", profile);

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to save profile.");
        return;
      }

      setProfile({
        ...profile,
        ...response.data.profile,
      });

      setMessage("Profile saved successfully.");
    } catch {
      setError("Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function connectGoogleCalendar() {
    setCalendarLoading(true);
    setError("");

    try {
      const response = await apiGet("calendar/connect");

      if (!response.data?.success) {
        setError(
          response.data?.message || "Unable to connect Google Calendar."
        );
        return;
      }

      window.location.href = response.data.authorization_url;
    } catch {
      setError("Unable to start Google Calendar connection.");
      setCalendarLoading(false);
    }
  }

  async function disconnectGoogleCalendar() {
    setCalendarLoading(true);
    setError("");

    try {
      const response = await apiPost("calendar/disconnect");

      if (!response.data?.success) {
        setError(
          response.data?.message || "Unable to disconnect Google Calendar."
        );
        return;
      }

      setCalendarConnected(false);
      setMessage("Google Calendar disconnected.");
    } catch {
      setError("Unable to disconnect Google Calendar.");
    } finally {
      setCalendarLoading(false);
    }
  }

  async function uploadProfilePhoto() {
    if (!photo) {
      return;
    }

    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const response = await uploadFile("profile/photo", formData);

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to upload photo.");
        return;
      }

      setProfile({
        ...profile,
        profile_photo: response.data.profile_photo,
      });

      setPhoto(null);
      setMessage("Profile photo updated.");
    } catch {
      setError("Unable to upload profile photo.");
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Professional profile</p>
          <h1>Profile</h1>
          <p>This information is displayed on your public booking page.</p>
        </div>

        {profile.slug && (
          <a
            className="button button-secondary"
            href={`/book/${profile.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={17} />
            View booking page
          </a>
        )}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="profile-grid">
        <Card
          title="Google Calendar"
          description="Automatically add confirmed appointments to your calendar."
        >
          <div className="calendar-connection-card">
            <div className="calendar-connection-icon">
              <CalendarDays size={22} />
            </div>

            <div className="calendar-connection-copy">
              <strong>
                {calendarConnected
                  ? "Google Calendar connected"
                  : "Connect Google Calendar"}
              </strong>
              <span>
                {calendarConnected
                  ? "New bookings can be synchronized with your Google Calendar."
                  : "Connect your calendar to synchronize professional appointments."}
              </span>
            </div>

            <div className="calendar-connection-action">
              {calendarConnected ? (
                <Button
                  variant="secondary"
                  onClick={disconnectGoogleCalendar}
                  loading={calendarLoading}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  onClick={connectGoogleCalendar}
                  loading={calendarLoading}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
          <div className="calendar-connection-card" style={{marginTop:8}}>
            <div className="calendar-connection-icon">
              <User size={22} />
            </div>

            <div className="calendar-connection-copy">
              <strong>
                Wanna Logout ?
              </strong>
            </div>

            <div className="calendar-connection-action">
              
                <Button
                  onClick={logout}
                  loading={calendarLoading}
                >
                  Logout
                </Button>
             
            </div>
          </div>
        </Card>
        

        <Card title="Profile photo" description="Use a clear professional photo.">
          <div className="photo-section">
            <div className="profile-photo">
              {profile.profile_photo || previewUrl ? (
                <img src={previewUrl?previewUrl:'http://localhost/'+profile.profile_photo} alt="" />
                // <img src={'http://localhost/'+profile.profile_photo} alt={profile.name} />
                ) : (
                profile.name?.charAt(0)?.toUpperCase() || "B"
              )}
            </div>

            {/* <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {setPhoto(event.target.files?.[0] || null); setPreviewUrl(URL.createObjectURL(event.target.files?.[0]))}}
            /> */}
            

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setPhoto(file);

                if (file) {
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
            <Button
              variant="secondary"
              onClick={uploadProfilePhoto}
              disabled={!photo}
            >
              <Upload size={17} />
              Upload photo
            </Button>
          </div>
        </Card>

        <Card title="Public profile" description="Keep these details up to date.">
          <form onSubmit={saveProfile} className="form-grid">
            <Field
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />

            <Field
              label="Profession"
              name="profession"
              value={profile.profession}
              onChange={handleChange}
              placeholder="Dentist"
            />

            <Field
              label="Business / clinic name"
              name="business_name"
              value={profile.business_name}
              onChange={handleChange}
            />

            <Field
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />

            <Field
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleChange}
            />

            <Field
              label="Public slug"
              name="slug"
              value={profile.slug}
              onChange={handleChange}
              placeholder="rahul-sharma"
              error={slugError}
              slugColor={slugColor}
            />
            
            <label className="field form-grid-full">
              <span className="field-label">About</span>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Tell clients about your experience and services."
                className="textarea"
                rows="5"
              />
            </label>

            <div className="form-grid-full">
              <Button type="submit" loading={saving}>
                Save profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Profile;
