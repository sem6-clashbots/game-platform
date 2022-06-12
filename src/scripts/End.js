import $ from 'jquery'

function toPage(page) {
    $('.page').hide()
    $(".page[data-page='" + page + "']").show()
}

function End() {
    return (
        <div className="end_screen page" style={{ display: 'none' }} data-page="end">
            <div className='card'>
                <div id='game_result'>
                    You should not be here!
                </div>
                <div className='end_btn' onClick={() => toPage(1)}>
                    Back to selection...
                </div>
            </div>
        </div>
    )
}

export default End;