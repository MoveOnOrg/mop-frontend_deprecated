import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoginForm from 'Theme/login-form'
import LoginFormMaterial from '../components/theme-giraffe/create-petition/login-form'

import { actions as accountActions } from '../actions/accountActions'
import { appLocation } from '../routes'
import { isValidEmail } from '../lib'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      presubmitErrors: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.errorList = this.errorList.bind(this)
    this.getFields = this.getFields.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formErrors.length) {
      this.setState({ presubmitErrors: null })
      if (!this.props.useMaterialDesign) this.password.value = ''
    }
  }

  getFields() {
    const material = this.props.useMaterialDesign
    const { email, password } = material ? this.props : this
    let fields = {}
    if (material) {
      fields = { email, password }
    } else {
      fields = {
        email: email.value,
        password: password.value
      }
    }
    return fields
  }

  /**
   * Validates the form for client side errors.
   * If valid returns true otherwise false.
   * If errors it will update the local state `presubmitErrors`
   * @returns {boolean}
   */
  validateForm() {
    const { email, password } = this.getFields()
    const errors = []
    if (!isValidEmail(email)) {
      if (!email.trim().length) {
        errors.push({ message: 'Missing required entry for the Email field.' })
      } else {
        errors.push({ message: 'Invalid entry for the Email field.' })
      }
    }
    if (!password.trim().length) {
      errors.push({ message: 'Missing required entry for the Password field.' })
    }
    if (errors.length) {
      this.setState({ presubmitErrors: errors })
    }
    return !errors.length
  }

  /**
   * Get the current errors as a jsx array.
   * @returns {Array} an jsx array of errors
   */
  errorList() {
    const errors = this.state.presubmitErrors || this.props.formErrors || []
    return errors.map(error => <li key={error.message}>{error.message}</li>)
  }

  handleSubmit(event) {
    event.preventDefault()
    if (!this.validateForm()) return

    const { dispatch, location } = this.props

    let successCallback = this.props.successCallback
    if (location.query.redirect) {
      successCallback = () => appLocation.push(location.query.redirect)
    }
    dispatch(accountActions.login(this.getFields(), successCallback))
  }

  render() {
    if (this.props.useMaterialDesign) {
      return (
        <LoginFormMaterial
          errorList={this.errorList}
          handleSubmit={this.handleSubmit}
          updateStateFromValue={this.props.updateStateFromValue}
          type={this.props.type}
          getStateValue={this.props.getStateValue}
          useMaterialDesign='true'
          isSubmitting={this.props.isSubmitting}
        />
      )
    }
    return (
      <div className='moveon-petitions'>
        <LoginForm
          errorList={this.errorList}
          handleSubmit={this.handleSubmit}
          // eslint-disable-next-line no-return-assign
          setRef={input => input && (this[input.name] = input)}
          isSubmitting={this.props.isSubmitting}
        />
      </div>
    )
  }
}

Login.defaultProps = {
  successCallback: () => appLocation.push('/dashboard.html'),
  location: { query: {} }
}

Login.propTypes = {
  formErrors: PropTypes.array,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  isSubmitting: PropTypes.bool,
  successCallback: PropTypes.func,
  useMaterialDesign: PropTypes.bool,
  updateStateFromValue: PropTypes.func,
  type: PropTypes.string,
  getStateValue: PropTypes.func
}

function mapStateToProps({ userStore = {} }) {
  return {
    formErrors: userStore.loginErrors || [],
    isSubmitting: !!userStore.isSubmittingLogin
  }
}

export default connect(mapStateToProps)(Login)
