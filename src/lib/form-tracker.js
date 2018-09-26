import Config from '../config'

export function FormTracker({ experiment = '', formvariant = '', variationname = '' }) {
  this.options = {
    formStarted: 0,
    formSubmitted: 0,
    eventInfo: {}
  }

  this.state = {
    result: '', // either started, completed or dropoff
    variationname, // variation name is a description identifier and should be 'current' if it's the baseline
    formvariant, // is for example whether the mobile or desktop is displayed
    experiment, // meant to define the specific experiment by name e.g. 'signMobilePhones1'
    loginstate: 0, // 0 is not logged in, 1 is guest login and 2 is an authenticated user
    validationerror: 0, // count of the number of fields that a validation error occurs before submission
    formexpand: 0, // number of times additional pieces of the form are displayed to the user
    sectionadvanced: 0, // maximum form section user gets to (normally for a multi step form)
    fieldfocused: -1, // maximum field index besides the submit button that receives focus
    fieldchanged: -1, // maximum field index that has a non default value,
    lastfieldchanged: '',
    lastfieldfocused: ''
  }

  this.submitForm = function submitForm(eventInfo) {
    this.state.result = 'completed'
    Object.keys(eventInfo).forEach(key => {
      this.state[key] = eventInfo[key]
    })
    this.track('form_finished')
  }

  this.formExpandTracker = function formExpandTracker() {
    this.state.formexpand += 1
  }

  this.loginState = function loginState(userInfo) {
    if (userInfo.anonymous) {
      this.state.loginstate = 0
    }

    if (!userInfo.anonymous && !userInfo.signonId) {
      this.state.loginstate = 1
    }

    if (!userInfo.anonymous && userInfo.signonId) {
      this.state.loginstate = 2
    }
  }

  this.isVisible = ref => (!!(ref.offsetWidth || ref.offsetHeight || ref.getClientRects().length))

  this.setForm = function setForm(ref, variantname) {
    if (ref) {
      this.form = ref
      this.state.formLength = ref.elements.length
      this.state.formvariant = variantname || ref.id
      this.startForm()
    }
  }

  this.startForm = function startForm() {
    if (this.options.formStarted === 0) {
      this.state.result = 'started'
      this.track('form_started')
    }
  }

  this.fieldIndex = function fieldIndex(fieldName) {
    if (this.form) {
      for (let i = 0; i < this.form.elements.length; i += 1) {
        if (this.form.elements[i].name === fieldName) {
          return i
        }
      }
    }
    return -1
  }

  this.updateFormProgress = function updateFormProgress(eventInfo) {
    const fieldName = eventInfo.fieldchanged
    this.state.lastfieldchanged = fieldName
    this.state.lastfieldfocused = fieldName

    if (eventInfo.fieldchanged) {
      this.state.fieldchanged = Math.max(this.state.fieldchanged, this.fieldIndex(eventInfo.fieldchanged))
    }

// track field focused
    if (eventInfo.fieldfocused) {
      this.state.fieldfocused = Math.max(this.state.fieldfocused, this.fieldIndex(eventInfo.fieldfocused))
    }

    if (!this.options.formStarted && this.state.formvariant) {
      this.startForm()
    }
  }

  this.validationErrorTracker = function validationErrorTracker() {
    this.state.validationerror += 1
  }

  // method that actually sends to segment
  this.track = function track(eventName) {
    this.options.formStarted = 1
    if (window.analytics) {
      window.analytics.track(eventName, { ...this.state })
    }
    if (Config.FAKE_ANALYTICS) {
      // eslint-disable-next-line no-console
      console.log(`Tracking event ${eventName} with current state object: ${JSON.stringify(this.state)} `)
    }
  }
}
