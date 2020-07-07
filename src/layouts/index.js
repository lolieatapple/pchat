import styles from './index.css';
import { Component } from 'react';

class BasicLayout extends Component {
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    return (
      <div className={styles.normal}>
        {this.props.children}
      </div>
    );
  }
}


export default BasicLayout;
