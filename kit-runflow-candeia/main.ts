import { Agent, openai, identify, type AgentInput } from '@runflow-ai/sdk';
import { tools } from './tools/index.js';
import { systemPrompt, versaoAtual } from './prompts/index.js';

const agent = new Agent({
  name: `candeia-divergencias-${versaoAtual}`,
  model: openai('gpt-4o'),
  instructions: systemPrompt,
  tools,
  observability: 'full',
});

export async function main(input: AgentInput) {
  identify(input.sessionId ?? input.userId ?? 'anon');
  return agent.process(input);
}

export default main;
