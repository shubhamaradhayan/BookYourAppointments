import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Field from "../../components/ui/Field";
import { apiDelete, apiGet, apiPost, apiPut } from "../../api/client";

const emptyForm = {
  name: "",
  description: "",
  duration_minutes: 30,
  price: "",
};

function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadServices() {
    try {
      const response = await apiGet("services");
      setServices(response.data?.services || []);
    } catch {
      setError("Unable to load services.");
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function startEditing(service) {
    setEditingId(service.id);
    setForm({
      name: service.name || "",
      description: service.description || "",
      duration_minutes: service.duration_minutes || 30,
      price: service.price || "",
    });
    setMessage("");
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = editingId
        ? await apiPut(`services/${editingId}`, form)
        : await apiPost("services", form);

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to save service.");
        return;
      }

      setMessage(editingId ? "Service updated." : "Service created.");
      resetForm();
      await loadServices();
    } catch {
      setError("Unable to save service.");
    }
  }

  async function deleteService(id) {
    if (!window.confirm("Delete this service?")) {
      return;
    }

    try {
      const response = await apiDelete(`services/${id}`);

      if (!response.data?.success) {
        setError(response.data?.message || "Unable to delete service.");
        return;
      }

      await loadServices();
    } catch {
      setError("Unable to delete service.");
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <p className="eyebrow">Configuration</p>
          <h1>Services</h1>
          <p>Create the services that clients can book.</p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="two-column-layout">
        <Card
          title={editingId ? "Edit service" : "Add service"}
          description="Set duration and pricing for your service."
        >
          <form onSubmit={handleSubmit} className="form-stack">
            <Field
              label="Service name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="General consultation"
              required
            />

            <Field
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is included?"
            />

            <Field
              label="Duration in minutes"
              name="duration_minutes"
              type="number"
              value={form.duration_minutes}
              onChange={handleChange}
              required
            />

            <Field
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="500"
            />

            <div className="button-row">
              <Button type="submit">
                <Plus size={17} />
                {editingId ? "Update service" : "Add service"}
              </Button>

              {editingId && (
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card
          title="Your services"
          description={`${services.length} service(s) available for booking.`}
        >
          <div className="service-list">
            {services.length === 0 ? (
              <div className="empty-state">No services created yet.</div>
            ) : (
              services.map((service) => (
                <div className="service-item" key={service.id}>
                  <div>
                    <strong>{service.name}</strong>
                    <span>
                      {service.duration_minutes} min
                      {service.price ? ` · ₹${service.price}` : ""}
                    </span>
                    {service.description && <small>{service.description}</small>}
                  </div>

                  <div className="icon-actions">
                    <button
                      className="icon-button"
                      onClick={() => startEditing(service)}
                      title="Edit service"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="icon-button danger"
                      onClick={() => deleteService(service.id)}
                      title="Delete service"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default Services;
