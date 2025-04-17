// src/view/view.ts
import d3 from '../d3';
import { cardToMiddle, treeFit } from './view.handlers';
import updateLinks from './view.links';
import updateCards from './view.cards';
import updateCardsHtml from './view.html.cards';
import updateCardsComponent from './view.html.component';
import { CalculatedTree, TreePerson, LinkData, ViewProps } from '../types';

type CardFunction = (this: SVGGElement | HTMLDivElement, d: TreePerson) => void;

export default function view(
  tree: CalculatedTree,
  svg: SVGSVGElement,
  Card: CardFunction,
  props: ViewProps = {}
): boolean {
  props.initial = props.hasOwnProperty('initial')
    ? props.initial
    : !d3
        .select(svg.parentNode as Element)
        .select('.card_cont')
        .node();

  props.transition_time = props.hasOwnProperty('transition_time')
    ? props.transition_time
    : 2000;

  if (props.cardComponent) {
    updateCardsComponent(props.cardComponent, tree, Card, props);
  } else if (props.cardHtml) {
    updateCardsHtml(props.cardHtml, tree, Card as any, props);
  } else {
    updateCards(svg, tree, Card as any, props);
  }

  updateLinks(svg, tree, props);

  const tree_position = props.tree_position || 'fit';

  if (props.initial) {
    treeFit({
      svg,
      svg_dim: svg.getBoundingClientRect(),
      tree_dim: tree.dim,
      transition_time: 0,
    });
  } else if (tree_position === 'fit') {
    treeFit({
      svg,
      svg_dim: svg.getBoundingClientRect(),
      tree_dim: tree.dim,
      transition_time: props.transition_time,
    });
  } else if (tree_position === 'main_to_middle') {
    cardToMiddle({
      datum: tree.data[0],
      svg,
      svg_dim: svg.getBoundingClientRect(),
      scale: props.scale,
      transition_time: props.transition_time,
    });
  } else if (tree_position === 'inherit') {
    // Do nothing - keep current position
  }

  return true;
}

export function calculateDelay(
  tree: CalculatedTree,
  d: TreePerson | LinkData,
  transition_time: number
): number {
  const delay_level = transition_time * 0.4;
  const ancestry_levels = Math.max(
    ...tree.data.map(d => (d.is_ancestry ? d.depth : 0))
  );

  let delay = (d as TreePerson).depth * delay_level;

  if (
    ((d as TreePerson).depth !== 0 || !!(d as TreePerson).spouse) &&
    !(d as TreePerson).is_ancestry
  ) {
    delay += ancestry_levels * delay_level; // after ancestry

    if ((d as TreePerson).spouse) {
      delay += delay_level; // spouse after bloodline
    }

    delay += (d as TreePerson).depth * delay_level; // double the delay for each level because of additional spouse delay
  }

  return delay;
}
