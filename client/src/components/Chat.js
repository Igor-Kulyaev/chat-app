import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
import Message from './Message';
import ActiveUser from './ActiveUser';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import User from './User';
import NewText from './NewText';

function Chat() {

    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [presentUsers, setPresentUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [muted, setMuted] = useState(false)
    const [userInfo, setUserInfo] = useState({ id: '', username: '' })


    const banUser = (event, data) => {
        event.preventDefault();
        socket.emit('banUser', data);
    }

    const muteUser = (event, data) => {
        event.preventDefault();
        socket.emit('muteUser', data);
    }

    const logOut = () => {
        socket.emit('logout', socket.id)
    }

    let latestmessages = messages.map(item => <Message key={item._id} username={item.username} message={item.message} />);
    let onlineUsers = presentUsers.map(item => <ActiveUser key={item.userData.UUID} username={item.userData.username} />);


    useEffect(() => {
        if (localStorage.getItem("SavedToken")) {
            const socket = io('http://localhost:4000', {
                transports: ['websocket'],
                auth: {
                    token: localStorage.getItem("SavedToken")
                },
            });
            setSocket(socket)
        }
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on("connect", () => {
                socket.emit("getUserMuteStatus", socket.id);
            })

            socket.on('youConnected', ({ id, username, muted }) => {
                setUserInfo({ id, username })
                setMuted(muted)
            })

            socket.on('messages', (data) => {
                if (Array.isArray(data)) {
                    setMessages(data);
                    return;
                }
                setMessages(messages => {
                    return [...messages, data]
                })
            });

            socket.on('message-error', (data) => {
                alert('Please wait');
            });

            socket.on('present-users', (data) => {
                setPresentUsers(data);
            });

            socket.on('all-users', (data) => {
                setAllUsers(data);
            });

            socket.on('disconnect', (data) => {
                localStorage.removeItem("SavedToken");
                navigate('/')
            });

            socket.on('updateMute', (data) => {
                setMuted(data);
                data ? alert('you have been muted') : alert('you have been unmuted');
            })

            socket.on('timer', (time) => {
                const seconds = Math.round(15 - (Date.now() - time) / 1000)
                alert(`You can send message in ${seconds} seconds`)
            })

            socket.on('back-error', () => {
                alert('Error occurred');
            });

            return () => socket.disconnect(true);

        }

    }, [socket, navigate])

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message)
        }
    }

    return (
        <Box sx={{ border: '3px solid grey', overflow: 'hidden', width: '100vw', height: '100vh' }}>
            <div className="container d-flex justify-content-center">
                <div className="card mt-5">
                    <div className="d-flex flex-row justify-content-between p-3 adiv text-white"> <i className="fas fa-chevron-left"></i> <span className="pb-3">Live chat</span> <i className="fas fa-times"></i>
                        <Button onClick={logOut}>Leave</Button></div>
                </div>
            </div>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1,
                gridTemplateAreas: `"users chat chat chat"`,
                border: '1px solid grey',
                height: 'calc(100% - 100px)'
            }}>
                <Box component="div" sx={{ gridArea: 'users', bgcolor: 'primary.main', border: '1px solid grey' }}>
                    <Box component="div" sx={{ bgcolor: 'green', border: '1px solid grey' }}>Hello {userInfo.username}</Box>

                    <List sx={{ width: '100%', bgcolor: 'beige', border: '1px solid grey' }}>
                        Active Users:
                        {onlineUsers}
                    </List>
                    {allUsers.length ? 'All Users: ' : null}
                    <ul>
                        {allUsers.map(item =>
                            <User
                                key={item.UUID}
                                username={item.username}
                                banned={item.banned}
                                muted={item.muted}
                                banUser={banUser}
                                muteUser={muteUser}
                                UUID={item.UUID}
                                role={item.role} />)}
                    </ul>
                </Box>
                <Box component="div" sx={{ gridArea: 'chat', bgcolor: 'primary.main', border: '1px solid grey', overflowY: 'scroll' }}>
                    {latestmessages}
                    <div className="form-group px-3">
                        <NewText setMessage={setMessage} message={message} sendMessage={sendMessage} muted={muted} />
                    </div >
                </Box>
            </Box>
        </Box>
    )
}

export default Chat;
