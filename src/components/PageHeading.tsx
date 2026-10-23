interface PageHeadingProps {
  kicker: string
  title: string
}

export default function PageHeading({ kicker, title }: PageHeadingProps) {
  return <div className="page-heading"><p className="eyebrow">{kicker}</p><h1>{title}</h1></div>
}
