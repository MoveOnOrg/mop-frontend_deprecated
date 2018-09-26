/* eslint-disable new-cap */
import Loadable from 'react-loadable'

import Loading from 'LegacyTheme/loading'

export const LoadableHome = Loadable({
  loader: () => import('../containers/home'),
  loading: Loading
})

export const LoadablePacHome = Loadable({
  loader: () => import('../containers/pac-home'),
  loading: Loading
})

export const LoadableSearch = Loadable({
  loader: () => import('../containers/search'),
  loading: Loading
})

export const LoadableCreatePetition = Loadable({
  loader: () => import('../containers/create-petition'),
  loading: Loading
})

export const LoadableCreate = Loadable({
  loader: () => import('../containers/create-petition-legacy'),
  loading: Loading
})

export const LoadablePreview = Loadable({
  loader: () => import('../containers/create-preview'),
  loading: Loading
})

export const LoadableRevise = Loadable({
  loader: () => import('../containers/create-revise'),
  loading: Loading
})

export const LoadableFinished = Loadable({
  loader: () => import('../containers/create-finished'),
  loading: Loading
})

export const LoadableRegister = Loadable({
  loader: () => import('Theme/register'),
  loading: Loading
})

export const LoadableLogin = Loadable({
  loader: () => import('../containers/login'),
  loading: Loading
})

export const LoadableForgotPassword = Loadable({
  loader: () => import('../containers/forgot-password'),
  loading: Loading
})

export const LoadableThanks = Loadable({
  loader: () => import('../containers/thanks'),
  loading: Loading
})

export const LoadablePetitionReport = Loadable({
  loader: () => import('../containers/petition-report'),
  loading: Loading
})

export const LoadableDashboard = Loadable({
  loader: () => import('../containers/petition-creator-dashboard'),
  loading: Loading
})

export const LoadableNoPetition = Loadable({
  loader: () => import('LegacyTheme/no-petition'),
  loading: Loading
})

export const LoadableStatic = Loadable({
  loader: () => import('../containers/static'),
  loading: Loading
})
