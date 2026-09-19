/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SlotGame } from './components/slot/SlotGame';
import { ErrorBoundary } from './components/slot/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <SlotGame />
    </ErrorBoundary>
  );
}

