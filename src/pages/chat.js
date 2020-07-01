
import styles from './chat.css';
import { Component } from 'react';

class Chat extends Component {
  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.title}>
          <label>Room Code: {"1acf"}</label>
          <label>Members: {1}</label>
        </div>
        <div className={styles.history}></div>
        <input className={styles.input} placeholder={"Input your message here."} />
        <br/>
        <select/>
        <button>Send</button>
      </div>
    );
  }
}

export default Chat;
