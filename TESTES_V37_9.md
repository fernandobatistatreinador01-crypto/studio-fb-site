# Testes V37.9 — Escrituração x Baixas

## Objetivo
Validar a sincronização entre a lista de despesas e os pagamentos efetivamente confirmados no Caixa.

## 1. Migração dos registros atuais de setembro
1. Abra **Despesas > Setembro/2026**.
2. O painel **Conciliação Manual das Despesas · V37.9** deve aparecer.
3. A despesa **Consulta com nutri — R$ 380,00** deve agrupar todas as baixas antigas encontradas pelo nome/categoria/competência.
4. Se aparecer excesso, use **Gerenciar baixas** e corrija as baixas para refletir o banco (no caso auditado: R$ 180,00 + R$ 200,00).
5. **Campainha + barrinhas — R$ 233,99** deve ficar “Sem baixa” até o pagamento ser confirmado. Registre a baixa real de R$ 233,99.
6. Se **Apple Bill — R$ 130,79** aparecer em “baixas órfãs”, cancele a baixa órfã caso ela realmente não tenha sido paga pela conta auditada.

## 2. Pagamento parcial
1. Crie uma despesa teste de R$ 380,00.
2. Registre uma baixa de R$ 180,00.
3. O status deve ficar **Parcial · falta R$ 200,00**.
4. Registre uma segunda baixa de R$ 200,00.
5. O status deve ficar **Pago** e o Caixa deve somar R$ 380,00.

## 3. Bloqueio de excesso
1. Em uma despesa de R$ 380,00 com R$ 180,00 já pago, tente adicionar R$ 380,00.
2. O sistema deve bloquear e informar que o máximo disponível é R$ 200,00.

## 4. Edição da escrituração
1. Em uma despesa de R$ 380,00 com R$ 180,00 pago, edite o valor para R$ 420,00.
2. A baixa de R$ 180,00 deve permanecer e o saldo deve passar para R$ 240,00.
3. Tente reduzir a despesa para R$ 100,00. O sistema deve bloquear enquanto existirem R$ 180,00 em baixas.

## 5. Exclusão
1. Exclua uma despesa que possua baixa.
2. O sistema deve avisar que as baixas vinculadas também serão arquivadas.
3. Confirmando, despesa e baixas não devem mais compor o Caixa realizado.

## 6. PDF
1. Abra **Financeiro > Caixa Realizado > Setembro/2026**.
2. Gere o PDF.
3. A soma das linhas deve ser idêntica ao total de despesas.
4. Depois de corrigir as baixas de setembro conforme o extrato, o total esperado da InfinitePay auditada é **R$ 6.800,49** (desde que não existam saídas reais por outra conta incluídas nesse relatório).

## Diagnóstico no console
```js
await auditarSincroniaDespesasV379(8, 2026)
```
O mês é zero-based: `8` = setembro.
