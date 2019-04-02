import Config from '../config'

export function CohortTracker({ experiment = '', variationname = '', userinfo }) {
  this.state = {
    experiment,
    variationname,
    user_signonid: userinfo.r_by,
    user_sighash: userinfo.r_hash
  }
  // method that actually sends to segment
  this.track = function track(eventName) {
    if (window.analytics) {
      window.analytics.track(eventName, { ...this.state })
    }
    if (Config.FAKE_ANALYTICS) {
      // eslint-disable-next-line no-console
      console.log(`Tracking event ${eventName} with current state object: ${JSON.stringify(this.state)} `)
    }
  }
}
