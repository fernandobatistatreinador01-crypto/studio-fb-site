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

### V37.2 — correção de estabilidade
A Tesouraria possui proteção de renderização: se uma leitura remota ou um bloco de cálculo falhar, o Caixa mostra o diagnóstico dentro da interface e mantém o restante do sistema utilizável. As leituras das coleções `tesouraria_*` são independentes para impedir que uma falha isolada produza página em branco.


## V37.3 — correção do Caixa em branco

Corrigido um conflito com a função legada `loading(false)`: após a Tesouraria montar o conteúdo, essa função limpava `#content`, deixando a página visualmente em branco apesar de não haver erro JavaScript.

A correção foi aplicada à visão geral do Caixa e aos perfis de conta/caixinha.


## V37.4 — navegação da Tesouraria

Corrigida a navegação do novo Caixa:

- mês anterior / próximo;
- retorno de perfil de conta para a visão geral;
- retorno de perfil de caixinha para a visão geral;
- preservação do mês selecionado ao voltar;
- mudança de mês retorna de forma segura à visão geral.

A causa era o uso de variáveis internas de um módulo ES diretamente em `onclick` inline.


## V37.5 — status de contratos no cartão

Corrigida a distinção entre quitação contratual e recebimento líquido.

Em pagamentos por cartão:

- o valor bruto cobrado do aluno é usado para verificar quitação e saldo do contrato;
- o valor líquido recebido pelo Studio continua sendo usado em caixa, DRE e cancelamento.

Exemplo:
- contrato bruto: R$ 5.800,00;
- cartão bruto: R$ 5.800,00;
- líquido recebido: R$ 5.019,63.

O contrato passa a ser exibido como **Vigente e quitado**, com saldo contratual R$ 0,00.
