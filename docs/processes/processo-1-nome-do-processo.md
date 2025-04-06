### 3.3.1 Processo 1 – Solicitação de Transporte Escolar

O processo descreve o fluxo completo de solicitação de transporte escolar por parte de um aluno/responsável, passando pelas etapas de cadastro, validação, envio e aprovação da solicitação, até a assinatura do contrato. Oportunidades de melhoria incluem a automação de validações, integração com parceiros de transporte em tempo real e digitalização completa da assinatura de documentos.

![430674796-d07b06e4-849b-402e-9a53-13ca3e7dc4b3](https://github.com/user-attachments/assets/cffec543-4321-4052-bf73-3113a048a6dd)

**Cadastro do aluno na plataforma**

| **Campo**       | **Tipo**         | **Restrições**        | **Valor default** |
|-----------------|------------------|------------------------|-------------------|
| nome_completo   | Caixa de texto   | obrigatório            |                   |
| data_nascimento | Data             | obrigatório            |                   |
| nome_responsável | Caixa de texto  | obrigatório            |                   |
| e-mail          | Caixa de texto   | formato de e-mail      |                   |
| telefone        | Número           | somente números        |                   |

| **Comandos**         | **Destino**                               | **Tipo**   |
|----------------------|--------------------------------------------|------------|
| avançar              | Assinatura dos Termos de Responsabilidade | default    |

---

**Assinatura dos Termos de Responsabilidade**

| **Campo**                 | **Tipo**  | **Restrições**                             | **Valor default** |
|--------------------------|-----------|--------------------------------------------|-------------------|
| termo_responsabilidade   | Arquivo   | leitura obrigatória antes da assinatura    |                   |

| **Comandos**         | **Destino**               | **Tipo**   |
|----------------------|----------------------------|------------|
| assinar              | Validação de Identidade    | default    |

---

**Validação de Identidade**

| **Campo**          | **Tipo** | **Restrições**                       | **Valor default** |
|--------------------|----------|--------------------------------------|-------------------|
| documento_foto     | Imagem   | obrigatório, formato jpg/png         |                   |
| selfie_documento   | Imagem   | obrigatório                          |                   |

| **Comandos**         | **Destino**                                | **Tipo**   |
|----------------------|---------------------------------------------|------------|
| validar              | Verificação de Transporte Parceiro Disponível | default |

---

**Verificação de Transporte Parceiro Disponível**

| **Campo**         | **Tipo**       | **Restrições** | **Valor default** |
|-------------------|----------------|----------------|-------------------|
| endereço_origem   | Caixa de texto | obrigatório    |                   |
| endereço_destino  | Caixa de texto | obrigatório    |                   |
| turno             | Seleção única  | obrigatório    |                   |

| **Comandos**               | **Destino**                            | **Tipo**   |
|----------------------------|-----------------------------------------|------------|
| consultar_disponibilidade | Envio da Solicitação de Carona         | default    |
| encerrar                   | Fim do processo (caso indisponível)    | cancel     |

---

**Envio da Solicitação de Carona**

| **Campo**     | **Tipo**      | **Restrições** | **Valor default** |
|---------------|---------------|----------------|-------------------|
| observações   | Área de texto | opcional       |                   |

| **Comandos**         | **Destino**                 | **Tipo**   |
|----------------------|-----------------------------|------------|
| enviar_solicitacao   | Recebimento da Solicitação  | default    |

---

**Recebimento da Solicitação**

| **Campo** | **Tipo**       | **Restrições**              | **Valor default** |
|-----------|----------------|-----------------------------|-------------------|
| status    | Seleção única  | pendente/aprovado/recusado  | pendente          |

| **Comandos**         | **Destino**                    | **Tipo**   |
|----------------------|---------------------------------|------------|
| aprovar              | Criação Automática do Contrato | default    |
| recusar              | Fim do processo                 | cancel     |

---

**Criação Automática do Contrato**

| **Campo**      | **Tipo** | **Restrições**            | **Valor default** |
|----------------|----------|----------------------------|-------------------|
| contrato_pdf   | Arquivo  | gerado automaticamente     |                   |

| **Comandos**         | **Destino**            | **Tipo**   |
|----------------------|-------------------------|------------|
| gerar_contrato       | Avaliação do Serviço    | default    |

---

**Avaliação do Serviço**

| **Campo**      | **Tipo**      | **Restrições** | **Valor default** |
|----------------|---------------|----------------|-------------------|
| nota_serviço   | Número         | de 1 a 5       |                   |
| comentários    | Área de texto | opcional       |                   |

| **Comandos**         | **Destino**             | **Tipo**   |
|----------------------|--------------------------|------------|
| aceitar              | Assinatura do Contrato   | default    |
| recusar              | Fim do processo          | cancel     |

---

**Assinatura do Contrato**

| **Campo**               | **Tipo** | **Restrições** | **Valor default** |
|--------------------------|----------|----------------|-------------------|
| assinatura_eletrônica    | Imagem   | obrigatório    |                   |

| **Comandos**         | **Destino**       | **Tipo**   |
|----------------------|--------------------|------------|
| concluir             | Fim do processo    | default    |
