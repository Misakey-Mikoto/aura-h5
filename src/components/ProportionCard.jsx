import './ProportionCard.css';

function ProportionCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`proportion-card-wrapper ${className}`}>
      {title && (
        <div className="proportion-card-header">
          <div className="proportion-header-line"></div>
          <div className="proportion-header-text">
            <span className="proportion-title">{title}</span>
            {subtitle && <span className="proportion-subtitle">{subtitle}</span>}
          </div>
          <div className="proportion-header-line"></div>
        </div>
      )}
      <div className="proportion-card-content">
        {children}
      </div>
    </div>
  );
}

export default ProportionCard;
