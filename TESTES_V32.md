# Testes de validação — V32

Executados antes do empacotamento:

- Sintaxe JavaScript (`node --check`): **OK**
- Data local `2026-08-01`: **agosto**, sem deslocamento para julho
- Ciclo 10/02 → 09/03: **1º mês**
- Ciclo 10/02 → 10/03: **2º mês**
- Ciclo 10/02 → 11/03: **2º mês**
- Caso Marcos:
  - mês utilizado: **4º**
  - mensal contratual: **R$ 450,00**
  - multa: **R$ 810,00**
  - extras: **R$ 517,89**
  - custo contratual: **R$ 3.127,89**
  - reembolso teórico: **R$ 1.602,51**
  - pagamentos: **R$ 1.350,00**
  - reembolso real: **R$ 0,00**
  - valor a receber: **R$ 1.777,89**
- Exemplo anual do contrato (R$ 5.796 total / R$ 5.087 à vista / 5º mês): reembolso **R$ 1.802,60**
- Teto de reembolso: pagamento acima do valor-base não permite ultrapassar o reembolso teórico

## Teste recomendado após o deploy

Como o banco e a autenticação são remotos, faça um teste curto no ambiente real antes de usar a nova rotina em produção:

1. Abrir um aluno de teste.
2. Registrar um pagamento com data de competência antiga e recebimento no mês atual.
3. Conferir DRE e Caixa separadamente.
4. Simular um cancelamento e fechar sem confirmar — contrato deve continuar ativo.
5. Confirmar um cancelamento de teste — contrato deve ficar cancelado, sem lançamento financeiro automático.
6. Registrar multa/acordo/reembolso e conferir os destinos.
7. Registrar uma despesa de competência e dar baixa em outro mês; conferir DRE x Caixa.
