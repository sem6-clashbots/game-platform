import React from 'react';
const base_url = 'localhost';

function API() {
    function sendTestRequest(){
        console.log('sending request to: ' + base_url);
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default API;