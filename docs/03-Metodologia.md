
# Metodologia

<span style="color:red">Pré-requisitos: <a href="02-Especificacao.md"> Especificação do projeto</a></span>

Descreva aqui a metodologia de trabalho do grupo para abordar o problema. Inclua definições sobre os ambientes de trabalho utilizados pela equipe para desenvolver o projeto. Isso abrange a relação dos ambientes utilizados, a estrutura para a gestão do código-fonte, além da definição do processo e das ferramentas por meio dos quais a equipe se organiza (gestão de equipes).


## Controle de versão

A ferramenta de controle de versão adotada no projeto foi o [Git](https://git-scm.com/), sendo que o [GitHub](https://github.com) foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `unstable`: versão já testada do software, porém instável
- `testing`: versão em testes do software
- `dev`: versão de desenvolvimento do software

Quanto à gerência de issues, o projeto adota a seguinte convenção para etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida

Discuta como a configuração do projeto foi feita na ferramenta de versionamento escolhida. Exponha como a gestão de tags, merges, commits e branches é realizada. Discuta também como a gestão de issues foi feita.

> **Links úteis**:
> - [Tutorial GitHub](https://guides.github.com/activities/hello-world/)
> - [Git e GitHub](https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA)
> - [Comparando fluxos de trabalho](https://www.atlassian.com/br/git/tutorials/comparing-workflows)
> - [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)
> - [The gitflow workflow - in less than 5 mins](https://www.youtube.com/watch?v=1SXpE08hvGs)

## Planejamento do projeto

###  Divisão de papéis

> Apresente a divisão de papéis entre os membros do grupo em cada Sprint. O desejável é que, em cada Sprint, o aluno assuma papéis diferentes na equipe. Siga o modelo do exemplo abaixo:

#### Sprint 1
- _Scrum master_: Luisa Machado
- Protótipos: Tiago Rafael
- Testes: Walyson, Otávio Rocha
- Documentação: Vinicius Henrique Alves, Guilherme Siqueira Ramos

#### Sprint 2
- _Scrum master_: Luisa Machado
- Desenvolvedor _front-end_: Otávio Rocha, Guilherme Siqueira
- Desenvolvedor _back-end_: Walyson, Vinicius Henrique
- Testes: Tiago Rafael

###  Quadro de tarefas

#### Sprint 1

Atualizado em: 16/03/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Guilherme Siqueira Ramos | Introdução    |11/03/2025     | 16/03/2025 | ✔️    | 11/03/2025                |
| Guilherme Siqueira Ramos | Restrições    |15/03/2025     | 16/03/2025 | ✔️    | 16/03/2025                |
| Guilherme Siqueira Ramos | Busca de Referências    |13/03/2025     | 16/03/2025 | ✔️    | 16/03/2025                |
| Vinicius Henrique Alves | Relatório | 15/03/2025     | 16/03/2025 | ✔️    | 15/03/2025      |
| Vinicius Henrique Alves | Apresentação | 15/03/2025     | 16/03/2025 | ✔️    | 16/03/2025      |
| Otávio Gonçalves Rocha | Finalização de requisitos e entrega| 16/03/2025 | 16/03/2025 | ✔️ | 16/03/2025
| Otávio Gonçalves Rocha | Adição de Referências | 16/03/2025 | 16/03/2025 | ✔️ | 16/03/2025
| Otávio Gonçalves Rocha | Metodologia e Ferramentas | 16/03/2025 | 16/03/2025 | ✔️ | 16/03/2025
| Walyson Moises | Refinamento  | 16/03/2025 | 16/03/2025 | ✔️ | 16/03/2025
| Walyson Moises | Finalização do documento de processo de negócios| 16/03/2025 | 16/03/2025 | ✔️ | 16/03/2025
| Luisa Machado | Validação dos requisitos da entrega da sprint 1 | 16/03/2025 | 16/03/2025 | ✔️ | 16/03/2025
| Tiago Rafael | Criar personas | 16/03/2025 | 16/03/2025 | ✔️ | 16/03/2025
| Tiago Rafael | Definir requisitos | 16/03/2025 | 16/03/2025 | ✔️ | 16/03/2025

#### Sprint 2

Atualizado em: 16/03/2025

| Responsável         | Tarefa/Requisito                                                     | Iniciado em | Prazo | Status | Terminado em |
|--------------------|------------------------------------------------------------------|-------------|-------|--------|--------------|
| Otávio Rocha      | RF-001 - Permitir o cadastro de pais, alunos e motoristas com verificação de identidade. |             |       | 📝    |              |
| Guilherme Siqueira | RF-002 - Permitir que os usuários avaliem e deixem feedback sobre as caronas realizadas. |             |       | 📝    |              |
| Vinicius Henrique  | RF-003 - Implementar um sistema de correspondência de rotas com base em proximidade e horários. |             |       | 📝    |              |
| Walyson Moises     | RF-004 - Permitir que os motoristas visualizem solicitações de carona em sua rota. |             |       | 📝    |              |
| Tiago Rafael      | RF-005 - Implementar um sistema de chat para comunicação entre motoristas e passageiros. |             |       | 📝    |              |
| Luisa Machado     | RF-006 - Permitir que os administradores gerenciem usuários e caronas. |             |       | 📝    |              |
| Otávio Rocha      | RF-007 - Oferecer uma funcionalidade de histórico de caronas realizadas. |             |       | 📝    |              |
| Guilherme Siqueira | RF-008 - Permitir que os usuários editem seus perfis e preferências de carona. |             |       | 📝    |              |




Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado


> **Links úteis**:
> - [11 passos essenciais para implantar Scrum no seu projeto](https://mindmaster.com.br/scrum-11-passos/)
> - [Scrum em 9 minutos](https://www.youtube.com/watch?v=XfvQWnRgxG0)
> - [Os papéis do Scrum e a verdade sobre cargos nessa técnica](https://www.atlassian.com/br/agile/scrum/roles)

### Processo

Coloque informações sobre detalhes da implementação do Scrum seguido pelo grupo. O grupo deverá fazer uso do recurso de gerenciamento de projeto oferecido pelo GitHub, que permite acompanhar o andamento do projeto, a execução das tarefas e o status de desenvolvimento da solução.
 
> **Links úteis**:
> - [Planejamento e gestão ágil de projetos](https://pucminas.instructure.com/courses/87878/pages/unidade-2-tema-2-utilizacao-de-ferramentas-para-controle-de-versoes-de-software)
> - [Sobre quadros de projeto](https://docs.github.com/pt/issues/organizing-your-work-with-project-boards/managing-project-boards/about-project-boards)
> - [Project management, made simple](https://github.com/features/project-management/)
> - [Como criar backlogs no GitHub](https://www.youtube.com/watch?v=RXEy6CFu9Hk)
> - [Tutorial slack](https://slack.com/intl/en-br/)


## Relação de ambientes de trabalho

Os artefatos do projeto são desenvolvidos a partir de diversas plataformas. Todos os ambientes e frameworks utilizados no desenvolvimento da aplicação estão listados na seção abaixo.

### Ferramentas

Liste todas as ferramentas que foram empregadas no projeto, justificando a escolha delas, sempre que possível.

Exemplo: os artefatos do projeto são desenvolvidos a partir de diversas plataformas e a relação dos ambientes com seu respectivo propósito é apresentada na tabela que se segue.

Utilizando whatsapp para comunicação do projeto, assim como a documentação assíncrona e compartilha dos produtos do Google (Google Docs etc.) Também utilizaremos o board do github scrum, para trackear as tasks das sprints.

| Ambiente                            | Plataforma                         | Link de acesso                         |
|-------------------------------------|------------------------------------|----------------------------------------|
| Repositório de código fonte         | GitHub                             | http://....                            |
| Documentos do projeto               | GitHub                             | http://....                            |
| Projeto de interface                | Figma                              | http://....                            |
| Gerenciamento do projeto            | GitHub Projects                    | http://....                            |
| Hospedagem                          | Vercel                             | http://....                            |
| Google Docs                         | Google                             | https://docs.google.com/document/d/14SgsHeZ-naK56n0AYIdo_QnAllGSwJT3YsZAmS03pBo/edit?tab=t.0 |
| Google Slides                       | Google                             | https://docs.google.com/presentation/d/1rFdk1TUFGbskCzCFMquKYxxWXrYll8nOFvKFMe0rLsU/edit?usp=sharing |
| Whatsapp                            | Meta                               | whatsapp.com                           |
| Microsoft Visual Studio Code        | Microsoft                          | https://code.visualstudio.com          |
 
