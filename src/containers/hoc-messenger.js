import React from 'react'
import PropTypes from 'prop-types'
import { petitionShortCode } from '../lib'

export function withMessenger(WrappedComponent) {
  class Messenger extends React.Component {
    constructor(props) {
      super(props)
      this.getTweet = this.getTweet.bind(this)
      this.shareMessenger = this.shareMessenger.bind(this)
    }

    getMessage() {
      const { petition, shortLinkMode, shortLinkArgs } = this.props

      const twitterShareLink = petitionShortCode(
        shortLinkMode,
        ...shortLinkArgs
      )
      const shareOpts =
        (petition.share_options && petition.share_options[0]) || {}

      let message
      if (shareOpts.twitter_share && shareOpts.twitter_share.message) {
        message = shareOpts.twitter_share.message.replace(
          '[URL]',
          twitterShareLink
        )
      } else {
        const suffix = ` ${twitterShareLink} @moveon`
        message = `${petition.title.slice(0, 140 - suffix.length)} ${suffix}`
      }

      return message
    }

    shareMessenger() {
      const encodedValue = encodeURIComponent(this.getMessenger())
      // <a href=”fb-messenger://share/?link= https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fsend-dialog&app_id=123456789”>Send In Messenger</a>
      // const url = `https://twitter.com/intent/tweet?text=${encodedValue}`
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
