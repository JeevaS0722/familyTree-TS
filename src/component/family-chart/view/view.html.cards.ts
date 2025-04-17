import d3 from '../d3';
import { calculateEnterAndExitPositions } from '../CalculateTree/CalculateTree.handlers';
import { calculateDelay } from './view';
import { Tree, TreeNode, UpdateProps } from '../types';

export default function updateCardsHtml(
  div: HTMLElement,
  tree: Tree,
  Card: (this: HTMLElement, d: TreeNode) => void,
  props: UpdateProps = {}
): void {
  const card = d3
      .select(div)
      .select('.cards_view')
      .selectAll('div.card_cont')
      .data(tree.data, (d: TreeNode) => d.data.id),
    card_exit = card.exit(),
    card_enter = card
      .enter()
      .append('div')
      .attr('class', 'card_cont')
      .style('pointer-events', 'none'),
    card_update = card_enter.merge(card);

  card_exit.each((d: TreeNode) =>
    calculateEnterAndExitPositions(d, false, true)
  );
  card_enter.each((d: TreeNode) =>
    calculateEnterAndExitPositions(d, true, false)
  );

  card_exit.each(cardExit);
  card.each(cardUpdateNoEnter);
  card_enter.each(cardEnter);
  card_update.each(cardUpdate);

  function cardEnter(this: HTMLElement, d: TreeNode): void {
    d3.select(this)
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('transform', `translate(${d._x}px, ${d._y}px)`)
      .style('opacity', 0);

    Card.call(this, d);
  }

  function cardUpdateNoEnter(this: HTMLElement, d: TreeNode): void {}

  function cardUpdate(this: HTMLElement, d: TreeNode): void {
    Card.call(this, d);
    const delay = props.initial
      ? calculateDelay(tree, d, props.transition_time)
      : 0;
    d3.select(this)
      .transition()
      .duration(props.transition_time || 0)
      .delay(delay)
      .style('transform', `translate(${d.x}px, ${d.y}px)`)
      .style('opacity', 1);
  }

  function cardExit(this: HTMLElement, d: TreeNode): void {
    const g = d3.select(this);
    g.transition()
      .duration(props.transition_time || 0)
      .style('opacity', 0)
      .style('transform', `translate(${d._x}px, ${d._y}px)`)
      .on('end', () => g.remove());
  }
}
