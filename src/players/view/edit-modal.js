/* global window */
const { createClass, createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const Form = require('elemental/lib/components/Form')
const FormField = require('elemental/lib/components/FormField')
const FormInput = require('elemental/lib/components/FormInput')
const Modal = require('elemental/lib/components/Modal')
const ModalHeader = require('elemental/lib/components/ModalHeader')
const ModalBody = require('elemental/lib/components/ModalBody')
const ModalFooter = require('elemental/lib/components/ModalFooter')
const EditPlayerGender = require('./edit-gender')
const EditPlayerAvatar = require('./edit-avatar')
const EditModalButtons = require('./edit-modal-buttons')

module.exports = createClass({
  displayName: 'EditPlayerModal',

  propTypes: {
    player: PropTypes.object,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    updateAvatar: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired
  },

  getInitialState () {
    return this.getStateFromPlayer(this.props.player)
  },

  getStateFromPlayer (player) {
    const {
      id,
      name = formatMessage('New Player'),
      gender = 'other',
      avatar = null
    } = player || {}
    return { id, name, gender, avatar }
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.player !== this.props.player) {
      this.setState(this.getStateFromPlayer(nextProps.player))
    }
  },

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.player !== this.props.player ||
      nextProps.isOpen !== this.props.isOpen ||
      nextProps.onClose !== this.props.onClose ||
      nextState.name !== this.state.name ||
      nextState.gender !== this.state.gender ||
      nextState.avatar !== this.state.avatar
    )
  },

  didClickRemove (evt) {
    const msg = formatMessage('Are you sure you want to remove { name }?', {
      name: this.state.name
    })
    if (window.confirm(msg)) {
      this.props.onClose()
      this.props.delete(this.props.player)
    }
  },

  didSubmit (evt) {
    evt.preventDefault()
    const { player } = this.props
    let { id, name, gender, avatar } = this.state
    if (!id) {
      id = Math.random().toString(16).slice(2)
      this.props.create({ id, name, gender })
    } else {
      this.props.update({ id, name, gender })
    }
    if (player.avatar !== avatar) {
      const lastUpdated = Math.floor(Date.now() / 1000)
      this.props.updateAvatar({ id, avatar, lastUpdated })
    }
    this.props.onClose()
  },

  didChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  },

  render () {
    const { player, isOpen, onClose } = this.props
    const { id, name, gender, avatar } = this.state
    return (
      h(Modal, { isOpen, onCancel: onClose, backdropClosesModal: true },
        h(Form, { className: 'EditPlayerView', onSubmit: this.didSubmit },
          h(ModalHeader, {
            showCloseButton: true,
            onClose: onClose,
            text: player
              ? formatMessage('Update { name }', { name: player.name })
              : formatMessage('Add Player')
          }),
          h(ModalBody, null,
            h('input', { type: 'hidden', name: 'id', value: id }),
            h(FormField, { label: formatMessage('Name'), htmlFor: 'name' },
              h(FormInput, {
                type: 'text',
                name: 'name',
                value: name,
                onChange: this.didChange
              })
            ),
            h(EditPlayerGender, {
              value: gender,
              onChange: this.didChange
            }),
            h(EditPlayerAvatar, {
              value: avatar,
              onChange: this.didChange
            })
          ),
          h(ModalFooter, null,
            h(EditModalButtons, {
              cancel: onClose,
              remove: player ? this.didClickRemove : null
            })
          )
        )
      )
    )
  }
})
