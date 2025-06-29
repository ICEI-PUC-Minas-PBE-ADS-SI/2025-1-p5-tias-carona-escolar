export interface ICreadentials {
  name?: string; // Campo do Passo 1
  username?: string; // Campo do Passo 1 (nome de usuário)
  email?: string; // Campo do Passo 2
  password?: string; // Campo do Passo 2
  cep?: string;
  street?: string; // Corresponderá à rua
  number?: string; // O número da residência
  neighborhood?: string; // O bairro
  city?: string;
  state?: string;
}
