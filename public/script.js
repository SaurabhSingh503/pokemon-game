const socket = io();

const playerInfo = document.getElementById('player-info');
const battleButton = document.getElementById('battle-button');
const result = document.getElementById('result');

let playerData = {};

socket.on('playerData', (data) => {
    playerData = data;
    playerInfo.textContent = `Your Pokémon: ${data.pokemon}`;
});

battleButton.addEventListener('click', () => {
    const opponentId = prompt('Enter opponent ID:');
    if (opponentId) {
        socket.emit('battle', opponentId);
    }
});

socket.on('battleResult', (data) => {
    if (data.result === 'win') {
        result.textContent = `You won! Your new Pokémon: ${data.newPokemon}`;
        playerInfo.textContent = `Your Pokémon: ${data.newPokemon}`;
    } else {
        result.textContent = 'You lost!';
    }
});
