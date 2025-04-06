### 3.3.2 Processo 2 – Roteirização e Embarque dos Alunos

O processo trata da etapa operacional em que o transporte escolar realiza a rota de embarque dos alunos. Oportunidades de melhoria incluem a integração com sistemas escolares para atualização em tempo real e otimização dinâmica de rotas.

![Modelo BPMN do Processo 2](../images/process2.png "Modelo BPMN do Processo 2.")

**Seguir GPS até o endereço do aluno**

| **Campo**               | **Tipo**       | **Restrições**                  | **Valor default** |
|--------------------------|----------------|----------------------------------|-------------------|
| coordenadas_endereco     | Link           | baseado no endereço do aluno     |                   |
| status_gps               | Seleção única  | ativo/inativo                    | ativo             |

| **Comandos**         | **Destino**       | **Tipo**   |
|----------------------|--------------------|------------|
| reprocessar_rota     | Seguir GPS         | cancel     |

---

**Embarcar Aluno**

| **Campo**             | **Tipo**      | **Restrições**              | **Valor default** |
|------------------------|---------------|------------------------------|-------------------|
| nome_aluno             | Caixa de texto| obrigatório                  |                   |
| horário_embarque       | Data e Hora   | obrigatório                  | horário atual     |
| foto_aluno             | Imagem        | opcional                     |                   |
| confirmação_embarque   | Seleção única | sim/não                      |                   |

| **Comandos**         | **Destino**              | **Tipo**   |
|----------------------|---------------------------|------------|
| embarcar             | Fim do processo           | default    |
| voltar_rota          | Seguir GPS                | cancel     |
