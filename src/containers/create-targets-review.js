import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReviewTargets from '../components/theme-giraffe/create-petition/ppp-steps/review-targets'
import cx from 'classnames'
import AddSvg from '../giraffe-ui/svgs/add.svg'

export class CreateTargetsReview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      load: 10,
      filteredTargets: false
    }

    this.renderTargets = this.renderTargets.bind(this)
    this.renderSelectedTargets = this.renderSelectedTargets.bind(this)
    this.loadMoreTargets = this.loadMoreTargets.bind(this)
    this.renderTargets = this.renderTargets.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
    this.renderCustomTarget = this.renderCustomTarget.bind(this)
  }

  static getDerivedStateFromProps(props) {
    const allTargets = props.items
    let filteredTargets = allTargets.map((target, i) => {
      // Filter selected targets
      if (!(props.targets.length && props.targets.some(e => e.label === target.label))) {
        // If exists, make lowercase
        const searchText = !props.targetQuery ? false : props.targetQuery.toLowerCase()
        // Filter query
        if (target.label.toLowerCase().indexOf(searchText) !== -1 || !searchText) {
          const key = i
          return (
            <button className={cx('checkbox-wrap col-12 review-hidden', props.theme === 'ppp' ? 'bg-ice-blue' : 'bg-white')} key={key} onClick={props.onTargetAdd(target, false)}>
              <span>
                {target.label}
              </span>
              <input name={target.value} id={`review-${target.value}`} type='checkbox' title={target.value} />
              <span className='checkmark' />
            </button>
          )
        }
      }
      return false
    })

    filteredTargets = filteredTargets.filter(target => !!target)

    return {
      allTargets,
      filteredTargets
    }
  }

  updateQuery(event) {
    this.renderTargets()
    this.setState({ load: 10 })
    const u = this.props.updateStateFromValue('targetQuery')
    u(event)
  }

  loadMoreTargets() {
    this.setState(prevState => {
      const newLoad = prevState.load + 10
      return { load: newLoad }
    })
    this.renderTargets()
  }

  renderTargets() {
    if (!this.state.filteredTargets) return false
    let filterIndex = 1
    return this.state.filteredTargets.map(target => {
      if (filterIndex < this.state.load) {
        filterIndex += 1
        return target
      }
      return false
    })
  }
  renderSelectedTargets() {
    if (this.props.targets.length) {
      return this.props.targets.map((target, i) => {
        const key = i
        return (
          <div className='col-6 selection-pill' key={key}>
            <div className='pill-inner bg-ice-blue black'>
              {target.name}
              <div className='close bg-azure' onClick={this.props.onTargetRemove(target)}>
                <span className='bg-white' />
                <span className='bg-white' />
              </div>
            </div>
          </div>
        )
      })
    }
    return false
  }

  renderCustomTarget() {
    if (this.props.targetQuery && this.state.filteredTargets.length === 0) {
      return (
        // <div className='col-12'>
        <div className='add-target bg-white' onClick={this.props.onTargetAdd({ target_type: 'custom', name: this.props.targetQuery, email: '', title: '' }, { isCustom: true })}>
          <span>Add <span style={{ fontWeight: 'bold' }}>“{this.props.targetQuery}”</span> as your target</span>
          <div className='add'><AddSvg /></div>
        </div>
        // </div>
      )
    }
    return false
  }

  render() {
    return (
      <ReviewTargets
        step={this.props.step}
        nextStep={this.props.nextStep}
        toggleOpen={this.props.toggleOpen}
        renderTargets={this.renderTargets}
        renderSelectedTargets={this.renderSelectedTargets}
        renderCustomTarget={this.renderCustomTarget}
        targetQuery={this.props.targetQuery}
        updateQuery={this.updateQuery}
        load={this.state.load}
        filteredTargets={this.state.filteredTargets}
        loadMoreTargets={this.loadMoreTargets}
        setRef={this.props.setRef}
      />
    )
  }
}

CreateTargetsReview.propTypes = {
  onTargetAdd: PropTypes.func,
  onTargetRemove: PropTypes.func,
  // eslint-disable-next-line
  customInputs: PropTypes.object,
  updateStateFromValue: PropTypes.func,
  step: PropTypes.number,
  nextStep: PropTypes.func,
  toggleOpen: PropTypes.func,
  targets: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.string
  ]),
  targetQuery: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  setRef: PropTypes.func
}
function mapStateToProps(store) {
  return {
    items:
      (store.petitionTargetsStore && store.petitionTargetsStore.national) || []
  }
}
export default connect(mapStateToProps)(CreateTargetsReview)
