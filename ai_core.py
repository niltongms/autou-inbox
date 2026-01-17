import os
import json
import PyPDF2
from groq import Groq
from dotenv import load_dotenv

# Carrega as senhas do .env
load_dotenv()

# Conecta na Inteligência Artifical Groq
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

def extrair_texto(arquivo) -> str:
    """Extrai texto de PDF ou TXT."""
    try:
        if arquivo.filename.endswith('.pdf'):
            leitor = PyPDF2.PdfReader(arquivo)
            texto = ""
            for pagina in leitor.pages:
                texto += pagina.extract_text() or ""
            return texto
        else:
            return arquivo.read().decode('utf-8')
    except Exception as e:
        raise ValueError(f"Erro ao ler arquivo: {str(e)}")

def analisar_email(texto_email: str) -> dict:
    """Analisa o email usando Llama 3 via Groq."""
    if not texto_email.strip():
        raise ValueError("O email está vazio.")

    prompt_sistema = """
        Você é um assistente corporativo da empresa AutoU.
        Sua tarefa é analisar o email recebido e retornar um JSON.
        
        Regras:
        1. Classifique como 'Produtivo' (trabalho, suporte, sistema) ou 'Improdutivo' (spam, social).
        2. Gere uma sugestão de resposta profissional e direta.
        3. Responda APENAS o JSON abaixo:
        {
            "classificacao": "Produtivo" ou "Improdutivo",
            "resposta_sugerida": "Texto da resposta..."
        }
        """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt_sistema},
                {"role": "user", "content": texto_email}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            response_format={"type": "json_object"}
        )

        conteudo = chat_completion.choices[0].message.content
        return json.loads(conteudo)

    except Exception as e:
        return {
            "classificacao": "Erro",
            "resposta_sugerida": f"Erro na IA: {str(e)}"
        }