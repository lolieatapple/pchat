
import styles from './chat.css';
import { Component } from 'react';
import sleep from 'ko-sleep';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state={};
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.addEventListener('message', this.onMessage);
  }

  onMessage = (event) => {
    console.log('Message from server ', event.data);
  }

  waitWs = async () => {
    while(true) {
      if (this.ws.readyState !== WebSocket.OPEN) {
        await sleep(100);
      } else {
        return;
      }
    }
  }

  async componentDidMount() {
    console.log('url', this.props.location.query);
    let query = this.props.location.query;
    let msg = {};
    switch (query.type) {
      case "create":
        msg = {
          type: 'cmd',
          content: 'create',
          roomCode: query.roomCode
        }
        await this.waitWs();
        this.ws.send(JSON.stringify(msg));
        break;
      case "join":
        msg = {
          type: 'cmd',
          content: 'join',
          roomCode: query.roomCode
        }
        await this.waitWs();
        this.ws.send(JSON.stringify(msg));
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.title}>
          <label>房间秘钥: {"1acf"}</label>
          <label>成员数: {1}</label>
        </div>
        <div className={styles.history}></div>
        <textarea className={styles.input} placeholder={"在此输入你的消息."} />
        <br/>
        <div className={styles.sendArea}>
          <select className={styles.select}>
            <option value="Mouse">白羊</option>
            <option value="Cow">金牛</option>
            <option value="Tiger">双子</option>
            <option value="Rabbit">巨蟹</option>
            <option value="Dragon">狮子</option>
            <option value="Snake">处女</option>
            <option value="Horse">天秤</option>
            <option value="Sheep">天蝎</option>
            <option value="Monkey">射手</option>
            <option value="Chicken">摩羯</option>
            <option value="Dog">水瓶</option>
            <option value="Pig">双鱼</option>
            <option value="Cat">喵喵</option>
          </select>
          <button className={styles.sendButton}>发送</button>
        </div>
      </div>
    );
  }
}

export default Chat;
