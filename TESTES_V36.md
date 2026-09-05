# Testes V36 — Excluído ≠ Cancelado

## 1. John — contrato antigo de teste

No Financeiro, localizar a linha do John referente ao contrato antigo e clicar em Rastrear.

Esperado:
- modal mostra Aluno ID e Contrato ID;
- botão "Excluir este contrato";
- confirmação explica que exclusão zera DRE/caixa/saldo e preserva auditoria.

Após confirmar:
- a linha some imediatamente da DRE;
- o contrato fica `status: excluido`;
- movimentos vinculados ficam `status: excluido`;
- contrato não volta após atualizar a página.

## 2. Contrato excluído

Criar contrato de teste, registrar pagamento e confirmar:
- DRE tem competência;
- Caixa tem recebimento.

Excluir o contrato.

Esperado:
- DRE = zero impacto desse contrato;
- Caixa = zero impacto dos pagamentos desse contrato;
- saldo = zero;
- contrato não aparece como vigente;
- pagamentos vinculados não aparecem como movimentos financeiros ativos;
- auditoria histórica continua preservada.

## 3. Contrato cancelado

Criar contrato real e cancelar no meio da vigência.

Esperado:
- NÃO virar `excluido`;
- competências anteriores/até o corte válido permanecem;
- competências futuras param;
- reembolso/multa/acordo só entram quando movimentados manualmente.

## 4. Auditoria de contrato órfão

Contrato ativo com `alunoId` que não existe na coleção atual de alunos.

Esperado:
- Auditoria Financeira mostra "Contrato ativo sem aluno correspondente";
- informa contratoId e alunoId;
- oferece "Excluir contrato".

## 5. Contrato antes da entrada do aluno

Aluno com entrada em 11/08/2026 e contrato ativo iniciando em 19/02/2026.

Esperado:
- Auditoria mostra alerta "Contrato começa antes da entrada cadastrada do aluno".

## 6. Atomicidade

Ao excluir contrato com pagamentos, o contrato e os pagamentos são atualizados no mesmo `writeBatch`.

Se o batch falhar:
- sistema mostra erro;
- não deve tratar exclusão parcial como válida.
