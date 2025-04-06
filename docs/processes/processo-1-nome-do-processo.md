# Processo 1 – Solicitação de Transporte Escolar

Este processo descreve o fluxo de solicitação, análise e contratação do serviço de transporte escolar entre o tutor do aluno e o prestador do serviço.

## Oportunidades de melhoria

- Automatizar o envio de notificações para maior agilidade;
- Incluir um sistema de geolocalização para verificação de rotas disponíveis;
- Possibilitar acompanhamento em tempo real da análise e confirmação da solicitação pelo tutor;
- Reduzir retrabalho automatizando a verificação de vagas e rotas.

![Modelo BPMN do Processo 1](https://github.com/user-attachments/assets/d95d5d65-47b9-40a5-a47f-ba72ccb2a5f8)

---

## Detalhamento das Atividades

### Solicitação de Transporte Escolar

| Campo          | Tipo           | Restrições        | Valor default |
|----------------|----------------|-------------------|----------------|
| Nome do aluno  | Caixa de Texto | Obrigatório       |                |
| Endereço       | Área de Texto  | Obrigatório       |                |
| Escola         | Caixa de Texto | Obrigatório       |                |
| Turno          | Seleção única  | Manhã, Tarde, Integral |          |

**Comandos**

| Comando   | Destino                    | Tipo     |
|-----------|----------------------------|----------|
| Enviar    | Recebimento da Solicitação | default  |
| Cancelar  | Fim do Processo            | cancel   |

---

### Recebimento da Solicitação

| Campo              | Tipo         | Restrições           | Valor default         |
|--------------------|--------------|-----------------------|------------------------|
| Solicitação ID     | Número       | Gerado automaticamente |                      |
| Data de recebimento| Data e Hora  | Automático            |                      |

**Comandos**

| Comando           | Destino                | Tipo     |
|-------------------|------------------------|----------|
| Verificar Vagas   | Verificação de Vagas   | default  |

---

### Verificação de Vagas

| Campo                     | Tipo   | Restrições   | Valor default |
|---------------------------|--------|--------------|----------------|
| Número de vagas disponíveis | Número | Obrigatório |                |

**Comandos**

| Comando                     | Destino                                  | Tipo     |
|-----------------------------|------------------------------------------|----------|
| Continuar                   | Verificação de Rotas                     | default  |
| Notificar Indisponibilidade| Notificação de Indisponibilidade (Sem vagas) | cancel |

---

### Verificação de Rotas

| Campo              | Tipo         | Restrições   | Valor default |
|--------------------|--------------|--------------|----------------|
| Endereço na rota   | Seleção única| Obrigatório  |                |

**Comandos**

| Comando                     | Destino                                  | Tipo     |
|-----------------------------|------------------------------------------|----------|
| Continuar                   | Elaboração do Contrato                   | default  |
| Notificar Indisponibilidade| Notificação de Indisponibilidade (Sem rotas) | cancel |

---

### Elaboração do Contrato

| Campo            | Tipo     | Restrições | Valor default |
|------------------|----------|------------|----------------|
| Dados do contrato| Arquivo  | PDF        |                |

**Comandos**

| Comando          | Destino                    | Tipo     |
|------------------|----------------------------|----------|
| Enviar Proposta  | Avaliação da Proposta      | default  |

---

### Avaliação da Proposta

| Campo     | Tipo          | Restrições         | Valor default |
|-----------|---------------|--------------------|----------------|
| Proposta  | Área de Texto | Leitura obrigatória|                |
| Aceite    | Seleção única | Sim, Não           |                |

**Comandos**

| Comando   | Destino                 | Tipo     |
|-----------|--------------------------|----------|
| Aceitar   | Assinatura do Contrato   | default  |
| Recusar   | Fim do Processo          | cancel   |

---

### Assinatura do Contrato

| Campo              | Tipo     | Restrições     | Valor default |
|--------------------|----------|----------------|----------------|
| Assinatura digital | Imagem   | Obrigatório    |                |
| Data da assinatura | Data     | Automático     |                |

**Comandos**

| Comando             | Destino                    | Tipo     |
|---------------------|----------------------------|----------|
| Confirmar Assinatura| Confirmação do Transporte  | default  |

---

### Confirmação do Transporte

| Campo        | Tipo          | Restrições   | Valor default |
|--------------|---------------|--------------|----------------|
| Confirmação  | Seleção única | Sim, Não     |                |

**Comandos**

| Comando   | Destino                      | Tipo     |
|-----------|------------------------------|----------|
| Confirmar | Inclusão do Endereço na Rota | default  |

---

### Inclusão do Endereço na Rota

| Campo              | Tipo        | Restrições   | Valor default |
|--------------------|-------------|--------------|----------------|
| Endereço do aluno  | Área de Texto | Obrigatório |                |
| Rota atribuída     | Seleção única | Obrigatório |                |

**Comandos**

| Comando   | Destino         | Tipo     |
|-----------|------------------|----------|
| Finalizar | Fim do Processo  | default  |
