import React from 'react'
import PropTypes from 'prop-types'

import { InputMaterial } from 'GiraffeUI/input-material'

const RegisterFormMaterial = ({
  errorList,
  handleSubmit,
  getStateValue,
  updateStateFromValue,
  type,
  isSubmitting
}) => {
  const email = (
    <InputMaterial
      type='text'
      name='email'
      label='Email'
      stateRef={getStateValue('email')}
      onChange={updateStateFromValue('email')}
    />
  )
  return (
    <form onSubmit={handleSubmit}>
      <div className='row'>
        <InputMaterial
          name='name'
          type='text'
          label='Name'
          stateRef={getStateValue('name')}
          className='mt-0'
          onChange={updateStateFromValue('name')}
        />
        {type !== 'conversational' ? email : ''}
        <InputMaterial
          type='text'
          name='zip'
          label='Zip'
          stateRef={getStateValue('zip')}
          onChange={updateStateFromValue('zip')}
        />
        <InputMaterial
          type='password'
          name='password'
          label='Password'
          stateRef={getStateValue('password')}
          onChange={updateStateFromValue('password')}
        />
        <InputMaterial
          type='password'
          name='passwordConfirm'
          label='Confirm Password'
          stateRef={getStateValue('passwordConfirm')}
          onChange={updateStateFromValue('passwordConfirm')}
        />
      </div>
      <div className='buttons text-align-center'>
        <button
          type='submit'
          className='center display-block ppp-btn btn'
          value='Preview The Petition'
          name='signup_next'
          id='signup_next'
          disabled={!getStateValue('name') || !getStateValue('email') || !getStateValue('password') || !getStateValue('passwordConfirm') || isSubmitting}
        >
          {type === 'conversational' ? 'Publish' : 'Next'}
          {isSubmitting ? ' Please wait...' : ''}
        </button>
        <ul className='mt-3 red errors'>{errorList && errorList()}</ul>
      </div>
    </form>
  )
}

RegisterFormMaterial.propTypes = {
  errorList: PropTypes.func,
  handleSubmit: PropTypes.func,
  getStateValue: PropTypes.func,
  updateStateFromValue: PropTypes.func,
  type: PropTypes.string,
  isSubmitting: PropTypes.bool
}

export default RegisterFormMaterial
