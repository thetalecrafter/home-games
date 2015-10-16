/* global window */
import React from 'react'
import formatMessage from 'format-message'
import Form from 'elemental/lib/components/Form'
import FormField from 'elemental/lib/components/FormField'
import FormInput from 'elemental/lib/components/FormInput'
import Button from 'elemental/lib/components/Button'
import Radio from 'elemental/lib/components/Radio'
import InputGroup from 'elemental/lib/components/InputGroup'
import Glyph from 'elemental/lib/components/Glyph'
import Modal from 'elemental/lib/components/Modal'
import ModalHeader from 'elemental/lib/components/ModalHeader'
import ModalBody from 'elemental/lib/components/ModalBody'
import ModalFooter from 'elemental/lib/components/ModalFooter'
import EditPlayerAvatar from './edit-avatar'

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
      nextProps.player !== this.props.player
      || nextProps.isOpen !== this.props.isOpen
      || nextProps.onClose !== this.props.onClose
      || nextState.name !== this.state.name
      || nextState.gender !== this.state.gender
      || nextState.avatar !== this.state.avatar
    )
  }

  didClickRemove = evt => {
    const msg = formatMessage('Are you sure you want to remove { name }?', {
      name: this.state.name
    })
    if (window.confirm(msg)) {
      this.props.delete(this.props.player)
      window.history.back()
    }
  }

  didSubmit = evt => {
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
    const formId = this.props.player
      ? 'player-' + this.props.player.id
      : 'player-new'
    return (
      <Modal isOpen={ this.props.isOpen } onCancel={ this.props.onClose } backdropClosesModal>
        <ModalHeader
          showCloseButton
          onClose={ this.props.onClose }
          text={ this.props.player
            ? formatMessage('Update { name }', { name: this.props.player.name })
            : formatMessage('Add Player')
          }
        />
        <ModalBody>
          <Form className='EditPlayerView' onSubmit={ this.didSubmit } id={ formId }>
            <input type='hidden' name='id' value={ this.state.id } />
            <FormField label={ formatMessage('Name') } htmlFor='name'>
              <FormInput
                type='text'
                name='name'
                value={ this.state.name }
                onChange={ ({ target }) => this.setState({ name: target.value }) }
              />
            </FormField>
            <FormField
              label={ formatMessage('Gender') }
              title={ formatMessage('Used in choosing proper he / she / they in game text.') }
            >
              <div className='inline-controls'>
                <Radio
                  label={ formatMessage('Male') }
                  name='gender' value='male'
                  checked={ this.state.gender === 'male' }
                  onChange={ () => this.setState({ gender: 'male' }) }
                />
                <Radio
                  label={ formatMessage('Female') }
                  name='gender' value='female'
                  checked={ this.state.gender === 'female' }
                  onChange={ () => this.setState({ gender: 'female' }) }
                />
                <Radio
                  label={ formatMessage('Other') }
                  name='gender' value='other'
                  checked={ this.state.gender === 'other' }
                  onChange={ () => this.setState({ gender: 'other' }) }
                />
              </div>
            </FormField>
            <EditPlayerAvatar
              value={ this.state.avatar }
              onChange={ ({ target }) => this.setState({ avatar: target.value }) }
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <InputGroup>
            <InputGroup.Section>
              <Button type='primary' submit form={ formId }>
                { formatMessage('Save') }
              </Button>
            </InputGroup.Section>
            <InputGroup.Section>
              <Button type='link-cancel' onClick={ this.props.onClose }>
                { formatMessage('Cancel') }
              </Button>
            </InputGroup.Section>
            <InputGroup.Section grow />
            { this.props.player &&
              <InputGroup.Section>
                <Button
                  type='link-delete'
                  title={ formatMessage('Remove Player') }
                  onClick={ this.didClickRemove }
                >
                  <Glyph icon='trashcan' />
                </Button>
              </InputGroup.Section>
            }
          </InputGroup>
        </ModalFooter>
      </Modal>
    )
  }
}
