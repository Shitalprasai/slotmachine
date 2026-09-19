/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AtmosphericLeftStageProps {
  currentBet?: number;
  winTier?: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT' | null;
}

/**
 * Left Stage: Clean, transparent atmospheric staging area showing pure
 * background fire without any dark boxes, borders, or backgrounds.
 */
export const AtmosphericLeftStage: React.FC<AtmosphericLeftStageProps> = () => {
  return (
    <div
      id="atmospheric-left-stage"
      className="relative hidden landscape:flex sm:flex flex-col justify-center items-center h-full w-[28%] lg:w-[32%] xl:w-[34%] py-2 px-2 pointer-events-none select-none z-10 overflow-hidden"
    >
      {/* Completely clean and open space for your next asset */}
    </div>
  );
};
