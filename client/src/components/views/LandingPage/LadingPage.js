import React from 'react';
import axios from 'axios';

function LadingPage(props) {

    const onClickHandler = () => {
        axios.get(`/api/users/logout`)
        .then(response => {
           if(response.data){
                props.history.push("/login")
           } else { 
                alert('실패했다 썩 돌아가!')
           }  
        })
    }   
            
 

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
        }}>
            <h2>HOME</h2>

        <button onClick={onClickHandler}>
            로그아웃
        </button>

        </div>
    )
}

export default LadingPage
