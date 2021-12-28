import { Button } from "@mui/material";
import { useState } from "react";

function User({
    username,
    UUID,
    banned,
    muted,
    banUser,
    muteUser,
    role
}) {

    return (
        <>
            <div className="username">{username}
                <Button className='btnStyled'
                    variant="contained"
                    onClick={(event) => banUser(event, { banned, UUID })}
                    disabled={role === 'user' ? false : true}
                    color={banned ? "error" : "success"}
                    size="small"
                    style={{ margin: '3px' }}
                >
                    {banned ? 'Unban' : 'Ban'}
                </Button>
                <Button
                    variant="contained"
                    onClick={(event) => muteUser(event, { muted, UUID })}
                    disabled={role === 'user' ? false : true}
                    color={muted ? "primary" : "secondary"}
                    size="small"
                    margin='5px'
                >
                    {muted ? 'Unmute' : 'Mute'}
                </Button>
            </div>
        </>
    )
}

export default User;
