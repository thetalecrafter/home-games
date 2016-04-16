import React from 'react'
import formatMessage from 'format-message'

export default class DoubleAgentMissionStage extends React.Component {
  static displayName = 'DoubleAgentMissionStage'

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
            `As a Double Agent, you need to sabotage missions to win, but you
            may successfully intercept the message if needed to keep the trust
            of the others.`
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
