// src/view/view.html.component.ts
import d3 from '../d3';
import { calculateEnterAndExitPositions } from '../CalculateTree/CalculateTree.handlers';
import { calculateDelay } from './view';
import { getCardsViewFake } from './view.html.handlers';
import { TreePerson, CalculatedTree, ViewProps } from '../types';

type CardFunction = (d: TreePerson) => HTMLElement;

export default function updateCardsComponent(
  div: HTMLDivElement,
  tree: CalculatedTree,
  Card: CardFunction,
  props: ViewProps = {}
): void {
  const card = d3
    .select(getCardsViewFake(() => div))
    .selectAll<HTMLDivElement, TreePerson>('div.card_cont_fake')
    .data(tree.data, d => d.data.id);

  const card_exit = card.exit();
  const card_enter = card
    .enter()
    .append('div')
    .attr('class', 'card_cont_fake')
    .style('display', 'none');

  const card_update = card_enter.merge(card);

  card_exit.each(d => calculateEnterAndExitPositions(d, false, true));
  card_enter.each(d => calculateEnterAndExitPositions(d, true, false));

  card_exit.each(cardExit);
  card.each(cardUpdateNoEnter);
  card_enter.each(cardEnter);
  card_update.each(cardUpdate);

  function cardEnter(this: HTMLDivElement, d: TreePerson): void {
    const card_element = d3.select(Card(d));

    card_element
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('opacity', 0)
      .style('transform', `translate(${d._x || 0}px, ${d._y || 0}px)`);
  }

  function cardUpdateNoEnter(this: HTMLDivElement, d: TreePerson): void {}

  function cardUpdate(this: HTMLDivElement, d: TreePerson): void {
    const card_element = d3.select(Card(d));
    const delay = props.initial
      ? calculateDelay(tree, d, props.transition_time || 2000)
      : 0;

    card_element
      .transition()
      .duration(props.transition_time || 2000)
      .delay(delay)
      .style('transform', `translate(${d.x}px, ${d.y}px)`)
      .style('opacity', 1);
  }

  function cardExit(this: HTMLDivElement, d: TreePerson): void {
    const card_element = d3.select(Card(d));
    const g = d3.select(this);

    card_element
      .transition()
      .duration(props.transition_time || 2000)
      .style('opacity', 0)
      .style('transform', `translate(${d._x || 0}px, ${d._y || 0}px)`)
      .on('end', () => g.remove()); // remove the card_cont_fake
  }
}
