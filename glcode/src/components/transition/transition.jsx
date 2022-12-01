import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const propTypes = {
  /** 执行动画 */
  action: PropTypes.bool,
  /** 切换的css动画的class名称 */
  toggleClass: PropTypes.string
}

const defaultProps = {
  action: false
}

/**
 * css过渡动画组件
 *
 * @visibleName Transition 过渡动画
 */
class Transition extends React.Component {

  static propTypes = propTypes

  static defaultProps = defaultProps

  render() {
    const {
      className,
      action,
      toggleClass,
      children
    } = this.props
    const transition = (
      <div
        className={
          classnames({
            transition: true
          })
        }
        style={
          {
            position: 'relative',
            overflow: 'hidden'
          }
        }
      >
        <div
          className={
            classnames({
              'transition-wrapper': true,
              [className]: className,
              [toggleClass]: action && toggleClass
            })
          }
        >
          { children }
        </div>
      </div>
    )
    return transition
  }
}
export default Transition