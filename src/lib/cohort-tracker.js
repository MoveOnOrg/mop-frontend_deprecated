import Config from '../config'

export default class CohortTracker {
  constructor(state) {
    this.state = { ...state }
  }
  // method that actually sends to segment
  track(eventName) {
    if (window.analytics) {
      window.analytics.track(eventName, { ...this.state })
    }
    if (Config.FAKE_ANALYTICS) {
      // eslint-disable-next-line no-console
      console.log(`Tracking event ${eventName} with current state object: ${JSON.stringify(this.state)} `)
    }
  }
}
