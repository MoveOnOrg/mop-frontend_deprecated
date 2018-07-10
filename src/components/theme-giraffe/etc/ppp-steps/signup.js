import React from 'react'
import PropTypes from 'prop-types'
import CreateRegister from '../../../../containers/create-register-form'
import cx from 'classnames'

const Signup = ({
    afterSignup,
    toggleOpen,
    updateStateFromValue,
    getStateValue,
    type
}) => {
    const name = getStateValue('name')
    const email = getStateValue('email')
    const zip = getStateValue('zip')
    const password = getStateValue('password')
    const passwordConfirm = getStateValue('passwordConfirm')
    const loginToggled = getStateValue('loginToggled')

    const defaults = {
      title: 'Your petition is important. Let’s make sure you don’t lose progress.',
      description: 'Provide your email and zip code to recover an incomplete petition draft and receive location specific suggestions to help you throughout your petition creation process.'
    }
    const conversational = {
      title: 'Complete your account to publish this petition.',
      description: 'You can edit, manage, and share your petition from your account dashboard.'
    }

    return (
      <div className={cx(
            getStateValue('signupModalToggled') ? 'signup-modal toggled' : 'signup-modal'
        )}
      >
        <div className='container bg-azure'>
          <div className='close' onClick={toggleOpen('signupModalToggled')}>
            <span className='bg-black' />
            <span className='bg-black' />
          </div>
          <div className='row'>
            <div className='col-12'>
              <h2 className='bg-black white'>{type === 'conversational' ? conversational.title : defaults.title}</h2>
              <p>{type === 'conversational' ? conversational.description : defaults.description}</p>
            </div>
            <div className='col-12'>
              <CreateRegister
                successCallback={afterSignup}
                updateStateFromValue={updateStateFromValue}
                getStateValue={getStateValue}
                type={type}
                name={name}
                email={email}
                zip={zip}
                password={password}
                passwordConfirm={passwordConfirm}
                loginToggled={loginToggled}
                isCreatingPetition
              />
            </div>
            <div className='col-12'>
              <a onClick={toggleOpen('loginToggled')}>{getStateValue('loginToggled') ? 'Need an account? Click to register' : 'Already have an account? Click to login'}</a>
            </div>
          </div>
        </div>

      </div>
    )
}

Signup.propTypes = {
    afterSignup: PropTypes.func,
    toggleOpen: PropTypes.func,
    updateStateFromValue: PropTypes.func,
    getStateValue: PropTypes.func,
    type: PropTypes.string
}

export default Signup

// disabled={!email || !zip || zip.length !== 5 || !name || !password || !passwordConfirm || passwordConfirm !== password} >
