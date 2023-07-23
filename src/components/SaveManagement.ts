import type { State } from './State';

export function saveState(currentState: State) {
  localStorage.setItem('saveState', JSON.stringify({
    inventory: currentState.inventory,
    meta: currentState.meta,
  }));
}

export function loadState(currentState: State): State {
  const saveJson = localStorage.getItem('saveState');

  if (saveJson === null) return currentState;

  const save = JSON.parse(saveJson);

  return {
    ...currentState,
    inventory: save.inventory,
    meta: save.meta,
  };
}

export function clearSave() {
  localStorage.clear();
}
