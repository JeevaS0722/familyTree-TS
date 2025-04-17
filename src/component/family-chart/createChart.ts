import f3 from './index';
import editTree from './CreateTree/editTree';
import {
  Card,
  ChartUpdateProps,
  Datum,
  EditTreeInstance,
  Store,
} from './types';

export default function createChart(
  cont: HTMLElement | string,
  data: Datum[]
): CreateChart {
  return new CreateChart(cont, data);
}

class CreateChart {
  public cont: HTMLElement;
  public store: Store;
  public svg: SVGElement;
  public getCard: () => any;
  public node_separation: number = 250;
  public level_separation: number = 150;
  public is_horizontal: boolean = false;
  public single_parent_empty_card: boolean = true;
  public transition_time: number = 2000;
  public is_card_html: boolean = false;
  public beforeUpdate: ((props: any) => void) | null = null;
  public afterUpdate: ((props: any) => void) | null = null;
  public editTreeInstance?: EditTreeInstance;

  constructor(cont: HTMLElement | string, data: Datum[]) {
    this.init(cont, data);
  }

  init(cont: HTMLElement | string, data: Datum[]): void {
    this.cont = setCont(cont);
    const getSvgView = (): Element | null =>
      this.cont.querySelector('svg .view');
    const getHtmlSvg = (): HTMLElement | null =>
      this.cont.querySelector('#htmlSvg');
    const getHtmlView = (): HTMLElement | null =>
      this.cont.querySelector('#htmlSvg .cards_view');

    this.svg = f3.createSvg(this.cont, {
      onZoom: f3.htmlHandlers.onZoomSetup(getSvgView, getHtmlView),
    });
    f3.htmlHandlers.createHtmlSvg(this.cont);

    this.store = f3.createStore({
      data,
      node_separation: this.node_separation,
      level_separation: this.level_separation,
      single_parent_empty_card: this.single_parent_empty_card,
      is_horizontal: this.is_horizontal,
    });

    this.setCard(f3.CardHtml); // set default card

    this.store.setOnUpdate((props: any) => {
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
      f3.view(this.store.getTree()!, this.svg, this.getCard(), props || {});
      if (this.afterUpdate) {
        this.afterUpdate(props);
      }
    });
  }

  updateTree(props: ChartUpdateProps = { initial: false }): this {
    this.store.updateTree(props);
    return this;
  }

  updateData(data: Datum[]): this {
    this.store.updateData(data);
    return this;
  }

  setCardYSpacing(card_y_spacing: number): this {
    if (typeof card_y_spacing !== 'number') {
      console.error('card_y_spacing must be a number');
      return this;
    }
    this.level_separation = card_y_spacing;
    this.store.state.level_separation = card_y_spacing;
    return this;
  }

  setCardXSpacing(card_x_spacing: number): this {
    if (typeof card_x_spacing !== 'number') {
      console.error('card_x_spacing must be a number');
      return this;
    }
    this.node_separation = card_x_spacing;
    this.store.state.node_separation = card_x_spacing;
    return this;
  }

  setOrientationVertical(): this {
    this.is_horizontal = false;
    this.store.state.is_horizontal = false;
    return this;
  }

  setOrientationHorizontal(): this {
    this.is_horizontal = true;
    this.store.state.is_horizontal = true;
    return this;
  }

  setSingleParentEmptyCard(
    single_parent_empty_card: boolean,
    options: { label?: string } = {}
  ): this {
    this.single_parent_empty_card = single_parent_empty_card;
    this.store.state.single_parent_empty_card = single_parent_empty_card;
    this.store.state.single_parent_empty_card_label =
      options.label || 'Unknown';
    if (
      this.editTreeInstance &&
      this.editTreeInstance.addRelativeInstance.is_active
    ) {
      this.editTreeInstance.addRelativeInstance.onCancel();
    }
    f3.handlers.removeToAddFromData(this.store.getData() || []);
    return this;
  }

  setCard(Card: any): Card {
    this.is_card_html = Card.is_html;

    if (this.is_card_html) {
      if (this.svg) {
        const viewSelector = this.svg.querySelector('.cards_view');
        if (viewSelector) {
          viewSelector.innerHTML = '';
        }
      }
      const htmlSvg = this.cont.querySelector('#htmlSvg');
      if (htmlSvg) {
        htmlSvg.style.display = 'block';
      }
    } else {
      const htmlView = this.cont.querySelector('#htmlSvg .cards_view');
      if (htmlView) {
        htmlView.innerHTML = '';
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

  setTransitionTime(transition_time: number): this {
    this.transition_time = transition_time;
    return this;
  }

  editTree(): EditTreeInstance {
    return (this.editTreeInstance = editTree(this.cont, this.store));
  }

  updateMain(d: { data: { id: string } }): this {
    this.store.updateMainId(d.data.id);
    this.store.updateTree({});
    return this;
  }

  updateMainId(id: string): this {
    this.store.updateMainId(id);
    return this;
  }

  getMainDatum(): Datum | undefined {
    return this.store.getMainDatum();
  }

  getDataJson(): string {
    const data = this.store.getData();
    return f3.handlers.cleanupDataJson(JSON.stringify(data));
  }

  setBeforeUpdate(fn: (props: any) => void): this {
    this.beforeUpdate = fn;
    return this;
  }

  setAfterUpdate(fn: (props: any) => void): this {
    this.afterUpdate = fn;
    return this;
  }
}

function setCont(cont: HTMLElement | string): HTMLElement {
  if (typeof cont === 'string') {
    return document.querySelector(cont) as HTMLElement;
  }
  return cont;
}
