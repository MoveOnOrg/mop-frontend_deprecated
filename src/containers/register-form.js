import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RegisterForm from 'Theme/register-form'
import RegisterFormMaterial from '../components/theme-giraffe/create-petition/register-form'

import Config from '../config'
import { register, devLocalRegister } from '../actions/accountActions'
import { appLocation } from '../routes'
import { isValidEmail } from '../lib'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      presubmitErrors: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.getFields = this.getFields.bind(this)
    this.errorList = this.errorList.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formErrors.length) {
      this.setState({ presubmitErrors: null })
      if (!this.props.useMaterialDesign) {
        this.password.value = ''
        this.passwordConfirm.value = ''
      }
    }
  }

  getFields() {
    const material = this.props.useMaterialDesign
    const { name, email, password, passwordConfirm, zip, phone } = material ? this.props : this
    let fields = {}
    if (material) {
      fields = {
        name,
        email,
        zip,
        password,
        passwordConfirm
      }
    } else {
      fields = {
        name: name.value,
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value
      }
      if (this.props.includeZipAndPhone) {
        fields.zip = zip.value
        fields.phone = phone.value
      }
    }
    return fields
  }

  validateForm() {
    const { name, email, password, passwordConfirm, zip } = this.getFields()
    const errors = []
    if (!name.trim().length) {
      errors.push({ message: 'Missing required entry for the Name field.' })
    }
    if (!isValidEmail(email)) {
      if (!email.trim().length) {
        errors.push({ message: 'Missing required entry for the Email field.' })
      } else {
        errors.push({ message: 'Invalid entry for the Email field.' })
      }
    }
    if (!password.trim().length) {
      errors.push({ message: 'Missing required entry for the Password field.' })
    } else if (password.trim() !== passwordConfirm.trim()) {
      errors.push({
        message: 'Password and PasswordConfirm fields do not match.'
      })
    }
    if (this.props.includeZipAndPhone && !zip.trim().length) {
      errors.push({ message: 'Missing required entry for the ZIP Code field.' })
    }
    if (errors.length) {
      this.setState({ presubmitErrors: errors })
    }
    return !errors.length
  }

  handleSubmit(event) {
    event.preventDefault()
    const registerAction = Config.API_WRITABLE ? register : devLocalRegister
    if (this.validateForm()) {
      const { successCallback, isCreatingPetition, dispatch } = this.props
      dispatch(registerAction(this.getFields(), { successCallback, isCreatingPetition }))
    }
  }

  /**
   * Get the current errors as a jsx array.
   * @returns {Array} an jsx array of errors
   */
  errorList() {
    const errors = this.state.presubmitErrors || this.props.formErrors || []
    return errors.map(error => <li key={error.message}>{error.message}</li>)
  }

  render() {
    if (this.props.useMaterialDesign) {
      return (
        <RegisterFormMaterial
          errorList={this.errorList}
          handleSubmit={this.handleSubmit}
          updateStateFromValue={this.props.updateStateFromValue}
          type={this.props.type}
          getStateValue={this.props.getStateValue}
          isSubmitting={this.props.isSubmitting}
        />
      )
    }
    return (
      <RegisterForm
        errorList={this.errorList}
        handleSubmit={this.handleSubmit}
        // eslint-disable-next-line no-return-assign
        setRef={input => input && (this[input.name] = input)}
        isSubmitting={this.props.isSubmitting}
        includeZipAndPhone={this.props.includeZipAndPhone}
        useLaunchButton={this.props.useLaunchButton}
        useAlternateFields={this.props.useAlternateFields}
      />
    )
  }
}

Register.defaultProps = {
  successCallback: () => appLocation.push('/no_petition.html'),
  isCreatingPetition: false
}

Register.propTypes = {
  formErrors: PropTypes.array,
  dispatch: PropTypes.func,
  isSubmitting: PropTypes.bool,
  includeZipAndPhone: PropTypes.bool,
  useLaunchButton: PropTypes.bool,
  useAlternateFields: PropTypes.bool,
  successCallback: PropTypes.func,
  isCreatingPetition: PropTypes.bool,
  useMaterialDesign: PropTypes.bool,
  updateStateFromValue: PropTypes.func,
  type: PropTypes.string,
  getStateValue: PropTypes.func
}

function mapStateToProps({ userStore = {}, petitionCreateStore = {} }) {
  return {
    formErrors: userStore.registerErrors || [],
    isSubmitting: Boolean(
      userStore.isSubmittingRegister || petitionCreateStore.isSubmitting
    )
  }
}

export default connect(mapStateToProps)(Register)
