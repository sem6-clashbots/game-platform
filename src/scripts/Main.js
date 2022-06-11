import React, { useEffect, useState, componentDidMount } from "react";
import axios from 'axios';
import $ from 'jquery'
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client'

import Selection from "./Selection.js";
import Start from "./Start.js";

import {
    connectWallet,
    getCurrentWalletConnected,
} from "../js/walletConnect";

const base_url = "http://localhost:9191"
const SOCKET_URL = 'http://localhost:9191/ws';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { walletAddress: "" };
        this.fight = this.fight.bind(this)
    }

    componentDidMount() {
        this.fetchData(this)
    }

    fight(userSide) {
        let that = this;

        axios({
            method: 'POST',
            url: base_url + '/games/start',
            data: {
                userAddress: this.state.walletAddress,
                userSide: userSide //to be dynamic
            }
        }).then(function (res) {
            let game = res.data

            //WEBSOCKET CONNECTION
            let socket = new SockJS(SOCKET_URL);
            let stomp = Stomp.over(socket);
            let msg = {
                gameId: game.id,
                senderAddress: that.state.walletAddress,
                receiverAddress: "testAddressRec",
                message: "testmsg"
            }

            stomp.connect({}, function () {
                console.log('Connected!')
                if(game.status === "IN_PROGRESS"){
                    //Tell other client to start
                    console.log('Sending start sign to: ' + game.id)
                    stomp.send("/app/start", {}, JSON.stringify(msg));
                }else if(game.status === "SEARCHING"){
                    //Wait and listen for opponent
                    console.log("Waiting and listening on: " + game.id)
                    stomp.subscribe('/game/' + game.id +  "/start", function (res) {
                        console.log("OPPONENT FOUND", res.body);
                    });
                }else{
                    //error, should be finished or broken?
                        console.log("Something went wrong! Game already finished or not found...");
                }

                stomp.subscribe('/game/' + game.id +  "/move", function (res) {
                    console.log("msg", res.body);
                    console.log("game start: " + JSON.parse(res.body).gameId);
                });
                
                // $('.page').hide()
                // $(".page[data-page='" + 2 + "']").show()
            });
        }).catch(function (error) {
            console.log(error)
        });
    }

    // onGameFound(payload) {
    //     console.log("game start: " + JSON.parse(payload).content);
    // }

    async fetchData(that) {
        const { address } = await getCurrentWalletConnected();
        that.setState({ walletAddress: address });
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    that.setState({ walletAddress: accounts[0] });
                } else {
                    that.setState({ walletAddress: "" });
                }
            });
        }
    }

    async connectWalletPressed(that) {
        const walletResponse = await connectWallet();
        that.state.walletAddress(walletResponse.address);
    };

    render() {
        const metamaskInstalled = window.ethereum;

        return (
            <div className='Main'>
                {metamaskInstalled ? (
                    <div className='Main'>
                        {this.state.walletAddress.length > 0 ? (
                            <div className='Main'>
                                <Start></Start>

                                <Selection fight={this.fight}></Selection>

                                <div className="fight_screen page" style={{ display: 'none' }} data-page="2">
                                    wows
                                </div>
                            </div>
                        ) : (
                            // CONNECT CARD
                            <div className="card">
                                <h1>CONNECT YOUR WALLET</h1>
                                <div className="widget_text">To proceed with minting, please connect a wallet of your choice.</div>
                                <button className="btn btn-primary card_btn" onClick={() => this.connectWalletPressed(this)}>
                                    Connect Wallet
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    //METAMASK NOT INSTALLED
                    <div className="card">
                        <h1>ERROR</h1>
                        <div>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </div>
                        <a className="btn btn-primary card_btn" rel="noreferrer" target="_blank" href={`https://metamask.io/download.html`}>
                            Get it here
                        </a>
                    </div>
                )}
            </div>
        )
    }
}

export default Main;
