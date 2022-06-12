import React from 'react'
import $ from 'jquery'


class Start extends React.Component {
    start(){
        $('.page').hide()
        $(".page[data-page='" + 1 + "']").show()
    }
    
    render(){
        return (
            <div className="start_screen page" data-page="0">
                <div className="side humans">
                    Humans
                </div>
                <div className="side robots">
                    Robots
                </div>
                <div className="start_pos">
                    <button className="start_btn" onClick={() => this.start()}>
                        START
                    </button>
                </div>
            </div>
        )
    }
}

export default Start;