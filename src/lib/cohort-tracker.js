import Config from '../config'

export function CohortTracker({ variationname = '', experiment = '' }) {
  this.state = {
    variationname, // variation name is a description identifier and should be 'current' if it's the baseline
    experiment // meant to define the specific experiment by name e.g. 'signMobilePhones1'
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
