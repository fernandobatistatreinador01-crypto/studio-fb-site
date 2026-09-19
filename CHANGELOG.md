# Changelog

## V37.9 — sincronização da escrituração com as baixas
- Despesas pontuais passam a receber **ID permanente**, evitando que edição, inclusão ou exclusão mude a identidade da despesa.
- Uma mesma despesa pode ter **múltiplos pagamentos parciais** (ex.: R$ 180 + R$ 200 = R$ 380).
- O sistema bloqueia a soma das baixas quando ela ultrapassa o valor escriturado da despesa.
- Editar o valor da despesa preserva as baixas existentes e recalcula o saldo pendente; não cria uma nova baixa integral.
- Excluir uma despesa com baixas exige confirmação e arquiva as baixas vinculadas, evitando movimentos órfãos.
- Referências antigas baseadas em índice são migradas com segurança por descrição, categoria e competência para o novo ID estável.
- A tela de Despesas ganhou auditoria por item: **pago, parcial, excesso e sem baixa**, além de listar baixas órfãs.
- Baixas órfãs podem ser canceladas diretamente no painel de conciliação.
- Adicionado diagnóstico `auditarSincroniaDespesasV379(mes, ano)`.
- PDF/Financeiro permanece com a trava matemática da V37.8 e passa a identificar a versão V37.9.

## V37.8 — integridade matemática do Financeiro
- Corrigido o PDF **Resumo de Caixa Realizado**: as linhas de despesas agora usam a mesma fonte do total (baixas efetivamente confirmadas).
- A DRE permanece por competência e continua listando as despesas cadastradas do mês.
- O sistema bloqueia a impressão se a soma das linhas divergir do total calculado em mais de R$ 0,01.
- Adicionado diagnóstico `auditarRelatorioFinanceiroV378()` para conferir soma das linhas, total e diferença.
- Identificação visual do Financeiro/Tesouraria/Despesas atualizada para V37.8.

## V37

- Nova Tesouraria escritural / Caixa 2.0.
- Abertura física em 31/08/2026 e escrituração a partir de setembro.
- Contas: InfinitePay, Banco de Tesouraria e Espécie.
- Posições Corrente/Investimento por instituição bancária.
- Perfil individual de contas e caixinhas.
- Conciliação bancária por posição.
- Motor de equalização líquida das destinações.
- Sugestões separadas de transações executadas.
- Provisão de antecipados calculada por serviço futuro já recebido.
- Provisão trabalhista conectada ao módulo Colaboradores.
- Manutenção por orçamento mensal acumulativo.
- Distribuição mensal configurável/editável.
- Fechamento versionado e reabertura com motivo.
- Conta física e origem gerencial nos lançamentos de caixa.
- PDFs institucionais para DRE e simulação de cancelamento.
- Limpeza de arquivos de testes antigos do pacote de produção.

## V37.2 — estabilidade do Caixa
- Corrigido o comportamento em que a rota Caixa podia ficar em branco quando uma etapa da nova Tesouraria falhava durante o carregamento.
- As coleções da Tesouraria agora são carregadas de forma independente; falha em uma coleção não derruba a tela inteira.
- Adicionada tela de erro/diagnóstico dentro do próprio Studio FB em vez de página branca.
- Removidos do topbar do Caixa os botões antigos do Caixa 1.0; as ações ficam dentro da página mensal da Tesouraria.
- Adicionado favicon embutido para eliminar o 404 de `/favicon.ico` no console.


## V37.3
- Corrigida tela branca do Caixa/Tesouraria.
- Removida a limpeza indevida de `#content` após o render.
- Corrigidos também os perfis de contas e caixinhas.


## V37.4
- Corrigidos botões mês anterior/próximo do Caixa.
- Corrigido botão Voltar ao Caixa nos perfis.
- Navegação da Tesouraria passa por funções públicas, compatíveis com módulo ES.


## V37.5
- Corrigido falso status "Vigente — parcial" em contratos pagos integralmente no cartão.
- Status e saldo contratual passam a usar valores brutos.
- Recebimento líquido continua separado para DRE/caixa.
- Perfil diferencia "Recebido líquido" de "Saldo contratual".
- Progresso deixa de mostrar falso saldo correspondente à taxa do cartão.


## V37.6
- Nota Fiscal integrada definitivamente ao Financeiro atual.
- Filtros de NF permanecem visíveis ao trocar mês e reabrir o Financeiro.
- Estados fiscais separados: A emitir, Emitida, NF integral e Não se aplica.
- Política de NF configurável por contrato.
- Receita avulsa recebe configuração de NF.
- Falha de leitura de `notas_fiscais` volta a tentar em vez de congelar o cache.
- Confirmações de despesas anteriores a setembro migradas como histórico.
- Agosto recebe conciliação histórica baseada no consolidado validado.
- Confirmações históricas não movimentam o Caixa nem alteram os saldos de abertura.
- Setembro em diante mantém confirmação operacional real.


## V37.7
- Corrigida a premissa histórica da confirmação de despesas.
- Setembro/2026+ continua por confirmação manual.
- Agosto/2026 é considerado realizado pela DRE confiável.
- Julho/2026 e meses anteriores são considerados realizados pelas despesas cadastradas.
- Relatório Caixa Realizado anual passa a exibir os valores históricos corretos.
- Histórico continua sem alterar os saldos físicos de abertura da Tesouraria.
- Tela Despesas mostra claramente a fonte da confirmação de cada período.
- Auditoria automática de agosto contra R$ 6.859,20.

## V37.10 — 19/09/2026
- Saneamento automático de baixas órfãs após correção/exclusão da escrituração.
- Normalização de legado parcial + baixa integral duplicada.
- Reparo auditável da baixa de Campainha + barrinhas de setembro/2026 com base no extrato conciliado.
- Financeiro, Despesas, Tesouraria e impressão executam saneamento antes de renderizar.
- Nenhum histórico é apagado: correções preservam trilha de auditoria.
