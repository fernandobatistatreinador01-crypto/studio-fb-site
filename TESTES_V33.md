# Testes V33 — Valores contratuais separados

## Caso oficial do contrato

Plano anual, 3x/semana:

- Valor total do contrato: R$ 5.796,00
- Valor à vista de referência: R$ 5.087,00
- Meses utilizados: 5
- Multa: 15%
- Extras: R$ 0,00
- Total pago: R$ 5.087,00

Resultado esperado:

- Valor mensal contratual: R$ 483,00
- Valor utilizado: R$ 2.415,00
- Multa: R$ 869,40
- Custo contratual: R$ 3.284,40
- Reembolso teórico: R$ 1.802,60
- Saldo financeiro real: R$ 1.802,60
- Resultado: A reembolsar R$ 1.802,60

## Contrato legado

Ao tentar simular cancelamento em um contrato trimestral/semestral/anual sem `valorVistaReferencia`, o sistema deve interromper e abrir a edição do contrato para revisão dos dois valores.

## Cadastro e renovação

Os formulários devem mostrar separadamente:

1. Valor total do contrato
2. Valor à vista de referência

O cancelamento deve exibir esses dois campos como somente leitura.
