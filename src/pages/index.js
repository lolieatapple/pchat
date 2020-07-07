import styles from './index.css';
import { Component } from 'react';
import router from 'umi/router';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state={ roomCode: '' };
  }

  onCreate = () => {
    this.setState({waiting: true});
    router.push('/chat?roomCode='+this.state.roomCode+'&&type=create');
  }

  onJoin = () => {
    this.setState({waiting: true});
    router.push('/chat?roomCode='+this.state.roomCode+'&&type=join');
  }

  render() {
    return (
      <div className={styles.normal}>
        <button className={styles.button} onClick={this.onCreate}>创建房间</button>
        <br/>
        <input className={styles.input} placeholder={"房间秘钥"} value={this.state.roomCode} onChange={e=>this.setState({roomCode: e.target.value})}/>
        <br/>
        <button className={styles.button} onClick={this.onJoin}>加入房间</button>
        <br/>
        {
          this.state.waiting ? <label style={{color: "white"}}>Waiting...</label> : <label/>
        }
        <a href="https://afdian.net/@molin" style={{color: "white", top:"30vh", position:"relative", fontSize:"14px"}}>打赏/赞助/捐赠</a>
      </div>
    );
  }
}

export default Index;
