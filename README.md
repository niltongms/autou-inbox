# AutoU Inbox

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Framework-Flask-green?style=for-the-badge&logo=flask&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-orange?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Frontend-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

> **Solução Full Stack de Triagem Inteligente.**
> Sistema desenvolvido para automatizar a classificação e resposta de emails corporativos, unindo a robustez do Python com a performance de inferência da Groq AI.

---

## Visão Geral

Este projeto foi concebido para resolver um gargalo comum em operações de suporte: a triagem manual de emails. A aplicação recebe arquivos ou textos, utiliza Processamento de Linguagem Natural (NLP) via LLM para entender o contexto e realiza duas ações críticas:
1.  **Classifica** a demanda por prioridade (Produtivo vs. Improdutivo).
2.  **Redige** uma minuta de resposta alinhada ao tom de voz corporativo.

### Funcionalidades Principais
* **Processamento Multiformato:** Leitura nativa de arquivos `.pdf` e `.txt`, além de entrada direta de texto.
* **Análise Semântica:** Utilização do modelo **Llama 3.3** para compreensão profunda do contexto, superando abordagens baseadas apenas em palavras-chave.
* **Interface Responsiva:** UI moderna desenvolvida com **Tailwind CSS**, seguindo um Tema Dark/Gold.
* **Feedback em Tempo Real:** Processamento assíncrono via AJAX, garantindo que a interface não congele durante a análise da IA.

---

## Arquitetura e Decisões Técnicas

Para este desafio, minha prioridade foi construir uma arquitetura escalável e desacoplada, evitando soluções "low-code" para conseguir demonstrar domínio de engenharia de software.

### 1. Backend: MVC com Flask
Adotei o padrão **Model-View-Controller** para organização do código:
* **Controller (`app.py`):** Atua como orquestrador, gerenciando rotas, validações de entrada e respostas HTTP.
* **Model (`ai_core.py`):** Isola a lógica de negócio e a integração com a API da Groq. Isso permite trocar o provedor de IA no futuro sem quebrar o resto da aplicação.
* **View (`templates/`):** Frontend desacoplado, servido pelo Flask mas construído com HTML5 semântico.

> **Por que Flask?** Ao contrário do Streamlit, o Flask me permite construir uma **API RESTful** real. Isso significa que, no futuro, essa mesma inteligência poderia ser integrada ao CRM ou ERP da AutoU via endpoints JSON.

### 2. IA e Performance: Groq (LPU)
A escolha da **Groq** foi estratégica visando performance e custo.
* **Inferência Instantânea:** O uso de LPUs (Language Processing Units) elimina a latência comum em LLMs, entregando respostas quase instantâneas.
* **Engenharia de Prompt:** O modelo foi instruído a retornar saídas estritamente em **JSON**, garantindo a integridade dos dados no tráfego entre Backend e Frontend.

---

## Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação em seu ambiente local.

### Pré-requisitos
* Python 3.10 ou superior
* Git

### Instalação

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/SEU-USUARIO/autou-inbox.git](https://github.com/SEU-USUARIO/autou-inbox.git)
    cd autou-inbox
    ```

2.  **Configure o Ambiente Virtual**
    Recomendado para isolar as dependências do projeto.
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # Linux/Mac
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Instale as Dependências**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configuração de Segurança (.env)**
    Crie um arquivo `.env` na raiz do projeto e adicione sua chave de API (obtenha em [console.groq.com](https://console.groq.com)):
    ```env
    GROQ_API_KEY=gsk_sua_chave_aqui
    ```

5.  **Execute a Aplicação**
    ```bash
    python app.py
    ```
    Acesse em seu navegador: `http://127.0.0.1:5000`

---

## Estrutura de Arquivos

A organização do código reflete boas práticas de desenvolvimento Python:

```text
projeto-autou/
├── ai_core.py           # Módulo de Lógica de IA (Model)
├── app.py               # Servidor Web e Rotas (Controller)
├── requirements.txt     # Lista de dependências
├── Procfile             # Configuração de entrypoint (Deploy)
├── .env                 # Variáveis de ambiente (GitIgnored)
├── templates/
│   └── index.html       # Interface do Usuário (View)
└── static/
    ├── css/style.css    # Estilizações personalizadas
    └── js/script.js     # Lógica de cliente (Fetch API/AJAX)

```

---

## Roadmap (Melhorias Futuras)

Como evolução deste projeto, os próximos passos seriam:

* [ ] Implementar sistema de **Login/Autenticação** para usuários.
* [ ] Adicionar um **Banco de Dados** (SQLite/Postgres) para salvar o histórico de emails analisados.
* [ ] Criar um **Dashboard** com métricas (ex: % de emails improdutivos por dia).
* [ ] Containerização da aplicação com **Docker**.

---

## Sobre o Projeto

Este projeto foi desenvolvido como parte de um **Case Técnico proposto pela AutoU**, visando avaliar competências em desenvolvimento Full Stack, integração de Inteligência Artificial e arquitetura de software.

### Desenvolvido por
<b>Elenilton Gomes</b>
<br />
<i>Full Stack Developer</i>
</td>
</tr>
</table>

