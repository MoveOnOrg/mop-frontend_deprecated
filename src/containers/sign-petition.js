import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Petition from 'Theme/petition'
import { LoadableThanks } from '../loaders/'
import { actions as petitionActions } from '../actions/petitionActions'
import { appLocation } from '../routes'

class SignPetition extends React.Component {
  static checkOrgPathMatches(petition, orgPath) {
    const { creator } = petition._embedded
    // Petition has org that doesn't match URL
    if (creator.source && creator.source !== orgPath) {
      appLocation.push(`/${creator.source}/sign/${petition.name}`)
      return false
    }
    // URL has org that doesn't match petition
    if (orgPath && orgPath !== creator.source) {
      appLocation.push(`/sign/${petition.name}`)
      return false
    }
    return true
  }

  constructor(props) {
    super(props)
    this.state = {
      deviceSize: null,
      floatingSignVisible: false
    }
    this.setRef = this.setRef.bind(this)
    this.focusSign = this.focusSign.bind(this)
    this.getAdminLink = this.getAdminLink.bind(this)
    this.getScrollToSignFormProps = this.getScrollToSignFormProps.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentWillMount() {
    const { dispatch, params, petition } = this.props
    dispatch(petitionActions.loadPetition(params.petitionName.split('.')[0]))
    if (petition) {
      SignPetition.checkOrgPathMatches(petition, params.organization)
    }
  }

  componentDidMount() {
    // Lazy-load thanks page component
    LoadableThanks.preload()
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillReceiveProps(nextProps) {
    const { params, petition } = nextProps
    if (petition) {
      SignPetition.checkOrgPathMatches(petition, params.organization)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  getScrollToSignFormProps() {
    const f = this.state.deviceSize
    const offset = f === 'mobile' ? -65 : -150
    return {
      to: `${f}-sign`,
      animate: { offset },
      afterAnimate: this.focusSign
    }
  }

  getAdminLink() {
    const { user, petition } = this.props
    if (!user || !user.custom_fields || !user.custom_fields.admin) return false

    return `${user.custom_fields.admin_petition_baseurl}?petition_id=${
      petition.petition_id
    }`
  }

  setRef({ isMobile }) {
    const formName = isMobile ? 'mobile' : 'desktop'
    // eslint-disable-next-line no-return-assign
    return input => input && (this[`${formName}-${input.name}Input`] = input)
  }

  focusSign() {
    const f = this.state.deviceSize
    // Forms are hidden per petition settings or user state, so we find the first rendered
    const name = this[`${f}-nameInput`]
    const address = this[`${f}-address1Input`]
    const comment = this[`${f}-commentInput`]

    const firstInput =
      (document.body.contains(name) && name) ||
      (document.body.contains(address) && address) ||
      (document.body.contains(comment) && comment) ||
      null

    if (firstInput) firstInput.focus()
  }

  updateWindowDimensions() {
    this.setState({ deviceSize: window.innerWidth < 768 ? 'mobile' : 'desktop' })
  }

  render() {
    const p = this.props.petition
    if (!p) {
      return <div />
    }
    const creator = (p._embedded && p._embedded.creator) || {
      name: p.contact_name
    }
    const petitionBy = creator.name || p.contact_name

    return (
      <div className='moveon-petitions sign container'>
        <Petition
          petition={this.props.petition}
          user={this.props.user}
          adminLink={this.getAdminLink()}
          query={this.props.location.query}
          petitionBy={petitionBy}
          isFloatingSignVisible={this.state.floatingSignVisible}
          scrollToSignFormProps={this.getScrollToSignFormProps}
          hideFloatingSign={() => this.setState({ floatingSignVisible: false })}
          showFloatingSign={() => this.setState({ floatingSignVisible: true })}
          setRef={this.setRef}
        />
      </div>
    )
  }
}

SignPetition.propTypes = {
  petition: PropTypes.object,
  user: PropTypes.object,
  params: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps(store, ownProps) {
  const petition = store.petitionStore.petitions[ownProps.params.petitionName.split('.')[0]]
  return {
    petition,
    sign_success:
      petition && store.petitionStore.signatureStatus[petition.petition_id],
    user: store.userStore
  }
}

export default connect(mapStateToProps)(SignPetition)
