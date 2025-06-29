# Nome do projeto

`CURSO: Sistemas de Informação`

`DISCIPLINA: Trabalho Interdisciplinar Aplicações para Sustentabilidade`

`5º semestre/2025`

O projeto tem como objetivo criar um aplicativo web de carona escolar, facilitando a conexão entre alunos ou pais que dirigem até a escola e aqueles que necessitam de transporte. A plataforma permitirá que usuários ofereçam ou solicitem caronas com base em suas rotas diárias, promovendo economia e praticidade nos deslocamentos escolares.

Diferentemente de aplicativos de carona tradicionais, este serviço será dedicado ao ambiente escolar, priorizando a segurança dos estudantes por meio de verificações de usuários e sistemas de avaliação. Além de proporcionar comodidade às famílias, o projeto contribuirá para a sustentabilidade e a mobilidade urbana, reduzindo o número de veículos em circulação e, consequentemente, o trânsito e a emissão de poluentes.

## Integrantes

* Guilherme Siqueira Ramos
* Luísa Machado Antunes Santos
* Otávio Gonçalves Rocha
* Tiago Rafael Martins Cardoso
* Vinicius Henrique Alves
* Walyson Moises Barbosa

## Professor

* Amália Soares Vieira de Vasconcelos

# Instruções de utilização

## Requisitos para executar a aplicação

- Node.js versão 18 ou superior  
- NPM ou Yarn instalado  
- Expo CLI (instalado globalmente ou via npx)  
- Emulador Android configurado (Android Studio) ou dispositivo Android físico conectado via USB com depuração ativada  
- Banco de dados PostgreSQL (versão 13 ou superior recomendado)  
- Servidor backend rodando localmente ou remotamente  

## Passos para instalação e execução

### Clone o repositório:

git clone https://github.com/ICEI-PUC-Minas-PBE-ADS-SI/2025-1-p5-tias-carona-escolar
cd 2025-1-p5-tias-carona-escolar

### Backend:

Entre na pasta do backend:

cd src\strada\backend
npm install

### Inicie o backend:

npm run start

# Ride Service
Em um terminal:

cd src/strada/ride-service
npm install
npm run start

# Auth Service
Em um terminal:

cd src/strada/auth-service
npm install
npm run start

### Frontend (React Native com Expo):
Entre na pasta do app mobile:

cd src\strada\mobile
npm install
Para rodar o app no emulador Android ou dispositivo físico, execute:

### Inicie o Frontend:

npx expo run:android

## Usuário de teste

| Tipo        | Usuário (email)     | Senha  | Observações               |
|-------------|---------------------|--------|--------------------------|
| Usuário     | luisa@email.com     | 1234   | Usuário padrão para testes|

# Documentação

<ol>
<li><a href="docs/01-Contexto.md"> Documentação de contexto</a></li>
<li><a href="docs/02-Especificacao.md"> Especificação do projeto</a></li>
<li><a href="docs/03-Metodologia.md"> Metodologia</a></li>
<li><a href="docs/04-Modelagem-processos-negocio.md"> Modelagem dos processos de negócios</a></li>
<li><a href="docs/05-Projeto-interface.md"> Projeto de interface</a></li>
<li><a href="docs/06-Template-padrao.md"> Template padrão da aplicação</a></li>
<li><a href="docs/07-Arquitetura-solucao.md"> Arquitetura da solução</a></li>
<li><a href="docs/08-Plano-testes-software.md"> Plano de testes de software</a></li>
<li><a href="docs/09-Registro-testes-software.md"> Registro de testes de software</a></li>
<li><a href="docs/10-Plano-testes-usabilidade.md"> Plano de testes de usabilidade</a></li>
<li><a href="docs/11-Registro-testes-usabilidade.md"> Registro de testes de usabilidade</a></li>
<li><a href="docs/12-Conclusao.md"> Conclusão</a></li>
<li><a href="docs/13-Referencias.md"> Referências</a></li>
</ol>

# Código

* <a href="src/README.md">Código</a>

# Apresentação

* <a href="presentation/README.md">Apresentação do projeto</a>
