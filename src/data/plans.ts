import { AITool, UseCase } from '../types';

export interface Plan {
  id: string;
  name: string;
  price: number;
  type: 'individual' | 'team' | 'enterprise' | 'api';
}

export interface ToolPricing {
  id: AITool;
  name: string;
  description: string;
  plans: Plan[];
}

export const toolPricing: ToolPricing[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-powered code editor',
    plans: [
      { id: 'free', name: 'Free', price: 0, type: 'individual' },
      { id: 'pro', name: 'Pro', price: 20, type: 'individual' },
      { id: 'business', name: 'Business', price: 40, type: 'team' },
    ],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer for code completion',
    plans: [
      { id: 'individual', name: 'Individual', price: 10, type: 'individual' },
      { id: 'business', name: 'Business', price: 19, type: 'team' },
      { id: 'enterprise', name: 'Enterprise', price: 39, type: 'enterprise' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'AI assistant for conversation and analysis',
    plans: [
      { id: 'free', name: 'Free', price: 0, type: 'individual' },
      { id: 'pro', name: 'Pro', price: 20, type: 'individual' },
      { id: 'team', name: 'Team', price: 25, type: 'team' },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI conversational AI assistant',
    plans: [
      { id: 'free', name: 'Free', price: 0, type: 'individual' },
      { id: 'plus', name: 'Plus', price: 20, type: 'individual' },
      { id: 'team', name: 'Team', price: 25, type: 'team' },
      { id: 'enterprise', name: 'Enterprise', price: 60, type: 'enterprise' },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    description: 'API access to Claude models',
    plans: [
      { id: 'pay_as_you_go', name: 'Pay as you go', price: 0, type: 'api' },
      { id: 'committed', name: 'Committed Use', price: 100, type: 'api' },
    ],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    description: 'API access to GPT models',
    plans: [
      { id: 'pay_as_you_go', name: 'Pay as you go', price: 0, type: 'api' },
      { id: 'committed', name: 'Committed Use', price: 100, type: 'api' },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: "Google's AI assistant and models",
    plans: [
      { id: 'free', name: 'Free', price: 0, type: 'individual' },
      { id: 'advanced', name: 'Advanced', price: 20, type: 'individual' },
      { id: 'enterprise', name: 'Enterprise', price: 30, type: 'enterprise' },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    description: 'AI-powered IDE by Codeium',
    plans: [
      { id: 'free', name: 'Free', price: 0, type: 'individual' },
      { id: 'pro', name: 'Pro', price: 15, type: 'individual' },
      { id: 'team', name: 'Team', price: 35, type: 'team' },
    ],
  },
];

export const useCaseLabels: Record<UseCase, string> = {
  coding: 'Software Development',
  writing: 'Content Creation & Writing',
  data: 'Data Analysis & Analytics',
  research: 'Research & Analysis',
  mixed: 'Mixed Use Cases',
};

export const toolLabels: Record<AITool, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API',
  openai_api: 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
};
