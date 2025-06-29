
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

#### Sprint 3
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


#### Sprint 3

Atualizado em: 11/05/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Vinicius | Apresentação   |11/05/2025     | 11/05/2025 | ✔️    | 11/05/2025                |



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
O grupo adotou a metodologia Scrum para organização e acompanhamento do desenvolvimento do projeto. O processo foi estruturado em Sprints quinzenais, com reuniões de planejamento, revisão e retrospectiva ao final de cada ciclo, além de daily meetings assíncronas realizadas via grupo no WhatsApp.

A divisão de papéis (Scrum Master, desenvolvedores, responsáveis por testes e documentação) foi feita por Sprint, buscando alternância de funções entre os membros, conforme apresentado na seção anterior.

Para o gerenciamento de tarefas e acompanhamento do progresso das Sprints, foi utilizado o recurso de GitHub Projects, que oferece um quadro de tarefas baseado na metodologia ágil (Kanban). Cada Sprint foi representada por uma view no quadro (Backlog, To Do, In Progress, Done), e cada tarefa foi registrada como uma issue, vinculada aos commits e pull requests correspondentes.

O processo seguiu o seguinte fluxo:

**Planejamento da Sprint:** definição dos requisitos priorizados e criação de issues no GitHub com base nesses requisitos.

**Distribuição das tarefas:** as issues foram atribuídas aos membros de acordo com os papéis da Sprint.

**Desenvolvimento e acompanhamento:** as tarefas foram movidas entre as colunas do quadro de projeto conforme o andamento. Isso permitiu uma visualização clara do progresso e dos gargalos.

**Integração com o repositório:** cada issue foi relacionada a commits e pull requests, garantindo rastreabilidade e organização do histórico de mudanças.

**Revisão e Retrospectiva:** ao final de cada Sprint, o grupo revisou as tarefas concluídas e discutiu pontos de melhoria para os próximos ciclos.

Além do GitHub Projects, ferramentas como o Google Docs foram utilizadas para documentação colaborativa, e o WhatsApp para comunicação ágil entre os membros da equipe.

O quadro do projeto no GitHub pode ser acessado neste link:
> [Quadro do projeto no GitHub](https://github.com/orgs/ICEI-PUC-Minas-PBE-ADS-SI/projects/34/views/1)


## Relação de ambientes de trabalho

O desenvolvimento do projeto ocorre em um ambiente colaborativo e distribuído, no qual diferentes plataformas e ferramentas foram escolhidas para apoiar cada etapa da construção da solução. As decisões foram tomadas com base na facilidade de uso, integração com outras ferramentas, acessibilidade e aderência ao fluxo ágil.

A seguir, apresentamos a relação dos ambientes utilizados e seus respectivos propósitos no contexto do projeto:

**Comunicação:** A equipe utiliza o WhatsApp como principal canal de comunicação rápida e informal, permitindo trocas constantes sobre o andamento das atividades, alinhamento de entregas e esclarecimento de dúvidas.

**Documentação:** O Google Docs e o GitHub são utilizados para criação, edição colaborativa e versionamento dos documentos do projeto. Essa escolha garante a rastreabilidade das alterações, facilidade de acesso e colaboração assíncrona.

**Gerenciamento do projeto:** O GitHub Projects foi adotado para organizar as tarefas por sprints, acompanhar o progresso das entregas e distribuir as atividades entre os membros do grupo conforme os papéis definidos no Scrum.

**Versionamento de código:** O GitHub é a plataforma utilizada para armazenar e controlar o código-fonte. Com o uso de branches específicas para desenvolvimento, testes e versões estáveis, o grupo consegue manter uma organização eficaz no repositório.

**Desenvolvimento:** O Visual Studio Code foi escolhido como editor principal por sua leveza, extensões úteis para diversas linguagens e integração com Git.

**Design de interface:** As interfaces foram prototipadas e validadas no Figma, o que facilitou a visualização antecipada das telas da aplicação e a colaboração entre desenvolvedores e responsáveis pelo design.

| Ambiente                            | Plataforma                         | Link de acesso                         |
|-------------------------------------|------------------------------------|----------------------------------------|
| Repositório de código fonte         | GitHub                             | [Acessar](http://...)                  |
| Documentos do projeto               | GitHub / Google Docs               | [GitHub](https://github.com/ICEI-PUC-Minas-PBE-ADS-SI/2025-1-p5-tias-carona-escolar) / [Google Docs](https://docs.google.com/document/...) |
| Projeto de interface                | Figma                              | [Acessar](https://www.figma.com/design/STxShpYMgpDATn893dIOiH/Untitled?node-id=1-2&p=f&t=Thnc5AvYjQMDoeH2-0)                  |
| Gerenciamento do projeto            | GitHub Projects                    | [Acessar](https://github.com/orgs/ICEI-PUC-Minas-PBE-ADS-SI/projects/34)                  |
| Hospedagem                          | AWS                             | [Acessar](https://aws.amazon.com/)                  |
| Comunicação                         | WhatsApp                           | [Acessar](https://www.whatsapp.com)    |
| Edição de código                    | Visual Studio Code                 | [Acessar](https://code.visualstudio.com) |


### Ferramentas

Os artefatos do projeto são desenvolvidos a partir de diversas plataformas, linguagens e serviços. A seguir, apresenta-se a relação das ferramentas utilizadas, bem como suas justificativas sempre que pertinente.

A comunicação da equipe é realizada principalmente pelo WhatsApp, facilitando trocas rápidas e objetivas entre os integrantes. Para documentação e compartilhamento assíncrono de materiais, são utilizados produtos do Google, como o Google Docs e Google Drive. A gestão das tarefas é realizada por meio do GitHub Projects, utilizando a metodologia Scrum para organização das sprints.

Além disso, ferramentas como Eraser.io são empregadas para o desenho da arquitetura de software e infraestrutura, permitindo uma visualização colaborativa dos componentes do sistema. Também estão em uso ambientes modernos de desenvolvimento, ferramentas de análise de APIs, renderização de mapas e notificações móveis, conforme detalhado a seguir.

| Ambiente                    | Ferramenta/Serviço                     | Justificativa                                                                 |
|-----------------------------|----------------------------------------|-------------------------------------------------------------------------------|
| Linguagens de Programação   | Go, TypeScript, Java                   | Uso conforme necessidade: Go, Java e Typescript no back-end, TypeScript no front-end     |
| Mobile                      | React Native                           | Framework cross-platform para acelerar o desenvolvimento mobile              |
| Banco de Dados              | PostgreSQL + PostGIS, MongoDB          | PostGIS para geodados e consultas espaciais; Mongo para dados não-relacionais|
| Backend/API                 | Node.js (TypeScript), Go, Java         | Modularidade e escolha por contexto da funcionalidade                        |
| Mensageria                  | Apache Kafka                           | Comunicação assíncrona, desacoplamento entre serviços e processamento em tempo real |
| API Testing                 | Insomnia                               | Testes e documentação de APIs                                                |
| Frontend Web                | -                                      | Projeto voltado ao mobile no momento                                         |
| Proxy Reverso               | Nginx                                  | Roteamento de requisições e balanceamento                                    |
| CI/CD                       | GitHub Actions (provável)              | Automação de testes e deploys                                                |
| Versionamento               | Git + GitHub                           | Padrão de mercado e integração com board Scrum                               |
| Containerização             | Docker                                 | Isolamento de ambientes                                                      |
| Orquestração                | Kubernetes (em análise)                | Possível adoção para escalabilidade futura                                   |
| IDEs                        | VSCode, IntelliJ IDEA                  | Preferência pessoal e compatibilidade com múltiplas linguagens               |
| Notificações Mobile         | Firebase Cloud Messaging (FCM)         | Envio de push notifications para apps                                        |
| Mapas e Geodados            | Mapbox, Google Routes API              | Visualização e roteamento geográfico no app                                  |
| Design de Arquitetura       | Eraser.io                              | Ferramenta colaborativa para diagramas e esquemas                            |
| Infraestrutura              | AWS, Oracle Cloud GCP ou Digital Ocean | Adoção de serviços em nuvem gratuitos para ambiente de testes/desenvolvimento|
| Documentação                | Google Docs, Google Drive              | Compartilhamento e versionamento leve de documentos                          |
| Comunicação                 | WhatsApp                               | Agilidade na comunicação entre membros da equipe                             |
| Gerenciamento de Projeto    | GitHub Projects                        | Organização de tarefas com metodologia Scrum                                 |
