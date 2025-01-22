const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Sample Pokémon list
const pokemonList = [
    'Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle', 'Eevee', 'Jigglypuff',
    'Snorlax', 'Gengar', 'Machamp', 'Alakazam', 'Mewtwo', 'Mew', 'Zapdos',
    'Moltres', 'Articuno', 'Dragonite', 'Charizard', 'Blastoise', 'Venusaur',
    'Onix', 'Gyarados', 'Scyther', 'Electabuzz', 'Magmar', 'Lapras', 'Ditto',
    'Vaporeon', 'Jolteon', 'Flareon', 'Kabutops', 'Aerodactyl', 'Snorlax',
    'Dragonair', 'Arcanine', 'Tauros', 'Exeggutor', 'Rhydon', 'Porygon',
    'Omastar', 'Kabuto', 'Hitmonlee', 'Hitmonchan', 'Chansey', 'Kangaskhan',
    'Mr. Mime', 'Jynx', 'Electrode', 'Dugtrio', 'Magneton', 'Weezing',
    'Muk', 'Cloyster', 'Hypno', 'Kingler', 'Seadra', 'Starmie', 'Tangela',
    'Koffing', 'Horsea', 'Goldeen', 'Seaking', 'Staryu', 'Magikarp', 'Pinsir',
    'Ditto', 'Vaporeon', 'Jolteon', 'Flareon', 'Kabutops', 'Aerodactyl',
    'Articuno', 'Zapdos', 'Moltres', 'Dratini', 'Dragonair', 'Dragonite'
];

const players = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Assign initial Pokémon to the player
    players[socket.id] = {
        pokemon: pokemonList[Math.floor(Math.random() * pokemonList.length)],
        wins: 0,
    };

    // Broadcast the list of players to all clients
    const updatePlayerList = () => {
        io.emit('playerList', Object.keys(players).map((id) => ({
            id,
            pokemon: players[id].pokemon,
        })));
    };
    updatePlayerList();

    // Send the player's data to them
    socket.emit('playerData', players[socket.id]);

    // Handle battle requests
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

    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete players[socket.id];
        updatePlayerList();
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
