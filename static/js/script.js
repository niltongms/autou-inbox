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

function copiarResposta() {
    navigator.clipboard.writeText(document.getElementById('textoResposta').innerText);
    alert('Copiado!');
}