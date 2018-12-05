import React from 'react'
import { IndexRoute, Route, Redirect, Router, browserHistory, hashHistory, match } from 'react-router'


import { Config } from './config'
import { scrollToTop } from './lib'
import { trackPage } from './actions/sessionActions'
import { loadOrganization } from './actions/navActions'
import { clearError } from './actions/serverErrorActions'

import Wrapper from './containers/wrapper'
import ThanksShim from './loaders/thanks-shim'
import { Error404 } from 'Theme/error404'
import { Error500 } from 'Theme/error500'
import Sign from './containers/sign-petition'
import Logout from './containers/logout'
import {
  LoadableHome,
  LoadablePacHome,
  LoadableSearch,
  LoadableDashboard,
  LoadableNoPetition,
  LoadableCreate,
  LoadableCreatePetition,
  LoadablePreview,
  LoadableRevise,
  LoadableFinished,
  LoadableRegister,
  LoadableLogin,
  LoadableStatic,
  LoadableForgotPassword,
  LoadablePetitionReport
} from './loaders/index'


const baseAppPath = window.baseAppPath || process.env.BASE_APP_PATH || '/'

export const appLocation = (Config.USE_HASH_BROWSING ? hashHistory : browserHistory)

const updateHistoryObject = (historyObj, routes) => {
  // This overrides <Link> routes and router.push() calls to navigate away from the
  // react app to PROD_URL/path (not respecting baseAppPath)
  //  - if we haven't implemented that view yet
  //  - or, if we're in production, limits matches to <Route> objects marked with a
  //    prodReady property (={true})
  //
  // It also rewrites match locations to include baseAppPath (like /2018/)
  //
  // All <Link>s and appLocation.push calls in the codebase should NOT be relative
  // -- i.e. they should be absolute paths like /thanks.html

  const PROD_URL = 'https://petitions.moveon.org'
  const origPush = historyObj.push
  // eslint-disable-next-line no-param-reassign
  historyObj.push = (path, state) => {
    let matchPath = path
    if (baseAppPath !== '/' && path.substring(0, 4) !== 'http') {
      matchPath = baseAppPath + (path[0] === '/' ? path.substring(1) : path)
    }
    match(
      { location: matchPath, routes },
      (error, newlocation, props) => {
        if (!error && props) {
          const matchedComponent = props.routes[props.routes.length - 1]

          if (matchedComponent.prodReady || (!Config.ONLY_PROD_ROUTES && Config.BASE_URL !== PROD_URL)) {
            origPush.call(this, matchPath, state)
            return
          }
        }
        if (path.substring(0, 4) === 'http') {
          window.location = path
        } else {
          window.location = `${PROD_URL}${path}`
        }
      })
  }
  // This is for GA/Segment tracking:
  // Note: this only triggers on *changes* -- not the first load
  // The server script loading should take care of the first load
  // with the boilerplate stuff, which should also setup the tracking id, etc.
  historyObj.listen(trackPage)
}

export const routes = store => {
  const orgLoader = nextState => {
    if (nextState.params && nextState.params.organization) {
      store.dispatch(loadOrganization(nextState.params.organization))
    }
  }

  /**
    * testFn can be used to be passed to a router in order to change the url string.
    * testFn will randomly divide users into cohort=1 or cohort=2 when AB_TEST_ENABLED
    * equals a value.
    *
    * Further documentation: docs/EXPLANATION--cohort-testing.md
    * Originally built for mobile field test: https://github.com/MoveOnOrg/mop-frontend/issues/512

  const testFn = () => {
    const cohort = (Math.random() > 0.5 ? 1 : 2)
    if (Config.AB_TEST_ENABLED) {
      const currentLocation = window.location
      const pathName = currentLocation.pathname
      const queryString = currentLocation.search
      const check = parseInt(Config.AB_TEST_ENABLED, 10) / 100

      if (Math.random() > check) {
        // makes sure it only does it on sign pages and
        // only triggers if you land directly on sign page vs through source
        // checks if there is a cohort already in the querystring so it doesnt add another cohort
        if (/sign/.test(pathName) && !/cohort/.test(queryString)) {
          const preChar = /\?/.test(currentLocation.search) ? '&' : '?'
          browserHistory.push(`${pathName}${currentLocation.search}${preChar}cohort=${cohort}`)
        }
      }
    }
    return cohort
  }
    **/

  const onChange = () => {
    store.dispatch(clearError()) // Stop showing any error page
    scrollToTop()
  }

  const routeHierarchy = (
    <Route path={baseAppPath} component={Wrapper} onChange={onChange}>
      <IndexRoute prodReady component={LoadableHome} />
      <Redirect from='/index.html' to='/' />

      {/* Sign pages are popular entry pages, so they get included in the main bundle (not Loadable)
          petitionName is a slugified name, matching the slugified "name" returned by the api.
      */}

      <Route path='sign/:petitionName' component={Sign} prodReady />
      <Route path=':organization/sign/:petitionName' component={Sign} onEnter={orgLoader} prodReady />

      <Route path='pac/' component={LoadablePacHome} prodReady />
      <Route path='thanks.html' component={ThanksShim} prodReady minimalNav />
      <Route path=':organization/thanks.html' component={ThanksShim} onEnter={orgLoader} prodReady minimalNav />
      <Route path='find' component={LoadableSearch} />

      {Config.THEME === 'giraffe' && <Route path='create' component={LoadableCreatePetition} hideNav hideFooter offWhiteBg />}
      {Config.THEME === 'giraffe' && <Route path='create/:type' component={LoadableCreatePetition} hideNav hideFooter offWhiteBg />}

      <Route path='create_start.html' component={LoadableCreate} minimalNav />
      <Route path='create_preview.html' component={LoadablePreview} minimalNav />
      <Route path='create_revise.html' component={LoadableRevise} minimalNav />
      <Route path='create_finished.html' component={LoadableFinished} minimalNav />
      <Route path='petition_report.html' component={LoadablePetitionReport} />
      <Route path=':organization/create_start.html' component={LoadableCreate} onEnter={orgLoader} minimalNav />
      <Route path='login/' component={LoadableLogin} />
      <Route path='login/index.html' component={LoadableLogin} />
      <Route path='login/do_logout.html' component={Logout} />
      <Route path='login/register.html' component={LoadableRegister} />
      <Route path='login/forgot_password.html' component={LoadableForgotPassword} />

      {/* Authenticated routes (check happens in Wrapper) */}
      <Route path='dashboard.html' component={LoadableDashboard} authenticated />
      <Route path='no_petition.html' component={LoadableNoPetition} authenticated />

      {/* Static pages with content from wordpress api */}
      <Route path='about.html' component={LoadableStatic} wordpressId={60931} />
      <Route path='brandmerge.html' component={LoadableStatic} wordpressId={61002} />
      <Route path='campaign_tips.html' component={LoadableStatic} wordpressId={60942} />
      <Route path='funding.html' component={LoadableStatic} wordpressId={60943} />
      <Route path='howto_campaign.html' component={LoadableStatic} wordpressId={60944} />
      <Route path='howto_communication.html' component={LoadableStatic} wordpressId={60945} />
      <Route path='howto_delivery.html' component={LoadableStatic} wordpressId={60946} />
      <Route path='howto_petition.html' component={LoadableStatic} wordpressId={60947} />
      <Route path='howto_twitter.html' component={LoadableStatic} wordpressId={60948} />
      <Route path='organizations.html' component={LoadableStatic} wordpressId={60949} />
      <Route path='privacy.html' component={LoadableStatic} wordpressId={60950} />
      <Route path='terms.html' component={LoadableStatic} wordpressId={60951} />
      <Route path='victories.html' component={LoadableStatic} wordpressId={61001} />

      {/* Mostly errors will be shown by Wrapper, but these are nice for development */}
      <Route path='404' component={Error404} />
      <Route path='500' component={Error500} />
    </Route>
  )
  updateHistoryObject(appLocation, routeHierarchy)
  return (
    <Router history={appLocation}>
      {routeHierarchy}
    </Router>
  )
}
