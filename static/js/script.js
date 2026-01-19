const form = document.getElementById('meuFormulario');
const inputFile = document.getElementById('inputFile');
const nomeArquivo = document.getElementById('nomeArquivo');

inputFile.addEventListener('change', function() {
    if (this.files && this.files[0]) nomeArquivo.textContent = this.files[0].name;
});

// Botão "Limpar tudo"

    document.getElementById('btnLimparTexto').addEventListener('click', function() {
    form.reset();
    nomeArquivo.textContent = '';
    document.querySelector('textarea[name="texto_direto"]').focus();
    // Esconde erros antigos se tiver
    document.getElementById('erroMsg').classList.add('hidden');
});
//Envio do Formulário e Validações

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const loading = document.getElementById('loading');
    const erroMsg = document.getElementById('erroMsg');
    const estadoVazio = document.getElementById('estadoVazio');
    const resultados = document.getElementById('resultados');
    const badge = document.getElementById('badgeClassificacao');
    const textoResposta = document.getElementById('textoResposta');
    const textArea = document.querySelector('textarea[name="texto_direto"]');

    // Verificar dados dos inputs
    const temArquivo = inputFile.files.length > 0;
    const temTexto = textArea.value.trim() !== "";

    loading.classList.remove('hidden');
    resultados.classList.add('hidden');
    erroMsg.classList.add('hidden');
    estadoVazio.classList.add('hidden');

    // Validação de Exclusividade (ou arquivo ou texto)
    if (temArquivo && temTexto) {
        erroMsg.innerHTML = "<strong>Conflito de dados!</strong><br>Por favor, envie o arquivo OU cole o texto, não os dois.";
        erroMsg.classList.remove('hidden');
        loading.classList.add('hidden');
        estadoVazio.classList.remove('hidden');
        return;
    }

    // Validação dos inputs vazios
    if (!temArquivo && !temTexto) {
        erroMsg.innerHTML = "<strong>Dados ausentes!</strong><br>Selecione um arquivo ou cole o texto do email.";
        erroMsg.classList.remove('hidden');
        loading.classList.add('hidden');
        estadoVazio.classList.remove('hidden');
        return;
    }

    // Validação do tamanho e da extensão do arquivo
    if (temArquivo) {
        const arquivo = inputFile.files[0];
        if (arquivo.size > 18 * 1024 * 1024) {
            erroMsg.innerHTML = "<strong>Arquivo muito grande!</strong><br>O limite máximo é 16MB.";
            erroMsg.classList.remove('hidden');
            loading.classList.add('hidden');
            estadoVazio.classList.remove('hidden');
            return;
        }
        // Extensão
        const extensao = arquivo.name.split('.').pop().toLowerCase();
        if (extensao !== 'pdf' && extensao !== 'txt') {
            erroMsg.innerHTML = " <strong>Formato inválido!</strong><br>Apenas arquivos .PDF e .TXT são aceitos.";
            erroMsg.classList.remove('hidden');
            loading.classList.add('hidden');
            estadoVazio.classList.remove('hidden');
            return;
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

// Botão "Fazer Nova Análise" 

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

        const toast = document.getElementById('toast');
        toast.classList.remove('opacity-0', 'translate-y-10');      
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-10');
        }, 3000);

    }).catch(err => {
        console.error('Erro ao copiar:', err);
    });
}