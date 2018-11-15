// WebSocket handling service

const CONNECTED = 1,
    CONNECTING = 0,
    URL = 'ws://localhost:8000/api/streams/robots/positions/'

let WS = null

let webSocket = {
    initConnection({ onopen, onclose, onmessage, onerror, interval = 1000, num_robots = 1 }) {
        //is web socket in't already open
        if (!webSocket.isConnectedOrConnecting()) {
            WS = new WebSocket(`${URL}?interval=${interval}&num_robots=${num_robots}`)

            WS.onopen = onopen
            WS.onclose = onclose
            WS.onmessage = onmessage
            WS.onerror = onerror
        } else {
            console.log('already attempting to connect')
        }
    },
    isConnected() {
        return WS !== null && WS.readyState === CONNECTED
    },
    isConnectedOrConnecting() {
        return WS !== null && (WS.readyState === CONNECTED || WS.readyState === CONNECTING)
    },
    closeConnection() {
        if (WS && webSocket.isConnectedOrConnecting()) {
            console.log('closing connection')
            WS.close()
        } else {
            console.log('No WS connection to close')
        }
    },
}

export default webSocket
