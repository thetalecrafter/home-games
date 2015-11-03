/* global window */
import React from 'react'
import formatMessage from 'format-message'
import FormField from 'elemental/lib/components/FormField'
import './edit-avatar.css'

function didChangeImage (evt, onChange) {
  const file = evt.target.files[0]
  const URL = window.URL || window.webkitURL

  const img = new window.Image()
  img.onload = () => {
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
    onChange(value)

    URL.revokeObjectURL(img.src)
  }
  img.src = URL.createObjectURL(file)
}

const EditPlayerAvatar = ({ value, onChange }) =>
  <FormField label={ formatMessage('Picture') } htmlFor='avatar'>
    <div className='EditPlayerAvatar'>
      { value &&
        <img
          className='EditPlayerAvatar-img'
          src={ value }
        />
      }
      <input
        className='EditPlayerAvatar-input'
        type='file' name='avatar' defaultValue=''
        onChange={ evt => didChangeImage(evt, onChange) }
      />
    </div>
  </FormField>

EditPlayerAvatar.displayName = 'EditPlayerAvatar'
EditPlayerAvatar.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
}
export default EditPlayerAvatar
