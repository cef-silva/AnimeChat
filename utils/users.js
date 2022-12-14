const users = [];

//Usuario entra no chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

//Obter o usuario atual
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//Usuario sai do chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Obter usuario na sala
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}