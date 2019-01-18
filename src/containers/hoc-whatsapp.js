import React from 'react'
import PropTypes from 'prop-types'
import { petitionShortCode } from '../lib'

export function withWhatsApp(WrappedComponent) {
  class WhatsApp extends React.Component {
    constructor(props) {
      super(props)
      this.getWhatsAppText = this.getWhatsAppText.bind(this)
      this.shareWhatsApp = this.shareWhatsApp.bind(this)
    }

    getWhatsAppText() {
      const { petition, shortLinkMode, shortLinkArgs } = this.props

      const whatsAppShareLink = petitionShortCode(
        shortLinkMode,
        ...shortLinkArgs
      )
        /* no message length limit for whatsapp */

      const suffix = `${whatsAppShareLink}`
      const message = `Hi - I just signed this petition titled "${petition.title}" and I'm asking my friends to join me. Will you sign too? ${suffix}`

      return message
    }

    shareWhatsApp() {
      const encodedValue = encodeURIComponent(this.getWhatsAppText())
      const isFirefoxOrSafariDesktop = /Firefox/.test(navigator.userAgent) || /Safari/.test(navigator.userAgent)
      const isMobileOrChromeDesktop = /iPhone/.test(navigator.userAgent) || /Chrome/.test(navigator.userAgent) || /Android/.test(navigator.userAgent)
      const whatsAppDomain = ((isFirefoxOrSafariDesktop && !isMobileOrChromeDesktop) ? 'web.whatsapp.com' : 'wa.me')
      const url = `https://${whatsAppDomain}/?text=${encodedValue}`
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
      return <WrappedComponent {...otherProps} onClick={this.shareWhatsApp} />
    }
  }
  WhatsApp.propTypes = {
    petition: PropTypes.object,
    shortLinkArgs: PropTypes.array,
    shortLinkMode: PropTypes.string,
    recordShare: PropTypes.func,
    afterShare: PropTypes.func
  }
  return WhatsApp
}
