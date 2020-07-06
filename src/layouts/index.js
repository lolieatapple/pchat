import styles from './index.css';
import { Component } from 'react';

class BasicLayout extends Component {
  render() {
    return (
      <div className={styles.normal}>
        {this.props.children}
      </div>
    );
  }
}


export default BasicLayout;
