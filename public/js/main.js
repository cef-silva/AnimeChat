const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Obtem o usuario e a sua sala pelo URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

//Entra na sala de chat
socket.emit('joinRoom', {username, room});

// Obtem salas e sala e usuarios
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);;
    outputUsers(users);
});

//Mensagem do servidor
socket.on('message', message => {
    outputMessage(message);

    //Desce a tela
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Obtem a mensagem
    const msg = e.target.elements.msg.value;

    //Emite a mensagem ao servidor
    socket.emit('chatMessage', msg);

    //Limpa a área de texto
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Mensagem de saída ao DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Adiciona Nome da Sala pelo DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Adiciona usuarios pelo DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`
}