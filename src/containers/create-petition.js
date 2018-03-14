import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadTargets } from '../actions/createPetitionActions'

import CreatePetitionForm from 'LegacyTheme/create-petition-form'

class CreatePetition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'title',
      nationalOpen: false,
      stateOpen: false,
      customOpen: false
    }
    this.setSelected = this.setSelected.bind(this)
    this.setRef = this.setRef.bind(this)
    this.toggleOpen = this.toggleOpen.bind(this)
  }

  componentDidMount() {
    // Preload congress for autocomplete
    this.props.dispatch(loadTargets('national'))
  }

  setSelected(name) {
    return () => this.setState({ selected: name })
  }

  setRef(name) {
    return input => input && (this[name] = input)
  }
  toggleOpen(section) {
    return () => this.setState(prevState => {
      const prev = prevState[section]
      return { [section]: !prev }
    })
  }

  render() {
    const elementByField = {
      title: this.titleInput,
      statement: this.statementInput,
      'target-national': this.nationalInput,
      'target-state': this.stateInput,
      'target-custom': this.customInput,
      about: this.aboutInput
    }

    const instructionStyle = { position: 'relative', top: -45 }
    const selectedElement = elementByField[this.state.selected]
    const bodyTop = document.body.getBoundingClientRect().top + 175

    if (typeof selectedElement !== 'undefined') {
      instructionStyle.top = selectedElement.getBoundingClientRect().top - bodyTop
    }

    return (
      <div className='moveon-petitions'>
        <CreatePetitionForm
          setSelected={this.setSelected}
          setRef={this.setRef}
          toggleOpen={this.toggleOpen}
          selected={this.state.selected}
          nationalOpen={this.state.nationalOpen}
          stateOpen={this.state.stateOpen}
          customOpen={this.state.customOpen}
          instructionStyle={instructionStyle}
        />
      </div>
    )
  }
}

CreatePetition.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(CreatePetition)
