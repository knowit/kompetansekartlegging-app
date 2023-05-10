import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link, { LinkProps } from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'
import { createStyles, makeStyles } from '@mui/styles'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Route } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'

const getBreadcrumbNameMap = (
  t: TFunction<'translation', undefined, 'translation'>
) => {
  return {
    '/add': t('add'),
    '/edit': t('admin.editCatalogs.modify'),
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: '24px',
      paddingBottom: '24px',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    lists: {
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing(1),
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
)

interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
)

const RouterBreadcrumbs = ({ extraCrumbsMap, urlOverrides }: any) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const crumbNameMap = { ...getBreadcrumbNameMap(t), ...extraCrumbsMap }

  return (
    <div className={classes.root}>
      <Route>
        {({ location }) => {
          const pathnames = location.pathname.split('/').filter((x) => x)

          return location.pathname !== '/' ? (
            <Breadcrumbs>
              <LinkRouter color="inherit" to="/">
                {t('admin.editCatalogs.catalogs')}
              </LinkRouter>
              {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1
                const to = `/${pathnames.slice(0, index + 1).join('/')}`

                return last ? (
                  <Typography color="textPrimary" key={to}>
                    {crumbNameMap[to]}
                  </Typography>
                ) : (
                  <LinkRouter
                    color="inherit"
                    to={urlOverrides[to] || to}
                    key={to}
                  >
                    {crumbNameMap[to]}
                  </LinkRouter>
                )
              })}
            </Breadcrumbs>
          ) : null
        }}
      </Route>
    </div>
  )
}

export default RouterBreadcrumbs
