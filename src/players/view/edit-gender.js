import React from 'react'
import formatMessage from 'format-message'
import FormField from 'elemental/lib/components/FormField'
import Radio from 'elemental/lib/components/Radio'

const EditGender = ({ value, onChange }) =>
  <FormField
    label={ formatMessage('Gender') }
    title={ formatMessage('Used in choosing proper he / she / they in game text.') }
  >
    <div className='inline-controls'>
      <Radio
        label={ formatMessage('Male') }
        name='gender'
        value='male'
        checked={ value === 'male' }
        onChange={ () => onChange('male') }
      />
      <Radio
        label={ formatMessage('Female') }
        name='gender'
        value='female'
        checked={ value === 'female' }
        onChange={ () => onChange('female') }
      />
      <Radio
        label={ formatMessage('Other') }
        name='gender'
        value='other'
        checked={ value === 'other' }
        onChange={ () => onChange('other') }
      />
    </div>
  </FormField>

EditGender.displayName = 'EditGender'
EditGender.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
}
export default EditGender
