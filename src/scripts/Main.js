import React, { useEffect, useState, componentDidMount } from "react";
import logo from '../resources/webLogo.png'
import $ from 'jquery'

function Main() {
    function nextPage(pageIndex) {
        $('.page').addClass('hidden');
        $(".page[data-page='" + pageIndex + "']").removeClass('hidden')
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
            <div className="select_screen page hidden" data-page="1">
                <div className="side column side_selected_char">
                    <div className="card selected_char">
                        <span className="char_name">CHARACTER 1</span>
                        <div className="img_container">
                        <img className="selected_img" src={logo}></img>
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
                        START
                    </button>
                </div>
                <div className="side side_options">
                    <div className="card options">
                        Options
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
