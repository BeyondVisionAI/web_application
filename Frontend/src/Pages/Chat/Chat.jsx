import { useState, useContext, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import "./Chat.css"
import { AuthContext } from './../../GenericComponents/Auth/Auth';
import axios from 'axios';

const Chat = () => {
    const {socket, currentUser} = useContext(AuthContext);
    
    const [messages, setMessages] = useState([])
    const [toSend, setToSend] = useState("");
    const [roomID, setRoomID] = useState(null)
    const [isSetUsername, setIsSetUsername] = useState(true)
    
    socket.on('connection', () => {
        console.log(`I'm connected with the back-end`);
    });
    
    socket.on('newMessage', (message) => {
        setMessages([...messages, message]);
    });

    useEffect(async () => {
        if (!roomID) return
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
    
    function sendMessage() {
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

    function changeStep(roomNb) {
        setRoomID(roomNb)
        socket.emit("join room", roomNb);
        setIsSetUsername(false);
    }

    function leaveRoom() {
        setRoomID(null)
        socket.emit("leave room");
        setMessages([]);
        setIsSetUsername(true);
    }

    if (isSetUsername) {
        return (
            <div>
                <button onClick={() => changeStep(1)}>Join Room 1</button>
                <button onClick={() => changeStep(2)}>Join Room 2</button>
            </div>
        )
    }

    
    return (
        <div className='page-container'>
            <div className='chat-container'>
                {messages.map((message, key) => {
                    return (
                        <ChatMessage key={key} message={message.message} from={message.senderID.firstName + " " + message.senderID.lastName}
                        myMessage={currentUser.firstName + " " + currentUser.lastName === message.senderID.firstName + " " + message.senderID.lastName ? true : false} />
                    )
                })}
            </div>
            <input value={toSend} type="text" name="message" id="message"  onChange={(event) => setToSend(event.target.value)}/>
            <button onClick={sendMessage}>Send</button>
            <button onClick={leaveRoom}>Leave Room</button>
        </div>
    );
}
 
export default Chat;