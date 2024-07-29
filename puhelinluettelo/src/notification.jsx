import React from "react"

const Notification=({message})=>{
    if (message.state===null){
        return null
    }

    const notificationStyle={
        color: message.color,
        font: 20,
        backgroundColor: '#E7E1E0',
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    return(
        <div style={notificationStyle}>
            {message.state}
        </div>

    )
}
export default Notification
