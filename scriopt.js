const emojis = {
  pedra: '✊',
  papel: '✋',
  tesoura: '✌️'
};


let pontosJogador = 0;
let pontosCpu = 0;
let empates = 0;
let metaVitorias = 3;
let jogoEncerrado = false;

let historicoPartidas = [];

let recordeVitorias = Number(localStorage.getItem('recordeJokenpo')) || 0;

const playerScoreEl = document.getElementById('playerScore');
const cpuScoreEl = document.getElementById('cpuScore');
const drawScoreEl = document.getElementById('drawScore');
const recordScoreEl = document.getElementById('recordScore');
const playerHandEl = document.getElementById('playerHand');
const cpuHandEl = document.getElementById('cpuHand');
const statusTextEl = document.getElementById('statusText');
const choiceBtns = document.querySelectorAll('.choice-btn');
const historyListEl = document.getElementById('historyList');
const roundCounterEl = document.getElementById('roundCounter');
const themeBtn = document.getElementById('themeBtn');
const resetBtn = document.getElementById('resetBtn');
const metaInput = document.getElementById('metaInput');
const definirMetaBtn = document.getElementById('definirMetaBtn');
const mensagemErro = document.getElementById('mensagemErro');
const metaAtualTexto = document.getElementById('metaAtualTexto');

recordScoreEl.textContent = recordeVitorias;

themeBtn.addEventListener('click', function () {
  if (document.body.classList.contains('light-theme')) {
    document.body.classList.remove('light-theme');
    themeBtn.textContent = '☀️ Modo Claro';
  } else {
    document.body.classList.add('light-theme');
    themeBtn.textContent = '🌙 Modo Escuro';
  }
});

definirMetaBtn.addEventListener('click', function () {
  const valorDigitado = metaInput.value.trim();

  if (valorDigitado === '') {
    mensagemErro.textContent = 'Erro: o campo não pode ficar vazio.';
    return;
  }

  const numeroMeta = Number(valorDigitado);
  if (isNaN(numeroMeta) || numeroMeta <= 0 || !Number.isInteger(numeroMeta)) {
    mensagemErro.textContent = 'Erro: digite apenas um número inteiro maior que zero.';
    return;
  }

  mensagemErro.textContent = '';
  metaVitorias = numeroMeta;
  metaAtualTexto.innerHTML = `Meta atual: <strong>${metaVitorias} ${metaVitorias === 1 ? 'vitória' : 'vitórias'}</strong>`;
  reiniciarPartida();
});

function obterJogadaCpu() {
  const opcoes = ['pedra', 'papel', 'tesoura'];
  const indiceAleatorio = Math.floor(Math.random() * opcoes.length);
  return opcoes[indiceAleatorio];
}

function verificarVencedor(jogador, cpu) {
  if (jogador === cpu) {
    return 'draw';
  } else if (
    (jogador === 'pedra' && cpu === 'tesoura') ||
    (jogador === 'papel' && cpu === 'pedra') ||
    (jogador === 'tesoura' && cpu === 'papel')
  ) {
    return 'win';
  } else {
    return 'lose';
  }
}

function jogarRodada(escolhaJogador) {
  if (jogoEncerrado) return;

  const escolhaCpu = obterJogadaCpu();
  const resultado = verificarVencedor(escolhaJogador, escolhaCpu);

  playerHandEl.textContent = emojis[escolhaJogador];
  cpuHandEl.textContent = emojis[escolhaCpu];
  playerHandEl.className = 'hand';
  cpuHandEl.className = 'hand';

  let textoResultado = '';

  if (resultado === 'win') {
    pontosJogador++;
    playerScoreEl.textContent = pontosJogador;
    statusTextEl.textContent = 'Você venceu a rodada!';
    statusTextEl.className = 'status-text win-text';
    playerHandEl.classList.add('player-win');
    textoResultado = 'Vitória';

    if (pontosJogador > recordeVitorias) {
      recordeVitorias = pontosJogador;
      recordScoreEl.textContent = recordeVitorias;
      localStorage.setItem('recordeJokenpo', recordeVitorias);
    }
  } else if (resultado === 'lose') {
    pontosCpu++;
    cpuScoreEl.textContent = pontosCpu;
    statusTextEl.textContent = 'A CPU venceu a rodada!';
    statusTextEl.className = 'status-text lose-text';
    cpuHandEl.classList.add('cpu-win');
    textoResultado = 'Derrota';
  } else {
    empates++;
    drawScoreEl.textContent = empates;
    statusTextEl.textContent = 'Empate!';
    statusTextEl.className = 'status-text draw-text';
    textoResultado = 'Empate';
  }

  historicoPartidas.push({
    rodada: historicoPartidas.length + 1,
    jogador: emojis[escolhaJogador],
    cpu: emojis[escolhaCpu],
    resultado: resultado,
    texto: textoResultado
  });

  atualizarListaHistorico();
  verificarFimDeJogo();
}

function atualizarListaHistorico() {
  historyListEl.innerHTML = '';
  roundCounterEl.textContent = `${historicoPartidas.length} ${historicoPartidas.length === 1 ? 'rodada' : 'rodadas'}`;

  // Laço percorrendo o array de trás para frente (rodadas mais recentes primeiro)
  for (let i = historicoPartidas.length - 1; i >= 0; i--) {
    const item = historicoPartidas[i];
    const li = document.createElement('li');
    li.className = `history-item ${item.resultado}`;
    li.innerHTML = `
      <span>Rodada #${item.rodada} — Você ${item.jogador} vs ${item.cpu} CPU</span>
      <strong>${item.texto}</strong>
    `;
    historyListEl.appendChild(li);
  }
}

function verificarFimDeJogo() {
  if (pontosJogador >= metaVitorias) {
    jogoEncerrado = true;
    statusTextEl.textContent = `🏆 Fim de jogo! Você atingiu ${metaVitorias} vitórias!`;
    statusTextEl.className = 'status-text win-text';
    alternarBotoesJogada(true);
  } else if (pontosCpu >= metaVitorias) {
    jogoEncerrado = true;
    statusTextEl.textContent = `🤖 Fim de jogo! A CPU atingiu ${metaVitorias} vitórias!`;
    statusTextEl.className = 'status-text lose-text';
    alternarBotoesJogada(true);
  }
}

function alternarBotoesJogada(desativar) {
  for (let i = 0; i < choiceBtns.length; i++) {
    choiceBtns[i].disabled = desativar;
  }
}

function reiniciarPartida() {
  pontosJogador = 0;
  pontosCpu = 0;
  empates = 0;
  jogoEncerrado = false;
  historicoPartidas = [];

  playerScoreEl.textContent = '0';
  cpuScoreEl.textContent = '0';
  drawScoreEl.textContent = '0';
  roundCounterEl.textContent = '0 rodadas';
  playerHandEl.textContent = '✊';
  cpuHandEl.textContent = '✊';
  playerHandEl.className = 'hand';
  cpuHandEl.className = 'hand';
  statusTextEl.textContent = 'Escolha sua jogada abaixo!';
  statusTextEl.className = 'status-text';
  historyListEl.innerHTML = '<li class="empty-history">Nenhuma partida jogada ainda.</li>';
  alternarBotoesJogada(false);
}

for (let i = 0; i < choiceBtns.length; i++) {
  choiceBtns[i].addEventListener('click', function () {
    jogarRodada(this.dataset.choice);
  });
}

resetBtn.addEventListener('click', reiniciarPartida);
