import './ChatMessage.css'

const ChatMessage = (props) => {
    return (
        <div className={props.myMessage ? 'chat-message-container chat-message-container-own' : 'chat-message-container chat-message-container-other'}>
            <p className="chat-message">{props.message}</p>
            <p className="chat-message-from">{props.from}</p>
        </div>
    );
}
 
export default ChatMessage;