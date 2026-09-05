# Testes V35 — Financeiro / DRE auditável

## 1. John — teste de integridade

1. Abrir Financeiro → Competência em um mês onde John aparecia.
2. Se John estiver sem contratos válidos, ele deve desaparecer da receita.
3. Se ainda aparecer, a linha deve mostrar:
   - tipo da origem;
   - ID da origem;
   - botão "Rastrear".
4. Conferir a seção Auditoria Financeira.
5. Se houver contrato residual/duplicado, a auditoria deve indicar o ID.

A V35 não cria mais "Contrato inicial" automaticamente.

## 2. Excluir contrato

1. Criar contrato com competência no mês.
2. Confirmar que aparece na DRE.
3. Arquivar/excluir o contrato.
4. Reabrir Financeiro.

Esperado:
- competência do contrato desaparece imediatamente;
- pagamentos históricos podem continuar no histórico/caixa;
- pagamento normal não mantém receita na DRE.

## 3. Pagamento retroativo

Aluno com:
- contrato A: 01/01/2025 a 31/12/2025
- contrato B: 01/01/2026 a 31/12/2026

Abrir Registrar pagamento e informar 15/12/2025.

Esperado:
- modal mostra o contrato de referência atual;
- sistema sugere contrato A;
- não troca automaticamente;
- botão "Usar sugerido" troca;
- se Fernando mantiver contrato B, salvar pede confirmação.

## 4. Receita avulsa — competência diferente do caixa

Cadastrar:
- descrição: Avaliação externa
- valor: R$ 300,00
- competência: julho/2026
- recebido: sim
- data: 05/08/2026

Esperado:
- DRE julho: + R$ 300,00
- DRE agosto: R$ 0,00 dessa receita
- Caixa julho: R$ 0,00 dessa receita
- Caixa agosto: + R$ 300,00
- linha tem ID e botão Rastrear.

## 5. Receita avulsa ainda não recebida

Cadastrar valor R$ 500 em setembro, "Recebido" desmarcado.

Esperado:
- DRE setembro + R$ 500
- caixa sem entrada
- ao editar e marcar recebido com data em outubro, caixa outubro + R$ 500.

## 6. Pagamento normal não duplica DRE

Contrato anual com líquido R$ 5.087,00.

Esperado:
- competência do contrato vem do valor líquido distribuído pelos ciclos;
- registrar pagamento normal não acrescenta outra linha de receita na DRE;
- o pagamento aparece no caixa pela data real.

## 7. Auditoria

Criar ou identificar dois contratos sobrepostos do mesmo aluno.

Esperado:
- Auditoria Financeira mostra alerta/erro;
- os IDs aparecem para localização.

Criar duas movimentações idênticas do mesmo contrato/data/valor/natureza.

Esperado:
- auditoria mostra "Possível movimentação duplicada".
