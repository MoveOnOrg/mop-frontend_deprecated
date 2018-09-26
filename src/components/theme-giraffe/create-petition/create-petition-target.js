import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadTargets } from '../../../actions/createPetitionActions'

import { TargetForm } from 'LegacyTheme/form/target-select'
import NationalTargetSelect from 'LegacyTheme/form/target-select/national'
import StateTargetSelect from 'LegacyTheme/form/target-select/state'
import CustomTargetSelect from '../../../components/theme-legacy/form/target-select/custom'

export class CreatePetitionTarget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nationalOpen: false,
      geoState: null,
      stateOpen: false,
      customOpen: false
    }

    this.toggleOpen = this.toggleOpen.bind(this)
    this.renderNational = this.renderNational.bind(this)
    this.renderGeoState = this.renderGeoState.bind(this)
    this.renderCustom = this.renderCustom.bind(this)
  }

  componentDidMount() {
    // Preload congress for autocomplete
    this.props.dispatch(loadTargets('national')).then(
      // result => {
      // }
    )

    // Handle if we need to preload a geoState
    if (this.state.stateTargets && this.state.stateTargets.length) {
      this.props.dispatch(
        loadTargets('state', this.state.stateTargets[0].target_id)
      )
    }
  }

  toggleOpen(key) {
    return () => this.setState(prev => ({ [key]: !prev[key] }))
  }

  renderNational() {
    if (!this.state.nationalOpen) return null
    return (
      <NationalTargetSelect
        selected={this.state.nationalTargets}
        remove={this.props.onTargetRemove}
        onSelect={this.props.onTargetAdd}
      />
    )
  }

  renderGeoState() {
    if (!this.state.stateOpen) return null
    return (
      <StateTargetSelect
        geoState={this.state.geoState}
        selected={this.state.stateTargets}
        remove={this.props.onTargetRemove}
        onSelect={this.props.onTargetAdd}
        onChangeGeoState={event => {
          const { value } = event.target
          this.props.dispatch(loadTargets('state', value))
          this.setState({ geoState: value })
        }}
      />
    )
  }

  renderCustom() {
    const { customOpen } = this.state
    if (!customOpen) return null
    return (
      <CustomTargetSelect
        selected={this.state.customTargets}
        remove={this.props.onTargetRemove}
        onSelect={target => {
          this.props.onTargetAdd(target, { isCustom: true })
        }}
        customInputs={this.props.customInputs}
        onChangeInputs={this.props.onChangeCustomInputs}
      />
    )
  }

  render() {
    const { setSelected, setRef } = this.props

    return (
      <TargetForm
        setSelected={setSelected}
        setRef={setRef}
        renderNational={this.renderNational}
        renderGeoState={this.renderGeoState}
        renderCustom={this.renderCustom}
        toggleOpen={this.toggleOpen}
        nationalOpen={this.state.nationalOpen}
        stateOpen={this.state.stateOpen}
        customOpen={this.state.customOpen}
      />
    )
  }
}

CreatePetitionTarget.propTypes = {
  setSelected: PropTypes.func,
  setRef: PropTypes.func,
  onTargetAdd: PropTypes.func,
  onTargetRemove: PropTypes.func,
  dispatch: PropTypes.func,
  // eslint-disable-next-line
  targets: PropTypes.array,
  customInputs: PropTypes.object,
  onChangeCustomInputs: PropTypes.func
}
function mapStateToProps({ petitionTargetStore }) {
  return {
    targets: petitionTargetStore
  }
}

export default connect(mapStateToProps)(CreatePetitionTarget)
