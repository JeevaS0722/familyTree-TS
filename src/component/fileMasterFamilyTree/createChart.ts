// src/createChart.ts
import d3 from './d3';
import fmFamilyTree, { handlers } from './index';
import editTree from './CreateTree/editTree';
import {
  Person,
  CreateChartInterface,
  CreateChartOptions,
  Store,
  CardInterface,
  TreePerson,
} from './types';

export default function createChart(
  cont: HTMLElement | string,
  data: Person[]
): CreateChartInterface {
  return new CreateChart(cont, data);
}

class CreateChart implements CreateChartInterface {
  cont: HTMLElement | null = null;
  store: Store | null = null;
  svg: SVGSVGElement | null = null;
  getCard: (() => (d: TreePerson) => void) | null = null;
  node_separation: number = 250;
  level_separation: number = 150;
  is_horizontal: boolean = false;
  single_parent_empty_card: boolean = true;
  transition_time: number = 2000;
  is_card_html: boolean = false;
  beforeUpdate: ((props?: any) => void) | null = null;
  afterUpdate: ((props?: any) => void) | null = null;
  editTreeInstance?: any;

  constructor(cont: HTMLElement | string, data: Person[]) {
    this.init(cont, data);
    return this;
  }

  init(cont: HTMLElement | string, data: Person[]): void {
    this.cont = cont = setCont(cont);

    const getSvgView = () => cont.querySelector('svg .view') as SVGElement;
    const getHtmlSvg = () => cont.querySelector('#htmlSvg') as HTMLDivElement;
    const getHtmlView = () =>
      cont.querySelector('#htmlSvg .cards_view') as HTMLDivElement;

    this.svg = fmFamilyTree.createSvg(cont, {
      onZoom: fmFamilyTree.htmlHandlers.onZoomSetup(getSvgView, getHtmlView),
    });

    fmFamilyTree.htmlHandlers.createHtmlSvg(cont);

    this.store = fmFamilyTree.createStore({
      data,
      node_separation: this.node_separation,
      level_separation: this.level_separation,
      single_parent_empty_card: this.single_parent_empty_card,
      is_horizontal: this.is_horizontal,
    });

    this.setCard(fmFamilyTree.CardSvg); // set default card

    this.store.setOnUpdate(props => {
      if (this.beforeUpdate) {
        this.beforeUpdate(props);
      }
      props = Object.assign(
        { transition_time: this.transition_time },
        props || {}
      );

      if (this.is_card_html) {
        props = Object.assign({}, props || {}, { cardHtml: getHtmlSvg() });
      }

      const tree = this.store?.getTree();
      if (tree && this.svg && this.getCard) {
        fmFamilyTree.view(tree, this.svg, this.getCard(), props || {});
      }

      if (this.afterUpdate) {
        this.afterUpdate(props);
      }
    });
  }

  updateTree(props: { initial?: boolean } = {}): CreateChartInterface {
    this.store?.updateTree(props);
    return this;
  }

  updateData(data: Person[]): CreateChartInterface {
    this.store?.updateData(data);
    return this;
  }

  setCardYSpacing(card_y_spacing: number): CreateChartInterface {
    if (typeof card_y_spacing !== 'number') {
      console.error('card_y_spacing must be a number');
      return this;
    }
    this.level_separation = card_y_spacing;
    if (this.store) {
      this.store.state.level_separation = card_y_spacing;
    }
    return this;
  }

  setCardXSpacing(card_x_spacing: number): CreateChartInterface {
    if (typeof card_x_spacing !== 'number') {
      console.error('card_x_spacing must be a number');
      return this;
    }
    this.node_separation = card_x_spacing;
    if (this.store) {
      this.store.state.node_separation = card_x_spacing;
    }
    return this;
  }

  setOrientationVertical(): CreateChartInterface {
    this.is_horizontal = false;
    if (this.store) {
      this.store.state.is_horizontal = false;
    }
    return this;
  }

  setOrientationHorizontal(): CreateChartInterface {
    this.is_horizontal = true;
    if (this.store) {
      this.store.state.is_horizontal = true;
    }
    return this;
  }

  setSingleParentEmptyCard(
    single_parent_empty_card: boolean,
    { label = 'Unknown' }: { label?: string } = {}
  ): CreateChartInterface {
    this.single_parent_empty_card = single_parent_empty_card;

    if (this.store) {
      this.store.state.single_parent_empty_card = single_parent_empty_card;
      this.store.state.single_parent_empty_card_label = label;
    }

    if (
      this.editTreeInstance &&
      this.editTreeInstance.addRelativeInstance.is_active
    ) {
      this.editTreeInstance.addRelativeInstance.onCancel();
    }

    if (this.store) {
      handlers.removeToAddFromData(this.store.getData() || []);
    }

    return this;
  }

  setCard<T extends CardInterface>(
    Card: (cont: HTMLElement, store: Store) => T
  ): T {
    if (!this.cont || !this.store) {
      throw new Error('Chart not properly initialized');
    }

    this.is_card_html = !!Card.is_html;

    if (this.is_card_html) {
      const cardsView = this.svg?.querySelector('.cards_view');
      if (cardsView) {
        cardsView.innerHTML = '';
      }

      const htmlSvg = this.cont.querySelector('#htmlSvg') as HTMLElement;
      if (htmlSvg) {
        htmlSvg.style.display = 'block';
      }
    } else {
      const htmlCardsView = this.cont.querySelector('#htmlSvg .cards_view');
      if (htmlCardsView) {
        htmlCardsView.innerHTML = '';
      }

      const htmlSvg = this.cont.querySelector('#htmlSvg');
      if (htmlSvg) {
        htmlSvg.style.display = 'none';
      }
    }

    const card = Card(this.cont, this.store);
    this.getCard = () => card.getCard();

    return card;
  }

  setTransitionTime(transition_time: number): CreateChartInterface {
    this.transition_time = transition_time;
    return this;
  }

  editTree(): any {
    if (!this.cont || !this.store) {
      throw new Error('Chart not properly initialized');
    }
    return (this.editTreeInstance = editTree(this.cont, this.store));
  }

  updateMain(d: TreePerson): CreateChartInterface {
    if (this.store) {
      this.store.updateMainId(d.data.id);
      this.store.updateTree({});
    }
    return this;
  }

  updateMainId(id: string): CreateChartInterface {
    if (this.store) {
      this.store.updateMainId(id);
    }
    return this;
  }

  getMainDatum(): Person | undefined {
    return this.store?.getMainDatum();
  }

  getDataJson(): string {
    if (!this.store) {
      return '[]';
    }

    const data = this.store.getData();
    return handlers.cleanupDataJson(JSON.stringify(data));
  }

  setBeforeUpdate(fn: (props?: any) => void): CreateChartInterface {
    this.beforeUpdate = fn;
    return this;
  }

  setAfterUpdate(fn: (props?: any) => void): CreateChartInterface {
    this.afterUpdate = fn;
    return this;
  }
}

function setCont(cont: HTMLElement | string): HTMLElement {
  if (typeof cont === 'string') {
    const element = document.querySelector(cont);
    if (!element) {
      throw new Error(`Container element not found: ${cont}`);
    }
    return element as HTMLElement;
  }
  return cont;
}
