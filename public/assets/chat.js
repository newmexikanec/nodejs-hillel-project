import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();

const chatBox = document.querySelector('main div.chat-box');
chatBox.scrollTop = chatBox.scrollHeight;
const chatID = chatBox.getAttribute('chat-id');
const senderID = document.querySelector('header span#user-id').getAttribute('user-id');

socket.on('connect', () => {
    socket.emit('join', chatID);
    socket.on('getMessage', data => {
        const newMessage = document.createElement('div');
        const p = document.createElement('p');
        const text = document.createTextNode(data.text);
        const span = document.createElement('span');
        const date = new Date();
        const minutes = date.getMinutes();
        const time = document.createTextNode(`${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`);

        newMessage.className = senderID === data.senderID ? 'media-chat media-chat-reverse' : 'media-chat';
        span.appendChild(time);
        p.appendChild(text);
        p.appendChild(span);
        newMessage.appendChild(p);
        chatBox.append(newMessage);

        chatBox.scrollTop = chatBox.scrollHeight;
    });

    document
        .querySelector('.publisher-input')
        .addEventListener('keyup', e => {
            if (e.code === 'Enter' && e.target.value) {
                socket.emit('sendMessage', {
                    text: e.target.value,
                    senderID
                });
                e.target.value = '';
            }
        });
});
