function NewText({ setMessage, message, sendMessage, muted }) {
    return (
        <>
            <textarea
                className="form-control sendMessage"
                rows="5"
                disabled={muted ? true : false}
                onChange={(event) => {
                    if (event.target.value.length >= 200) {
                        return
                    }
                    setMessage(event.target.value)
                }}
                value={message} onKeyPress={event => event.key === 'Enter' ?
                    sendMessage(event) : null} />
        </>
    )
}

export default NewText;
