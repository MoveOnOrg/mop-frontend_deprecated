import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Scroll from 'react-scroll'

import Config from '../config'

import { previewSubmit, submit, devLocalSubmit } from '../actions/createPetitionActions'
import { conversation } from 'GiraffeUI/conversation/conversation'

import CreatePetitionForm from 'GiraffeTheme/create-petition/create-petition-form'
import CreatePetitionFormConversation from 'GiraffeTheme/create-petition/create-petition-form-conversation'

import { isValidEmail } from '../lib'

const CONVO_ERRORS = {
  empty: {
    email: 'Please provide your email.',
    title: 'Please provide a title for your petition.',
    summary: 'Please fill in the statement for your petition.',
    target: 'You must select at least one target for your petition.',
    description: 'Please provide background info for your petition.'
  },
  maxChar: {
    title: 50,
    summary: 100,
    description: 500
  }
}
const STEPS = ['title', 'summary', 'description', 'target', 'reviewTarget']

class CreatePetition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      createRef: [],
      currentRef: false,
      // User Data
      name: false,
      email: false,
      country: false,
      zip: false,
      password: false,
      passwordConfirm: false,
      nearby_count: false,
      // Petition Data
      title: false,
      summary: false,
      target: false,
      description: false,
      targetQuery: '',
      customInputs: { name: '', email: '', title: '' },
      errors: [],
      isPublishing: false,
      // Flow control
      step: 1,
      section: 0,
      sectionLengths: [],
      currentBubble: 0,
      currentIndex: 0,
      bubbleShow: false,
      bubbleLoading: false,
      bubbleEdit: false,
      currentTip: 0,
      // Toggles
      signupModalToggled: false,
      tipModalToggled: false,
      shareButtonsToggled: false,
      editPetition: false,
      convoReviewToggled: false,
      loginToggled: false
    }
    this.targetHasFocused = false
    this.nextStep = this.nextStep.bind(this)
    this.getSectionLengths = this.getSectionLengths.bind(this)
    this.callSection = this.callSection.bind(this)
    this.nextSection = this.nextSection.bind(this)
    this.callBubble = this.callBubble.bind(this)
    this.nextBubble = this.nextBubble.bind(this)
    this.saveInput = this.saveInput.bind(this)
    this.toggleEditBubble = this.toggleEditBubble.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.updateStateFromValue = this.updateStateFromValue.bind(this)
    this.getStateValue = this.getStateValue.bind(this)
    this.toggleOpen = this.toggleOpen.bind(this)
    this.toggleConvoTip = this.toggleConvoTip.bind(this)
    this.onTargetAdd = this.onTargetAdd.bind(this)
    this.onTargetRemove = this.onTargetRemove.bind(this)
    this.submitPetition = this.submitPetition.bind(this)
    this.validateAndContinue = this.validateAndContinue.bind(this)
    this.setRef = this.setRef.bind(this)
    this.petitionRefs = {
      userInput: false,
      title: false,
      summary: false,
      description: false,
      target: false,
      reviewTarget: false
    }
  }

  static getDerivedStateFromProps(props) {
    let createType

    if (props.params) {
      const paramTheme = props.params.type
      createType = paramTheme === 'chat' ? 'chat' : 'p'
    } else {
      createType = 'p'
    }

    return {
      createType
    }
  }

  componentDidMount() {
    this.getSectionLengths()
    this.initSection = setTimeout(() => {
      this.callSection()
    }, 500)
  }
  componentDidUpdate() {
    // if ((this.state.step === 4 || this.state.currentIndex === 20) && !this.targetHasFocused) {
    //   this.focusRef()
    //   this.targetHasFocused = true
    // }
  }

  // --------------------
  // TARGETS
  // --------------------
  onTargetAdd(target, { isCustom } = { isCustom: false }) {
    return () => {
      if (!isCustom && !target.label) return // target is invalid
      if (!isCustom && this.state.target) {
        if (this.state.target.find(old => old.label === target.label || old.name === target.name)) return // already exists
      }
      if (isCustom && !this.state.targetQuery) return // Trying to add a blank custom target
      if (isCustom) {
        this.setState({ customInputs: { name: '', email: '', title: '' } })
      }
      this.setState({ target: [...this.state.target, target], targetQuery: '' })
      setTimeout(() => {
        const currentStep = STEPS[this.state.step - 1]
        const convoTarget = this.state.convoReviewToggled ? this.petitionRefs.reviewTarget : this.petitionRefs.target
        const ref = this.state.createType === 'p' ? this.petitionRefs[currentStep] : convoTarget
        ref.value = ''
        ref.focus()
        if (this.state.createType !== 'p') this.scrollToBottom()
      }, 50)
    }
  }

  onTargetRemove(target) {
    return () => {
      this.setState(state => ({
        target: state.target.filter(e => e.label !== target.label)
      }))
    }
  }

  // --------------------
  // SHARED
  // --------------------
  getSectionLengths() { // Get the length of each section in the conversation script to control how many bubbles are displayed before the user is given an input prompt
    const sections = []
    const sectionLengths = []
    let count = 0
    conversation.forEach(el => {
      if (Object.prototype.hasOwnProperty.call(el, 'section')) sections.push(el.section)
    })
    for (let i = 0; i < sections[sections.length - 1]; i += 1) {
      /* eslint-disable no-loop-func */
      sections.forEach(el => {
        if (el === i) count += 1
      })
      sectionLengths.push(count)
      count = 0
    }
    this.setState(prevState => {
      const newState = prevState.sectionLengths.concat(sectionLengths)
      return { sectionLengths: newState }
    })
  }

  getStateValue(field) {
    return this.state[field]
  }

  setRef(ref, label) {
    if (ref && label) {
      const theme = this.state.createType === 'p' ? 'ppp' : 'convo'
      this.petitionRefs[label] = ref
      if ((theme === 'ppp' && this.state.step === 1) || (theme === 'convo' && this.state.currentIndex === 0)) this.focusRef()
    }
  }

  focusRef() {
    if (this.state.createType === 'p') {
      const key = STEPS[this.state.step - 1]
      if (this.petitionRefs[key]) this.petitionRefs[key].focus()
    } else if (this.petitionRefs.userInput) {
      const index = this.state.currentIndex
      this.petitionRefs.userInput.focus()
      if (Object.prototype.hasOwnProperty.call(conversation[index], 'input') && conversation[index].input.type === 'target' && this.petitionRefs.target) {
        this.petitionRefs.target.focus()
      }
    }
  }

  updateStateFromValue(field, isCheckbox = false) {
    return event => {
      const value = isCheckbox ? event.target.checked : event.target.value
      this.setState({
        [field]: value
      })
    }
  }

  toggleOpen(element, id = 0) {
    return () => {
      if (id) this.setState({ step: id })
      this.setState(prevState => {
        const prev = prevState[element]
        return { [element]: !prev }
      })
    }
  }

  // --------------------
  // PPP
  // --------------------
  nextStep() {
    if (this.state.step === 1) {
      if (this.state.zip && !this.state.nearby_count) {
        const url = `${Config.API_URI}/targets/zip?zip=${this.state.zip}`

        fetch(url).then(
          response => response.json()).then(data => {
            if (data.nearby_count > 10) this.setState({ nearby_count: data.nearby_count })
          })
      }
    }
    this.scrollToTop()
    this.setState(prevState => {
      const newStep = prevState.step + 1
      return { step: newStep, signupModalToggled: false }
    }, this.focusRef)
  }

  // --------------------
  // CONVERSATION
  // --------------------
  nextSection() {
    this.setState(prevState => {
      const newSection = prevState.section + 1
      return { section: newSection }
    })
  }

  callSection() {
    const sectionLength = this.state.sectionLengths[this.state.section]
    this.setState({ bubbleLoading: true })
    this.callBubble(sectionLength)
  }

  callBubble(sectionLength) {
    const bubbleLength = conversation[this.state.currentIndex].content.length
    const bubbleTime = ((bubbleLength / 60) * 1000) >= 800 ? ((bubbleLength / 60) * 1000) : 800
    this.bubbleTimeout = setTimeout(() => {
      this.nextBubble()
      if (this.state.currentBubble < sectionLength) {
        this.callBubble(sectionLength)
      } else {
        this.setState({ bubbleLoading: false, currentBubble: 0 })
      }
    }, bubbleTime)
  }

  nextBubble() {
    setTimeout(() => {
      this.focusRef()
      this.scrollToBottom()
    }, conversation[this.state.currentIndex].name === 'target-tips' ? 700 : 200)
    this.setState(prevState => {
      const newBubble = prevState.currentBubble + 1
      const newIndex = prevState.currentIndex + 1
      return { currentBubble: newBubble, currentIndex: newIndex }
    })
  }

  saveInput(inputType) {
    const uinput = this.petitionRefs.userInput
    return () => {
      this.setState({ errors: [] })
      if (!this.convoInputIsValid(inputType)) return
      this.nextBubble()
      this.setState({ currentBubble: 0 })
      uinput.value = ''
      uinput.focus()
      this.inputTimeout = setTimeout(() => {
        this.setState({})
        this.nextSection()
        this.callSection()
      }, 500)
    }
  }

  toggleEditBubble(inputType) {
    if (!this.state.bubbleEdit) return () => this.setState({ bubbleEdit: inputType }) // Toggle bubble editing on
    return () => { // Validate and toggle bubble editing off
      this.setState({ errors: [] })
      if (!this.convoInputIsValid(inputType)) return
      this.setState({ bubbleEdit: false })
    }
  }

  toggleConvoTip(i) {
    return () => {
      this.setState({ currentTip: i })
      this.setState(prevState => {
        const prev = prevState.tipModalToggled
        return { tipModalToggled: !prev }
      })
    }
  }

  /* eslint-disable class-methods-use-this */
  scrollToBottom() {
    Scroll.animateScroll.scrollToBottom({
      smooth: true,
      containerId: 'chat-wrap',
      duration: 700
    })
  }

  scrollToTop() {
    window.scrollTo(0, 0)
  }


  // --------------------
  // VALIDATION
  // --------------------
  validateAndContinue() {
    if (this.formIsValid()) {
      this.props.dispatch(
        previewSubmit({
          title: this.state.title,
          summary: this.state.summary,
          target: this.state.target,
          description: this.state.description,
          source: this.state.source,
          clonedFromId: this.state.clonedFromId,
          solicitId: this.state.solicitId
        })
      )
      this.submitPetition()
    }
  }

  formIsValid() {
    const { title, summary, target, description } = this.state
    const errors = []
    if (!title) errors.push(CONVO_ERRORS.name)
    if (!summary) errors.push(CONVO_ERRORS.text_statement)
    if (!target) errors.push(CONVO_ERRORS.target)
    if (!description) errors.push(CONVO_ERRORS.text_about)
    if (errors.length) {
      this.setState({ errors })
      return false
    }
    return true
  }

  convoInputIsValid(inputType) {
    const errors = []
    if (!this.state[inputType]) errors.push(CONVO_ERRORS.empty[inputType])
    if (inputType === 'email' && this.state.email) {
      if (!isValidEmail(this.state.email)) errors.push('Please use a valid email address.')
    }
    if (errors.length) {
      this.setState({ errors })
      return false
    }
    return true
  }

  // SUBMIT
  submitPetition() {
    this.setState(prevState => {
      const newState = prevState.isPublishing
      return { isPublishing: !newState }
    })
    return this.props.dispatch(Config.API_WRITABLE ? submit(this.state.zip) : devLocalSubmit())
  }


  render() {
    if (this.state.createType === 'p') {
      return (
        <div className='moveon-petitions'>
          <CreatePetitionForm
            updateStateFromValue={this.updateStateFromValue}
            getStateValue={this.getStateValue}
            nextStep={this.nextStep}
            toggleOpen={this.toggleOpen}
            editPetition={this.state.editPetition}
            onTargetAdd={this.onTargetAdd}
            onTargetRemove={this.onTargetRemove}
            publish={this.validateAndContinue}
            targets={this.state.target}
            targetQuery={this.state.targetQuery}
            step={this.state.step}
            submitPetition={this.submitPetition}
            setRef={this.setRef}
          />
        </div>
      )
    }
      return (
        <div className='moveon-petitions'>
          <CreatePetitionFormConversation
            updateStateFromValue={this.updateStateFromValue}
            getStateValue={this.getStateValue}
            toggleOpen={this.toggleOpen}
            nextSection={this.nextSection}
            toggleConvoTip={this.toggleConvoTip}
            toggleEditBubble={this.toggleEditBubble}
            saveInput={this.saveInput}
            chatEnd={this.state.chatEnd}
            onTargetAdd={this.onTargetAdd}
            onTargetRemove={this.onTargetRemove}
            publish={this.validateAndContinue}
            targetQuery={this.state.targetQuery}
            targets={this.state.target}
            currentIndex={this.state.currentIndex}
            submitPetition={this.submitPetition}
            setRef={this.setRef}
          />
        </div>
      )
  }
}

CreatePetition.propTypes = {
  dispatch: PropTypes.func
}

export default withRouter(connect()(CreatePetition))
