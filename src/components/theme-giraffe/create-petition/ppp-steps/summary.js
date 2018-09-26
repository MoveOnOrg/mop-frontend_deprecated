import React from 'react'
import PropTypes from 'prop-types'
import { InputMaterial } from 'GiraffeUI/input-material'
import cx from 'classnames'
import Lightbulb from '../../../../giraffe-ui/svgs/lightbulb.svg'

const Summary = ({ toggleOpen, updateStateFromValue, getStateValue, nextStep, setRef }) => (
  <div className={cx('statement', 'ppp-step', 'container', getStateValue('step') === 2 ? 'active' : '')}>
    <div className='row ppp-item'>
      <div className='col-12 ppp-heading'>
        <h3>Petition statement</h3>
        <div className='ppp-tip bg-ice-blue' onClick={toggleOpen('tipModalToggled')}>
          Tips
          <span className='bg-white'><Lightbulb /></span>
        </div>
      </div>
      <div className='col-12'>
        <p>In one to two sentences, tell us more about what you want your petition to accomplish.</p>
      </div>
      <InputMaterial name='summary' type='textarea' className='bg-ice-blue' label='Your Petition Statement' charLimit={100} stateRef={getStateValue('summary')} onChange={updateStateFromValue('summary')} setRef={setRef} />
    </div>
    <button
      type='button'
      className='center display-block ppp-btn btn azure'
      name='summary_next'
      id='summary_next'
      onClick={nextStep}
      disabled={!getStateValue('summary')}
    >
     Next
    </button>
  </div>
)

Summary.propTypes = {
  toggleOpen: PropTypes.func,
  updateStateFromValue: PropTypes.func,
  getStateValue: PropTypes.func,
  nextStep: PropTypes.func,
  setRef: PropTypes.func
}

export default Summary
