import { io } from "socket.io-client";
import { useEffect } from 'react';

function Message({ message, username }) {

    return (
        <>
            <div className="d-flex flex-row p-3">
                <p>{username}</p>
            </div>
            <div className="chat ml-2 p-3">{message}</div>
        </>
    )
}

export default Message;
