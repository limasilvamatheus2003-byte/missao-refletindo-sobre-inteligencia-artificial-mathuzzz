const caixaPerguntas = document.querySelector(".caixa-perguntas");
const caixaAlternativas = document.querySelector(".caixa-alternativas");
const caixaResultado = document.querySelector(".caixa-resultado");
const textoResultado = document.querySelector(".texto-resultado");
const tituloResultado = document.querySelector(".titulo-resultado");
const barraProgresso = document.getElementById("barra-progresso");
const marcadorAno = document.getElementById("marcador-ano");
const btnReiniciar = document.getElementById("btn-reiniciar");

let anoAtual = 2026;

const perguntas = [
    {
        enunciado: "FASE 1: Chips de IA Neurais foram liberados comercialmente. Você decide implantar um para aprender idiomas instantaneamente?",
        alternativas: [
            {
                texto: "Sim! Quero conexão direta e aprendizado instantâneo.",
                afirmacao: "Você se tornou um dos primeiros ciborgues urbanos.",
                anos: 5
            },
            {
                texto: "Não. Prefiro manter minha mente sem conexões externas.",
                afirmacao: "Você escolheu ser um humano 'natural' em uma sociedade híbrida.",
                anos: 15
            }
        ]
    },
    {
        enunciado: "FASE 2: Robôs domésticos autônomos com sentimentos simulados pedem salários e direitos. Qual é o seu posicionamento?",
        alternativas: [
            {
                texto: "Conceder direitos básicos e tratar robôs como cidadãos.",
                afirmacao: "Sua empatia acelerou a integração pacífica entre humanos e robôs.",
                anos: 10
            },
            {
                texto: "Negar. Mão de obra robótica deve continuar sendo puramente serviço.",
                afirmacao: "Isso gerou uma grande revolta sintética e atrasou a expansão tecnológica.",
                anos: 25
            }
        ]
    },
    {
        enunciado: "FASE 3: Uma superinteligência global propõe governar o planeta sem políticos humanos para eliminar a corrupção. Você vota a favor?",
        alternativas: [
            {
                texto: "Sim! Deixe a IA administrar recursos e leis de forma perfeita.",
                afirmacao: "Você entregou as chaves do planeta para um sistema lógico impecável.",
                anos: 20
            },
            {
                texto: "Não! Decisões humanas, mesmo imperfeitas, devem ser mantidas.",
                afirmacao: "Você lutou pela soberania humana, mantendo o controle em nossas mãos.",
                anos: 8
            }
        ]
    },
    {
        enunciado: "FASE 4: Cientistas criaram o 'Digital Upload', permitindo transferir sua consciência para um servidor eterno. Qual o seu destino?",
        alternativas: [
            {
                texto: "Fazer o upload agora e viver para sempre no metaverso.",
                afirmacao: "Sua consciência agora habita o espaço digital imortal.",
                anos: 35
            },
            {
                texto: "Recusar. A vida finita no mundo físico é o que nos torna humanos.",
                afirmacao: "Você escolheu a beleza e os limites da vida biológica.",
                anos: 12
            }
        ]
    }
];

let atual = 0;
let perguntaAtual;
let historiaFinal = "";

function mostraPergunta() {
    if (atual >= perguntas.length) {
        mostraResultado();
        return;
    }
    
    const progresso = (atual / perguntas.length) * 100;
    barraProgresso.style.width = `${progresso}%`;

    perguntaAtual = perguntas[atual];
    caixaPerguntas.textContent = perguntaAtual.enunciado;
    caixaAlternativas.textContent = "";

    mostraAlternativas();
}

function mostraAlternativas() {
    for (const alternativa of perguntaAtual.alternativas) {
        const botaoAlternativas = document.createElement("button");
        botaoAlternativas.textContent = alternativa.texto;
        botaoAlternativas.addEventListener("click", () => respostaSelecionada(alternativa));
        caixaAlternativas.appendChild(botaoAlternativas);
    }
}

function respostaSelecionada(opcaoSelecionada) {
    historiaFinal += opcaoSelecionada.afirmacao + " ";
    anoAtual += opcaoSelecionada.anos;
    marcadorAno.textContent = `Ano Estimado: ${anoAtual}`;
    atual++;
    mostraPergunta();
}

function mostraResultado() {
    barraProgresso.style.width = "100%";
    caixaPerguntas.textContent = "Sua Linha do Tempo Foi Concluída!";
    tituloResultado.textContent = `Você chegou ao ano de ${anoAtual}! 🚀`;
    textoResultado.textContent = historiaFinal;
    caixaAlternativas.textContent = "";
    caixaResultado.style.display = "block";
}

btnReiniciar.addEventListener("click", () => {
    atual = 0;
    anoAtual = 2026;
    historiaFinal = "";
    marcadorAno.textContent = "Ano Base: 2026";
    caixaResultado.style.display = "none";
    mostraPergunta();
});

mostraPergunta();