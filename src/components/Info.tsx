interface InfoProps {
  label: string
  value: string
  detail: string
}

export default function Info({ label, value, detail }: InfoProps) {
  return <div className="info-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}
