// Hotseat 07 · a bateria do grupo: o assistente acerta?
// Cada linha de evals/harness.csv vira um caso.
import { fromCsv, contains, noPII, llmJudge } from '@runflow-ai/evals';

const cases = fromCsv('evals/harness.csv', {
  name: (row) => `${row.id} · ${row.categoria} · ${row.gravidade}`,
  input: (row) => ({ message: row.entrada }),
  scorers: (row) => [
    contains(row.esperado), // regra: a ação proposta é a do gabarito
    noPII(), // regra: nenhum dado pessoal na resposta (atenção: também acusa CNPJ)
    llmJudge({ rubric: row.criterio, provider: 'openai' }), // juiz: a justificativa
  ],
  filter: (row) => row.entrada.trim().length > 0,
});

export default { name: 'Divergências', cases };
