import styles from './index.css';
import { Component } from 'react';
import router from 'umi/router';

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
