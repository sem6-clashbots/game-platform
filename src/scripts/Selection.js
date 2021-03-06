import logo from '../resources/webLogo.png'
import React from 'react';

class Selection extends React.Component {
    render(){
        return (
            <div className="select_screen page" style={{ display: 'none' }} data-page="1">
                <div className="select_container">
                    <div className="options card">
                        <div className="card_title">
                            CHARACTER SELECT
                        </div>
                        <div id="character_selecter" className="options">
                            <div className="option">
                                CHARACTER-1
                            </div>
                        </div>
                    </div>
                </div>
                <div className="select_container">
                    <div className="selected_character card">
    
                        <span className="char_name">CHARACTER 1</span>
                        <div>
                            <img className="selected_img" width="250px" src={logo}></img>
                        </div>
                        <div className="stats">
                            <div className="">
                                <span>HP</span>
                                <span>MP</span>
                            </div>
                            <div className="">
                                <span>ATK</span>
                                <span>DEF</span>
                            </div>
                        </div>
    
                    </div>
                    <button className="fight_btn" onClick={() => this.props.searchGame("ROBOTS")}>
                        Fight AS ROBOT
                    </button>
                    <button className="fight_btn" onClick={() => this.props.searchGame("HUMANS")}>
                        Fight AS HUMAN
                    </button>
                </div>
            </div>
        )
    }
}

export default Selection