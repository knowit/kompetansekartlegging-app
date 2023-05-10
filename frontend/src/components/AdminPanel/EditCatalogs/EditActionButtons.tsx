import Button from '@mui/material/Button'
import { createStyles, makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { KnowitColors } from '../../../styles'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: '8px',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    confirmButton: {
      width: '162px',
      height: '38px',
      border: '3px solid',
      borderRadius: '19px',
      borderColor: KnowitColors.lightGreen,
      marginLeft: '32px',
      transition: '250ms',
      '&:hover': {
        color: KnowitColors.black,
        backgroundColor: KnowitColors.lightGreen,
      },
    },
    cancelButton: {
      width: '162px',
      height: '38px',
      border: '3px solid',
      borderColor: KnowitColors.flamingo,
      boxsizing: 'border-box',
      borderRadius: '19px',
      transition: '250ms',
      color: KnowitColors.flamingo,
      '&:hover': {
        color: KnowitColors.black,
        backgroundColor: KnowitColors.flamingo,
      },
    },
    buttonText: {
      fontWeight: 'bold',
      textTransform: 'none',
      lineHeight: 1,
    },
  })
)

const EditActionButtons = ({ onSave, onCancel, disabled }: any) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button onClick={onCancel} className={classes.cancelButton}>
        <span className={classes.buttonText}>{t('abort')}</span>
      </Button>
      <Button
        disabled={disabled}
        onClick={onSave}
        className={classes.confirmButton}
      >
        <span className={classes.buttonText}>{t('save')}</span>
      </Button>
    </div>
  )
}

export default EditActionButtons
