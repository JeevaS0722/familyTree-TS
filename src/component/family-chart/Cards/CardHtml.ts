import d3 from '../d3';
import f3 from '../index';
import { pathToMain } from '../CalculateTree/createLinks';
import {
  Card,
  CardDimensions,
  Store,
  TreeNode,
  CardNodePair,
  LinkNodePair,
} from '../types';

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

class CardHtml implements Card {
  cont: HTMLElement;
  store: Store;
  svg: SVGElement | null = null;
  getCard: (() => any) | null = null;
  onCardClick: (e: Event, d: TreeNode) => void;
  mini_tree: boolean = false; // Default mini_tree to false
  onCardUpdate: ((this: Element, d: TreeNode) => void) | null = null;
  card_dim: CardDimensions = {
    w: 320, // Wider card to match the design
    h: 150, // Taller card for the fields
    img_w: 60,
    img_h: 60,
    img_x: 5,
    img_y: 5,
    height_auto: true,
  };
  onCardMouseenter: ((e: Event, d: TreeNode) => void) | null = null;
  onCardMouseleave: ((e: Event, d: TreeNode) => void) | null = null;
  to_transition: string | boolean = false;
  relationshipTitle: string = 'Relationship to file';
  divisionTitle: string = 'Division of Interest';
  showIcons: boolean = true;
  customCardRenderer: ((d: TreeNode) => string) | null = null;

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
      f3.elements.CardHtml({
        store: this.store,
        onCardClick: this.onCardClick,
        mini_tree: this.mini_tree,
        onCardUpdate: this.onCardUpdate,
        card_dim: this.card_dim,
        onCardMouseenter: this.onCardMouseenter
          ? this.onCardMouseenter.bind(this)
          : null,
        onCardMouseleave: this.onCardMouseleave
          ? this.onCardMouseleave.bind(this)
          : null,
        relationshipTitle: this.relationshipTitle,
        divisionTitle: this.divisionTitle,
        showIcons: this.showIcons,
        customCardRenderer: this.customCardRenderer,
      });
  }

  setOnCardClick(onCardClick: (e: Event, d: TreeNode) => void): this {
    this.onCardClick = onCardClick;
    return this;
  }

  onCardClickDefault(e: Event, d: TreeNode): void {
    this.store.updateMainId(d.data.id);
    this.store.updateTree({});
  }

  setMiniTree(mini_tree: boolean): this {
    this.mini_tree = mini_tree;
    return this;
  }

  setOnCardUpdate(onCardUpdate: (this: Element, d: TreeNode) => void): this {
    this.onCardUpdate = onCardUpdate;
    return this;
  }

  setRelationshipTitle(title: string): this {
    this.relationshipTitle = title;
    return this;
  }

  setDivisionTitle(title: string): this {
    this.divisionTitle = title;
    return this;
  }

  setShowIcons(show: boolean): this {
    this.showIcons = show;
    return this;
  }

  setCardDim(card_dim: Record<string, number | boolean>): this {
    if (typeof card_dim !== 'object') {
      console.error('card_dim must be an object');
      return this;
    }

    for (let key in card_dim) {
      const val = card_dim[key];
      if (typeof val !== 'number' && typeof val !== 'boolean') {
        console.error(`card_dim.${key} must be a number or boolean`);
        return this;
      }

      // Handle key mapping
      if (key === 'width') {
        key = 'w';
      } else if (key === 'height') {
        key = 'h';
      } else if (key === 'img_width') {
        key = 'img_w';
      } else if (key === 'img_height') {
        key = 'img_h';
      } else if (key === 'img_x') {
        key = 'img_x';
      } else if (key === 'img_y') {
        key = 'img_y';
      } else if (key === 'height_auto') {
        key = 'height_auto';
      }

      this.card_dim[key] = val;
    }

    return this;
  }

  resetCardDim(): this {
    this.card_dim = {
      w: 320,
      h: 150,
      img_w: 60,
      img_h: 60,
      img_x: 5,
      img_y: 5,
      height_auto: true,
    };
    return this;
  }

  setOnHoverPathToMain(): this {
    this.onCardMouseenter = this.onEnterPathToMain.bind(this);
    this.onCardMouseleave = this.onLeavePathToMain.bind(this);
    return this;
  }

  unsetOnHoverPathToMain(): this {
    this.onCardMouseenter = null;
    this.onCardMouseleave = null;
    return this;
  }

  onEnterPathToMain(e: Event, datum: TreeNode): this {
    this.to_transition = datum.data.id;
    const main_datum = this.store.getTreeMainDatum();
    const cards = d3
      .select(this.cont)
      .select('div.cards_view')
      .selectAll('.card_cont');
    const links = d3
      .select(this.cont)
      .select('svg.main_svg .links_view')
      .selectAll('.link');

    const [cards_node_to_main, links_node_to_main] = pathToMain(
      cards,
      links,
      datum,
      main_datum
    );

    cards_node_to_main.forEach((d: CardNodePair) => {
      const delay = Math.abs(datum.depth - d.card.depth) * 200;
      d3.select(d.node.querySelector('div.card-inner'))
        .transition()
        .duration(0)
        .delay(delay)
        .on(
          'end',
          () =>
            this.to_transition === datum.data.id &&
            d3
              .select(d.node.querySelector('div.card-inner'))
              .classed('f3-path-to-main', true)
        );
    });

    links_node_to_main.forEach((d: LinkNodePair) => {
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

  onLeavePathToMain(e: Event, d: TreeNode): this {
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

  setCustomCardRenderer(renderer: (d: TreeNode) => string): this {
    this.customCardRenderer = renderer;
    return this;
  }
}
