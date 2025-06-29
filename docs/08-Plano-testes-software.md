# Plano de testes de software

### **Casos de Teste para os Requisitos Funcionais**

| **Caso de teste** | **CT-001 – Cadastrar novo usuário** |
| :---: | :---: |
| **Requisito associado** | RF-001 - Cadastro e Gestão de Usuários: O sistema deve permitir um cadastro de usuário unificado. Todo usuário inicia como "Responsável" e pode se tornar "Motorista" ao oferecer uma rota. |
| **Objetivo do teste** | Verificar se um novo usuário consegue se cadastrar na aplicação e se o seu perfil é criado com o papel padrão de "Responsável". |
| **Passos** | - Acessar a aplicação mobile. <br> - Clicar em "Vamos começar" <br> - Perpassar o carrosel de boas-vindas. <br> - Clicar em "Entrar agora". <br> - Na tela de login, clicar em "Sign up"  <br> - Preencher as informações de 1º nível (usuário). <br> - Preencher as informações de 2º nível (email e senha). <br> - Preencher as informações de 3º nível (endereço). |
| **Critério de êxito** | - O cadastro é realizado com sucesso. <br> - O sistema exibe uma mensagem de sucesso ou redireciona para o login. |
| **Responsável pela elaboração do caso de teste** | Vinicius Henrique Alves. |

<br>

| **Caso de teste** | **CT-002 – Validar documentação para se tornar "Motorista"** |
| :---: | :---: |
| **Requisito associado** | RF-010 - Validação de Segurança do Motorista: O sistema deve ter um processo de validação da CNH (Carteira Nacional de Habilitação) quando um usuário se candidata a "Motorista". |
| **Objetivo do teste** | Verificar se o usuário com perfil "Responsável" consegue submeter seus documentos (CNH) para validação. |
| **Passos** | - Acessar a aplicação mobile. <br> - Clicar em "Vamos começar" <br> - Perpassar o carrosel de boas-vindas. <br> - Clicar em "Entrar agora". <br> - Fazer login com a conta de usuário  <br> - Clicar em "Oferecer". <br> - Clicar em "Adicionar dados do Veículo e da CNH". <br> - Informar uma CNH válida (terminada em 1). <br> - Clicar em "Validar". |
| **Critério de êxito** | - O sistema exibe a mensagem "Válida". |
| **Responsável pela elaboração do caso de teste** | Vinicius Henrique Alves. |

<br>

| **Caso de teste** | **CT-003 – Cadastrar aluno no perfil do Responsável** |
| :---: | :---: |
| **Requisito associado** | RF-003 - Cadastro de Alunos (Passageiros): O sistema deve permitir que um "Responsável" cadastre um ou mais alunos (filhos) em sua conta, vinculando-os ao seu perfil. |
| **Objetivo do teste** | Verificar se um usuário "Responsável" consegue adicionar um novo aluno (filho) à sua conta. |
| **Passos** | - Acessar o sistema com um usuário do tipo "Responsável". <br> - Navegar até a aba Perfil do Usuário. <br> - Localizar a seção Dependentes. <br> - Clicar no botão Adicionar. <br> - Preencher os dados obrigatórios do dependente (ex: nome, data de nascimento, etc.). <br> - Clicar em Salvar.|
| **Critério de êxito** | - O sistema exibe a mensagem "Válida". |
| **Responsável pela elaboração do caso de teste** | Walyson Moises Barbosa. |

<br>

| **Caso de teste** | **CT-004 – Cadastrar nova rota de carona (Motorista)** |
| :---: | :---: |
| **Requisito associado** | RF-004 - Criação e Gerenciamento de Rotas (Motorista): O sistema deve permitir que o "Motorista" cadastre suas rotas de ou para a escola Educare. |
| **Objetivo do teste** | Verificar se um usuário "Motorista" (com perfil já validado) consegue criar uma nova rota. |
| **Passos** | - Acessar a aplicação mobile. <br> - Clicar em "Vamos começar" <br> - Perpassar o carrosel de boas-vindas. <br> - Clicar em "Entrar agora". <br> - Fazer login com a conta de usuário  <br> - Clicar em "Oferecer". <br> - Escolher ponto de partida. <br> - Definir quantidade e preço dos assentos. <br> - Definir preferências da viagem (permitir fumar; permitir animais; permitir bagagem; permitir paradas). <br> - Clicar em "Publicar Carona". |
| **Critério de êxito** | - O usuário é redirecionado para a tela de Histórico, onde pode acessar a corrida. <br> - Na tela de histórico, o motorista pode verificar algumas informações sobre a viagem, tal qual o status, que quando criado é "Aguardando". |
| **Responsável pela elaboração do caso de teste** | Vinicius Henrique Alves. |

<br>

| **Caso de teste** | **CT-005 – Buscar rotas compatíveis (Responsável)** |
| :---: | :---: |
| **Requisito associado** | RF-005 - Busca e Correspondência de Rotas (Responsável): O sistema deve permitir que o "Responsável" busque por motoristas cujas rotas sejam compatíveis com a necessidade do aluno. |
| **Objetivo do teste** | Verificar se o "Responsável" consegue buscar e encontrar rotas que atendam às suas necessidades de local e horário. |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

<br>

| **Caso de teste** | **CT-006 – Solicitar agendamento de carona (Responsável)** |
| :---: | :---: |
| **Requisito associado** | RF-006 - Agendamento de Carona (Responsável): O sistema deve permitir que o "Responsável" solicite e agende uma carona para um aluno com um motorista compatível. |
| **Objetivo do teste** | Verificar se o "Responsável" consegue solicitar uma vaga na rota de um motorista para um de seus alunos. |
| **Passos** | - Fazer login no aplicativo com uma conta do tipo "Responsável".<br> - Acessar a aba "Minhas".<br> - Selecionar uma carona disponível na lista do histórico.<br> - Visualizar os detalhes da carona.<br> - Clicar no botão "Reservar".<br> - Escolher a rota, ponto de saída e destino desejados.<br> - Clicar em "Solicitar Carona".<br> - Acompanhar o status da solicitação no mapa da aplicação. |
| **Critério de êxito** | - A solicitação é realizada com sucesso.<br> - A rota solicitada aparece no mapa para acompanhamento em tempo real.<br> - A solicitação é registrada e exibida no histórico de caronas. |
| **Responsável pela elaboração do caso de teste** | Luísa Machado Antunes Santos. |

<br>

| **Caso de teste** | **CT-007 – Editar informações do perfil** |
| :---: | :---: |
| **Requisito associado** | RF-007 - Gestão de Perfil do Usuário: O sistema deve permitir que os usuários editem informações básicas de seus perfis. |
| **Objetivo do teste** | Verificar se o usuário consegue editar e salvar as informações de seu perfil. |
| **Passos** | - Estar logado no aplicativo. <br> - Na tela principal, clicar na aba de perfil. <br> - Clicar em “Editar”. <br> - Alterar os dados desejados (ex: nome, telefone, etc.). <br> - Clicar no botão “Salvar” <br> - Verificar se os dados foram atualizados na visualização do perfil. <br>|
| **Critério de êxito** | Os dados são salvos com sucesso e exibidos corretamente após a edição. |
| **Responsável pela elaboração do caso de teste** | Tiago Rafael Martins Cardoso |

<br>

| **Caso de teste** | **CT-008 – Avaliar uma carona concluída** |
| :---: | :---: |
| **Requisito associado** | RF-008 - Sistema de Avaliação e Feedback: O sistema deve permitir que responsáveis e motoristas se avaliem mutuamente após a conclusão de uma carona. |
| **Objetivo do teste** | Verificar se, após uma carona ser marcada como concluída, o "Responsável" consegue avaliar o "Motorista". |
| **Passos** | - Na tela inicial do aplicativo, clicar na aba "Minhas". <br/> - Na tela "Histórico de Caronas", <br/>  - Clique na carona com status "Concluída". <br/> Arraste o modal no fim da tela para cima <br/>- Role a tela para baixo até encontrar a opção "Avaliar Corrida". <br/> - Clique em "Avaliar Corrida". <br/> - Na janela pop-up "Avaliar Corrida", selecione a quantidade de estrelas para aquela corrida. <br/>  - Caso queira adicionar complementar a avaliação, adicione uma mensagem ao campo "Comentário" <br/> - Clique em "Enviar Avaliação". <br/> - Na janela "Avaliação Enviada", clique em "OK". |
| **Critério de êxito** | A avaliação do usuário é enviada com sucesso. <br/> O sistema exibe uma mensagem de agradecimento pela avaliação |
| **Responsável pela elaboração do caso de teste** | Guilherme Siqueira Ramos |

<br>

| **Caso de teste** | **CT-009 – Visualizar histórico de caronas** |
| :---: | :---: |
| **Requisito associado** | RF-009 - Histórico de Caronas: O sistema deve oferecer um histórico simplificado das caronas realizadas para cada usuário. |
| **Objetivo do teste** | Verificar se o usuário consegue acessar e visualizar a lista de caronas passadas (concluídas ou canceladas). |
| **Passos** | - Na tela inicial do aplicativo, clicar na aba "Minhas". <br/> - Na tela "Histórico de Caronas", |
| **Critério de êxito** | Caso o usuário já tenha realizado uma caronas, o sistema deverá listar todas caronas agendadas ou concluídas |
| **Responsável pela elaboração do caso de teste** | Guilherme Siqueira Ramos |
