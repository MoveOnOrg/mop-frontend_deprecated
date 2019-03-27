import React from 'react'
import PropTypes from 'prop-types'
import { petitionShortCode } from '../lib'

function copyText(text) {
  const textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
}

export function withCopyLink(WrappedComponent) {
  class CopyLink extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        copied: false
      }
      this.onClick = this.onClick.bind(this)
      this.getLink = this.getLink.bind(this)
    }

    onClick(e) {
      e.preventDefault()
      copyText(this.getLink())
      this.setState({ copied: true })
      const { recordShare } = this.props
      if (recordShare) recordShare()
    }

    getLink() {
      const { shortLinkMode, shortLinkArgs } = this.props
      return petitionShortCode(shortLinkMode, ...shortLinkArgs)
    }

    render() {
      // eslint-disable-next-line no-unused-vars
      const { shortLinkMode, shortLinkArgs, ...otherProps } = this.props
      return (
        <WrappedComponent
          {...otherProps}
          onClick={this.onClick}
          copied={this.state.copied}
          clearCopied={() => this.setState({ copied: false })}
          rawLink={this.getLink()}
        />
      )
    }
  }

  CopyLink.propTypes = {
    shortLinkMode: PropTypes.string,
    shortLinkArgs: PropTypes.array,
    recordShare: PropTypes.func
  }

  return CopyLink
}
