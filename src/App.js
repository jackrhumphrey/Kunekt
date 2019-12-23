import React from "react";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";
import MessageList from "./components/MessageList";
import SendMessageForm from "./components/SendMessageForm";
import SendReplyForm from "./components/SendReplyForm";
import RoomList from "./components/RoomList";
import NewRoomForm from "./components/NewRoomForm";
import Thread from "./components/Thread";

import { tokenUrl, instanceLocator } from "./config";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: [],
      roomId: null,
      messageId: null,
      senderId: null,
      text: null
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

  showMessage(messageId, senderId, text) {
    this.setState({ messageId, senderId, text }, function() {
      console.log(this.state.messageId);
    });
  }

  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator,
      userId: "Admin",
      tokenProvider: new TokenProvider({
        url: tokenUrl
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.getRooms();
      })
      .catch(err => {
        console.log("error on connecting", err);
      });
  }

  getRooms() {
    this.currentUser
      .getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        });
      })
      .catch(err => {
        console.log("error on joinableRooms", err);
      });
  }

  subscribeToRoom(roomId) {
    this.setState({ messages: [] });
    this.currentUser
      .subscribeToRoom({
        roomId,
        hooks: {
          onMessage: message => {
            this.setState({
              messages: [...this.state.messages, message]
            });
          }
        }
      })
      .then(room => {
        this.setState({
          roomId: room.id
        });
        this.getRooms();
      })
      .catch(err => {
        console.log("error on subscribing to room: ", err);
      });
  }

  sendMessage(text) {
    this.currentUser.sendMultipartMessage({
      parts: [{ type: "text/plain", content: text }],
      roomId: this.state.roomId
    });
  }

  sendReply(text, message) {
    this.currentUser.sendMultipartMessage({
      roomId: this.state.roomId,
      parts: [
        { type: "text/plain", content: text },
        { type: "text/plain", content: message }
        // {
        //   type: "application/json",
        //   content: JSON.stringify({
        //     your_id: "foo"
        //   })
        // }
      ]
    });
  }

  // currentUser.sendMultipartMessage({
  //   roomId: myRoom.id,
  //   parts: [
  //     { type: "text/plain", content: "🐷😍" },
  //     {
  //       type: "image/gif",
  //       url: "https://gfycat.com/failingforkedheterodontosaurus",
  //     },
  //     {
  //       file: document.querySelector("#attach").files[0],
  //       customData: { metadata: 42 },
  //     }
  //   ],
  // })

  createRoom(name) {
    this.currentUser
      .createRoom({
        name
      })
      .then(room => this.subscribeToRoom(room.id))
      .catch(err => console.log("error with createRoom: ", err));
  }

  render() {
    return (
      <div className="app">
        <div className="room-container">
          <RoomList
            roomId={this.state.roomId}
            subscribeToRoom={this.subscribeToRoom}
            rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
          />
          <NewRoomForm createRoom={this.createRoom} />
        </div>
        <div className="message-container">
          <MessageList
            roomId={this.state.roomId}
            messages={this.state.messages}
            showMessage={this.showMessage}
          />
          <SendMessageForm
            disabled={!this.state.roomId}
            sendMessage={this.sendMessage}
          />
        </div>
        <div className="thread-container">
          <Thread 
          messageId={this.state.messageId} 
          username={this.state.senderId}
          text={this.state.text}
/>
          <SendReplyForm
            disabled={!this.state.roomId}
            sendReply={this.sendReply}
            messageId={this.messageId}
          />
        </div>
      </div>
    );
  }
}

export default App;