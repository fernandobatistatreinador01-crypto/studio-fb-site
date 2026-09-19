# Testes V37.10 — saneamento de baixas legadas

## Objetivo
Fazer a tela de Caixa realizado refletir a escrituração atual depois das correções feitas pelo Fernando, preservando trilha de auditoria.

## Setembro/2026 — resultado esperado
Ao abrir **Despesas**, **Financeiro > Caixa** ou **Tesouraria** em setembro/2026, o saneamento roda antes da renderização.

1. **Apple Bill R$ 130,79**
   - Se não existe mais na escrituração, sua baixa antiga deve ser arquivada e deixar de aparecer no Caixa realizado.

2. **Consulta com nutri R$ 380,00**
   - O legado `R$ 180 + R$ 380` deve ser normalizado para `R$ 180 + R$ 200`.
   - Total pago da despesa: R$ 380,00.

3. **Campainha + barrinhas R$ 233,99**
   - Se estiver na escrituração e sem baixa, a V37.10 recompõe a baixa auditada de 13/09/2026 na InfinitePay.

4. **Total esperado de despesas pagas — setembro/2026**
   - R$ 6.800,49.

## Trilha de auditoria
Nenhum registro é apagado fisicamente. Registros inválidos ficam com `status: excluido`, `motivoExclusao` e `saneadoV3710: true`. Ajustes de valor guardam `valorAntesSaneamentoV3710`.

## Auditoria no console
```js
await auditarSaneamentoV3710(8, 2026)
```
O retorno deve mostrar `totalBaixado: 6800.49` se os demais registros permanecerem conforme a auditoria.
