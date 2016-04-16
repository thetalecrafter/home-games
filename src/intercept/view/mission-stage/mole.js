import React from 'react'
import formatMessage from 'format-message'

export default class MoleMissionStage extends React.Component {
  static displayName = 'MoleMissionStage'

  static propTypes = {
    result: React.PropTypes.bool,
    vote: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.intercept = this.intercept.bind(this)
    this.sabotage = this.sabotage.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.result !== this.props.result
  }

  intercept () {
    this.props.vote(true)
  }

  sabotage () {
    this.props.vote(false)
  }

  render () {
    const { result } = this.props
    return (
      <div>
        <p>
          { formatMessage(
            `As a Mole, you need to intercept messages to win, but you may
            sabotage the mission if needed to keep the trust of the double
            agents.`
          ) }
        </p>
        { result == null
          ? <div>
            <button onClick={ this.intercept }>
              { formatMessage('Intercept Message') }
            </button>
            <button onClick={ this.sabotage }>
              { formatMessage('Sabotage Mission') }
            </button>
          </div>
          : result
          ? <p>
            { formatMessage('You have successfully completed your mission.') }
          </p>
          : <p>
            { formatMessage('You have sabotaged the mission.') }
          </p>
        }
      </div>
    )
  }
}
