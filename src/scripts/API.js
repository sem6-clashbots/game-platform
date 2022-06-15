import React from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client'
import $ from 'jquery'

//production
const base_url = "https://gateway-cahox.cloud.okteto.net"
const SOCKET_URL = 'https://gateway-cahox.cloud.okteto.net/ws';

//development
// const base_url = "http://localhost:9191"
// const SOCKET_URL = "http://localhost:9191/games/ws"

function API() {

    /* TESTREQ */
    function sendTestRequest() {
        console.log('sending request to: ' + base_url);
        axios({
            method: 'GET',
            url: base_url + '/games/1',
        }).then(function (res) {
            console.log(res)
        }).catch(function (error) {
            console.log(error)
        });
    }

    /* WEBSOCKET */
    let stomp = null;
    let testMsg = {
        gameId: "304dc6c5-6eca-4fe5-9a18-167172f38e0b",
        senderAddress: "testAddressSend",
        receiverAddress: "testAddressRec",
        message: "testmsg"
    }
    
    function connect() {
        var socket = new SockJS(SOCKET_URL);
        stomp = Stomp.over(socket);

        stomp.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stomp.subscribe('/game/' + testMsg.gameId + "/start", function (msg) {
                console.log(JSON.parse(msg.body).content);
            });
        });
    }

    function disconnect() {
        
    }

    function send() {
        stomp.send("/app/start", {}, JSON.stringify(testMsg));
    }

    return (
        <div className="API">
            <div className='api_container'>
                <div className='api_card'>
                    <h1>API TEST PAGE!!!</h1>
                    <div>
                        <button onClick={() => sendTestRequest()}>
                            sendTestRequest()
                        </button>
                        <div style={{ border: "1px black solid" }}>
                            WEBSOCKET
                            <div>
                                <button onClick={() => connect()}>
                                    connect()
                                </button>
                                <button onClick={() => disconnect()}>
                                    disconnect()
                                </button>
                            </div>
                            <div>
                                <input id="moveContent" type="text"></input>
                                <button onClick={() => send()}>
                                    send()
                                </button>
                                <div id="content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default API;