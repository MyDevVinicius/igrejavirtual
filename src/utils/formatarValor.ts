const formatarValor = (valor: any) => {
  console.log("Valor recebido:", valor); // Adicionando log para depuração

  // Garantir que o valor seja um número
  const numero = Number(valor);

  // Verificar se o valor é um número válido
  if (isNaN(numero)) {
    return "R$ 0,00"; // Retornar valor padrão em caso de erro
  }

  return `R$ ${numero.toFixed(2).replace(".", ",")}`;
};
