const { createElement: h, PropTypes } = require('react')
const formatMessage = require('format-message')
const FormField = require('elemental/lib/components/FormField')
const Radio = require('elemental/lib/components/Radio')

const EditGender = ({ value, onChange }) =>
  h(FormField, {
    label: formatMessage('Gender'),
    title: formatMessage('Used in choosing proper he / she / they in game text.')
  },
    h('div', { className: 'inline-controls' },
      h(Radio, {
        label: formatMessage('Male'),
        name: 'gender',
        value: 'male',
        checked: value === 'male',
        onChange: onChange
      }),
      h(Radio, {
        label: formatMessage('Female'),
        name: 'gender',
        value: 'female',
        checked: value === 'female',
        onChange: onChange
      }),
      h(Radio, {
        label: formatMessage('Other'),
        name: 'gender',
        value: 'other',
        checked: value === 'other',
        onChange: onChange
      })
    )
  )

EditGender.displayName = 'EditGender'
EditGender.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}
module.exports = EditGender
