# Auditoria Financeira — Studio FB V32

## Escopo

Auditoria da separação entre competência e caixa, pagamentos de alunos, cartão, cancelamentos e despesas.

## Problemas encontrados

1. Havia filtros financeiros usando `new Date("YYYY-MM-DD")`. Em navegadores no fuso UTC-3, uma data como `2026-08-01` pode ser interpretada como a noite de `31/07`, deslocando o registro para o mês anterior.
2. O cancelamento antigo lançava automaticamente multa/benefícios como receita, embora a regra operacional atual determine que o cancelamento seja apenas documental.
3. O cadastro de aluno podia criar um pagamento integral automaticamente quando o status inicial era “pago”, produzindo caixa sem um recebimento explicitamente registrado.
4. A visão de caixa das despesas usava despesas do mês de competência, mesmo sem data real de pagamento.
5. Pagamentos pós-cancelamento não tinham natureza suficiente para separar multa, acordo e reembolso.

## Correções aplicadas

- Competência de contrato continua exclusivamente pelos ciclos mensais do contrato.
- Pagamentos atrasados/antecipados afetam somente o caixa na data real.
- Filtros financeiros críticos passaram a usar interpretação local de datas.
- Cartão entra integralmente no caixa pelo líquido recebido na data registrada.
- Multa só entra na DRE quando Fernando registra uma movimentação de natureza “Multa rescisória”.
- Pagamento de acordo entra apenas no caixa.
- Reembolso entra como saída de caixa e não como despesa operacional.
- Multa, acordo, reembolso e aula extra não quitam o preço original do contrato.
- Cadastro de aluno não cria pagamento fictício.
- Despesas só afetam o caixa após baixa explícita.
- Cancelamento confirmado não cria DRE/caixa automaticamente.

## Regra de cancelamento implementada

- Mensal: sem multa e sem reembolso.
- Trimestral: 25% no 1º mês, 15% no 2º, 5% depois.
- Semestral: 25% até o 2º mês, 15% até o 4º, 5% depois.
- Anual: 25% até o 3º mês, 15% até o 6º, 5% depois.
- O mês muda no aniversário mensal da data de início.

Fórmulas:

- Valor mensal contratual = valor total ÷ meses do plano
- Valor utilizado = valor mensal × meses utilizados
- Multa = valor total × percentual
- Custo contratual = valor utilizado + multa + extras
- Reembolso teórico = max(0, valor à vista − custo contratual)
- Saldo financeiro real = pagamentos registrados do contrato − custo contratual
- Reembolso efetivo = min(reembolso teórico, saldo positivo), nunca menor que zero
- Se o saldo for negativo, o resultado é “valor a receber do aluno”.

## Cenários de validação

- Competência de julho paga em agosto → DRE julho; caixa agosto.
- Pagamento em 01/08 → caixa agosto, sem deslocamento UTC para julho.
- Cliente parcela no cartão → líquido integral entra na data em que o Studio recebe.
- Despesa de agosto paga em setembro → DRE agosto; caixa setembro.
- Multa registrada em setembro → DRE setembro + caixa setembro.
- Acordo registrado em setembro → somente caixa setembro.
- Reembolso registrado em setembro → saída de caixa em setembro; sem despesa DRE.
- Simulação de cancelamento → nenhum dado persistido.
- Confirmação do cancelamento → contrato cancelado + snapshot; nenhum lançamento financeiro automático.

## Limitação histórica intencional

O sistema não tenta inferir datas de pagamentos de despesas antigas. Onde não houver baixa real registrada, o caixa histórico deverá ser conciliado manualmente para não inventar movimentações.
