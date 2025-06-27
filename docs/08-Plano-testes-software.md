# Plano de testes de software

<span style="color:red">Pré-requisitos: <a href="02-Especificacao.md"> Especificação do projeto</a></span>, <a href="05-Projeto-interface.md"> Projeto de interface</a>

O plano de testes de software é gerado a partir da especificação do sistema e consiste em casos de teste que deverão ser executados quando a implementação estiver parcial ou totalmente pronta. Apresente os cenários de teste utilizados na realização dos testes da sua aplicação. Escolha cenários de teste que demonstrem os requisitos sendo satisfeitos.

Enumere quais cenários de testes foram selecionados para teste. Neste tópico, o grupo deve detalhar quais funcionalidades foram avaliadas, o grupo de usuários que foi escolhido para participar do teste e as ferramentas utilizadas.

Não deixe de enumerar os casos de teste de forma sequencial e garantir que o(s) requisito(s) associado(s) a cada um deles esteja(m) correto(s) — de acordo com o que foi definido na <a href="02-Especificacao.md">Especificação do projeto</a>.

Por exemplo:

| **Caso de teste**  | **CT-001 – Cadastrar perfil**  |
|:---: |:---: |
| Requisito associado | RF-00X - A aplicação deve apresentar, na página principal, a funcionalidade de cadastro de usuários para que estes consigam criar e gerenciar seu perfil. |
| Objetivo do teste | Verificar se o usuário consegue se cadastrar na aplicação. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar em "Criar conta" <br> - Preencher os campos obrigatórios (e-mail, nome, sobrenome, celular, CPF, senha, confirmação de senha) <br> - Aceitar os termos de uso <br> - Clicar em "Registrar" |
| Critério de êxito | - O cadastro foi realizado com sucesso. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

Com certeza\! Abaixo estão os casos de teste criados a partir dos requisitos funcionais, seguindo o template fornecido.

-----

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
| **Requisito associado** | RF-002 - Validação de Segurança do Motorista: O sistema deve ter um processo de validação de identidade e da CNH (Carteira Nacional de Habilitação) quando um usuário se candidata a "Motorista". |
| **Objetivo do teste** | Verificar se o usuário com perfil "Responsável" consegue submeter seus documentos (identidade e CNH) para validação. |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

<br>

| **Caso de teste** | **CT-003 – Cadastrar aluno no perfil do Responsável** |
| :---: | :---: |
| **Requisito associado** | RF-003 - Cadastro de Alunos (Passageiros): O sistema deve permitir que um "Responsável" cadastre um ou mais alunos (filhos) em sua conta, vinculando-os ao seu perfil. |
| **Objetivo do teste** | Verificar se um usuário "Responsável" consegue adicionar um novo aluno (filho) à sua conta. |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

<br>

| **Caso de teste** | **CT-004 – Cadastrar nova rota de carona (Motorista)** |
| :---: | :---: |
| **Requisito associado** | RF-004 - Criação e Gerenciamento de Rotas (Motorista): O sistema deve permitir que o "Motorista" cadastre suas rotas de ou para a escola Educare. |
| **Objetivo do teste** | Verificar se um usuário "Motorista" (com perfil já validado) consegue criar uma nova rota. |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

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
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

<br>

| **Caso de teste** | **CT-007 – Aceitar solicitação de carona (Motorista)** |
| :---: | :---: |
| **Requisito associado** | RF-007 - Gestão de Solicitações de Carona (Motorista): O sistema deve permitir que o "Motorista" visualize, aceite ou recuse as solicitações de carona recebidas. |
| **Objetivo do teste** | Verificar se o "Motorista" consegue visualizar e aceitar uma solicitação de carona pendente. |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

<br>

| **Caso de teste** | **CT-008 – Editar informações do perfil** |
| :---: | :---: |
| **Requisito associado** | RF-008 - Gestão de Perfil do Usuário: O sistema deve permitir que os usuários editem informações básicas de seus perfis. |
| **Objetivo do teste** | Verificar se o usuário consegue editar e salvar as informações de seu perfil. |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

<br>

| **Caso de teste** | **CT-009 – Avaliar uma carona concluída** |
| :---: | :---: |
| **Requisito associado** | RF-009 - Sistema de Avaliação e Feedback: O sistema deve permitir que responsáveis e motoristas se avaliem mutuamente após a conclusão de uma carona. |
| **Objetivo do teste** | Verificar se, após uma carona ser marcada como concluída, o "Responsável" consegue avaliar o "Motorista". |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

<br>

| **Caso de teste** | **CT-010 – Agendar carona recorrente** |
| :---: | :---: |
| **Requisito associado** | RF-010 - Agendamento de Caronas Recorrentes: O sistema deve permitir que o "Responsável" agende caronas de forma recorrente. |
| **Objetivo do teste** | Verificar se o "Responsável" consegue agendar uma carona para várias datas de uma só vez (ex: toda segunda e quarta-feira). |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |

<br>

| **Caso de teste** | **CT-011 – Visualizar histórico de caronas** |
| :---: | :---: |
| **Requisito associado** | RF-011 - Histórico de Caronas: O sistema deve oferecer um histórico simplificado das caronas realizadas para cada usuário. |
| **Objetivo do teste** | Verificar se o usuário consegue acessar e visualizar a lista de caronas passadas (concluídas ou canceladas). |
| **Passos** | |
| **Critério de êxito** | |
| **Responsável pela elaboração do caso de teste** | Nome do integrante da equipe. |


## Ferramentas de testes (opcional)

Comente sobre as ferramentas de testes utilizadas.
 
> **Links úteis**:
> - [IBM - criação e geração de planos de teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Práticas e técnicas de testes ágeis](http://assiste.serpro.gov.br/serproagil/Apresenta/slides.pdf)
> - [Teste de software: conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
> - [Criação e geração de planos de teste de software](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Ferramentas de teste para JavaScript](https://geekflare.com/javascript-unit-testing/)
> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)
