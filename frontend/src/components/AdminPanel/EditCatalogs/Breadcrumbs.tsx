import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Link, { LinkProps } from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Route } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

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
