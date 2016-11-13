/* global window */
const { createClass, createElement: h, PropTypes } = require('react')
const t = require('format-message')
const FormField = require('elemental/lib/components/FormField')
require('./edit-avatar.css')

module.exports = createClass({
  displayName: 'EditPlayerAvatar',

  propTypes: {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  },

  didChangeImage (evt) {
    const name = evt.target.name
    const file = evt.target.files[0]
    const URL = window.URL || window.webkitURL
    const self = this

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
      self.props.onChange({ target: { name, value } })

      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  },

  render () {
    const { value } = this.props
    return (
      h(FormField, { label: t('Picture'), htmlFor: 'avatar' },
        h('div', { className: 'EditPlayerAvatar' },
          value &&
            h('img', {
              className: 'EditPlayerAvatar-img',
              src: value
            }),
          h('input', {
            className: 'EditPlayerAvatar-input',
            type: 'file',
            name: 'avatar',
            defaultValue: '',
            onChange: this.didChangeImage
          })
        )
      )
    )
  }
})
