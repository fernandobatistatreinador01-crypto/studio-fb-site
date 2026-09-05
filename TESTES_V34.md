# Testes V34

## 1. Contrato anual — bruto x líquido

Cadastrar:
- Valor total/bruto: R$ 5.796,00
- Valor líquido/à vista: R$ 5.087,00
- Cartão bruto: R$ 5.796,00
- Plano: anual

Esperado:
- Mensal contratual bruto: R$ 483,00
- Competência total reconhecida em 12 ciclos: R$ 5.087,00
- Competência mensal base: aproximadamente R$ 423,91/423,92, com ajuste de centavos na última competência
- Taxa/diferença informativa do cartão: R$ 709,00

## 2. Cancelamento no 5º mês

Com os valores acima, sem extras:
- Valor utilizado: R$ 2.415,00
- Multa 15%: R$ 869,40
- Custo contratual: R$ 3.284,40
- Reembolso teórico: R$ 1.802,60

A competência líquida mensal mostrada na simulação é apenas informativa e NÃO altera a fórmula contratual de cancelamento.

## 3. Equivalência cartão

Ao alterar o valor total do contrato, o bruto do cartão acompanha automaticamente enquanto estiver em modo automático.

Ao editar manualmente o bruto do cartão, a equivalência deixa de ser automática.

O botão "Usar valor do contrato" restaura a equivalência.

## 4. Impressão da simulação

Abrir cancelamento sem confirmar e clicar "Imprimir simulação".

Esperado:
- documento marcado como "SIMULAÇÃO — NÃO CONFIRMADA";
- contrato permanece ativo;
- nenhum lançamento na DRE;
- nenhum lançamento no caixa.

## 5. Mensagens

Alertas do sistema devem aparecer em modal visual do Studio FB.

A confirmação de cancelamento e as validações do novo contrato não devem usar caixas nativas do navegador.
