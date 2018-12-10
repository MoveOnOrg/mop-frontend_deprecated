import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import { CountrySelect, StateSelect } from 'GiraffeUI/petition'
import { InputBlock } from 'GiraffeUI/input-block'
import MobileSubscribe from './signature-mobile-subscribe'

import { Submit as Button } from 'GiraffeUI/button'

const SignatureAddForm = ({
  submit,
  creator,
  petition,
  user,
  volunteer,
  onClickVolunteer,
  country,
  onChangeCountry,
  showOptinWarning,
  showOptinCheckbox,
  thirdPartyOptin,
  displayMobileOptIn,
  showAddressFields,
  requireAddressFields,
  onUnrecognize,
  updateStateFromValue,
  updateValueFromState,
  validationError,
  setRef,
  innerRef,
  id,
  hideUntilInteract
}) => (
  <form ref={innerRef} onSubmit={submit} className='sign-form bg-ice-blue p-4' id={id} acceptCharset='utf-8'>
    <h2 className='text-align-center'>SIGN THIS PETITION</h2>
    {user.signonId ? (
      // Recognized
      <div>
        <p>Welcome back {user.given_name}!</p>
        <p>
          (Not {user.given_name}? <a onClick={onUnrecognize}>Click here.</a>)
        </p>
      </div>
    ) : (
      // Anonymous
      <div>
        <InputBlock
          name='name'
          label='Name*'
          setRef={setRef}
          onChange={updateStateFromValue('name')}
        />
        {validationError('name')}
        <InputBlock
          type='email'
          name='email'
          label='Email*'
          onChange={updateStateFromValue('email')}
        />
        {validationError('email')}
      </div>
    )}

    {(!hideUntilInteract && showAddressFields) ? (
      <div>
        {!user.signonId ?
          <MobileSubscribe
            className='mobile_subscribe'
            showBox={!!displayMobileOptIn}
            updatePhoneNo={updateStateFromValue('phone')}
            updateOptIn={updateStateFromValue('mobile_optin',
                /* isCheckbox: */ true)}
          /> : ''
        }
        <CountrySelect
          className='override-collapse'
          onChange={onChangeCountry}
        />
        <InputBlock
          name='address1'
          label={requireAddressFields ? 'Address*' : 'Address'}
          onChange={updateStateFromValue('address1')}
          setRef={setRef}
        />
        {validationError('address1')}
        <InputBlock
          name='address2'
          label='Address (cont.)'
          onChange={updateStateFromValue('address2')}
        />
        <InputBlock
          name='city'
          label={petition.needs_full_addresses ? 'City*' : 'City'}
          onChange={updateStateFromValue('city')}
        />
        {validationError('city')}
        {country === 'United States' ? (
          <StateSelect
            label='State*'
            onChange={updateStateFromValue('state')}
          />
        ) : (
          <InputBlock
            name='region'
            label='Region'
            onChange={updateStateFromValue('region')}
          />
        )}
        {validationError('state')}
        <InputBlock
          name={country === 'United States' ? 'zip' : 'postal'}
          label={country === 'United States' ? 'ZIP Code*' : 'Postal'}
          onChange={
            country === 'United States'
              ? updateStateFromValue('zip')
              : updateStateFromValue('postal')
          }
        />
        {validationError('zip')}
      </div>
    ) : (
      ''
    )}
    {user.signonId ?
      <MobileSubscribe
        className='mobile_subscribe'
        showBox={!!displayMobileOptIn}
        updatePhoneNo={updateStateFromValue('phone')}
        updateOptIn={updateStateFromValue('mobile_optin',
            /* isCheckbox: */ true)}
      /> : ''
    }
    <InputBlock name='comment' label='Comment (Optional)'>
      <textarea
        rows='10'
        name='comment'
        id='comment'
        autoComplete='off'
        onChange={updateStateFromValue('comment')}
        onBlur={updateStateFromValue('comment')}
        ref={setRef}
      />
    </InputBlock>

    {petition.collect_volunteers && (
      <InputBlock
        name='volunteer'
        type='checkbox'
        label={petition.collect_volunteers}
        onChange={onClickVolunteer}
      />
    )}
    {volunteer && (
      <div>
        <InputBlock
          name='phone'
          label='Phone*'
          value={updateValueFromState('phone')}
          onChange={updateStateFromValue('phone')}
          className='override-collapse'
        />
        {validationError('phone')}
      </div>
    )}

    <Button onClick={submit}>SIGN THE PETITION</Button>

    {showOptinCheckbox && (
      <InputBlock
        name='thirdparty_optin'
        type='checkbox'
        label={`Receive campaign updates from ${creator.organization ||
          'this organization'}`}
        onChange={updateStateFromValue(
          'thirdparty_optin',
          /* isCheckbox: */ true
        )}
        defaultChecked={thirdPartyOptin}
      />
    )}

    {showOptinWarning ? (
      <div className='sign-form__agreement'>
        Note: This petition is a project of {creator.organization} and
        MoveOn.org. By signing, you agree to receive email messages
        from {creator.organization}, MoveOn Political Action, and MoveOn Civic
        Action. You may unsubscribe at any time.
      </div>
    ) : (
      <div className='sign-form__agreement'>
        Note: By signing, you agree to receive email messages from MoveOn.org
        Civic Action and MoveOn.org Political Action. You may unsubscribe at any
        time.
      </div>
    )}
    <Link to='/privacy.html' className='sign-form__link'>
      See Privacy Policy &gt;
    </Link>
  </form>
)

SignatureAddForm.propTypes = {
  submit: PropTypes.func,
  petition: PropTypes.object.isRequired,
  user: PropTypes.object,
  showAddressFields: PropTypes.bool,
  requireAddressFields: PropTypes.bool,
  creator: PropTypes.object,
  onUnrecognize: PropTypes.func,
  showOptinWarning: PropTypes.bool,
  showOptinCheckbox: PropTypes.bool,
  thirdPartyOptin: PropTypes.bool,
  displayMobileOptIn: PropTypes.bool,
  volunteer: PropTypes.bool,
  onClickVolunteer: PropTypes.func,
  country: PropTypes.string,
  onChangeCountry: PropTypes.func,
  updateStateFromValue: PropTypes.func,
  updateValueFromState: PropTypes.func,
  validationError: PropTypes.func,
  setRef: PropTypes.func,
  innerRef: PropTypes.func,
  id: PropTypes.string,
  hideUntilInteract: PropTypes.bool
}

export default SignatureAddForm
