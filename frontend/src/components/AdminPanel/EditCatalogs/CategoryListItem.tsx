import { useState } from 'react'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import { createStyles, makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { KnowitColors } from '../../../styles'
import EditActionButtons from './EditActionButtons'
import { useTranslation } from 'react-i18next'

const useCategoryListItemStyles = makeStyles(() =>
  createStyles({
    button: {
      color: KnowitColors.darkBrown,
      marginLeft: '16px',
    },
    // orderButton: {
    //     marginLeft: "16px",
    //     color: "white",
    // },
    listItem: {
      transition: '150ms',
      cursor: 'pointer',
      backgroundColor: KnowitColors.beige,
      padding: '16px',
      borderRadius: '16px',
      marginBottom: '10px',
      '&:hover': {
        background: KnowitColors.greyGreen,
      },
    },
    listItemEdit: {
      backgroundColor: KnowitColors.darkBrown,
      color: 'white',
      padding: '16px',
      borderRadius: '16px',
      marginBottom: '10px',
      flexWrap: 'wrap',
    },
    listItemText: {
      color: KnowitColors.darkBrown,
      '& span': {
        fontWeight: 'bold',
      },
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
    },
    textField: {
      marginBottom: '16px',
      '& input': {
        color: KnowitColors.white,
      },
      '& textarea': {
        color: KnowitColors.white,
      },
      '& label': {
        color: KnowitColors.white,
      },
      '& fieldset': {
        color: KnowitColors.white,
        border: '2px solid #F3C8BA',
        borderRadius: '15px',
        transition: 'border 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      },
    },
  })
)

const CategoryListItem = ({
  category: c,
  onClick,
  index: ind,
  moveCategory,
  saveCategory,
  deleteCategory,
  enableUpdates,
  categories,
}: any) => {
  const { t } = useTranslation()

  const [editMode, setEditMode] = useState<boolean>(false)
  const [text, setText] = useState<string>(c.text)
  const [description, setDescription] = useState<string>(c.description || '')
  const classes = useCategoryListItemStyles()

  const onSave = async () => {
    try {
      await saveCategory(c, text, description)
      setEditMode(false)
    } catch (e) {}
  }

  const onCancel = () => {
    setText(c.text)
    setDescription(c.description || '')
    setEditMode(false)
  }

  return editMode ? (
    <ListItem className={classes.listItemEdit}>
      <ListItemText
        primary={
          <>
            <TextField
              fullWidth
              label={t('name')}
              variant="outlined"
              value={text}
              className={classes.textField}
              onChange={(e: any) => setText(e.target.value)}
              error={text.length === 0}
              helperText={
                text.length === 0 &&
                t('admin.editCatalogs.nameOfTheCategoryCantBeEmpty')
              }
            />
            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={6}
              label={t('description')}
              variant="outlined"
              value={description}
              className={classes.textField}
              onChange={(e: any) => setDescription(e.target.value)}
            />
          </>
        }
        className={classes.listItemText}
      />
      <EditActionButtons
        disabled={text.length === 0}
        onSave={onSave}
        onCancel={onCancel}
      />
    </ListItem>
  ) : (
    <ListItem className={classes.listItem} onClick={onClick}>
      <ListItemText
        primary={`${ind + 1}. ${c.text}`}
        className={classes.listItemText}
      />
      <ListItemSecondaryAction className={classes.actions}>
        <IconButton onClick={() => setEditMode(true)} className={classes.button} size="large">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => deleteCategory(c)} className={classes.button} size="large">
          <DeleteIcon />
        </IconButton>
        <ButtonGroup
          disableElevation
          variant="text"
          size="small"
          orientation="vertical"
        >
          <Button
            size="small"
            onClick={() => moveCategory(c, 1)}
            className={classes.button}
            disabled={!enableUpdates || ind === 0}
          >
            <KeyboardArrowUpIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            onClick={() => moveCategory(c, -1)}
            className={classes.button}
            disabled={!enableUpdates || ind === categories.length - 1}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </Button>
        </ButtonGroup>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default CategoryListItem
