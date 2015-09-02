/* global window */
import React from 'react'
import formatMessage from 'format-message'
import resolve from '../../common/resolve-url'
import './edit.css'

export default class EditPlayerView extends React.Component {
  static displayName = 'EditPlayerView'

  static propTypes = {
    player: React.PropTypes.object,
    create: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired
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
      || nextState.name !== this.state.name
      || nextState.gender !== this.state.gender
      || nextState.avatar !== this.state.avatar
    )
  }

  componentWillUnmount () {
    if (this.img) {
      this.img.onload = null
      this.img = null
    }
  }

  didChangeAvatar = evt => {
    const file = evt.target.files[0]
    const URL = window.URL || window.webkitURL

    if (this.img) this.img.onload = null
    const img = this.img = new window.Image()
    img.onload = () => {
      this.img = null

      const { naturalWidth, naturalHeight } = img
      let x = 0
      let y = 0
      let width = 128
      let height = 128
      if (naturalWidth > naturalHeight) {
        width = naturalWidth * height / naturalHeight
        x = Math.round((height - width) / 2)
      } else {
        height = naturalHeight * width / naturalWidth
        y = Math.round((width - height) / 2)
      }

      const document = window.document
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 128
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, x, y, width, height)
      const avatar = canvas.toDataURL('image/jpeg')
      this.setState({ avatar })

      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
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
    window.history.back()
  }

  render () {
    return (
      <form className='EditPlayerView' onSubmit={ this.didSubmit }>
        <input type='hidden' name='id' value={ this.state.id } />
        <label>
          { formatMessage('Name') }
          <input type='text' name='name' value={ this.state.name }
            onChange={ ({ target }) => this.setState({ name: target.value }) }
          />
        </label>
        <fieldset>
          <legend title={
            formatMessage('Used in choosing proper he / she / they in game text.')
          }>
            { formatMessage('Gender') }
          </legend>
          <label>
            <input type='radio' name='gender' value='male'
              checked={ this.state.gender === 'male' }
              onChange={ () => this.setState({ gender: 'male' }) }
            />
            { formatMessage('Male') }
          </label>
          <label>
            <input type='radio' name='gender' value='female'
              checked={ this.state.gender === 'female' }
              onChange={ () => this.setState({ gender: 'female' }) }
            />
            { formatMessage('Female') }
          </label>
          <label>
            <input type='radio' name='gender' value='other'
              checked={ this.state.gender === 'other' }
              onChange={ () => this.setState({ gender: 'other' }) }
            />
            { formatMessage('Other') }
          </label>
        </fieldset>
        <label className='EditPlayerView-avatar'>
          { this.state.avatar &&
            <img className='EditPlayerView-avatarImg'
              alt={ this.state.name }
              src={ this.state.avatar }
            />
          }
          <input className='EditPlayerView-avatarInput'
            type='file' name='avatar' defaultValue=''
            onChange={ this.didChangeAvatar }
          />
          { formatMessage('Picture') }
        </label>
        <div>
          <button type='submit'>
            { formatMessage('Save') }
          </button>
          { this.props.player &&
            <button type='button' onClick={ this.didClickRemove }>
              { formatMessage('Remove') }
            </button>
          }
          <button type='button' onClick={ () => window.history.back() }>
            { formatMessage('Cancel') }
          </button>
        </div>
      </form>
    )
  }
}
