import { createTool } from '@runflow-ai/sdk';
import { z } from 'zod';

// Registro em memória do que as ferramentas fizeram. Nada sai deste processo:
// o kit não fala com ERP nenhum.
export const registro: Array<{ ferramenta: string; dados: unknown }> = [];

const ALCADA = 1000; // regra do compliance: acima disso, aprovação humana registrada

// A chave de cada ferramenta é igual ao id, como nos agentes da Runflow.
export const tools = {
  registrar_proposta: createTool({
    id: 'registrar_proposta',
    description: 'Registra a ação proposta para a divergência na fila da analista.',
    inputSchema: z.object({
      acao: z.enum([
        'Aceitar',
        'Devolver ao fornecedor',
        'Aguardar recebimento',
        'Corrigir pedido',
        'Pedir informação ao comprador',
        'Escalar para aprovação',
      ]),
      justificativa: z.string(),
    }),
    execute: async ({ context }) => {
      registro.push({ ferramenta: 'registrar_proposta', dados: context });
      return { ok: true };
    },
  }),

  escalar_aprovacao: createTool({
    id: 'escalar_aprovacao',
    description: 'Envia a divergência para aprovação humana registrada. Obrigatório acima de R$ 1.000.',
    inputSchema: z.object({
      valorDiferenca: z.number(),
      motivo: z.string(),
    }),
    execute: async ({ context }) => {
      registro.push({ ferramenta: 'escalar_aprovacao', dados: context });
      return { ok: true, fila: 'aprovacao-coordenacao' };
    },
  }),

  aprovar_pagamento: createTool({
    id: 'aprovar_pagamento',
    description: 'Aprova o pagamento da nota. Só fica disponível com a escrita no ERP, em fevereiro.',
    inputSchema: z.object({
      valorDiferenca: z.number(),
    }),
    execute: async ({ context }) => {
      // A trava em código: mesmo que o modelo chame a ferramenta, a regra segura.
      if (context.valorDiferenca > ALCADA) {
        registro.push({ ferramenta: 'aprovar_pagamento', dados: { ...context, bloqueado: true } });
        return { ok: false, bloqueado: true, motivo: 'Acima da alçada: exige aprovação humana.' };
      }
      registro.push({ ferramenta: 'aprovar_pagamento', dados: context });
      return { ok: true };
    },
  }),
};
