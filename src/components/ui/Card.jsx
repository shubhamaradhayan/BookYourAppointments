function Card({ children, title, description, actions, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {(title || description || actions) && (
        <div className="card-header">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>

          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}

      <div className="card-body">{children}</div>
    </section>
  );
}

export default Card;
