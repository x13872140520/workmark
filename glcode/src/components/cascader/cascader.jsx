import React from 'react';
import styles from './cascader.css';
import Grow from '@material-ui/core/Grow';
class Cascader extends React.Component {
    constructor (props) {
        super(props);
        console.log('props',props)
    }
  
    render() {
    const {children} =this.props
      return <Grow in={true }><div className={styles.casCader}>
          {children}{}
      </div></Grow>
    }
  }
  export default Cascader