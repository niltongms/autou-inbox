from flask import Flask, render_template, request, jsonify
from ai_core import extrair_texto, analisar_email
import os

app = Flask(__name__)

# Rota que mostra o site (HTML)
@app.route('/')
def index():
    return render_template('index.html')

# Rota que processa o email (API)
@app.route('/processar', methods=['POST'])
def processar():
    try:
        texto_final = ""

        # Verifica se enviou arquivo
        if 'file' in request.files and request.files['file'].filename != '':
            arquivo = request.files['file']
            texto_final = extrair_texto(arquivo)
        
        # Verifica se colou texto
        elif 'texto_direto' in request.form and request.form['texto_direto'].strip() != '':
            texto_final = request.form['texto_direto']
        
        else:
            return jsonify({"erro": "Envie um arquivo ou cole o texto."}), 400

        # Chama a IA
        resultado = analisar_email(texto_final)
        return jsonify(resultado)

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)