const form = document.getElementById('meuFormulario');
const inputFile = document.getElementById('inputFile');
const nomeArquivo = document.getElementById('nomeArquivo');

inputFile.addEventListener('change', function() {
    if (this.files && this.files[0]) nomeArquivo.textContent = this.files[0].name;
});

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const loading = document.getElementById('loading');
    const erroMsg = document.getElementById('erroMsg');
    const estadoVazio = document.getElementById('estadoVazio');
    const resultados = document.getElementById('resultados');
    const badge = document.getElementById('badgeClassificacao');
    const textoResposta = document.getElementById('textoResposta');

    loading.classList.remove('hidden');
    resultados.classList.add('hidden');
    erroMsg.classList.add('hidden');
    estadoVazio.classList.add('hidden');

    if (inputFile.files.length > 0) {
        const tamanhoArquivo = inputFile.files[0].size;
        const tamanhoMaximo = 18 * 1024 * 1024; // 18MB

        if (tamanhoArquivo > tamanhoMaximo) {
            // Se for grande demais: Mostra erro, esconde loader e PARA TUDO.
            erroMsg.textContent = "O arquivo é muito grande! O limite máximo é 18MB.";
            erroMsg.classList.remove('hidden');
            loading.classList.add('hidden');
            estadoVazio.classList.remove('hidden');
            return; // O comando 'return' impede que o código continue para o 'fetch'
        }
    }

    const formData = new FormData(form);

    try {
        const response = await fetch('/processar', { method: 'POST', body: formData });
        const data = await response.json();

        if (!response.ok) throw new Error(data.erro || 'Erro desconhecido');

        if (data.classificacao === 'Produtivo') {
            badge.className = 'inline-block px-4 py-2 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 font-bold text-sm';
            badge.innerHTML = 'PRODUTIVO';
        } else {
            badge.className = 'inline-block px-4 py-2 rounded-full bg-red-900/30 text-red-400 border border-red-500/50 font-bold text-sm';
            badge.innerHTML = 'IMPRODUTIVO';
        }

        textoResposta.textContent = data.resposta_sugerida;
        loading.classList.add('hidden');
        resultados.classList.remove('hidden');

    } catch (error) {
        loading.classList.add('hidden');
        erroMsg.textContent = error.message;
        erroMsg.classList.remove('hidden');
        estadoVazio.classList.remove('hidden');
    }
});

// UX: Botão "Fazer Nova Análise" 

document.getElementById('btnReset').addEventListener('click', function() {
    form.reset();
    
    nomeArquivo.textContent = '';
    
    document.getElementById('resultados').classList.add('hidden');
    document.getElementById('estadoVazio').classList.remove('hidden');
    
    document.getElementById('erroMsg').classList.add('hidden');
    
    document.querySelector('textarea[name="texto_direto"]').focus();
});

// Copiar

function copiarResposta() {
    const texto = document.getElementById('textoResposta').innerText;
    
    navigator.clipboard.writeText(texto).then(() => {
        // Pega o elemento do Toast
        const toast = document.getElementById('toast');
        
        // MOSTRA O TOAST
        // Remove as classes que escondem e adiciona as que mostram
        toast.classList.remove('opacity-0', 'translate-y-10'); 
        
        // ESPERA 3 SEGUNDOS E ESCONDE
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-10');
        }, 3000);

    }).catch(err => {
        console.error('Erro ao copiar:', err);
    });
}