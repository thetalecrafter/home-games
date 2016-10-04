const { createElement: h, PropTypes } = require('react')
const classnames = require('classnames')
require('./avatar.css')

function initials (name) {
  return name.replace(/\s*\b(\w)\w+\s*/g, '$1')
}

const PlayerAvatar = ({ className, name, avatar }) =>
  avatar
    ? h('img', {
      className: classnames(className, 'PlayersAvatar'),
      alt: name,
      src: avatar
    })
    : h('span', {
      className: classnames(className, 'PlayersAvatar--generated')
    }, initials(name))

PlayerAvatar.displayName = 'PlayerAvatar'
PlayerAvatar.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string
}

module.exports = PlayerAvatar
