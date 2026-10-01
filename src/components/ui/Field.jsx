function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  children,
  error,
  slugColor,
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </span>

      {children || (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="input"
        />
        
      )}
       {error && <span className="field-label" style={{color:slugColor}}>
        {error}
      </span>}
    </label>
  );
}

export default Field;
