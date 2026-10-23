interface RuleProps {
  number: string
  title: string
  text: string
}

export default function Rule({ number, title, text }: RuleProps) {
  return <div className="rule"><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></div>
}
import './Rule.css'
