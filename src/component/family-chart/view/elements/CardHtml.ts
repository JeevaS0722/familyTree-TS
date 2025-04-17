import d3 from '../../d3';
import { miniTreeSvgIcon } from './Card.icons';
import { TreeNode, CardDimensions } from '../../types';

interface CardHtmlParams {
  store?: any;
  onCardClick: (e: Event, d: TreeNode) => void;
  mini_tree?: boolean;
  onCardUpdate?: ((d: TreeNode) => void) | null;
  card_dim?: CardDimensions;
  onCardMouseenter?: ((e: Event, d: TreeNode) => void) | null;
  onCardMouseleave?: ((e: Event, d: TreeNode) => void) | null;
  relationshipTitle?: string;
  divisionTitle?: string;
  showIcons?: boolean;
  // Add new custom renderer prop
  customCardRenderer?: (d: TreeNode) => string;
}

export function CardHtml(
  props: CardHtmlParams
): (this: HTMLElement, d: TreeNode) => void {
  // Choose the card renderer based on props
  const cardInner = (d: TreeNode): string => {
    // If a custom renderer is provided, use it
    if (props.customCardRenderer) {
      return props.customCardRenderer(d);
    }
    // Otherwise use the default filemaster card
    return getCardInnerFilemaster(d);
  };

  return function (this: HTMLElement, d: TreeNode): void {
    this.innerHTML = `
    <div class="card ${getClassList(d).join(' ')}" data-id="${d.data.id}" style="transform: translate(-50%, -50%); pointer-events: auto;">
      ${props.mini_tree ? getMiniTree(d) : ''}
      ${cardInner(d)}
    </div>
    `;

    const cardElement = this.querySelector('.card') as HTMLElement;

    if (cardElement) {
      // Remove previous event listeners to prevent duplicates
      const newCard = cardElement.cloneNode(true);
      if (cardElement.parentNode) {
        cardElement.parentNode.replaceChild(newCard, cardElement);
      }

      // Add click event
      newCard.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        props.onCardClick(e, d);
      });
    }

    if (props.onCardUpdate) {
      props.onCardUpdate.call(this, d);
    }

    if (props.onCardMouseenter) {
      d3.select(this)
        .select('.card')
        .on('mouseenter', (e: Event) => {
          if (props.onCardMouseenter) {
            props.onCardMouseenter(e, d);
          }
        });
    }

    if (props.onCardMouseleave) {
      d3.select(this)
        .select('.card')
        .on('mouseleave', (e: Event) => {
          if (props.onCardMouseleave) {
            props.onCardMouseleave(e, d);
          }
        });
    }
  };

  function getCardInnerFilemaster(d: TreeNode): string {
    const relationshipTitle = props.relationshipTitle || 'Relationship to file';
    const divisionTitle = props.divisionTitle || 'Division of Interest';
    const fileName = d.data.data.name || 'File Name';
    const age = d.data.data.age || '00';
    const birth = d.data.data.birth || '00/00/00';
    const death = d.data.data.death || '00/00/00';
    const address =
      d.data.data.address || 'Lorem ipsum dolor sit amet consectetur.';
    const interest = d.data.data.interest || '0.000 %';

    return `
    <div class="card-inner card-filemaster" ${getCardStyle()}>
      <div class="card-header">
        <div class="card-relationship">${relationshipTitle}</div>
        <div class="card-filename">
          <span>${fileName}</span>
          <span class="chevron-right">&#8250;</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-info">
          <div class="info-row"><span class="info-label">Age:</span> <span class="info-value">${age}</span></div>
          <div class="info-row"><span class="info-label">Birth:</span> <span class="info-value">${birth}</span></div>
          <div class="info-row"><span class="info-label">Death:</span> <span class="info-value">${death}</span></div>
          <div class="info-row"><span class="info-label">Address:</span> <span class="info-value address">${address}</span></div>
        </div>
        <div class="card-actions">
          <div class="division-section">
            <div class="division-title">${divisionTitle}</div>
            <div class="division-value">
              <span>${interest}</span>
              <span class="chevron-right">&#8250;</span>
            </div>
          </div>
          ${
            props.showIcons !== false
              ? `
          <div class="action-icons">
            <div class="icon money-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="green"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="14">$</text>
              </svg>
            </div>
            <div class="icon doc-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="2" width="16" height="20" rx="2" fill="#333"/>
                <line x1="8" y1="7" x2="16" y2="7" stroke="white" stroke-width="1.5"/>
                <line x1="8" y1="12" x2="16" y2="12" stroke="white" stroke-width="1.5"/>
                <line x1="8" y1="17" x2="12" y2="17" stroke="white" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="icon contract-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="#555"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">$</text>
              </svg>
            </div>
          </div>
          `
              : ''
          }
        </div>
      </div>
    </div>
    `;
  }

  function getMiniTree(d: TreeNode): string {
    if (!props.mini_tree) {
      return '';
    }
    if (d.data.to_add) {
      return '';
    }
    if (d.data._new_rel_data) {
      return '';
    }
    if (d.all_rels_displayed) {
      return '';
    }
    return `<div class="mini-tree">${miniTreeSvgIcon()}</div>`;
  }

  function cardInnerFilemaster(d: TreeNode): string {
    return getCardInnerFilemaster(d);
  }

  function getClassList(d: TreeNode): string[] {
    const class_list: string[] = [];
    if (d.data.data.gender === 'M') {
      class_list.push('card-male');
    } else if (d.data.data.gender === 'F') {
      class_list.push('card-female');
    } else {
      class_list.push('card-genderless');
    }

    if (d.data.main) {
      class_list.push('card-main');
    }
    if (d.data._new_rel_data) {
      class_list.push('card-new-rel');
    }
    if (d.data.to_add) {
      class_list.push('card-to-add');
    }

    return class_list;
  }

  function getCardStyle(): string {
    let style = 'style="';
    if (props.card_dim?.w || props.card_dim?.h) {
      style += `width: ${props.card_dim.w}px; min-height: ${props.card_dim.h}px;`;
      if (props.card_dim.height_auto) {
        style += 'height: auto;';
      } else {
        style += `height: ${props.card_dim.h}px;`;
      }
    } else {
      return '';
    }
    style += '"';
    return style;
  }
}
