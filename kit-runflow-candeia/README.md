# Kit Runflow · Case Candeia

Material de apoio dos hotseats 07 e 08 da Certificação FDE. A Candeia Materiais Elétricos é uma empresa fictícia; todos os valores são ilustrativos.

**Estado do kit:** a bateria `divergencias` rodou de ponta a ponta em 17/11/2026 (perfil Runflow local, agente com `openai('gpt-4o')` e juiz com OpenAI). As baterias do hotseat 08 entram no kit na semana que vem.

## O que tem aqui

| Arquivo | O que é |
|---|---|
| `main.ts` | O agente de divergências e a identidade de cada execução |
| `prompts/index.ts` | O prompt v3 (piloto) e o prompt v4 (a troca de sexta). `PROMPT_VERSION` escolhe |
| `tools/index.ts` | `registrar_proposta`, `escalar_aprovacao` e `aprovar_pagamento`, com a trava de R$ 1.000 em código |
| `evals/harness.csv` | Os casos do grupo. Vem com seis linhas de exemplo; o grupo completa até 20 |
| `evals/datasets/divergencias.dataset.ts` | Hotseat 07: o assistente acerta? |
| `evals/runs/` | Uma rodada por arquivo, em JSON e HTML |

## Preparar

```bash
npm install
```

Configure as credenciais do SDK da Runflow e do provedor do modelo como no seu projeto. O juiz (`llmJudge`) também chama um modelo.

## Quinta, 19/11 · Hotseat 07

1. Exporte a aba Harness do caderno para `evals/harness.csv`, com as colunas `id, categoria, gravidade, origem, entrada, esperado, criterio`.
2. Rode a bateria contra o prompt v3 (tarefa 3.1):

```bash
npm run eval -- --filter Divergências
```

3. Abra as rodadas no navegador:

```bash
npm run eval:view
```

4. Rode a v4 comparando com a rodada da v3 (tarefa 3.2). Troque o nome do arquivo pelo da rodada gerada no passo 2:

```bash
PROMPT_VERSION=v4 npm run eval -- --filter Divergências --baseline evals/runs/RODADA-V3.json
```

O comando sai com erro se um caso que passava na v3 falhar na v4.

## Quinta, 26/11 · Hotseat 08

As baterias de travas e de casos adversariais entram no kit antes do hotseat 08.

## O que o kit não cobre

O comando prova acerto e regressão. Mapa de dado pessoal, trilha de auditoria e plano de degradação continuam sendo trabalho do grupo, no caderno e no parecer.

## Observações

- `noPII` também acusa CNPJ. As entradas do kit não trazem CNPJ; se a sua trouxer, ajuste `patterns` ou `allowlist`.
- O `--filter` casa com o nome do caso ou com uma tag. Se o filtro pelo nome do dataset não funcionar na sua versão, rode sem filtro ou filtre pelo prefixo do caso (`H07`).
- Em produção, o prompt seria um recurso versionado da plataforma, e não um texto no código.
