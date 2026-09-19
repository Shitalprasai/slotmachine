import { PaylineDefinition } from './types';

export const PAYLINES: PaylineDefinition[] = [
  {
    id: 1,
    name: 'Line 1',
    color: '#EF4444', // Red
    rows: [0, 0, 0], // Top row horizontal
    description: 'Top → Top → Top',
  },
  {
    id: 2,
    name: 'Line 2',
    color: '#3B82F6', // Blue
    rows: [1, 1, 1], // Center row horizontal
    description: 'Middle → Middle → Middle',
  },
  {
    id: 3,
    name: 'Line 3',
    color: '#10B981', // Emerald green
    rows: [2, 2, 2], // Bottom row horizontal
    description: 'Bottom → Bottom → Bottom',
  },
  {
    id: 4,
    name: 'Line 4',
    color: '#F59E0B', // Amber
    rows: [0, 1, 2], // Diagonal top-left to bottom-right
    description: 'Top → Middle → Bottom',
  },
  {
    id: 5,
    name: 'Line 5',
    color: '#8B5CF6', // Purple
    rows: [2, 1, 0], // Diagonal bottom-left to top-right
    description: 'Bottom → Middle → Top',
  },
];
