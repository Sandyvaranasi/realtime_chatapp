$(document).ready(function () {
    const socket = io.connect('http://localhost:3000');

    const usernameInput = $("#username");
    const changeUsernameButton = $("#change_username");
    const feedbackDiv = $("#feedback");
    const messageInput = $("#message");
    const changeMessageButton = $("#change_message");

    changeMessageButton.click(function () {
        const message = messageInput.val().trim();
        if (message !== '') {
            socket.emit('new_message', { message });
            messageInput.val('');
        }
    });

    socket.on('new_message', function (data) {
        const messageContainerClass = (data.username === 'You') ? 'sent-message' : 'received-message';
        const messageContainer = $('<div>').addClass('message-container ' + messageContainerClass);
        const usernameElement = $('<span>').addClass('message-username').text(data.username + ':');
        const messageContent = $('<div>').addClass('message-content').html('<p>' + data.message + '</p>');
    
        messageContainer.append(usernameElement, messageContent);
        feedbackDiv.append(messageContainer);
    
        feedbackDiv.scrollTop(feedbackDiv.prop('scrollHeight'));
    });
    

    changeUsernameButton.click(function () {
        const username = usernameInput.val().trim();
        if (username !== '') {
            socket.emit('change_username', { username });
        }
    });

    messageInput.keypress(function () {
        socket.emit('typing');
    });

    socket.on('typing', function (data) {
        feedbackDiv.html('<p><i>' + data.username + ' is typing a message...</i></p>');
    });
});
