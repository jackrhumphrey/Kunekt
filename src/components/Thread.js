import React from "react";
import ReactDOM from "react-dom";
import Message from "./Message";

class Thread extends React.Component {
  render() {
    return (
      <div className="thread">
        <div className="message">
          <div className="message-username">{this.props.username}</div>
          <div className="message-text">{this.props.text}</div>
        </div>
      </div>
    );

    // this.props.messageId
  }
}

export default Thread;
