import React from 'react'
import PropTypes from 'prop-types'

const inputStyle = {
  height: '17px',
  marginBottom: '5px',
  width: '95%'
}

const RegisterForm = ({
  errorList,
  handleSubmit,
  setRef,
  isSubmitting,
  includeZipAndPhone,
  useLaunchButton,
  useAlternateFields
}) => (
  <React.Fragment>
    <ul className='errors'>{errorList && errorList()}</ul>
    <form method='POST' onSubmit={handleSubmit} className='form-horizontal'>
      <input
        ref={setRef}
        name='name'
        className='percent-80 validation_error'
        type='text'
        id='inputName'
        placeholder='Name'
        style={useAlternateFields ? inputStyle : {}}
      />
      <input
        ref={setRef}
        name='email'
        className='percent-80 validation_error'
        type='text'
        id='inputEmail'
        placeholder='Email'
        style={useAlternateFields ? inputStyle : {}}
      />
      {includeZipAndPhone && (
        <input
          ref={setRef}
          autoComplete='off'
          name='phone'
          type='text'
          placeholder='Phone (optional)'
          style={useAlternateFields ? inputStyle : {}}
        />
      )}
      {includeZipAndPhone && (
        <input
          ref={setRef}
          required='required'
          name='zip'
          type='text'
          placeholder='ZIP Code'
          style={useAlternateFields ? inputStyle : {}}
        />
      )}
      <input
        name='password'
        ref={setRef}
        className='percent-80 validation_error'
        type='password'
        id='inputPassword'
        placeholder='Password'
        style={useAlternateFields ? inputStyle : {}}
      />
      <input
        name='passwordConfirm'
        ref={setRef}
        className='percent-80 validation_error'
        type='password'
        id='inputConfirm'
        placeholder='Confirm Password'
        style={useAlternateFields ? inputStyle : {}}
      />
      <div>
        <div className='bump-bottom-2'>
          {useLaunchButton ? (
            <button
              type='submit'
              className='xl percent-100 bump-top-3 background-moveon-bright-red'
              id='sign-here-button'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : 'Launch petition'}
            </button>
          ) : (
            <input
              value={isSubmitting ? 'Please wait...' : 'Register'}
              disabled={isSubmitting}
              className='button bump-top-2'
              type='submit'
            />
          )}
        </div>
      </div>
    </form>
  </React.Fragment>
)

RegisterForm.propTypes = {
  errorList: PropTypes.func,
  handleSubmit: PropTypes.func,
  setRef: PropTypes.func,
  isSubmitting: PropTypes.bool,
  includeZipAndPhone: PropTypes.bool,
  useLaunchButton: PropTypes.bool,
  useAlternateFields: PropTypes.bool
}

export default RegisterForm
