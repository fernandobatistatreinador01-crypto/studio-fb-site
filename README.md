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
