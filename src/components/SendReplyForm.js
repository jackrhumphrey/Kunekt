import React from 'react'

class SendReplyForm extends React.Component {
    constructor() {
        super()
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.sendReply(this.state.message)
        this.setState({
            message: ''
        })
    }

    render() {
        return (
            <form 
                onSubmit={this.handleSubmit}
                className="send-message-form">
                <input
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

export default SendReplyForm

// currentUser.sendMultipartMessage({
//   roomId: myRoom.id,
//   parts: [
//     { type: "text/plain", content: "🐷😍" },
//     {
//       type: "image/gif",
//       url: "https://gfycat.com/failingforkedheterodontosaurus"
//     },
//     {
//       file: document.querySelector("#attach").files[0],
//       customData: { metadata: 42 }
//     }
//   ]
// });
  