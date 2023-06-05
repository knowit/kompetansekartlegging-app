import { CardContent, Card } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface InfoCardProps {
  title: string
  description: string
}

const InfoCard = ({ title, description }: InfoCardProps) => {
  const { t } = useTranslation()

  return (
    <Card variant="outlined">
      <CardContent>
        <h1>{t(title)}</h1>
        {t(description)}
      </CardContent>
    </Card>
  )
}

export default InfoCard
