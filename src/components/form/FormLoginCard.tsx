import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface FormLoginCardProps {
  title: string
  description: string
  children: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export default function FormLoginCard({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName
}: FormLoginCardProps) {
  return (
    <Card className={className}>
      <CardHeader className={`text-center ${headerClassName || ''}`}>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  )
}
