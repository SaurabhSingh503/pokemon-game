const socket = io();

const playerInfo = document.getElementById('player-info');
const battleButton = document.getElementById('battle-button');
const result = document.getElementById('result');

let playerData = {};
let playerList = [];

// Display the player's Pokémon
socket.on('playerData', (data) => {
    playerData = data;
    playerInfo.textContent = `Your Pokémon: ${data.pokemon}`;
});

// Display the list of connected players
socket.on('playerList', (list) => {
    playerList = list;
    const playerListDiv = document.getElementById('player-list');
    playerListDiv.innerHTML = '<h3>Available Players:</h3>';
    list.forEach((player) => {
        if (player.id !== socket.id) {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `ID: ${player.id}, Pokémon: ${player.pokemon}`;
            playerDiv.addEventListener('click', () => {
                startBattle(player.id);
            });
            playerListDiv.appendChild(playerDiv);
        }
    });
});

// Start a battle with the selected opponent
function startBattle(opponentId) {
    socket.emit('battle', opponentId);
}

// Handle battle results
socket.on('battleResult', (data) => {
    if (data.result === 'win') {
        result.textContent = `You won! Your new Pokémon: ${data.newPokemon}`;
        playerInfo.textContent = `Your Pokémon: ${data.newPokemon}`;
    } else {
        result.textContent = 'You lost!';
    }
});
