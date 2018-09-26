import React from 'react'
import PropTypes from 'prop-types'

import Title from './ppp-steps/title'
import Summary from './ppp-steps/summary'
import Description from './ppp-steps/description'
import CreateTargets from '../../../containers/create-targets'
import Review from './ppp-steps/review'
import Tip from './ppp-steps/tip'
import Signup from './ppp-steps/signup'
import '../../../../css/create.scss'

import Config from '../../../config'

const CreatePetitionForm = ({
  updateStateFromValue,
  getStateValue,
  nextStep,
  toggleOpen,
  onTargetAdd,
  onTargetRemove,
  publish,
  targets,
  targetQuery,
  step,
  setRef
}) => {
  const titleStep = (<Title
    toggleOpen={toggleOpen}
    updateStateFromValue={updateStateFromValue}
    getStateValue={getStateValue}
    nextStep={nextStep}
    setRef={setRef}
  />)
  const summaryStep = (<Summary
    toggleOpen={toggleOpen}
    updateStateFromValue={updateStateFromValue}
    getStateValue={getStateValue}
    nextStep={nextStep}
    setRef={setRef}
  />)
  const descriptionStep = (<Description
    toggleOpen={toggleOpen}
    updateStateFromValue={updateStateFromValue}
    getStateValue={getStateValue}
    nextStep={nextStep}
    setRef={setRef}
  />)
  const targetsStep = (<CreateTargets
    toggleOpen={toggleOpen}
    nextStep={nextStep}
    updateStateFromValue={updateStateFromValue}
    getStateValue={getStateValue}
    onTargetAdd={onTargetAdd}
    onTargetRemove={onTargetRemove}
    targets={targets}
    targetQuery={targetQuery}
    theme='ppp'
    step={step}
    setRef={setRef}
  />)
  const reviewStep = (<Review
    toggleOpen={toggleOpen}
    updateStateFromValue={updateStateFromValue}
    getStateValue={getStateValue}
    nextStep={publish}
    onTargetAdd={onTargetAdd}
    onTargetRemove={onTargetRemove}
    targets={targets}
    targetQuery={targetQuery}
    setRef={setRef}
  />)

  const tip = (<Tip
    toggleOpen={toggleOpen}
    getStateValue={getStateValue}
  />)
  const signup = (<Signup
    afterSignup={nextStep}
    getStateValue={getStateValue}
    toggleOpen={toggleOpen}
    updateStateFromValue={updateStateFromValue}
    type='ppp'
  />)

  const name = getStateValue('name')
  const nearbyCount = getStateValue('nearby_count')
  const progressWidth = `${(step / 6) * 100}%`
  const progressStyles = {
    width: progressWidth
  }

  return (
    <div id='ppp'>
      <div className='container-fluid ppp-page-heading bg-off-white'>
        <div className='progress-bar bg-azure' style={progressStyles} />
        <div className='background'>
          <img alt='background' src={`${Config.STATIC_ROOT}images/ppp-heading-background.svg`} />
        </div>
        <div className='row'>
          <div className='col-12 heading-title-wrap'>
            <a href='https://front.moveon.org/'>
              <img className='logo' src={`${Config.STATIC_ROOT}images/logo-reverse-blue.svg`} alt='MoveOn Logo' />
            </a>
            <h2 className='bg-white'>
              {
              (step === 7 && `Congratulations, ${name}! Let’s get your first 10 signatures.`) ||
              (nearbyCount > 10 && `${nearbyCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} MoveOn members in your area have recently taken action.`) ||
              ('Millions of MoveOn members sign petitions.')
            }
            </h2>
          </div>
        </div>
      </div>

      <form id='petition_form'>
        {titleStep}
        {summaryStep}
        {descriptionStep}
        {targetsStep}
        {reviewStep}
        {tip}
      </form>
      {signup}
    </div>
  )
}

CreatePetitionForm.propTypes = {
  toggleOpen: PropTypes.func,
  nextStep: PropTypes.func,
  updateStateFromValue: PropTypes.func,
  getStateValue: PropTypes.func,
  publish: PropTypes.func,
  onTargetAdd: PropTypes.func,
  onTargetRemove: PropTypes.func,
  targets: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array
  ]),
  targetQuery: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  step: PropTypes.number,
  setRef: PropTypes.func
}

export default CreatePetitionForm
