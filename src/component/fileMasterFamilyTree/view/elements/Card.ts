// src/view/elements/Card.ts
import d3 from '../../d3';
import { appendTemplate, CardBodyOutline } from './Card.templates';
import cardElements, { appendElement } from './Card.elements';
import setupCardSvgDefs from './Card.defs';
import { CardProps, TreePerson } from '../../types';

interface CardFunction {
  (this: SVGElement, d: TreePerson): void;
}

export function Card(props: CardProps): CardFunction {
  props = setupProps(props);
  if (props.svg) {
    setupCardSvgDefs(props.svg, props.card_dim);
  }

  return function (this: SVGElement, d: TreePerson): void {
    const gender_class =
      d.data.data.gender === 'M'
        ? 'card-male'
        : d.data.data.gender === 'F'
          ? 'card-female'
          : 'card-genderless';

    const card_dim = props.card_dim;

    const card = d3
      .create('svg:g')
      .attr('class', `card ${gender_class}`)
      .attr('transform', `translate(${[-card_dim.w / 2, -card_dim.h / 2]})`);

    card
      .append('g')
      .attr('class', 'card-inner')
      .attr('clip-path', 'url(#card_clip)');

    this.innerHTML = '';
    this.appendChild(card.node());

    appendTemplate(
      CardBodyOutline({
        d,
        card_dim,
        is_new: d.data.to_add,
      }).template,
      card.node() as SVGElement,
      true
    );

    appendElement(
      cardElements.cardBody(d, props),
      this.querySelector('.card-inner') as SVGElement
    );

    if (props.img) {
      appendElement(
        cardElements.cardImage(d, props),
        this.querySelector('.card') as SVGElement
      );
    }

    if (props.mini_tree) {
      appendElement(
        cardElements.miniTree(d, props),
        this.querySelector('.card') as SVGElement,
        true
      );
    }

    if (props.link_break) {
      appendElement(
        cardElements.lineBreak(d, props),
        this.querySelector('.card') as SVGElement
      );
    }

    if (props.cardEditForm) {
      appendElement(
        cardElements.cardEdit(d, props),
        this.querySelector('.card-inner') as SVGElement
      );

      appendElement(
        cardElements.cardAdd(d, props),
        this.querySelector('.card-inner') as SVGElement
      );
    }

    if (props.onCardUpdates) {
      props.onCardUpdates.forEach(fn => fn.call(this, d));
    }

    if (props.onCardUpdate) {
      props.onCardUpdate.call(this, d);
    }
  };

  function setupProps(props: CardProps): CardProps {
    const default_props: Partial<CardProps> = {
      img: true,
      mini_tree: true,
      link_break: false,
      card_dim: {
        w: 220,
        h: 70,
        text_x: 75,
        text_y: 15,
        img_w: 60,
        img_h: 60,
        img_x: 5,
        img_y: 5,
      },
    };

    if (!props) {
      props = {} as CardProps;
    }

    for (const k in default_props) {
      if (typeof props[k as keyof CardProps] === 'undefined') {
        props[k as keyof CardProps] = default_props[k as keyof CardProps];
      }
    }

    return props;
  }
}
