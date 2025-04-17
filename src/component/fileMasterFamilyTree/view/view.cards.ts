// src/view/view.cards.ts
import d3 from '../d3';
import { calculateEnterAndExitPositions } from '../CalculateTree/CalculateTree.handlers';
import { calculateDelay } from './view';
import { TreePerson, CalculatedTree, ViewProps } from '../types';

type CardFunction = (this: SVGGElement, d: TreePerson) => void;

export default function updateCards(
  svg: SVGSVGElement,
  tree: CalculatedTree,
  Card: CardFunction,
  props: ViewProps = {}
): void {
  const card = d3
    .select(svg)
    .select('.cards_view')
    .selectAll<SVGGElement, TreePerson>('g.card_cont')
    .data(tree.data, d => d.data.id);

  const card_exit = card.exit();
  const card_enter = card.enter().append('g').attr('class', 'card_cont');
  const card_update = card_enter.merge(card);

  card_exit.each(d => calculateEnterAndExitPositions(d, false, true));
  card_enter.each(d => calculateEnterAndExitPositions(d, true, false));

  card_exit.each(cardExit);
  card.each(cardUpdateNoEnter);
  card_enter.each(cardEnter);
  card_update.each(cardUpdate);

  function cardEnter(this: SVGGElement, d: TreePerson): void {
    d3.select(this)
      .attr('transform', `translate(${d._x || 0}, ${d._y || 0})`)
      .style('opacity', 0);

    Card.call(this, d);
  }

  function cardUpdateNoEnter(this: SVGGElement, d: TreePerson): void {}

  function cardUpdate(this: SVGGElement, d: TreePerson): void {
    Card.call(this, d);

    const delay = props.initial
      ? calculateDelay(tree, d, props.transition_time || 2000)
      : 0;

    d3.select(this)
      .transition()
      .duration(props.transition_time || 2000)
      .delay(delay)
      .attr('transform', `translate(${d.x}, ${d.y})`)
      .style('opacity', 1);
  }

  function cardExit(this: SVGGElement, d: TreePerson): void {
    const g = d3.select(this);

    g.transition()
      .duration(props.transition_time || 2000)
      .style('opacity', 0)
      .attr('transform', `translate(${d._x || 0}, ${d._y || 0})`)
      .on('end', () => g.remove());
  }
}
