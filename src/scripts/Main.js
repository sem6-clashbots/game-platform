import React, { useEffect, useState, componentDidMount } from "react";
import logo from '../resources/webLogo.png'
import $ from 'jquery'

function Main() {
    function nextPage(pageIndex) {
        $('.page').hide("fast")
        $(".page[data-page='" + pageIndex + "']").show("fast")
    }

    return (
        <div className='Main'>
            <div className="start_screen page" data-page="0">
                <div className="side humans">
                    Humans
                </div>
                <div className="side robots">
                    Robots
                </div>
                <div className="start_pos">
                    <button className="start_btn" onClick={() => nextPage(1)}>
                        START
                    </button>
                </div>
            </div>

            <div className="select_screen page" style={{display: 'none'}} data-page="1">
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
                    <button className="fight_btn" onClick={() => nextPage(2)}>
                        wowsies btn
                    </button>
                </div>
            </div>
            
            <div className="fight_screen page" style={{display: 'none'}} data-page="2">
                wows
            </div>
        </div>
    );
}

export default Main;
