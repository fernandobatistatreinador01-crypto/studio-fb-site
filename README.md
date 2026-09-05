# Studio FB — Gestão

Estrutura estática do sistema Studio FB.

## Arquivos

- `index.html` — estrutura da interface
- `assets/css/styles.css` — estilos visuais
- `assets/js/app.js` — lógica da aplicação, Firebase Authentication e Firestore

## Deploy no Netlify

Este projeto não precisa de build.

Configuração recomendada:

- Branch: `main`
- Base directory: vazio
- Build command: vazio
- Publish directory: `.`

O deploy é disparado automaticamente pelos pushes no GitHub.

## Segurança

O login utiliza Firebase Authentication (e-mail e senha).

A proteção dos dados do Firestore deve ser mantida nas Firestore Security Rules,
permitindo acesso apenas aos UIDs autorizados.

## Atualização V32 — Cancelamento e auditoria financeira

### Cancelamento

- O botão principal passa a ser **Cancelar contrato**.
- Abrir o cancelamento inicia uma **simulação**, sem alterar o contrato.
- Ao confirmar, o contrato vira **Cancelado** e a apuração é salva como uma fotografia histórica.
- A confirmação do cancelamento **não cria automaticamente** lançamento em DRE ou caixa.
- O detalhe do cancelamento mostra cálculo, extras, pagamentos considerados, acordo e movimentações posteriores.
- Reembolso efetivo nunca ultrapassa o reembolso teórico e nunca fica negativo.

### Competência x caixa

- A competência de contratos vem exclusivamente dos **ciclos do contrato**.
- Um pagamento atrasado não muda a competência: se julho foi pago em agosto, a DRE continua em julho e o caixa entra em agosto.
- Datas `YYYY-MM-DD` usadas nas rotinas financeiras críticas são interpretadas como datas locais, evitando que o dia 1º caia no mês anterior por UTC.
- No cartão, o caixa recebe o **valor líquido integral** na data registrada, mesmo quando o cliente parcelou a compra.

### Movimentações no perfil do aluno

- **Pagamento do contrato:** entrada de caixa; não cria nova receita de competência.
- **Multa rescisória:** entrada de caixa + receita na DRE no mês do recebimento.
- **Pagamento do acordo:** entrada de caixa; sem nova receita na DRE.
- **Reembolso ao aluno:** saída de caixa; não entra como despesa operacional na DRE.

### Despesas

A tela **Despesas** ganhou uma seção de **Conciliação de Caixa das Despesas**.
A despesa permanece na competência original, mas só sai do caixa depois que Fernando registra a data e o valor efetivamente pagos.

> Importante: pagamentos históricos de despesas não são inventados pelo sistema. Meses antigos precisam ser conciliados manualmente quando a data real de pagamento não estiver registrada.


## V32.1 — correção do login

- Login passou a usar `<form>` real.
- Removidos handlers JavaScript inline do formulário de autenticação.
- Enter/submissão é tratado por `addEventListener`.
- Remove o aviso do Chrome de senha fora de formulário.

## Correção V32.2

- Corrigida incompatibilidade de sintaxe no cálculo de cancelamento causada pela mistura de `??` e `||` sem agrupamento explícito.
- O `app.js` foi validado integralmente após remover apenas os imports ESM para fins de análise sintática.
- A função de cálculo de cancelamento também foi validada isoladamente.


## Contratos — V33

Cada contrato agora armazena dois valores independentes:

- `valorTotal`: valor total nominal do contrato. É a base para a competência mensal (`valorTotal ÷ meses do plano`) e para a multa rescisória.
- `valorVistaReferencia`: valor à vista definido no contrato. É a base máxima do reembolso teórico.

Contratos antigos que ainda não tenham `valorVistaReferencia` precisam ser revisados uma vez antes de uma simulação de cancelamento. O sistema não confirma cancelamento usando uma suposição silenciosa.

Exemplo do contrato (anual 3x/semana):

- Valor total: R$ 5.796,00
- Valor à vista: R$ 5.087,00
- Valor mensal contratual: R$ 483,00
- Cancelamento no 5º mês: multa de 15% = R$ 869,40
- Reembolso teórico sem extras: R$ 1.802,60


## Contratos e competência — V34

A V34 separa explicitamente três conceitos:

1. **Valor total do contrato — bruto**  
   Valor nominal do contrato. É a base do valor mensal contratual usado no cancelamento e da multa rescisória.

2. **Valor líquido / à vista de referência**  
   Valor que efetivamente fica para o Studio. É a base total da competência da DRE e a base máxima do reembolso.

3. **Valor cobrado no cartão — bruto**  
   Normalmente é igual ao valor total do contrato. O sistema sugere essa equivalência, mas permite edição.

A competência continua seguindo os ciclos do contrato, independentemente da data do pagamento, porém o **valor reconhecido por competência é o líquido**.

Exemplo:
- bruto contrato: R$ 5.796,00
- líquido / à vista: R$ 5.087,00
- competência total do contrato: R$ 5.087,00
- competência mensal aproximada no anual: R$ 423,92 (com ajuste de centavos na última competência)
- valor mensal contratual para cancelamento: R$ 483,00
- multa de 15%: calculada sobre R$ 5.796,00

A simulação de cancelamento pode ser impressa antes da confirmação e não altera contrato, DRE ou caixa.


## Financeiro / DRE — V35

A V35 torna a composição financeira rastreável e separa definitivamente as fontes.

### Receita por competência

A DRE usa uma única composição:

- contrato ativo/cancelado válido → competência líquida do ciclo;
- aula extra registrada → competência na data da aula;
- multa rescisória registrada → competência na data do registro;
- receita avulsa → competência informada manualmente.

Pagamento normal de contrato **não gera uma segunda receita na DRE**. Ele afeta somente o caixa.

### Caixa

Entram no caixa:

- pagamentos/movimentações dos alunos pela data real;
- receitas avulsas marcadas como recebidas pela data real;
- reembolsos como saída;
- despesas somente quando houver baixa real.

### Pagamento → contrato

O modal mostra explicitamente o `contratoId`.

Ao alterar a data de um pagamento normal, o sistema verifica qual contrato cobre aquela data e apenas **sugere** a troca. Nunca muda o vínculo silenciosamente.

Se a data ficar fora do contrato escolhido, o sistema pede confirmação antes de salvar.

### Receita avulsa

Pode ser lançada sem aluno/contrato, com:

- descrição;
- categoria;
- valor líquido;
- competência;
- recebido ou não;
- data real do recebimento;
- forma/conta.

Excluir a receita avulsa remove automaticamente seu impacto tanto da competência quanto do caixa.

### Auditoria financeira

O Financeiro passa a verificar:

- contrato de migração antiga ainda ativo;
- contratos sobrepostos ou possivelmente duplicados;
- pagamentos sem `contratoId`;
- pagamentos apontando para contrato inexistente;
- pagamentos ligados a contrato arquivado;
- divergência de aluno entre pagamento e contrato;
- possíveis pagamentos duplicados;
- receita avulsa incompleta;
- qualquer tentativa de competência de contrato arquivado.

### Migração antiga desativada

A rotina que criava automaticamente `Contrato inicial` a partir dos campos antigos do aluno foi removida do carregamento. A partir da V35, nenhum contrato é recriado automaticamente.

O caso do aluno John deve ser usado como teste: se não houver contrato válido nem receita avulsa atribuível, nenhuma linha de competência dele deve existir. Se houver um contrato residual/duplicado, a DRE exibirá seu ID e a Auditoria Financeira apontará a origem.
