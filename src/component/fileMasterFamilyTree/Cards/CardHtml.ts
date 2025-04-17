// src/Cards/CardHtml.ts
import d3 from '../d3';
import fmFamilyTree from '../index';
import { processCardDisplay } from './utils';
import { pathToMain } from '../CalculateTree/createLinks';
import { Store, CardInterface, TreePerson, CardDimensions } from '../types';

// Define the type for the export function with static property
export interface CardHtmlWrapperInterface {
  (cont: HTMLElement, store: Store): CardHtml;
  is_html: boolean;
}

// Create the export function
const CardHtmlWrapper: CardHtmlWrapperInterface = (
  cont: HTMLElement,
  store: Store
) => new CardHtml(cont, store);

// Set static property for type checking
CardHtmlWrapper.is_html = true;

export default CardHtmlWrapper;

class CardHtml implements CardInterface {
  cont: HTMLElement;
  store: Store;
  svg: SVGSVGElement | null = null;
  getCard: (() => (d: TreePerson) => void) | null = null;
  card_display: ((d: any) => string)[] = [
    d => `${d.data['first name']} ${d.data['last name']}`,
  ];
  onCardClick: (e: MouseEvent, d: TreePerson) => void;
  style: string = 'default';
  mini_tree: boolean = false;
  onCardUpdate: ((d: TreePerson) => void) | null = null;
  card_dim: CardDimensions = {};
  onCardMouseenter?: (e: MouseEvent, d: TreePerson) => void;
  onCardMouseleave?: (e: MouseEvent, d: TreePerson) => void;
  to_transition: string | boolean = false;

  constructor(cont: HTMLElement, store: Store) {
    this.cont = cont;
    this.store = store;
    this.onCardClick = this.onCardClickDefault;
    this.init();
    return this;
  }

  init(): void {
    this.svg = this.cont.querySelector('svg.main_svg');

    this.getCard = () =>
      fmFamilyTree.elements.CardHtml({
        store: this.store,
        card_display: this.card_display,
        onCardClick: this.onCardClick,
        style: this.style,
        mini_tree: this.mini_tree,
        onCardUpdate: this.onCardUpdate,
        card_dim: this.card_dim,
        empty_card_label: this.store.state.single_parent_empty_card_label,
        onCardMouseenter: this.onCardMouseenter
          ? this.onCardMouseenter.bind(this)
          : undefined,
        onCardMouseleave: this.onCardMouseleave
          ? this.onCardMouseleave.bind(this)
          : undefined,
      });
  }

  setCardDisplay(card_display: any): CardHtml {
    this.card_display = processCardDisplay(card_display);
    return this;
  }

  setOnCardClick(
    onCardClick: (e: MouseEvent, d: TreePerson) => void
  ): CardHtml {
    this.onCardClick = onCardClick;
    return this;
  }

  onCardClickDefault(e: MouseEvent, d: TreePerson): void {
    this.store.updateMainId(d.data.id);
    this.store.updateTree({});
  }

  setStyle(style: string): CardHtml {
    this.style = style;
    return this;
  }

  setMiniTree(mini_tree: boolean): CardHtml {
    this.mini_tree = mini_tree;
    return this;
  }

  setOnCardUpdate(onCardUpdate: (d: TreePerson) => void): CardHtml {
    this.onCardUpdate = onCardUpdate;
    return this;
  }

  setCardDim(card_dim: Partial<CardDimensions>): CardHtml {
    if (typeof card_dim !== 'object') {
      console.error('card_dim must be an object');
      return this;
    }

    for (const key in card_dim) {
      const val = card_dim[key];
      if (typeof val !== 'number' && typeof val !== 'boolean') {
        console.error(`card_dim.${key} must be a number or boolean`);
        return this;
      }

      let targetKey = key;
      if (key === 'width') {
        targetKey = 'w';
      }
      if (key === 'height') {
        targetKey = 'h';
      }
      if (key === 'img_width') {
        targetKey = 'img_w';
      }
      if (key === 'img_height') {
        targetKey = 'img_h';
      }
      if (key === 'img_x') {
        targetKey = 'img_x';
      }
      if (key === 'img_y') {
        targetKey = 'img_y';
      }

      this.card_dim[targetKey as keyof CardDimensions] = val;
    }

    return this;
  }

  resetCardDim(): CardHtml {
    this.card_dim = {};
    return this;
  }

  setOnHoverPathToMain(): CardHtml {
    this.onCardMouseenter = this.onEnterPathToMain.bind(this);
    this.onCardMouseleave = this.onLeavePathToMain.bind(this);
    return this;
  }

  unsetOnHoverPathToMain(): CardHtml {
    this.onCardMouseenter = undefined;
    this.onCardMouseleave = undefined;
    return this;
  }

  onEnterPathToMain(e: MouseEvent, datum: TreePerson): CardHtml {
    this.to_transition = datum.data.id;
    const main_datum = this.store.getTreeMainDatum();

    if (!main_datum) {
      return this;
    }

    const cards = d3
      .select(this.cont)
      .select('div.cards_view')
      .selectAll<HTMLElement, TreePerson>('.card_cont');
    const links = d3
      .select(this.cont)
      .select('svg.main_svg .links_view')
      .selectAll<SVGPathElement, any>('.link');

    const [cards_node_to_main, links_node_to_main] = pathToMain(
      cards,
      links,
      datum,
      main_datum
    );

    cards_node_to_main.forEach(d => {
      const delay = Math.abs(datum.depth - d.card.depth) * 200;
      const cardInner = d.node.querySelector('div.card-inner');

      if (cardInner) {
        d3.select(cardInner)
          .transition()
          .duration(0)
          .delay(delay)
          .on(
            'end',
            () =>
              this.to_transition === datum.data.id &&
              d3.select(cardInner).classed('f3-path-to-main', true)
          );
      }
    });

    links_node_to_main.forEach(d => {
      const delay = Math.abs(datum.depth - d.link.depth) * 200;

      d3.select(d.node)
        .transition()
        .duration(0)
        .delay(delay)
        .on(
          'end',
          () =>
            this.to_transition === datum.data.id &&
            d3.select(d.node).classed('f3-path-to-main', true)
        );
    });

    return this;
  }

  onLeavePathToMain(e: MouseEvent, d: TreePerson): CardHtml {
    this.to_transition = false;

    d3.select(this.cont)
      .select('div.cards_view')
      .selectAll('div.card-inner')
      .classed('f3-path-to-main', false);

    d3.select(this.cont)
      .select('svg.main_svg .links_view')
      .selectAll('.link')
      .classed('f3-path-to-main', false);

    return this;
  }
}
