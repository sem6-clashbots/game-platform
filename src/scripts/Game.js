import React from "react";
import logo from '../resources/webLogo.png'
import sword from '../resources/moves/sword.png'
import shield from '../resources/moves/shield.png'
import hammer from '../resources/moves/hammer.png'
import fist from '../resources/moves/fist.png'

class Game extends React.Component {
    render() {
        return (
            <div className="game_screen page" style={{ display: 'none' }} data-page="2">
                <div className="game_container">
                    <div className="field">
                        <div className="game_side player_side">
                            <div className="title_container">
                                <div className="char_title">0xF5B58Aa66258166b47e7Dc9e76053129d345Efa7</div>
                            </div>
                            <div className="game_character_container">
                                <img className="game_character_image" width="250px" src={logo}></img>
                            </div>
                            <div id="player_health" className="health_bar hp-5">
                                5/5
                            </div>
                        </div>
                        <div className="game_side opponent_side">
                            <div className="title_container">
                                <div className="char_title">Opponent</div>
                            </div>
                            <div className="game_character_container">
                                <img className="game_character_image" width="250px" src={logo}></img>
                            </div>
                            <div id="opponent_health" className="health_bar hp-5">
                                5/5
                            </div>
                        </div>
                    </div>
                    <div id="game_timer" className="centered_absolute timer"></div>
                    <div className="centered_absolute selected_attacks">
                        <div id="player_move_selected" className="selected_move_picked">
                            <img id="player_move_img" className="move_selected_image" src={fist}></img>
                        </div>
                        <div id="opponent_move_selected" className="selected_move_picked">
                            <img id="opponent_move_img" className="move_selected_image flipped" src={fist}></img>
                        </div>
                    </div>
                    <div className="centered_absolute moves">
                        <div id="move_sword_btn" className='move_btn'>
                            <img className="move_image" src={sword}></img>
                        </div>
                        <div id="move_shield_btn" className='move_btn'>
                            <img className="move_image" src={shield}></img>
                        </div>
                        <div id="move_hammer_btn" className='move_btn'>
                            <img className="move_image" src={hammer}></img>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Game;