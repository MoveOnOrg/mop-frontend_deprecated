import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Textarea from 'react-textarea-autosize'

export const InputMaterial = ({
  name,
  type,
  className,
  label,
  helperText,
  charLimit,
  stateRef,
  onChange,
  setRef,
  ...rest
}) => {
  const input = (
    <input
      type={type}
      name={name}
      id={name}
      className={cx(
          className,
          stateRef ? 'has-input' : ''
        )}
      onChange={onChange}
      onBlur={onChange}
      ref={setRef ? el => { setRef(el, name) } : () => false}
      {...rest}
    />
  )
  const textarea = (
    <Textarea
      type={type}
      name={name}
      id={name}
      className={cx(
          className,
          stateRef ? 'has-input' : ''
        )}
      onChange={onChange}
      onBlur={onChange}
      inputRef={setRef ? el => { setRef(el, name) } : () => false}
      // autoFocus
      {...rest}
    />
  )
  const search = (
    <input
      type={type}
      name={name}
      id={name}
      className={cx(
          className,
          stateRef ? 'has-input' : ''
        )}
      onChange={onChange}
      onBlur={onChange}
      ref={el => setRef(el, name)}
      {...rest}
    />
  )
  let inputElement = input
  if (type === 'textarea') {
    inputElement = textarea
  }
  if (type === 'search') {
    inputElement = search
  }
  stateRef = stateRef || '' // eslint-disable-line

  return (
    <div className='col-12 group'>
      {inputElement}
      <span className='bar' />
      <label>{label}</label>
      {
        (!helperText && charLimit && <small className={cx('helper-text', stateRef.length > charLimit ? 'invalid' : '')}>Recommended length: {stateRef.length ? stateRef.length : '0'}/{charLimit} characters</small>)
        ||
        (helperText && !charLimit && <small className='helper-text'>{helperText}</small>)
      }
    </div>
  )
}

InputMaterial.defaultProps = { type: 'text' }

InputMaterial.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  charLimit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  stateRef: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.bool
  ]),
  onChange: PropTypes.func,
  setRef: PropTypes.func
}
