# Modelagem dos processos de negócio

## Modelagem da situação atual (Modelagem AS IS)

Atualmente, os pais ou responsáveis formalizam pedidos de transporte escolar visando assegurar que seus filhos tenham um meio seguro de chegar à escola. No entanto, quando o serviço público não está disponível ou a solicitação não é atendida, eles precisam recorrer a serviços particulares de transporte, o que pode gerar custos adicionais e preocupações com a qualidade e segurança do serviço.

Os diagramas BPMN abaixo ilustram os principais fluxos atuais:

![image](https://github.com/user-attachments/assets/4d2d2f81-de98-4c71-b6e6-a93d23b2735e)<br>
Figura 1: Solicitação de Transporte Escolar

![image](https://github.com/user-attachments/assets/923b2395-f423-4ed5-b698-b0816b840c23)<br>
Figura 2: Embarque Diário do Aluno

## Descrição geral da proposta (Modelagem TO BE)

A proposta de modelagem TO-BE busca otimizar o processo de solicitação e o uso do transporte escolar por meio da introdução de uma plataforma digital. Nessa nova abordagem, o processo inicia-se com o cadastro do aluno na plataforma pelo responsável, seguido da assinatura dos termos de responsabilidade e da validação de identidade. Em seguida, é realizada a verificação automática da disponibilidade de transporte parceiro. Dessa forma, é possível seguir com a solicitação de uma nova carona, na qual ocorre a criação automática do contrato, que é disponibilizado para o aceite do responsável. Após o uso do serviço, o responsável pode registrar sua experiência por meio de uma avaliação da qualidade do transporte escolar.

A solução propõe uma modernização efetiva dos processos relacionados à mobilidade estudantil, agregando mais agilidade, rastreabilidade e segurança para os responsáveis e para as instituições envolvidas.

Entre as oportunidades de melhoria estão a redução do tempo de resposta às solicitações, a automatização de tarefas repetitivas e a coleta de dados por meio das avaliações, permitindo o aperfeiçoamento contínuo do serviço. Como limitação, a proposta depende da adesão digital por parte dos usuários e da disponibilidade efetiva de transporte parceiro, o que pode representar um desafio em regiões mais remotas ou com baixa cobertura.

Os diagramas BPMN abaixo ilustram os principais fluxos atuais:

![image](https://github.com/user-attachments/assets/d07b06e4-849b-402e-9a53-13ca3e7dc4b3)<br>
Figura 3: Solicitação de Transporte Escolar com uso do Strada

![image](https://github.com/user-attachments/assets/16a6979a-b3e8-4a96-bc4a-730775e53f98)<br>
Figura 4: Embarque Diário do Aluno com uso do Strada

## Modelagem dos processos

[Processo 1 – Solicitação de Transporte Escolar](./processes/processo-1-solicitacao-de-transporte-escolar.md "Detalhamento do processo 1.")

[Processo 2 - Embarque Diário do Aluno](./processes/processo-2-embarque-diario-do-aluno.md "Detalhamento do processo 2.")


## Indicadores de desempenho


| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| ---           | ---           | ---           | ---             | ---             |
| Taxa de solicitações de caronas atendidas | Medir a eficiência do sistema em atender às demandas de caronas. | Percentual de caronas atendidas em relação ao total feitas pelos pais/responsáveis. | Tabela Solicitação de Carona | (número total de solicitação de caronas atendidas / número total de solicitações) * 100 |
| Índice de Satisfação | Avaliar a qualidade do serviço a partir das avaliações dos usuários. | Média das notas (0-5) dadas pelos pais/responsáveis após o uso do serviço. | Tabela Avaliação | Média aritmética das notas recebidas |
| Tempo Médio de Resposta | Reduzir o tempo entre a solicitação e a confirmação da carona. | Tempo médio (em horas/minutos) desde a solicitação até a atribuição de um motorista. | Tabela Solicitação de Carona | Soma(tempo de resposta por solicitação) / Nº total de solicitações
| Taxa de Cancelamentos | Identificar problemas no processo (ex: motoristas desistentes, rotas inviáveis). | Percentual de caronas canceladas em relação ao total agendadas. | Tabela Caronas | (número de caronas canceladas / número total de caronas agendadas) * 100 |
| Disponibilidade de Motoristas | Garantir que há motoristas suficientes para atender a demanda. | Número médio de motoristas ativos por dia em relação à demanda estimada. | Tabela Motorista + Tabela Solicitação de Carona | (número de motoristas disponíveis por dia / número de solicitações por dia) * 100


Obs.: todas as informações necessárias para gerar os indicadores devem estar no diagrama de classe a ser apresentado posteriormente.
