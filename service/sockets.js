var Presentation = require('../models/Presentation');
var Vote = require('../models/Vote');

module.exports = function(io, PresentationService, Message, DOMAIN) {
    var presentationService = new PresentationService();

    var clients = {}; // field: array of socket connections
    var speakers = {};

    io.on('connection', function(socket) {

        socket.on('speaker_connect', function(token) {
            if (speakers[token]) {
                console.log("Speaker connection restored:", token);

            } else {
                console.log("Got new speaker connection:", token);
                clients[token] = [];
                speakers[token] = socket;
            }
        });

        socket.on('speaker_disconnect', function(token) {

            if (clients[token]) {
                for (var i = 0; i < clients[token].length; i += 1) {
                    clients[token][i].emit('speaker_disconnected');
                }
            }

            delete clients[token];
            delete speakers[token];

            socket.emit('speaker_disconnected', token);


            console.log("Speaker disconnected:", token);
        });

        socket.on('user_connect', function(token) { // viewers //socket.emit('user_connect', token);

            if (clients[token]) {

                clients[token].push(socket);

                console.log("Viewer connected to", token);

                var temp = {};
                temp[token] = [socket];
                presentationService.sendSlide(temp, token, 1, DOMAIN);
            } else {
                console.log("Stupid user entered wrong token", token);
                socket.emit('wrong_token');
            }
        });

        socket.on('user_disconnect', function(token) { // onunload => socket.emit('user_disconnect', token);

            if (clients[token]) {

                var idx = clients[token].indexOf(socket);
                clients[token] = clients[token].splice(idx, 1);
                console.log("Viewer disconnected from", token);

            } else {
                console.log("User is already disconnected from", token)
            }
        });

        socket.on('change_slide', function(data) {
            console.log("Changing slides of ", data.token, "to", data.number); // data.number — slide id:, data.token — presentation token
            presentationService.sendSlide(clients, data.token, data.number, DOMAIN);
        });

        socket.on('like', function(data) {
            // SAVE TO THE DB
            var vote = new Vote(data);
            presentationService.saveSlideVote(vote, "like");
        });

        socket.on('dislike', function(data) {
            // SAVE TO THE DB
            var vote = new Vote(data);
            presentationService.saveSlideVote(vote, "dislike");
        });




        socket.on('question', function(data){
            // SAVE TO THE DB

            var message = new Message(data);
            message.save(function(err) {
                if (err) console.log(err);
            });

            //data.token
            //data.sender_name
            //data.question

            console.log("Send question to", data.token);
            // EMIT TO THE SPEAKER

            speakers[data.token].emit('user_question', data);
        });

    });
};