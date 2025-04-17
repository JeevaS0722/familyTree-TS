// src/CreateTree/history.ts
import d3 from '../d3';
import { cleanupDataJson } from './form';
import * as icons from '../view/elements/Card.icons';
import { Person, Store } from '../types';

interface History {
  changed: () => void;
  back: () => void;
  forward: () => void;
  canForward: () => boolean;
  canBack: () => boolean;
  controls?: HistoryControls;
}

interface HistoryControls {
  back_btn: HTMLButtonElement;
  forward_btn: HTMLButtonElement;
  updateButtons: () => void;
  destroy: () => void;
}

/**
 * Creates a history tracker for undo/redo operations
 *
 * @param store - The data store
 * @param getStoreData - Function to get the current data
 * @param onUpdate - Function to call when history changes
 * @returns A history object with methods to navigate history
 */
export function createHistory(
  store: Store,
  getStoreData: () => Person[],
  onUpdate: () => void
): History {
  let history: {
    main_id: string | null;
    data: Person[];
  }[] = [];
  let history_index: number = -1;

  const historyObject: History = {
    changed,
    back,
    forward,
    canForward,
    canBack,
  };

  return historyObject;

  /**
   * Records the current state in the history
   */
  function changed(): void {
    if (history_index < history.length - 1) {
      history = history.slice(0, history_index + 1);
    }

    const clean_data = JSON.parse(
      cleanupDataJson(JSON.stringify(getStoreData()))
    ) as Person[];

    clean_data.main_id = store.getMainId();
    history.push(clean_data);
    history_index++;
  }

  /**
   * Goes back one step in history
   */
  function back(): void {
    if (!canBack()) {
      return;
    }
    history_index--;
    updateData(history[history_index]);
  }

  /**
   * Goes forward one step in history
   */
  function forward(): void {
    if (!canForward()) {
      return;
    }
    history_index++;
    updateData(history[history_index]);
  }

  /**
   * Checks if forward navigation is possible
   */
  function canForward(): boolean {
    return history_index < history.length - 1;
  }

  /**
   * Checks if backward navigation is possible
   */
  function canBack(): boolean {
    return history_index > 0;
  }

  /**
   * Updates the data from a history entry
   */
  function updateData(data: { main_id: string | null; data: Person[] }): void {
    store.updateMainId(data.main_id);
    store.updateData(data.data);
    onUpdate();
  }
}

/**
 * Creates UI controls for navigating history
 *
 * @param cont - The container element
 * @param history - The history object
 * @param onUpdate - Function to call when navigation occurs
 * @returns Controls for the history navigation
 */
export function createHistoryControls(
  cont: HTMLElement,
  history: History,
  onUpdate: () => void = () => {}
): HistoryControls {
  const history_controls = d3
    .select(cont)
    .append('div')
    .attr('class', 'f3-history-controls');

  const back_btn = history_controls
    .append('button')
    .attr('class', 'f3-back-button')
    .on('click', () => {
      history.back();
      updateButtons();
      onUpdate();
    });

  const forward_btn = history_controls
    .append('button')
    .attr('class', 'f3-forward-button')
    .on('click', () => {
      history.forward();
      updateButtons();
      onUpdate();
    });

  back_btn.html(icons.historyBackSvgIcon());
  forward_btn.html(icons.historyForwardSvgIcon());

  const controls: HistoryControls = {
    back_btn: back_btn.node() as HTMLButtonElement,
    forward_btn: forward_btn.node() as HTMLButtonElement,
    updateButtons,
    destroy,
  };

  return controls;

  /**
   * Updates the button states based on history availability
   */
  function updateButtons(): void {
    back_btn.classed('disabled', !history.canBack());
    forward_btn.classed('disabled', !history.canForward());

    history_controls.style(
      'display',
      !history.canBack() && !history.canForward() ? 'none' : null
    );
  }

  /**
   * Cleans up the history controls
   */
  function destroy(): void {
    d3.select(cont).select('.f3-history-controls').remove();
  }
}
