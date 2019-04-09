import React from 'react'
import PropTypes from 'prop-types'
import { petitionShortCode } from '../lib'
import Config from '../config'

export function withMessenger(WrappedComponent) {
  class Messenger extends React.Component {
    constructor(props) {
      super(props)
      this.getMessage = this.getMessage.bind(this)
      this.shareMessenger = this.shareMessenger.bind(this)
    }

    getMessage() {
      const { petition, shortLinkMode, shortLinkArgs } = this.props
      const messengerShareLink = petitionShortCode(
        shortLinkMode,
        ...shortLinkArgs
      )
        /* no message length limit for whatsapp */

      const suffix = `${messengerShareLink}`

      const isMobile = /iPhone/.test(navigator.userAgent) || /Android/.test(navigator.userAgent)
https://www.facebook.com/dialog/send?app_id=140586622674265&link=http%3A%2F%2Fwww.addthis.com%2F%23.XKeGPvcX4fY.messenger&redirect_uri=https%3A%2F%2Fwww.addthis.com%2Fmessengerredirect
      let msgrMobileLink = `www.facebook.com/dialog/send?app_id=${Config.MESSENGER_APP_ID}&link=${suffix}%2F%23.messenger&redirect_uri=${suffix}%2Fmessengerredirect`

      if(isMobile){
        let msgrMobileLink = `fb-messenger://share/?link=${suffix}https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fsend-dialog&app_id=${Config.MESSENGER_APP_ID}`
      }

      return msgrMobileLink
    }

    shareMessenger() {
      const encodedValue = encodeURIComponent(this.getMessage())
      const url = `https://${encodedValue}`
      // <a href=”fb-messenger://share/?link= https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fsend-dialog&app_id=123456789”>Send In Messenger</a>
      window.open(url)
      const { recordShare, afterShare } = this.props
      if (recordShare) recordShare()
      if (afterShare) afterShare()
    }

    render() {
      /* eslint-disable no-unused-vars */
      // remove props we don't want to pass through
      const {
        petition,
        shortLinkMode,
        shortLinkArgs,
        recordShare,
        // (just to remove from otherProps)
        ...otherProps
      } = this.props
      /* eslint-enable */
      return <WrappedComponent {...otherProps} onClick={this.shareMessenger} />
    }
  }
  Messenger.propTypes = {
    petition: PropTypes.object,
    shortLinkArgs: PropTypes.array,
    shortLinkMode: PropTypes.string,
    recordShare: PropTypes.func,
    afterShare: PropTypes.func
  }
  return Messenger
}
