import d3 from '../d3';
import { calculateEnterAndExitPositions } from '../CalculateTree/CalculateTree.handlers';
import { calculateDelay } from './view';
import { getCardsViewFake } from './view.html.handlers';
import { Tree, TreeNode, UpdateProps } from '../types';

export default function updateCardsComponent(
  div: HTMLElement,
  tree: Tree,
  Card: (d: TreeNode) => Element,
  props: UpdateProps = {}
): void {
  const card = d3
      .select(getCardsViewFake(() => div))
      .selectAll('div.card_cont_fake')
      .data(tree.data, (d: TreeNode) => d.data.id),
    card_exit = card.exit(),
    card_enter = card
      .enter()
      .append('div')
      .attr('class', 'card_cont_fake')
      .style('display', 'none'),
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
    const card_element = d3.select(Card(d));

    card_element
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('opacity', 0)
      .style('transform', `translate(${d._x}px, ${d._y}px)`);
  }

  function cardUpdateNoEnter(this: HTMLElement, d: TreeNode): void {}

  function cardUpdate(this: HTMLElement, d: TreeNode): void {
    const card_element = d3.select(Card(d));
    const delay = props.initial
      ? calculateDelay(tree, d, props.transition_time)
      : 0;

    card_element
      .transition()
      .duration(props.transition_time || 0)
      .delay(delay)
      .style('transform', `translate(${d.x}px, ${d.y}px)`)
      .style('opacity', 1);
  }

  function cardExit(this: HTMLElement, d: TreeNode): void {
    const card_element = d3.select(Card(d));
    const g = d3.select(this);

    card_element
      .transition()
      .duration(props.transition_time || 0)
      .style('opacity', 0)
      .style('transform', `translate(${d._x}px, ${d._y}px)`)
      .on('end', () => g.remove()); // remove the card_cont_fake
  }
}
