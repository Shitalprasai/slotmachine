/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

export const RotatePrompt: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // If height > width and max width < 768, user is on a mobile device in portrait
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 640;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  return (
    <div
      id="rotate-device-prompt"
      className="fixed top-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-950 via-amber-950 to-red-950 border border-amber-400 text-amber-200 shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-xs font-montserrat font-bold animate-bounce"
    >
      <Smartphone size={14} className="text-yellow-400 rotate-90" />
      <span>Rotate phone to landscape for best experience!</span>
      <button
        type="button"
        aria-label="Dismiss rotation tip"
        onClick={() => setDismissed(true)}
        className="ml-1 text-amber-400 hover:text-white"
      >
        <X size={12} />
      </button>
    </div>
  );
};
