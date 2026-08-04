const caixaPerguntas = document.querySelector(".caixa-perguntas");
const caixaAlternativas = document.querySelector(".caixa-alternativas");
const caixaResultado = document.querySelector(".caixa-resultado");
const textoResultado = document.querySelector(".texto-resultado");
const tituloResultado = document.querySelector(".titulo-resultado");
const barraProgresso = document.getElementById("barra-progresso");
const marcadorPlacar = document.getElementById("marcador-placar");
const btnProximo = document.getElementById("btn-proximo");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Banco de perguntas organizado por dificuldade
const bancoDePerguntas = [
    // RODADA 1: NÍVEL FÁCIL
    [
        {
            enunciado: "1. Qual seleção venceu a Copa do Mundo de 2002?",
            alternativas: [
                { texto: "Alemanha", correta: false },
                { texto: "Brasil", correta: true },
                { texto: "Itália", correta: false },
                { texto: "Argentina", correta: false }
            ]
        },
        {
            enunciado: "2. Quem é conhecido como 'O Rei do Futebol'?",
            alternativas: [
                { texto: "Maradona", correta: false },
                { texto: "Pelé", correta: true },
                { texto: "Cruyff", correta: false },
                { texto: "Zico", correta: false }
            ]
        },
        {
            enunciado: "3. Qual clube tem mais títulos da UEFA Champions League?",
            alternativas: [
                { texto: "Barcelona", correta: false },
                { texto: "Real Madrid", correta: true },
                { texto: "Bayern de Munique", correta: false },
                { texto: "AC Milan", correta: false }
            ]
        }
    ],
    // RODADA 2: NÍVEL MÉDIO
    [
        {
            enunciado: "4. Em qual Copa do Mundo ocorreu o famoso gol 'Mão de Deus' de Maradona?",
            alternativas: [
                { texto: "México 1986", correta: true },
                { texto: "Espanha 1982", correta: false },
                { texto: "Itália 1990", correta: false },
                { texto: "Argentina 1978", correta: false }
            ]
        },
        {
            enunciado: "5. Qual jogador conquistou a Bola de Ouro (Ballon d'Or) em 2007, sendo o último antes da era Messi/Cristiano Ronaldo?",
            alternativas: [
                { texto: "Ronaldinho Gaúcho", correta: false },
                { texto: "Kaká", correta: true },
                { texto: "Andriy Shevchenko", correta: false },
                { texto: "Thierry Henry", correta: false }
            ]
        },
        {
            enunciado: "6. Qual foi a primeira seleção africana a chegar às quartas de final de uma Copa do Mundo?",
            alternativas: [
                { texto: "Nigéria (1994)", correta: false },
                { texto: "Camarões (1990)", correta: true },
                { texto: "Gana (2010)", correta: false },
                { texto: "Senegal (2002)", correta: false }
            ]
        }
    ],
    // RODADA 3: NÍVEL DIFÍCIL
    [
        {
            enunciado: "7. Qual jogador detém o recorde de mais gols marcados em um único ano civil (91 gols em 2012)?",
            alternativas: [
                { texto: "Cristiano Ronaldo", correta: false },
                { texto: "Gerd Müller", correta: false },
                { texto: "Lionel Messi", correta: true },
                { texto: "Romário", correta: false }
            ]
        },
        {
            enunciado: "8. Quem era o técnico da Seleção Brasileira na Copa do Mundo de 1970?",
            alternativas: [
                { texto: "Zagallo", correta: true },
                { texto: "João Saldanha", correta: false },
                { texto: "Vicente Feola", correta: false },
                { texto: "Telê Santana", correta: false }
            ]
        },
        {
            enunciado: "9. Qual clube venceu a primeira edição da Copa Libertadores da América em 1960?",
            alternativas: [
                { texto: "Santos", correta: false },
                { texto: "Peñarol", correta: true },
                { texto: "Olimpia", correta: false },
                { texto: "Boca Juniors", correta: false }
            ]
        }
    ],
    // RODADA 4: NÍVEL LENDÁRIO
    [
        {
            enunciado: "10. Quem marcou o gol do título da Alemanha na final da Copa do Mundo de 1954 (O Milagre de Berna)?",
            alternativas: [
                { texto: "Fritz Walter", correta: false },
                { texto: "Helmut Rahn", correta: true },
                { texto: "Max Morlock", correta: false },
                { texto: "Sepp Herberger", correta: false }
            ]
        },
        {
            enunciado: "11. Qual país sediou e venceu a primeira Eurocopa da história em 1960?",
            alternativas: [
                { texto: "União Soviética", correta: true },
                { texto: "França", correta: false },
                { texto: "Yugoslávia", correta: false },
                { texto: "Espanha", correta: false }
            ]
        },
        {
            enunciado: "12. Qual jogador detém o recorde de mais gols marcados em uma única edição de Copa do Mundo (13 gols em 1958)?",
            alternativas: [
                { texto: "Sándor Kocsis", correta: false },
                { texto: "Just Fontaine", correta: true },
                { texto: "Gerd Müller", correta: false },
                { texto: "Ademir de Menezes", correta: false }
            ]
        }
    ]
];

let rodadaAtual = 0;
let perguntaNaRodada = 0;
let acertosTotais = 0;
let acertosRodada = 0;
let totalPerguntasRespondidas = 0;

function iniciaRodada() {
    perguntaNaRodada = 0;
    acertosRodada = 0;
    caixaResultado.style.display = "none";
    mostraPergunta();
}

function mostraPergunta() {
    const perguntasDaRodada = bancoDePerguntas[rodadaAtual];

    if (perguntaNaRodada >= perguntasDaRodada.length) {
        mostraResultadoRodada();
        return;
    }

    const progresso = (perguntaNaRodada / perguntasDaRodada.length) * 100;
    barraProgresso.style.width = `${progresso}%`;
    marcadorPlacar.textContent = `Nível ${rodadaAtual + 1} - Pergunta ${perguntaNaRodada + 1}/${perguntasDaRodada.length}`;

    const perguntaAtual = perguntasDaRodada[perguntaNaRodada];
    caixaPerguntas.textContent = perguntaAtual.enunciado;
    caixaAlternativas.textContent = "";

    for (const alternativa of perguntaAtual.alternativas) {
        const botao = document.createElement("button");
        botao.textContent = alternativa.texto;
        botao.addEventListener("click", () => respostaSelecionada(alternativa));
        caixaAlternativas.appendChild(botao);
    }
}

function respostaSelecionada(opcao) {
    if (opcao.correta) {
        acertosRodada++;
        acertosTotais++;
    }
    totalPerguntasRespondidas++;
    perguntaNaRodada++;
    mostraPergunta();
}

function mostraResultadoRodada() {
    barraProgresso.style.width = "100%";
    caixaPerguntas.textContent = `Rodada ${rodadaAtual + 1} Concluída!`;
    caixaAlternativas.textContent = "";

    const perguntasDaRodada = bancoDePerguntas[rodadaAtual];
    tituloResultado.textContent = `Você acertou ${acertosRodada} de ${perguntasDaRodada.length} nesta rodada!`;
    
    if (rodadaAtual < bancoDePerguntas.length - 1) {
        textoResultado.textContent = `Placar Geral: ${acertosTotais} acertos até agora. O próximo nível será ainda mais difícil!`;
        btnProximo.style.display = "block";
        btnProximo.textContent = `Ir para a Rodada ${rodadaAtual + 2} 🔥`;
    } else {
        textoResultado.textContent = `Fim de Jogo! Você completou todas as rodadas com um total de ${acertosTotais} acertos em ${totalPerguntasRespondidas} perguntas!`;
        btnProximo.style.display = "none";
    }

    caixaResultado.style.display = "block";
}

btnProximo.addEventListener("click", () => {
    rodadaAtual++;
    iniciaRodada();
});

btnReiniciar.addEventListener("click", () => {
    rodadaAtual = 0;
    acertosTotais = 0;
    totalPerguntasRespondidas = 0;
    iniciaRodada();
});

iniciaRodada();