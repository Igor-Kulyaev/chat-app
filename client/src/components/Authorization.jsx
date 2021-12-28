import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
function Authorization(props) {
    const token = localStorage.getItem('SavedToken')
    const navigation = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleClick = async () => {
        if (!username || !password) {
            return
        }
        const data = await axios.post(`http://localhost:4000/auth`, {
            username: username,
            password: password
        });
        const token = data.data.token;
        localStorage.setItem("SavedToken", token);
        navigation('/chat');
    }

    return (!token ?
        <div className="registration-cssave">
            <h3 className="text-center">Login form</h3>
            <div className="form-group">
                <input className="form-control item" value={username} onChange={({ target: { value } }) => setUsername(value)} />
            </div>
            <div className="form-group">
                <input type='password' className="form-control item" value={password} onChange={({ target: { value } }) => setPassword(value)} />
            </div>
            <div className="form-group">
                <button className="btn btn-primary btn-block create-account" onClick={handleClick}>Registration / Sign in</button>
            </div>
        </div>
        : <Navigate to='/chat' />
    )
}

export default Authorization;
