// src/view/view.svg.ts
import d3 from '../d3';

interface CreateSvgProps {
  onZoom?: (event: d3.D3ZoomEvent<Element, unknown>) => void;
  zoom_polite?: boolean;
}

declare module 'd3' {
  interface Selection<
    GElement extends d3.BaseType,
    Datum,
    PElement extends d3.BaseType,
    PDatum,
  > {
    call<T extends d3.Selection<GElement, Datum, PElement, PDatum>>(
      fn: (selection: T, ...args: any[]) => void,
      ...args: any[]
    ): T;
  }
}

export default function createSvg(
  cont: HTMLElement,
  props: CreateSvgProps = {}
): SVGSVGElement {
  const svg_dim = cont.getBoundingClientRect();
  const svg_html = `
    <svg class="main_svg">
      <rect width="${svg_dim.width}" height="${svg_dim.height}" fill="transparent" />
      <g class="view">
        <g class="links_view"></g>
        <g class="cards_view"></g>
      </g>
      <g style="transform: translate(100%, 100%)">
        <g class="fit_screen_icon cursor-pointer" style="transform: translate(-50px, -50px); display: none">
          <rect width="27" height="27" stroke-dasharray="${27 / 2}" stroke-dashoffset="${27 / 4}" 
            style="stroke:#fff;stroke-width:4px;fill:transparent;"/>
          <circle r="5" cx="${27 / 2}" cy="${27 / 2}" style="fill:#fff" />          
        </g>
      </g>
    </svg>
  `;

  const f3Canvas = getOrCreateF3Canvas(cont);

  const temp_div = d3.create('div').node();

  if (temp_div) {
    temp_div.innerHTML = svg_html;
    const svg = temp_div.querySelector('svg');

    if (svg) {
      f3Canvas.appendChild(svg);
      cont.appendChild(f3Canvas);
      setupZoom(svg, props);
      return svg;
    }
  }

  throw new Error('Failed to create SVG element');

  function getOrCreateF3Canvas(cont: HTMLElement): HTMLDivElement {
    let f3Canvas = cont.querySelector('#f3Canvas') as HTMLDivElement;

    if (!f3Canvas) {
      f3Canvas = d3
        .create('div')
        .attr('id', 'f3Canvas')
        .attr(
          'style',
          'position: relative; overflow: hidden; width: 100%; height: 100%;'
        )
        .node() as HTMLDivElement;
    }

    return f3Canvas;
  }
}

function setupZoom(el: SVGSVGElement, props: CreateSvgProps = {}): void {
  if ((el as any).__zoom) {
    return;
  }

  const view = el.querySelector('.view') as SVGGElement;
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .on('zoom', props.onZoom || zoomed);

  d3.select(el).call(zoom);
  (el as any).__zoomObj = zoom;

  if (props.zoom_polite) {
    zoom.filter(zoomFilter);
  }

  function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>): void {
    d3.select(view).attr('transform', event.transform.toString());
  }

  function zoomFilter(event: any): boolean {
    if (event.type === 'wheel' && !event.ctrlKey) {
      return false;
    } else if (event.touches && event.touches.length < 2) {
      return false;
    } else {
      return true;
    }
  }
}
