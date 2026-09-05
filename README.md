# Studio FB — Gestão

Aplicação web do Studio FB.

## Versão de produção: V37

A V37 consolida o Financeiro/DRE auditável e inaugura a Tesouraria escritural.

### Marco financeiro

- Agosto/2026 é o primeiro mês confiável da DRE.
- Posição física de abertura em 31/08/2026:
  - InfinitePay — corrente: R$ 7.106,95
  - InfinitePay — investimento: R$ 0,00
  - Banco de Tesouraria — corrente: R$ 0,00
  - Banco de Tesouraria — investimento: R$ 0,00
  - Espécie: R$ 912,00
- A escrituração de entradas, saídas e transferências começa em 01/09/2026.

### Tesouraria

O módulo Caixa separa:

1. **Conta física**: InfinitePay, Banco de Tesouraria e Espécie. InfinitePay e Banco de Tesouraria possuem posição Corrente e Investimento.
2. **Destinação gerencial**: antecipados, trabalhista, capital de giro, reserva, manutenção, investimentos futuros e lucro.
3. **Sugestão x execução**: uma recomendação nunca altera o saldo; somente a transferência marcada como executada altera a posição física.

A conciliação bancária compara saldo calculado pelo sistema com saldo real informado. A equalização gerencial compensa todas as decisões do período e sugere somente a transferência física líquida necessária.

### Manutenção

Manutenção é uma caixinha especial: `orçamento mensal - gasto real = movimento da provisão`. A sobra acumula; gasto acima do orçamento consome o acumulado. O orçamento começa em R$ 0,00 e deve ser configurado pelo Fernando quando o valor mensal for definido.

### Fechamento

O mês pode ser fechado quando a conciliação estiver zerada e não houver equalizações físicas pendentes. O fechamento é versionado. Reabrir exige motivo e obriga nova revisão de DRE, conciliação, proteções, distribuição e equalização.

### PDFs

A DRE e a simulação de cancelamento passam a usar um layout institucional próprio do Studio FB, com cabeçalho, indicadores, tabelas e rodapé de auditoria.

### Arquivos do repositório

Arquivos intermediários de teste e auditorias antigas não fazem mais parte do pacote de produção. O projeto mantém somente o código e documentação consolidada.
