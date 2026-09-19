# Testes V37.8 — Integridade matemática

## 1. Caixa realizado — setembro/2026
1. Abrir Financeiro.
2. Selecionar setembro/2026.
3. Selecionar **Caixa Realizado**.
4. Imprimir/Salvar PDF.
5. Somar as linhas de despesas.
6. Confirmar que a soma é exatamente igual ao **Total de despesas** e ao KPI de despesas.

**Esperado:** o PDF lista somente pagamentos/baixas efetivamente confirmados no caixa.

## 2. DRE — setembro/2026
1. Selecionar **Regime de Competência**.
2. Imprimir o relatório.
3. Somar as despesas cadastradas exibidas.

**Esperado:** a soma das linhas é exatamente igual ao total da DRE.

## 3. Divergência entre cadastro e baixa
1. Tenha uma despesa cadastrada por R$ 233,99 e uma baixa confirmada por R$ 180,00.
2. No **Caixa Realizado**, imprimir o relatório.

**Esperado:** o relatório mostra R$ 180,00, pois essa é a saída efetivamente confirmada.
Na DRE, a despesa continua sendo R$ 233,99. Os dois regimes não são misturados.

## 4. Diagnóstico
No console, execute:

```js
await auditarRelatorioFinanceiroV378(8, 2026, 'caixa')
```

**Esperado:** `integridade: true` e `diferenca: 0`.

## 5. Trava de segurança
Se por qualquer regressão a soma das linhas diferir do total calculado em mais de R$ 0,01, a impressão deve ser bloqueada e exibir **Falha de integridade financeira**.
