import styles from './index.css';
import { Component } from 'react';
import router from 'umi/router';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  onCreate = () => {
    console.log('create');
    this.setState({waiting: true});
    router.push('/chat');
  }

  render() {
    return (
      <div className={styles.normal}>
        <button className={styles.button} onClick={this.onCreate}>Create Room<br/>创建房间</button>
        <br/>
        <input className={styles.input} placeholder={"Room Code"}/>
        <br/>
        <button className={styles.button}>Join Room<br/>加入房间</button>
        <br/>
        {
          this.state.waiting ? <label style={{color: "white"}}>Waiting...</label> : <label/>
        }

      </div>
    );
  }
}

export default Index;
