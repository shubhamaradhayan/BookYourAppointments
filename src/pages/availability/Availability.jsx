import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { apiGet, apiPut } from "../../api/client";

const DAYS = [
  { key: 1, label: "Monday" },
  { key: 2, label: "Tuesday" },
  { key: 3, label: "Wednesday" },
  { key: 4, label: "Thursday" },
  { key: 5, label: "Friday" },
  { key: 6, label: "Saturday" },
  { key: 0, label: "Sunday" },
];

const defaultRules = DAYS.map((day) => ({
  day_of_week: day.key,
  start_time: "09:00",
  end_time: "17:00",
  is_available: day.key >= 1 && day.key <= 5,
}));

function Availability() {
  const [rules, setRules] = useState(defaultRules);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAvailability() {
      try {
        const response = await apiGet("availability");
        console.log(response.data);
        
        if (response.data?.rules?.length) {
          setRules(response.data.rules);
        }
      } catch {
        setError("Unable to load availability.");
      }
    }

    loadAvailability();
  }, []);

  function updateRule(dayOfWeek, field, value) {
    setRules((currentRules) =>
      currentRules.map((rule) =>
        rule.day_of_week === dayOfWeek
          ? { ...rule, [field]: value }
          : rule
      )
    );
  }

  async function saveAvailability(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await apiPut("availability", {
        rules,
      });

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to save availability.");
        return;
      }

      setMessage("Availability saved successfully.");
    } catch {
      setError("Unable to save availability.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Booking rules</p>
          <h1>Availability</h1>
          <p>Choose when clients can book appointments with you.</p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <Card title="Weekly schedule" description="Your regular working hours.">
        <form onSubmit={saveAvailability}>
          <div className="availability-list">
            {DAYS.map((day) => {
              const rule = rules.find(
                (item) => item.day_of_week === day.key
              ) || {
                day_of_week: day.key,
                start_time: "09:00",
                end_time: "17:00",
                is_available: false,
              };

              return (
                <div className="availability-row" key={day.key}>
                  <label className="day-toggle">
                    <input
                      type="checkbox"
                      checked={Boolean(rule.is_available)}
                      onChange={(event) =>
                        updateRule(
                          day.key,
                          "is_available",
                          event.target.checked
                        )
                      }
                    />
                    <strong>{day.label}</strong>
                  </label>

                  <input
                    className="input time-input"
                    type="time"
                    value={rule.start_time}
                    disabled={!rule.is_available}
                    onChange={(event) =>
                      updateRule(day.key, "start_time", event.target.value)
                    }
                  />

                  <span className="time-separator">to</span>

                  <input
                    className="input time-input"
                    type="time"
                    value={rule.end_time}
                    disabled={!rule.is_available}
                    onChange={(event) =>
                      updateRule(day.key, "end_time", event.target.value)
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="form-actions">
            <Button type="submit" loading={saving}>
              Save availability
            </Button>
          </div>
        </form>
      </Card>
    </AppLayout>
  );
}

export default Availability;
