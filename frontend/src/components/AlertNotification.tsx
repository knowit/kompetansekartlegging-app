import Tooltip from '@mui/material/Tooltip'
import UpdateIcon from '@mui/icons-material/Update'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import { Millisecs } from '../helperFunctions'

// Time passed before answers are flagged as stale and alerts are displayed
export const staleAnswersLimit: number = Millisecs.THREEMONTHS

export enum AlertType {
  Incomplete,
  Outdated,
  Multiple,
}

export const AlertNotification = (props: {
  type: AlertType
  message: string
  size?: number
}) => {
  switch (props.type) {
    case AlertType.Incomplete:
      return (
        <div>
          <Tooltip title={props.message}>
            <div aria-label={props.message}>!</div>
          </Tooltip>
        </div>
      )
    case AlertType.Outdated:
      return (
        <div>
          <Tooltip title={props.message}>
            <UpdateIcon aria-label={props.message} />
          </Tooltip>
        </div>
      )
    case AlertType.Multiple:
      return (
        <div>
          <Tooltip title={props.message}>
            <div aria-label={props.message}>
              {props.size !== 0 ? (
                props.size
              ) : (
                <NotificationsActiveOutlinedIcon fontSize="small" />
              )}
            </div>
          </Tooltip>
        </div>
      )
  }
}
