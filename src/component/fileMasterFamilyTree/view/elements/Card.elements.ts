// src/view/elements/Card.elements.ts
import d3 from '../../d3';
import { isAllRelativeDisplayed } from '../../handlers/general';
import {
  cardChangeMain,
  cardEdit,
  cardShowHideRels,
} from '../../handlers/cardMethods';
import {
  CardBody,
  CardBodyAddNew,
  CardImage,
  LinkBreakIconWrapper,
  MiniTree,
  PencilIcon,
  PlusIcon,
} from './Card.templates';
import { CardProps, TreePerson, Store } from '../../types';
import { Selection } from 'd3';

interface CardElementsProps extends Partial<CardProps> {
  store: Store;
  card_dim: CardProps['card_dim'];
  addRelative?: (params: { d: TreePerson }) => void;
  onMiniTreeClick?: (e: MouseEvent, d: TreePerson) => void;
  cardEditForm?: CardProps['cardEditForm'];
}

const CardElements = {
  miniTree,
  lineBreak,
  cardBody,
  cardImage,
  cardEdit: cardEditIcon,
  cardAdd: cardAddIcon,
};

export default CardElements;

function miniTree(
  d: TreePerson,
  props: CardElementsProps
): SVGGElement | undefined {
  if (d.data.to_add) {
    return;
  }
  if (d.all_rels_displayed) {
    return;
  }

  const card_dim = props.card_dim;
  const g = d3.create('svg:g');
  g.html(MiniTree({ d, card_dim }).template);

  g.on('click', function (event: MouseEvent) {
    event.stopPropagation();
    if (props.onMiniTreeClick) {
      props.onMiniTreeClick.call(this, event, d);
    } else {
      cardChangeMain(props.store, { d });
    }
  });

  return g.node() as SVGGElement;
}

function lineBreak(
  d: TreePerson,
  props: CardElementsProps
): SVGGElement | undefined {
  if (d.data.to_add) {
    return;
  }

  const card_dim = props.card_dim;
  const g = d3.create('svg:g');
  g.html(LinkBreakIconWrapper({ d, card_dim }).template);

  g.on('click', (event: MouseEvent) => {
    event.stopPropagation();
    cardShowHideRels(props.store, { d });
  });

  return g.node() as SVGGElement;
}

function cardBody(d: TreePerson, props: CardElementsProps): SVGGElement {
  const unknown_lbl = props.cardEditForm ? 'ADD' : 'UNKNOWN';
  const card_dim = props.card_dim;
  let g: Selection<SVGGElement, unknown, null, undefined>;

  if (!d.data.to_add) {
    g = d3.create<SVGGElement>('svg:g');
    g.html(
      CardBody({
        d,
        card_dim,
        card_display: props.card_display || [() => ''],
      }).template
    );

    g.on('click', function (event: MouseEvent) {
      event.stopPropagation();
      if (props.onCardClick) {
        props.onCardClick.call(this, event, d);
      } else {
        cardChangeMain(props.store, { d });
      }
    });
  } else {
    g = d3.create<SVGGElement>('svg:g');
    g.html(
      CardBodyAddNew({
        d,
        card_dim,
        card_add: !!props.cardEditForm,
        label: unknown_lbl,
      }).template
    );

    g.on('click', (event: MouseEvent) => {
      event.stopPropagation();
      cardEdit(props.store, { d, cardEditForm: props.cardEditForm });
    });
  }

  return g.node() as SVGGElement;
}

function cardImage(
  d: TreePerson,
  props: CardElementsProps
): SVGGElement | undefined {
  if (d.data.to_add) {
    return;
  }

  const card_dim = props.card_dim;
  const g = d3.create('svg:g');
  g.html(
    CardImage({
      d,
      image: d.data.data.avatar || null,
      card_dim,
      maleIcon: null,
      femaleIcon: null,
    }).template
  );

  return g.node() as SVGGElement;
}

function cardEditIcon(
  d: TreePerson,
  props: CardElementsProps
): SVGGElement | undefined {
  if (d.data.to_add) {
    return;
  }

  const card_dim = props.card_dim;
  const g = d3.create('svg:g');
  g.html(
    PencilIcon({
      card_dim,
      x: card_dim.w - 46,
      y: card_dim.h - 20,
    }).template
  );

  g.on('click', (event: MouseEvent) => {
    event.stopPropagation();
    cardEdit(props.store, { d, cardEditForm: props.cardEditForm });
  });

  return g.node() as SVGGElement;
}

function cardAddIcon(
  d: TreePerson,
  props: CardElementsProps
): SVGGElement | undefined {
  if (d.data.to_add || !props.addRelative) {
    return;
  }

  const card_dim = props.card_dim;
  const g = d3.create('svg:g');
  g.html(
    PlusIcon({
      card_dim,
      x: card_dim.w - 26,
      y: card_dim.h - 20,
    }).template
  );

  g.on('click', (event: MouseEvent) => {
    event.stopPropagation();
    props.addRelative?.({ d });
  });

  return g.node() as SVGGElement;
}

export function appendElement(
  el_maybe: SVGElement | undefined,
  parent: SVGElement | HTMLElement,
  is_first?: boolean
): void {
  if (!el_maybe) {
    return;
  }

  if (is_first) {
    parent.insertBefore(el_maybe, parent.firstChild);
  } else {
    parent.appendChild(el_maybe);
  }
}
