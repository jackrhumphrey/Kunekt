import React from "react";
import ReactDOM from "react-dom";

class Message extends React.Component {

  render() {
    return (
      <div className="message">
        <a onClick={() => this.props.showMessage(this.props.id,this.props.username,this.props.text)} href="#">
          <div className="message-username">{this.props.username}</div>
          <div className="message-text">{this.props.text}</div>
        </a>
      </div>
    );
  }
}

export default Message;