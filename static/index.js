document.addEventListener('DOMContentLoaded', () => {

     // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {



        if(!localStorage.getItem('user'))
        {
            console.log("hallihallo")
            document.getElementById('user').innerHTML='  <h2> Please enter your Name</h2>' +
                ' <input autocomplete="off" autofocus class="form-control" id="username" type="text"/>\n' +
                '   <hr>\n' +
                '   <button id="moin"> Submit</button>';


             document.getElementById('moin').onclick = () =>{
                console.log("Moinsen");
                localStorage.setItem('user' , document.getElementById('username').value);
                document.getElementById('user').remove();
                document.getElementById('create_chat').style.display = 'block';

            };

            document.getElementById('create_chat').style.display = 'none';

        }




        // Each button should emit a "submit vote" event
        document.querySelectorAll("#submit_message").forEach(button => {
            button.onclick = () => {

                const chat_name=document.getElementById('chat_name').innerHTML;
                const message = document.getElementById('message').value;
                document.getElementById('message').value="";
                socket.emit('new_message', {"message": message, "chat_name":chat_name, "user": localStorage.getItem('user')});
                return false;
            };
        });
    });
        // When a new vote is announced, add to the unordered list

    socket.on('next_message', data => {

        document.getElementById('chat').innerHTML += data + '<br>';


    });


});