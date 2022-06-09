import React from 'react';
import axios from 'axios';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import $ from 'jquery'

const base_url = "http://localhost:9191"

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
    var stompClient = null;

    function setConnected(connected) {
        $("#connect").prop("disabled", connected);
        $("#disconnect").prop("disabled", !connected);
        if (connected) {
            $("#conversation").show();
        }
        else {
            $("#conversation").hide();
        }
        $("#greetings").html("");
    }

    function connect() {
        // console.log('oof')
        // // var socket = new SockJS(base_url + '/games/ws');
        // var socket = new WebSocket('ws://localhost:9191/games/ws');
        // stompClient = Stomp.over(socket);
        // stompClient.connect({}, function (frame) {
        //     setConnected(true);
        //     console.log('Connected: ' + frame);
        //     stompClient.subscribe('/topic/greetings', function (greeting) {
        //         console.log('pending greeting', greeting)
        //         showConnected(JSON.parse(greeting.body).content);
        //     });
        // });
        
        stompClient = new window.StompJs.Client({
          webSocketFactory: function () {
            return new WebSocket("ws://localhost:9191/games");
          }
        });
        // stompClient.onConnect = function (frame) {
        //   frameHandler(frame)
        // };
        // stompClient.onWebsocketClose = function () {
        //   onSocketClose();
        // };
  
        stompClient.activate();
    }

    function disconnect() {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        setConnected(false);
        console.log("Disconnected");
    }

    function showConnected(message) {
        console.log('showing greeting', message)
        $("#content").append("<tr><td>" + message + "</td></tr>");
    }

    function send() {
        stompClient.send("/games/hello", {}, JSON.stringify({ 'name': $("#moveContent").val() }));
        stompClient.send("/app/hello", {}, JSON.stringify({ 'name': $("#moveContent").val() }));
        stompClient.send("/hello", {}, JSON.stringify({ 'name': $("#moveContent").val() }));
    }

    return (
        <div className="API">
            <div className='api_container'>
                <div className='api_card'>
                    <h1>API TEST PAGE</h1>
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