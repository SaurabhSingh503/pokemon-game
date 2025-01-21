const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = {};
let pokemonList = Array.from({ length: 100 }, (_, i) => `Pokemon-${i + 1}`);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Assign initial Pokémon to the player
    players[socket.id] = {
        pokemon: pokemonList[Math.floor(Math.random() * pokemonList.length)],
        wins: 0,
    };

    socket.emit('playerData', players[socket.id]);

    socket.on('battle', (opponentId) => {
        if (players[opponentId]) {
            const playerPokemon = players[socket.id].pokemon;
            const opponentPokemon = players[opponentId].pokemon;

            // Simple battle logic
            const playerWins = Math.random() > 0.5;

            if (playerWins) {
                players[socket.id].wins += 1;
                players[socket.id].pokemon =
                    pokemonList[Math.floor(Math.random() * pokemonList.length)];
                socket.emit('battleResult', {
                    result: 'win',
                    newPokemon: players[socket.id].pokemon,
                });
                io.to(opponentId).emit('battleResult', { result: 'lose' });
            } else {
                io.to(opponentId).emit('battleResult', { result: 'win' });
                socket.emit('battleResult', { result: 'lose' });
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete players[socket.id];
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
