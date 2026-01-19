from flask import Flask, render_template, request, jsonify
from ai_core import extrair_texto, analisar_email
from werkzeug.exceptions import RequestEntityTooLarge 
import os

app = Flask(__name__)

#Configura o tamanho máximo do arquivo para upload e as extensões permitidas
app.config['MAX_CONTENT_LENGTH'] = 18 * 1024 * 1024
ALLOWED_EXTENSIONS = {'txt', 'pdf'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
# Rota que mostra o site (HTML)
@app.route('/')
def index():
    return render_template('index.html')

# Rota que processa o email (API)
@app.route('/processar', methods=['POST'])
def processar():
    try:
        texto_final = ""
        
        # Verifica quais inputs foram recebidos
        tem_arquivo = 'file' in request.files and request.files['file'].filename != ''
        tem_texto = 'texto_direto' in request.form and request.form['texto_direto'].strip() != ''

        # Regra de Exclusividade (para não aceitar texto e arquivo)
        if tem_arquivo and tem_texto:
            return jsonify({
                "erro": "Conflito de dados: Por favor, envie APENAS o arquivo OU cole o texto. Não os dois."
            }), 400

        if tem_arquivo:
            arquivo = request.files['file']
            
            # Validando a extensão 
            if not allowed_file(arquivo.filename):
                return jsonify({"erro": "Formato inválido. Apenas arquivos .PDF e .TXT são aceitos."}), 400
            
            texto_final = extrair_texto(arquivo)
            
        elif tem_texto:
            texto_final = request.form['texto_direto']
            
        else:
            # Se não mandou nada
            return jsonify({"erro": "Nenhum dado fornecido. Anexe um arquivo ou cole o texto."}), 400

        # 4. Chama a IA
        resultado = analisar_email(texto_final)
        return jsonify(resultado)

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# Tratamento de erro para arquivos grandes
@app.errorhandler(RequestEntityTooLarge)
def handle_file_too_large(e):
    return jsonify({"erro": "O arquivo é muito grande! O limite máximo é 18MB."}), 413

if __name__ == '__main__':
    app.run(debug=True)