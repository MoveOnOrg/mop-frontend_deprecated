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
      const shareOpts =
        (petition.share_options && petition.share_options[0]) || {}

      let msg
      if (shareOpts.whatsapp_share && shareOpts.whatsapp_share.message) {
        msg = shareOpts.whatsapp_share.message.replace(
          '[URL]',
          whatsAppShareLink
        )
      } else {
        /* no message length limit for whatsapp */
        const suffix = ` ${whatsAppShareLink}`
        msg = `${petition.title} ${suffix}`
      }

      return msg
    }

    shareWhatsApp() {
      const encodedValue = encodeURIComponent(this.getWhatsAppText())
      const url = `https://wa.me/?text=${encodedValue}`
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
