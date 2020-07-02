
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
        <textarea className={styles.input} placeholder={"Input your message here."} />
        <br/>
        <div className={styles.sendArea}>
          <select className={styles.select}>
            <option value="Mouse">Mouse</option>
            <option value="Cow">Cow</option>
            <option value="Tiger">Tiger</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Dragon">Dragon</option>
            <option value="Snake">Snake</option>
            <option value="Horse">Horse</option>
            <option value="Sheep">Sheep</option>
            <option value="Monkey">Monkey</option>
            <option value="Chicken">Chicken</option>
            <option value="Dog">Dog</option>
            <option value="Pig">Pig</option>
            <option value="Cat">Cat</option>
          </select>
          <button className={styles.sendButton}>Send</button>
        </div>
      </div>
    );
  }
}

export default Chat;
