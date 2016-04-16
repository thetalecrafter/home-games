import React from 'react'
import formatMessage from 'format-message'

export default class SpyMissionStage extends React.Component {
  static displayName = 'SpyMissionStage'

  static propTypes = {
    result: React.PropTypes.bool,
    vote: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.vote = this.vote.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.result !== this.props.result
  }

  vote () {
    this.props.vote(true)
  }

  render () {
    const { result } = this.props
    return (
      <div>
        <p>
          { formatMessage(
            `As a Spy, you need to intercept messages to win, you cannot
            sabotage the mission.`
          ) }
        </p>
        { result == null
          ? <div>
            <button onClick={ this.vote }>
              { formatMessage('Intercept Message') }
            </button>
            <button disabled>
              { formatMessage('Sabotage Mission') }
            </button>
          </div>
          : result &&
            <p>
              { formatMessage('You have successfully completed your mission.') }
            </p>
        }
      </div>
    )
  }
}
