// Define uma nova interface para a estrutura do endereço.
// É uma boa prática exportá-la caso precise ser usada em outro lugar.
export interface IAddress {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Modifica a interface principal de credenciais.
export interface ICreadentials {
  username: string; // Usado para o email
  password?: string; // Senha pode ser opcional durante as etapas iniciais

  // Adiciona o objeto de endereço.
  // É opcional (?) porque não existe nas primeiras etapas do cadastro.
  address?: IAddress;

  // Você também pode adicionar outros campos do passo 1 aqui, se necessário:
  // name?: string;
  // loginUsername?: string;
}
