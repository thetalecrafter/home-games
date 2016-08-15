const { createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const InputGroup = require('elemental/lib/components/InputGroup')
const Glyph = require('elemental/lib/components/Glyph')
const Button = require('elemental/lib/components/Button')

const EditModalButtons = ({ cancel, remove }) =>
  h(InputGroup, null,
    h(InputGroup.Section, null,
      h(Button, { type: 'primary', submit: true },
        formatMessage('Save')
      )
    ),
    h(InputGroup.Section, null,
      h(Button, { type: 'link-cancel', onClick: cancel },
        formatMessage('Cancel')
      )
    ),
    h(InputGroup.Section, { grow: true }),
    remove &&
      h(InputGroup.Section, null,
        h(Button, {
          type: 'link-delete',
          title: formatMessage('Remove Player'),
          onClick: remove
        },
          h(Glyph, { icon: 'trashcan' })
        )
      )
  )

EditModalButtons.displayName = 'EditModalButtons'
EditModalButtons.propTypes = {
  cancel: PropTypes.func.isRequired,
  remove: PropTypes.func
}
module.exports = EditModalButtons
