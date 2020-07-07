
import styles from './chat.css';
import { Component } from 'react';
import sleep from 'ko-sleep';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: 0,
      members: 0,
      inputText: "",
      nick: this.nicks[Math.floor(Math.random() * this.nicks.length)],
      messages: [{ type: "msg", roomCode: "0002", nick: "小助手", content: "欢迎光临隐私聊天室！这里的记录不会在任何地方保存，而且超过10分钟会自动清除。", time: Date.now() }],
    };
    this.ws = new WebSocket('wss://cat.molin.tech:9000');
    this.ws.addEventListener('message', this.onMessage);
  }

  scrollToBottom = () => {
    var elem = document.getElementById('msgList');
    elem.scrollTop = elem.scrollHeight + 40;
  }

  onMessage = (event) => {
    // console.log('Message from server ', event.data);
    let obj = JSON.parse(event.data);
    switch (obj.type) {
      case "update":
        this.setState({ roomCode: obj.roomCode, members: obj.members });
        break;
      case "msg":
        let messages = this.state.messages.slice();
        messages.push(obj);
        // console.log(obj);
        this.setState({ messages });
        setTimeout(this.scrollToBottom, 100);
        break;
      default:
        break;
    }
  }

  waitWs = async () => {
    while (true) {
      if (this.ws.readyState !== WebSocket.OPEN) {
        await sleep(100);
      } else {
        return;
      }
    }
  }

  async componentDidMount() {
    // console.log('url', this.props.location.query);
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

    this.timer = setInterval(this.cleanHistory, 3000);
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount');
    this.ws.close();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  cleanHistory = () => {
    let messages = this.state.messages.slice();
    if (messages.length < 0) {
      return;
    }
    if (messages[0] && Date.now() - messages[0].time > 600000) {
      messages.shift();
    }
    this.setState({messages});
  }

  onSend = () => {
    let msg = {
      type: "msg",
      roomCode: this.state.roomCode,
      nick: this.state.nick,
      content: this.state.inputText,
      time: Date.now(),
    };
    this.ws.send(JSON.stringify(msg));
    this.setState({ inputText: '' });
    let messages = this.state.messages.slice();
    msg.self = true;
    messages.push(msg);
    this.setState({ messages });
    setTimeout(this.scrollToBottom, 100);
  }

  nicks = [
    '白羊',
    '金牛',
    '双子',
    '巨蟹',
    '狮子',
    '处女',
    '天秤',
    '天蝎',
    '射手',
    '摩羯',
    '水瓶',
    '双鱼',
  ]

  onKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.altKey || e.metaKey)) {
      this.setState({ inputText: this.state.inputText + "\n" });
      return;
    } else if (e.keyCode === 13) {
      e.preventDefault();
      this.onSend();
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.title}>
          <label>房间秘钥: {this.state.roomCode}</label>
          <label>成员数: {this.state.members}</label>
        </div>
        <div className={styles.history} id="msgList">
          {
            this.state.messages.map((v) => {
              if (v.self) {
                return (
                  <div key={v.time} style={{ textAlign: "-webkit-right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div className={styles.nick}>{v.nick}</div>
                      <div className={styles.time}>{new Date(v.time).toLocaleTimeString()}</div>
                    </div>
                    <pre className={styles.msgSelf}>{v.content}</pre>
                  </div>);
              } else {
                return (
                  <div key={v.time}>
                    <div style={{ display: "flex", justifyContent: "left" }}>
                      <div className={styles.nick}>{v.nick}</div>
                      <div className={styles.time}>{new Date(v.time).toLocaleTimeString()}</div>
                    </div>
                    <pre className={styles.msg}>{v.content}</pre>
                  </div>);
              }
            })
          }
        </div>
        <textarea className={styles.input}
          placeholder={"在此输入你的消息."}
          value={this.state.inputText}
          onChange={e => this.setState({ inputText: e.target.value })}
          onKeyDown={this.onKeyDown} />
        <br />
        <div className={styles.sendArea}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ margin: "8px" }}>{"昵称："}</div>
            <div className={styles["select-editable"]}>
              <select value={this.state.nick} onChange={e => this.setState({ nick: e.target.value })}>
                {
                  this.nicks.map((v) => {
                    return (<option value={v} key={v}>{v}</option>);
                  })
                }
              </select>
              <input type="text" name="format"
                value={this.state.nick}
                onChange={e => this.setState({ nick: e.target.value })} />
            </div>
          </div>
          <button className={styles.sendButton} onClick={this.onSend}>发送</button>
        </div>
      </div>
    );
  }
}

export default Chat;
