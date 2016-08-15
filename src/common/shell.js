const { createElement: h, PropTypes } = require('react')
const classnames = require('classnames')
require('./shell.css')

const ShellView = ({ className, children }) =>
  h('div', { className: classnames('Shell', className) },
    children
  )

ShellView.displayName = 'ShellView'
ShellView.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

module.exports = ShellView
