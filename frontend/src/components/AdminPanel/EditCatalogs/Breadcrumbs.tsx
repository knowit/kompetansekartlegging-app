import React from 'react'
import { Link, LinkProps } from '@mui/material'
import { Breadcrumbs } from '@mui/material'
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

interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
)

const RouterBreadcrumbs = ({ extraCrumbsMap, urlOverrides }: any) => {
  const { t } = useTranslation()

  const crumbNameMap = { ...getBreadcrumbNameMap(t), ...extraCrumbsMap }

  return (
    <div>
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
                  <div key={to}>{crumbNameMap[to]}</div>
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
