import React from 'react'
import formatMessage from 'format-message'
import InputGroup from 'elemental/lib/components/InputGroup'
import Glyph from 'elemental/lib/components/Glyph'
import Button from 'elemental/lib/components/Button'

const EditModalButtons = ({ cancel, remove }) =>
  <InputGroup>
    <InputGroup.Section>
      <Button type='primary' submit>
        { formatMessage('Save') }
      </Button>
    </InputGroup.Section>
    <InputGroup.Section>
      <Button type='link-cancel' onClick={ cancel }>
        { formatMessage('Cancel') }
      </Button>
    </InputGroup.Section>
    <InputGroup.Section grow />
    { remove &&
      <InputGroup.Section>
        <Button
          type='link-delete'
          title={ formatMessage('Remove Player') }
          onClick={ remove }
        >
          <Glyph icon='trashcan' />
        </Button>
      </InputGroup.Section>
    }
  </InputGroup>

EditModalButtons.displayName = 'EditModalButtons'
EditModalButtons.propTypes = {
  cancel: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func
}
export default EditModalButtons
