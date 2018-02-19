import React from 'react'
import PropTypes from 'prop-types'

const StateSelect = ({
  onChange, selectText, style,
  name = 'state', id = 'state_id', className = 'span4 state moveon-track-click margin-right-1'
}) => (

  <select
    name={name}
    id={id}
    className={className}
    onChange={onChange}
    style={style}
  >
    <option value=''>{selectText}</option>
    <option value='AL'>Alabama</option>
    <option value='AK'>Alaska</option>
    <option value='AS'>American Samoa</option>
    <option value='AZ'>Arizona</option>
    <option value='AR'>Arkansas</option>
    <option value='CA'>California</option>
    <option value='CO'>Colorado</option>
    <option value='CT'>Connecticut</option>
    <option value='DE'>Delaware</option>
    <option value='DC'>District Of Columbia</option>
    <option value='FL'>Florida</option>
    <option value='FM'>Federated States of Micronesia</option>
    <option value='GA'>Georgia</option>
    <option value='GU'>Guam</option>
    <option value='HI'>Hawaii</option>
    <option value='ID'>Idaho</option>
    <option value='IL'>Illinois</option>
    <option value='IN'>Indiana</option>
    <option value='IA'>Iowa</option>
    <option value='KS'>Kansas</option>
    <option value='KY'>Kentucky</option>
    <option value='LA'>Louisiana</option>
    <option value='ME'>Maine</option>
    <option value='MD'>Maryland</option>
    <option value='MA'>Massachusetts</option>
    <option value='MH'>Marshall Islands</option>
    <option value='MI'>Michigan</option>
    <option value='MN'>Minnesota</option>
    <option value='MS'>Mississippi</option>
    <option value='MO'>Missouri</option>
    <option value='MT'>Montana</option>
    <option value='NE'>Nebraska</option>
    <option value='MP'>Northern Mariana Islands</option>
    <option value='NV'>Nevada</option>
    <option value='NH'>New Hampshire</option>
    <option value='NJ'>New Jersey</option>
    <option value='NM'>New Mexico</option>
    <option value='NY'>New York</option>
    <option value='NC'>North Carolina</option>
    <option value='ND'>North Dakota</option>
    <option value='OH'>Ohio</option>
    <option value='OK'>Oklahoma</option>
    <option value='OR'>Oregon</option>
    <option value='PW'>Palau</option>
    <option value='PA'>Pennsylvania</option>
    <option value='PR'>Puerto Rico</option>
    <option value='RI'>Rhode Island</option>
    <option value='SC'>South Carolina</option>
    <option value='SD'>South Dakota</option>
    <option value='TN'>Tennessee</option>
    <option value='TX'>Texas</option>
    <option value='UT'>Utah</option>
    <option value='VT'>Vermont</option>
    <option value='VA'>Virginia</option>
    <option value='VI'>U.S. Virgin Islands</option>
    <option value='WA'>Washington</option>
    <option value='WV'>West Virginia</option>
    <option value='WI'>Wisconsin</option>
    <option value='WY'>Wyoming</option>
    <option value='AE'>Armed Forces Africa</option>
    <option value='AA'>Armed Forces America</option>
    <option value='AE'>Armed Forces Canada</option>
    <option value='AE'>Armed Forces Europe</option>
    <option value='AE'>Armed Forces Middle East</option>
    <option value='AP'>Armed Forces Pacific</option>
  </select>
)

StateSelect.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  selectText: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string
}

export default StateSelect
