# Changelog

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
