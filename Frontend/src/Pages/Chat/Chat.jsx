import { useState, useContext, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import "./Chat.css"
import { AuthContext } from './../../GenericComponents/Auth/Auth';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import TextareaAutosize from 'react-textarea-autosize';

const Chat = (props) => {
    // TODO:
    // Ajouter les messages que l'on envoi directement dans l'array de message
    // 

    const {socket, currentUser} = useContext(AuthContext);
    
    const [messages, setMessages] = useState([])
    const [toSend, setToSend] = useState("");
    const [roomID, setRoomID] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    
    socket.on('connection', () => {
        console.log(`I'm connected with the back-end`);
    });
    
    socket.on('newMessage', (message) => {
        setMessages([...messages, message]);
    });

    useEffect(() => {
        setRoomID(props.projectId);
        return () => {
            socket.emit("leave room");
        }
    }, [props]);

    useEffect(async () => {
        console.log("🚀 ~ file: Chat.jsx ~ line 36 ~ useEffect ~ roomID", roomID)
        if (!roomID) return
        socket.emit("join room", roomID);
        try {
            var res = await axios({
                method: "GET",
                withCredentials: true,
                url: `${process.env.REACT_APP_API_URL}/chat/${roomID}`,
            })
            console.log("🚀 ~ file: Chat.jsx ~ line 31 ~ useEffect ~ res", res.data)
            setMessages([...messages, ...res.data]);
        } catch (e) {
            console.error(e)
        }
    }, [roomID]);

    useEffect(() => {
        scrollToBottomOfMessages()
    }, [messages]);
    
    function sendMessage(e) {
        e.preventDefault();
        if (toSend.length === 0) {
            alert("No Message Written")
            return
        }
        var messageObj = {
            message: toSend
        } 
        socket.emit("message", messageObj);
        setToSend("");
    }

    useEffect(() => {
        scrollToBottomOfMessages()
    }, [isOpen]);

    function scrollToBottomOfMessages() {
        var element = document.getElementById("message-container");
        console.log("🚀 ~ file: Chat.jsx ~ line 53 ~ useEffect ~ element", element)
        if (!element)
            return
        element.scrollTop = element.scrollHeight;
    }

    function onEnterPress (e) {
        if(e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            sendMessage(e)
        }
    }

    if(!isOpen) {
        return (
            <div onClick={() => setIsOpen(true)} className='chat-bubble'>
                <FontAwesomeIcon icon={faCommentAlt} className="chat-bubble-icon" />
            </div>
        )
    }
    
    return (
        <div className='chat-container'>
            <h2 className='chat-container-quit-button' onClick={() => setIsOpen(false)}>x</h2>
            <div id='message-container' className='message-container'>
                {messages.map((message, key) => {
                    return (
                        <ChatMessage key={key} message={message.message} from={message.senderID.firstName + " " + message.senderID.lastName}
                        myMessage={currentUser.firstName + " " + currentUser.lastName === message.senderID.firstName + " " + message.senderID.lastName ? true : false} />
                    )
                })}
            </div>
            <form onSubmit={sendMessage} className='message-typing-container'>
                <TextareaAutosize minRows={1} maxRows={3} onKeyDown={onEnterPress} className='message-typing-input' value={toSend} type="text" name="message" id="message"  onChange={(event) => setToSend(event.target.value)}/>
                <button type='submit' className='message-send-button-container'>
                    <FontAwesomeIcon icon={faPaperPlane} className='message-send-button' />
                </button>
            </form>
        </div>
    );
}
 
export default Chat;