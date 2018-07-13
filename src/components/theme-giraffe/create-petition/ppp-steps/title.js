import React from 'react'
import PropTypes from 'prop-types'
import { InputMaterial } from 'GiraffeUI/input-material'
import cx from 'classnames'
import Lightbulb from '../../../../giraffe-ui/svgs/lightbulb.svg'

const Title = ({
  toggleOpen,
  updateStateFromValue,
  getStateValue
}) => (
  <div className={cx('title', 'ppp-step', 'container', getStateValue('step') === 1 ? 'active' : '')}>
    <div className='row ppp-item'>
      <div className='col-12'>
        <p>
                  Let’s launch your petition! From local to national, we want to give your voice a platform to help you create progressive change.
        </p>
        <p>
                  Start with a petition title. It should be brief, like a newspaper headline.
        </p>
      </div>
      <div className='col-12 ppp-heading'>
        <h3>Petition title</h3>
        <div className='ppp-tip bg-ice-blue' onClick={toggleOpen('tipModalToggled')}>
                    Tips
          <span className='bg-white'><Lightbulb /></span>
        </div>
      </div>
      <div className='col-12'>
        <p>Start with a petition title - successful titles are brief, like a newspaper headline.</p>
      </div>
      <InputMaterial name='title' type='textarea' className='bg-ice-blue' label='Your Petition Title' charLimit={50} stateRef={getStateValue('title')} onChange={updateStateFromValue('title')} />
    </div>
    <button type='button' className='center display-block ppp-btn btn azure' name='title_next' id='title_next' onClick={toggleOpen('signupModalToggled')} disabled={!getStateValue('title') || getStateValue('title').length > 50}>Next</button>
  </div>
)

Title.propTypes = {
    toggleOpen: PropTypes.func,
    updateStateFromValue: PropTypes.func,
    getStateValue: PropTypes.func
}

export default Title
