/* global window */
import React from 'react'
import formatMessage from 'format-message'
import Form from 'elemental/lib/components/Form'
import FormField from 'elemental/lib/components/FormField'
import FormInput from 'elemental/lib/components/FormInput'
import Modal from 'elemental/lib/components/Modal'
import ModalHeader from 'elemental/lib/components/ModalHeader'
import ModalBody from 'elemental/lib/components/ModalBody'
import ModalFooter from 'elemental/lib/components/ModalFooter'
import EditPlayerGender from './edit-gender'
import EditPlayerAvatar from './edit-avatar'
import EditModalButtons from './edit-modal-buttons'

export default class EditPlayerModal extends React.Component {
  static displayName = 'EditPlayerModal'

  static propTypes = {
    player: React.PropTypes.object,
    create: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = this.getStateFromPlayer(props.player)
  }

  getStateFromPlayer (player) {
    const {
      id,
      name = formatMessage('New Player'),
      gender = 'other',
      avatar = null
    } = player || {}
    return { id, name, gender, avatar }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.player !== this.props.player) {
      this.state = this.getStateFromPlayer(nextProps.player)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.player !== this.props.player ||
      nextProps.isOpen !== this.props.isOpen ||
      nextProps.onClose !== this.props.onClose ||
      nextState.name !== this.state.name ||
      nextState.gender !== this.state.gender ||
      nextState.avatar !== this.state.avatar
    )
  }

  didClickRemove (evt) {
    const msg = formatMessage('Are you sure you want to remove { name }?', {
      name: this.state.name
    })
    if (window.confirm(msg)) {
      this.props.onClose()
      this.props.delete(this.props.player)
    }
  }

  didSubmit (evt) {
    evt.preventDefault()
    let { id, name, gender, avatar } = this.state
    if (!id) {
      id = Math.random().toString(16).slice(2)
      this.props.create({ id, name, gender, avatar })
    } else {
      this.props.update({ id, name, gender, avatar })
    }
    this.props.onClose()
  }

  render () {
    const { player, isOpen, onClose } = this.props
    const { id, name, gender, avatar } = this.state
    return (
      <Modal isOpen={ isOpen } onCancel={ onClose } backdropClosesModal>
        <Form className='EditPlayerView' onSubmit={ e => this.didSubmit(e) }>
          <ModalHeader
            showCloseButton
            onClose={ onClose }
            text={ player
              ? formatMessage('Update { name }', { name: player.name })
              : formatMessage('Add Player')
            }
          />
          <ModalBody>
            <input type='hidden' name='id' value={ id } />
            <FormField label={ formatMessage('Name') } htmlFor='name'>
              <FormInput
                type='text'
                name='name'
                value={ name }
                onChange={ ({ target }) => this.setState({ name: target.value }) }
              />
            </FormField>
            <EditPlayerGender
              value={ gender }
              onChange={ gender => this.setState({ gender }) }
            />
            <EditPlayerAvatar
              value={ avatar }
              onChange={ avatar => this.setState({ avatar }) }
            />
          </ModalBody>
          <ModalFooter>
            <EditModalButtons
              cancel={ onClose }
              remove={ player ? e => this.didClickRemove(e) : null }
            />
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}
