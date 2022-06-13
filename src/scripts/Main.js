import React from "react";
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
import Search from "./Search.js";
import Game from "./Game.js";
import Load from "./Load.js";
import sword from '../resources/moves/sword.png'
import shield from '../resources/moves/shield.png'
import hammer from '../resources/moves/hammer.png'
import fist from '../resources/moves/fist.png'
import End from "./End.js";

const base_url = "https://gateway-cahox.cloud.okteto.net"
const SOCKET_URL = 'https://gateway-cahox.cloud.okteto.net/ws';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { walletAddress: "", playerSide: "", playerHealth: 5, playerMove: sword, opponentHealth: 5, opponentMove: sword };
        this.searchGame = this.searchGame.bind(this)
    }

    componentDidMount() {
        this.fetchData(this)
    }

    toPage(page) {
        $('.page').hide()
        $(".page[data-page='" + page + "']").show()
    }

    async searchGame(userSide) {
        let that = this;
        await this.setState({ playerSide: userSide })
        axios({
            method: 'POST',
            url: base_url + '/games/start',
            data: {
                userAddress: this.state.walletAddress,
                userSide: this.state.playerSide //to be dynamic
            }
        }).then(function (res) {
            that.toPage('search')

            let game = res.data
            let socket = new SockJS(SOCKET_URL);
            let stomp = Stomp.over(socket);

            window.addEventListener("beforeunload", (ev) => {
                ev.preventDefault();
                return ev.returnValue = 'Are you sure you want to close?';
            });

            stomp.connect({}, function () {
                //sync listener
                stomp.subscribe('/game/' + game.id + "/sync", function (res) {
                    that.initGame(stomp, game)
                    stomp.unsubscribe('/game/' + game.id + "/sync", {})
                });

                if (game.status === "STARTING") {
                    //Tell other client to start
                    stomp.send("/app/start", {}, game.id);
                    that.toPage("load")
                } else if (game.status === "SEARCHING") {
                    //Wait and listen for opponent
                    stomp.subscribe('/game/' + game.id + "/start", function (res) {
                        that.toPage("load")
                        stomp.unsubscribe('/game/' + game.id + "/start", {})
                    });
                } else {
                    //error, should be finished or broken?
                    alert.log("Something went wrong! Game already finished or not found...");
                }
            });
        }).catch(function (error) {
            alert.log(error)
        });
    }

    //35.214.226.22
    //34.91.33.199

    disconnect(stomp) {
        stomp.unsubscribe()
    }

    startTimer() {
        let secondsLeft = 10
        $('#game_timer').html(secondsLeft)
        let gameTimer = setInterval(function () {
            secondsLeft--
            if (secondsLeft <= 0) {
                clearInterval(gameTimer);
                $('#game_timer').html("FIGHT")
            } else {
                $('#game_timer').html(secondsLeft)
            }
        }, 1000);
    }

    setHP(element, hp) {
        element.removeClass();
        element.addClass('health_bar hp-' + hp)
        element.html(hp + "/5")
    }

    setRoundMove(element, move) {
        switch (move) {
            case "SWORD":
                element.find("img").attr("src", sword)
                break;
            case "SHIELD":
                element.find("img").attr("src", shield)
                break;
            case "HAMMER":
                element.find("img").attr("src", hammer)
                break;
            default:
                //no pick
                element.find("img").attr("src", fist)
                break;
        }
    }

    handleEndRound(stomp, game) {
        //play animation
        $('.move_btn').removeClass('move_selected')

        let playerHP = $('#player_health')
        let opponentHP = $('#opponent_health')
        let playerMove = $('#player_move_selected')
        let opponentMove = $('#opponent_move_selected')

        if (this.state.playerSide === "HUMANS") {
            this.setHP(playerHP, game.human_hp)
            this.setHP(opponentHP, game.robot_hp)
            this.setRoundMove(playerMove, game.human_move)
            this.setRoundMove(opponentMove, game.robot_move)
        } else if (this.state.playerSide === "ROBOTS") {
            this.setHP(opponentHP, game.human_hp)
            this.setHP(playerHP, game.robot_hp)
            this.setRoundMove(opponentMove, game.human_move)
            this.setRoundMove(playerMove, game.robot_move)
        }

        //check if finished => end game

        if (game.status === "IN_PROGRESS") {
            this.startTimer()
        } else {
            //finish
            let gameWon = game.winner === this.state.playerSide
            $('#game_result').html("You " + (gameWon ? "won!" : "lost!"))
            this.toPage('end')
            stomp.unsubscribe('/game/' + game.id + "/move", {})
            window.removeEventListener("beforeunload");
        }
        //if not finished, reset btns, animations, timer etc
    }

    initGame(stomp, game) {
        let that = this
        that.startTimer()
        stomp.subscribe('/game/' + game.id + "/move", function (res) {
            that.handleEndRound(stomp, JSON.parse(res.body))
        });

        let msg = {
            gameId: game.id,
            senderAddress: that.state.walletAddress,
        }

        $('#move_sword_btn').on('click', () => this.setMove(stomp, 1, msg, $('#move_sword_btn')))
        $('#move_shield_btn').on('click', () => this.setMove(stomp, 2, msg, $('#move_shield_btn')))
        $('#move_hammer_btn').on('click', () => this.setMove(stomp, 3, msg, $('#move_hammer_btn')))

        this.toPage(2)
    }

    setMove(stomp, move, msg, btn) {
        msg.move = move
        $('.move_btn').removeClass('move_selected')
        btn.addClass('move_selected')
        stomp.send("/app/move", {}, JSON.stringify(msg));
    }

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

                                <Selection searchGame={this.searchGame}></Selection>

                                <Search></Search>
                                <Load></Load>

                                <Game playerHealth={this.playerHealth} opponentHealth={this.opponentHealth}></Game>

                                <End></End>
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
