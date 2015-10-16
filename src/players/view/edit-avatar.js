/* global window */
import React from 'react'
import formatMessage from 'format-message'
import FormField from 'elemental/lib/components/FormField'
import './edit-avatar.css'

export default class EditPlayerAvatar extends React.Component {
  static displayName = 'EditPlayerAvatar'

  static propTypes = {
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.value !== this.props.value
      || nextProps.onChange !== this.props.onChange
    )
  }

  componentWillUnmount () {
    if (this.img) {
      this.img.onload = null
      this.img = null
    }
  }

  didChangeImage = evt => {
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
      const value = canvas.toDataURL('image/jpeg')
      this.props.onChange({ target: { value } })

      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  }

  render () {
    return (
      <FormField label={ formatMessage('Picture') } htmlFor='avatar'>
        <div className='EditPlayerAvatar'>
          { this.props.value &&
            <img
              className='EditPlayerAvatar-img'
              src={ this.props.value }
            />
          }
          <input
            className='EditPlayerAvatar-input'
            type='file' name='avatar' defaultValue=''
            onChange={ this.didChangeImage }
          />
        </div>
      </FormField>
    )
  }
}
