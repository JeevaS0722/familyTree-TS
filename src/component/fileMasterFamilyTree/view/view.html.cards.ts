// src/view/view.html.cards.ts
import d3 from '../d3';
import { calculateEnterAndExitPositions } from '../CalculateTree/CalculateTree.handlers';
import { calculateDelay } from './view';
import { TreePerson, CalculatedTree, ViewProps } from '../types';

type HtmlCardFunction = (this: HTMLDivElement, d: TreePerson) => void;

export default function updateCardsHtml(
  div: HTMLDivElement,
  tree: CalculatedTree,
  Card: HtmlCardFunction,
  props: ViewProps = {}
): void {
  const card = d3
    .select(div)
    .select('.cards_view')
    .selectAll<HTMLDivElement, TreePerson>('div.card_cont')
    .data(tree.data, d => d.data.id);

  const card_exit = card.exit();
  const card_enter = card
    .enter()
    .append('div')
    .attr('class', 'card_cont')
    .style('pointer-events', 'none');

  const card_update = card_enter.merge(card);

  card_exit.each(d => calculateEnterAndExitPositions(d, false, true));
  card_enter.each(d => calculateEnterAndExitPositions(d, true, false));

  card_exit.each(cardExit);
  card.each(cardUpdateNoEnter);
  card_enter.each(cardEnter);
  card_update.each(cardUpdate);

  function cardEnter(this: HTMLDivElement, d: TreePerson): void {
    d3.select(this)
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('transform', `translate(${d._x || 0}px, ${d._y || 0}px)`)
      .style('opacity', 0);

    Card.call(this, d);
  }

  function cardUpdateNoEnter(this: HTMLDivElement, d: TreePerson): void {}

  function cardUpdate(this: HTMLDivElement, d: TreePerson): void {
    Card.call(this, d);

    const delay = props.initial
      ? calculateDelay(tree, d, props.transition_time || 2000)
      : 0;

    d3.select(this)
      .transition()
      .duration(props.transition_time || 2000)
      .delay(delay)
      .style('transform', `translate(${d.x}px, ${d.y}px)`)
      .style('opacity', 1);
  }

  function cardExit(this: HTMLDivElement, d: TreePerson): void {
    const g = d3.select(this);

    g.transition()
      .duration(props.transition_time || 2000)
      .style('opacity', 0)
      .style('transform', `translate(${d._x || 0}px, ${d._y || 0}px)`)
      .on('end', () => g.remove());
  }
}
