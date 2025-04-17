import d3 from '../d3';
import { TreeNode } from '../types';

export function assignUniqueIdToTreeData(
  div: HTMLElement,
  tree_data: TreeNode[]
): void {
  const card = d3
    .select(div)
    .selectAll('div.card_cont_2fake')
    .data(tree_data, (d: TreeNode) => d.data.id);
  const card_exit = card.exit();
  const card_enter = card
    .enter()
    .append('div')
    .attr('class', 'card_cont_2fake')
    .style('display', 'none')
    .attr('data-id', () => Math.random().toString());
  const card_update = card_enter.merge(card);

  card_exit.each(cardExit);
  card_enter.each(cardEnter);
  card_update.each(cardUpdate);

  function cardEnter(this: HTMLElement, d: TreeNode): void {
    d.unique_id = d3.select(this).attr('data-id');
  }

  function cardUpdate(this: HTMLElement, d: TreeNode): void {
    d.unique_id = d3.select(this).attr('data-id');
  }

  function cardExit(this: HTMLElement, d: TreeNode): void {
    d.unique_id = d3.select(this).attr('data-id');
    d3.select(this).remove();
  }
}

export function setupHtmlSvg(getHtmlSvg: () => HTMLElement): void {
  d3.select(getHtmlSvg())
    .append('div')
    .attr('class', 'cards_view_fake')
    .style('display', 'none');
}

export function getCardsViewFake(getHtmlSvg: () => HTMLElement): HTMLElement {
  return d3
    .select(getHtmlSvg())
    .select('div.cards_view_fake')
    .node() as HTMLElement;
}

interface ZoomEvent {
  transform: {
    x: number;
    y: number;
    k: number;
  };
}

export function onZoomSetup(
  getSvgView: () => Element,
  getHtmlView: () => Element
): (e: ZoomEvent) => void {
  return function onZoom(e: ZoomEvent): void {
    const t = e.transform;

    d3.select(getSvgView()).style(
      'transform',
      `translate(${t.x}px, ${t.y}px) scale(${t.k}) `
    );
    d3.select(getHtmlView()).style(
      'transform',
      `translate(${t.x}px, ${t.y}px) scale(${t.k}) `
    );
  };
}

export function setupReactiveTreeData(
  getHtmlSvg: () => HTMLElement
): (new_tree_data: TreeNode[]) => TreeNode[] {
  let tree_data: TreeNode[] = [];

  return function getReactiveTreeData(new_tree_data: TreeNode[]): TreeNode[] {
    const tree_data_exit = getTreeDataExit(new_tree_data, tree_data);
    tree_data = [...new_tree_data, ...tree_data_exit];
    assignUniqueIdToTreeData(getCardsViewFake(getHtmlSvg), tree_data);
    return tree_data;
  };
}

export function createHtmlSvg(cont: HTMLElement): HTMLElement {
  const f3Canvas = d3.select(cont).select('#f3Canvas');
  const cardHtml = f3Canvas
    .append('div')
    .attr('id', 'htmlSvg')
    .attr(
      'style',
      'position: absolute; width: 100%; height: 100%; z-index: 2; top: 0; left: 0'
    );

  cardHtml
    .append('div')
    .attr('class', 'cards_view')
    .style('transform-origin', '0 0');
  setupHtmlSvg(() => cardHtml.node() as HTMLElement);

  return cardHtml.node() as HTMLElement;
}

function getTreeDataExit(
  new_tree_data: TreeNode[],
  old_tree_data: TreeNode[]
): TreeNode[] {
  if (old_tree_data.length > 0) {
    return old_tree_data.filter(
      d => !new_tree_data.find(t => t.data.id === d.data.id)
    );
  } else {
    return [];
  }
}

export function getUniqueId(d: TreeNode): string {
  return d.unique_id;
}
