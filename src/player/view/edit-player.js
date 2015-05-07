/* global window */
import React from 'react'
import formatMessage from 'format-message'
import './edit-player.css'

export default React.createClass({
  displayName: 'EditPlayerView',

  propTypes: {
    player: React.PropTypes.object,
    cancel: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
    saveText: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      saveText: formatMessage('Create Player')
    }
  },

  getInitialState () {
    return this.getStateFromPlayer(this.props.player)
  },

  getStateFromPlayer (player) {
    const { id, name, gender, avatarUrl } = player || {}
    return {
      id,
      name: name || '',
      gender: gender || 'other',
      avatarUrl: avatarUrl || null
    }
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.player !== this.props.player) {
      this.replaceState(this.getStateFromPlayer(nextProps.player))
    }
  },

  didChangeAvatar (evt) {
    const file = evt.target.files[0]
    const URL = window.URL || window.webkitURL

    const img = new window.Image()
    img.onload = () => {
      if (!this.isMounted()) return

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
      const avatarUrl = canvas.toDataURL('image/png')
      this.setState({ avatarUrl })

      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  },

  didSubmit (evt) {
    evt.preventDefault()
    this.props.save(this.state)
  },

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
          { this.state.avatarUrl &&
            <img className='EditPlayerView-avatarImg'
              alt={ this.state.name }
              src={ this.state.avatarUrl }
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
            { this.props.saveText }
          </button>
          <button type='button' onClick={ this.props.cancel }>
            { formatMessage('Cancel') }
          </button>
        </div>
      </form>
    )
  }
})
