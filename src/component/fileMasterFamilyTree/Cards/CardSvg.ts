// src/Cards/CardSvg.ts
import d3 from '../d3';
import fmFamilyTree from '../index';
import { updateCardSvgDefs } from '../view/elements/Card.defs';
import { processCardDisplay } from './utils';
import { Store, CardInterface, TreePerson, CardDimensions } from '../types';

// Define the type for the export function
export default function CardSvgWrapper(
  cont: HTMLElement,
  store: Store
): CardSvg {
  return new CardSvg(cont, store);
}

// Set static property for type checking
CardSvgWrapper.is_html = false;

class CardSvg implements CardInterface {
  cont: HTMLElement;
  store: Store;
  svg: SVGSVGElement | null = null;
  getCard: (() => (d: TreePerson) => void) | null = null;
  card_dim: CardDimensions = {
    w: 220,
    h: 70,
    text_x: 75,
    text_y: 15,
    img_w: 60,
    img_h: 60,
    img_x: 5,
    img_y: 5,
  };
  card_display: ((d: any) => string)[] = [
    d => `${d.data['first name']} ${d.data['last name']}`,
  ];
  mini_tree: boolean = true;
  link_break: boolean = false;
  onCardClick: (e: MouseEvent, d: TreePerson) => void;
  onCardUpdate: ((d: TreePerson) => void) | null = null;
  onCardUpdates: ((d: TreePerson) => void)[] | null = null;

  constructor(cont: HTMLElement, store: Store) {
    this.cont = cont;
    this.store = store;
    this.onCardClick = this.onCardClickDefault;
    this.init();
    return this;
  }

  init(): void {
    this.svg = this.cont.querySelector('svg.main_svg');

    if (!this.svg) {
      throw new Error('SVG element not found in container');
    }

    this.getCard = () =>
      fmFamilyTree.elements.Card({
        store: this.store,
        svg: this.svg as SVGSVGElement,
        card_dim: this.card_dim,
        card_display: this.card_display,
        mini_tree: this.mini_tree,
        link_break: this.link_break,
        onCardClick: this.onCardClick,
        onCardUpdate: this.onCardUpdate,
        onCardUpdates: this.onCardUpdates,
      });
  }

  setCardDisplay(card_display: any): CardSvg {
    this.card_display = processCardDisplay(card_display);
    return this;
  }

  setCardDim(card_dim: Partial<CardDimensions>): CardSvg {
    if (typeof card_dim !== 'object') {
      console.error('card_dim must be an object');
      return this;
    }

    for (const key in card_dim) {
      const val = card_dim[key];
      if (typeof val !== 'number') {
        console.error(`card_dim.${key} must be a number`);
        return this;
      }

      let targetKey = key;
      if (key === 'width') {
        targetKey = 'w';
      }
      if (key === 'height') {
        targetKey = 'h';
      }

      this.card_dim[targetKey as keyof CardDimensions] = val;
    }

    if (this.svg) {
      updateCardSvgDefs(this.svg, this.card_dim);
    }

    return this;
  }

  setMiniTree(mini_tree: boolean): CardSvg {
    this.mini_tree = mini_tree;
    return this;
  }

  setLinkBreak(link_break: boolean): CardSvg {
    this.link_break = link_break;
    return this;
  }

  setCardTextSvg(cardTextSvg: (d: any) => string): CardSvg {
    const onCardUpdate = function (this: SVGElement, d: TreePerson): void {
      const card_node = d3.select(this);
      const card_text = card_node.select('.card-text text');
      const card_text_g = card_text.node()?.parentNode;

      if (card_text_g) {
        card_text_g.innerHTML = cardTextSvg(d.data);
      }
    };

    (onCardUpdate as any).id = 'setCardTextSvg';

    if (!this.onCardUpdates) {
      this.onCardUpdates = [];
    }
    this.onCardUpdates = this.onCardUpdates.filter(
      fn => (fn as any).id !== 'setCardTextSvg'
    );
    this.onCardUpdates.push(onCardUpdate);

    return this;
  }

  onCardClickDefault(e: MouseEvent, d: TreePerson): void {
    this.store.updateMainId(d.data.id);
    this.store.updateTree({});
  }

  setOnCardClick(onCardClick: (e: MouseEvent, d: TreePerson) => void): CardSvg {
    this.onCardClick = onCardClick;
    return this;
  }
}
