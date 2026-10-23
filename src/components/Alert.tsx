interface AlertProps {
  children: React.ReactNode
  onClose: () => void
  className?: string
}

export default function Alert({ children, onClose, className = '' }: AlertProps) {
  return (
    <div className={`alert ${className}`} role="alert">
      <span>{children}</span>
      <button
        className="alert-close"
        type="button"
        onClick={onClose}
        aria-label="Fermer le message"
      >
        ×
      </button>
    </div>
  )
}
