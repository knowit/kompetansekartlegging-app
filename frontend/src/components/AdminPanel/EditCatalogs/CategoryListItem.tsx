import { useState } from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { ListItemButton, TextField } from '@mui/material'
import {
  Edit as EditIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditActionButtons from './EditActionButtons'
import { useTranslation } from 'react-i18next'

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
    <ListItem>
      <ListItemText
        primary={
          <>
            <TextField
              fullWidth
              label={t('name')}
              value={text}
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
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
            />
          </>
        }
      />
      <EditActionButtons
        disabled={text.length === 0}
        onSave={onSave}
        onCancel={onCancel}
      />
    </ListItem>
  ) : (
    <ListItem divider>
      <ButtonGroup fullWidth>
        <ListItemButton onClick={() => onClick()}>
          <ListItemText primary={`${ind + 1}. ${c.text}`} />
        </ListItemButton>
        <IconButton onClick={() => setEditMode(true)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => deleteCategory(c)}>
          <DeleteIcon />
        </IconButton>
        <ButtonGroup variant="text" orientation="vertical">
          <Button
            size="small"
            onClick={() => moveCategory(c, 1)}
            disabled={!enableUpdates || ind === 0}
          >
            <KeyboardArrowUpIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            onClick={() => moveCategory(c, -1)}
            disabled={!enableUpdates || ind === categories.length - 1}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </ListItem>
  )
}

export default CategoryListItem
