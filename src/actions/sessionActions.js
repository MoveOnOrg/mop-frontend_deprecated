import Config from '../config.js'

export const actionTypes = {
  ANONYMOUS_SESSION_START: 'ANONYMOUS_SESSION_START',
  UNRECOGNIZE_USER_SESSION: 'UNRECOGNIZE_USER_SESSION',
  USER_SESSION_START: 'USER_SESSION_START',
  USER_SESSION_FAILURE: 'USER_SESSION_FAILURE'
}

export function unRecognize() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.UNRECOGNIZE_USER_SESSION
    })
  }
}

let hasIdentified = false
function identify(id) {
  // segment tracking
  if (hasIdentified || !window.analytics || !window.analytics.identify) return

  if (!id) {
    const anonId = String(Math.random()).substr(2)
    window.analytics.identify(`anon${anonId}`)
    // We don't mark it as hasIdentified in this branch because
    // if we load up session info, it might be non-anonymous
  } else {
    window.analytics.identify(id)
    hasIdentified = true
  }
}

function callSessionApi(tokens) {
  return (dispatch) => {
    const args = Object.keys(tokens)
      .map(k => ((tokens[k]) ? `${encodeURIComponent(k)}=${encodeURIComponent(tokens[k])}` : ''))
      .join('&')
    const queryString = (args && args !== '&') ? `?${args}` : ''
    fetch(`${Config.API_URI}/user/session.json${queryString}`, {
      credentials: 'include'
    })
    .then(
      (response) => response.json().then((json) => {
        dispatch({
          type: actionTypes.USER_SESSION_START,
          session: json,
          tokens
        })
        // segment tracking
        if (json && json.identifiers && json.identifiers.length) {
          let trackIdentity = null
          json.identifiers.forEach((id) => {
            if (/^actionkit:/.test(id)) {
              trackIdentity = id.substring('actionkit:'.length)
            }
          })
          identify(trackIdentity)
        }
      }),
      (err) => {
        dispatch({
          type: actionTypes.USER_SESSION_FAILURE,
          error: err,
          tokens
        })
      }
    )
  }
}

export const loadSession = (location) => {
  // Called from Wrapper container, so it's done only once on first-load

  // A cookie doesn't actually indicate authenticated -- we just mark the session differently
  const cookie = String(document.cookie).match(new RegExp(`${Config.SESSION_COOKIE_NAME}=([^;]+)`))

  if (cookie
      || (location && location.query
          && (location.query.akid || location.query.id))) {
    const tokens = {}
    const { id, akid } = location.query

    if (akid) {
      tokens.akid = akid
      identify(akid.split('.')[1])
    }
    if (id) {
      tokens.hashedId = id
    }
    return callSessionApi(tokens)
  }

  identify() // anonymous session tracking

  // If there was no cookie or tokens, we don't even need to call the api
  return (dispatch) => {
    dispatch({
      type: actionTypes.ANONYMOUS_SESSION_START
    })
  }
}

export const trackPage = () => {
  // This will track both when they navigate to a new page OR use the back button
  if (window.analytics || window.gtag) {
    const href = String(document.location.href)
      .replace(/([?&])source=/, (full, op) => `${op}utm_source=`)
    const pathname = document.location.pathname
    if (window.analytics) {
      // Segment.com tracking
      // https://segment.com/docs/sources/website/analytics.js/#page
      window.analytics.page({
        // overrides any canonical url set
        location: href,
        path: pathname,
        url: href
      })
    } else if (window.gtag) {
      // Google analytics tracking
      window.gtag('event', 'page_view', { page_location: href })
    }
  }
}

export const actions = {
  unRecognize,
  loadSession
}
