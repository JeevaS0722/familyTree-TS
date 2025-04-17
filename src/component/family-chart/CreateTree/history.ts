import d3 from '../d3';
import { cleanupDataJson } from './form';
import * as icons from '../view/elements/Card.icons';
import { Datum, History, HistoryControls, Store } from '../types';

export function createHistory(
  store: Store,
  getStoreData: () => Datum[],
  onUpdate: () => void
): History {
  let history: Array<{ data: Datum[]; main_id: string }> = [];
  let history_index: number = -1;

  return {
    changed,
    back,
    forward,
    canForward,
    canBack,
  };

  function changed(): void {
    if (history_index < history.length - 1) {
      history = history.slice(0, history_index + 1);
    }
    const clean_data = JSON.parse(
      cleanupDataJson(JSON.stringify(getStoreData()))
    );
    clean_data.main_id = store.getMainId();
    history.push(clean_data);
    history_index++;
  }

  function back(): void {
    if (!canBack()) {
      return;
    }
    history_index--;
    updateData(history[history_index]);
  }

  function forward(): void {
    if (!canForward()) {
      return;
    }
    history_index++;
    updateData(history[history_index]);
  }

  function canForward(): boolean {
    return history_index < history.length - 1;
  }

  function canBack(): boolean {
    return history_index > 0;
  }

  function updateData(data: { data: Datum[]; main_id: string }): void {
    store.updateMainId(data.main_id);
    store.updateData(data.data);
    onUpdate();
  }
}

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

  return {
    back_btn: back_btn.node() as HTMLButtonElement,
    forward_btn: forward_btn.node() as HTMLButtonElement,
    updateButtons,
    destroy,
  };

  function updateButtons(): void {
    back_btn.classed('disabled', !history.canBack());
    forward_btn.classed('disabled', !history.canForward());
    history_controls.style(
      'display',
      !history.canBack() && !history.canForward() ? 'none' : null
    );
  }

  function destroy(): void {
    history = null as any;
    d3.select(cont).select('.f3-history-controls').remove();
  }
}
