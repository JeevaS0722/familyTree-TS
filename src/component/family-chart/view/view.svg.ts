import d3 from '../d3';

interface CreateSvgProps {
  onZoom?: (e: any) => void;
  zoom_polite?: boolean;
  [key: string]: any;
}

export default function createSvg(
  cont: HTMLElement,
  props: CreateSvgProps = {}
): SVGElement {
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

  const temp_div = d3.create('div').node() as HTMLDivElement;
  temp_div.innerHTML = svg_html;
  const svg = temp_div.querySelector('svg') as SVGElement;
  f3Canvas.appendChild(svg);

  cont.appendChild(f3Canvas);

  setupZoom(f3Canvas, props);

  return svg;

  function getOrCreateF3Canvas(cont: HTMLElement): HTMLElement {
    let f3Canvas = cont.querySelector('#f3Canvas') as HTMLElement;
    if (!f3Canvas) {
      f3Canvas = d3
        .create('div')
        .attr('id', 'f3Canvas')
        .attr(
          'style',
          'position: relative; overflow: hidden; width: 100%; height: 100%;'
        )
        .node() as HTMLElement;
    }
    return f3Canvas;
  }
}

interface ZoomElement extends HTMLElement {
  __zoom?: any;
  __zoomObj?: any;
}

interface ZoomEvent {
  type?: string;
  touches?: TouchList;
  transform?: any;
  ctrlKey?: boolean;
}

function setupZoom(el: ZoomElement, props: CreateSvgProps = {}): void {
  if (el.__zoom) {
    return;
  }

  const view = el.querySelector('.view') as Element;
  const zoom = d3.zoom().on('zoom', props.onZoom || zoomed);

  d3.select(el).call(zoom);
  el.__zoomObj = zoom;

  if (props.zoom_polite) {
    zoom.filter(zoomFilter);
  }

  function zoomed(e: ZoomEvent): void {
    d3.select(view).attr('transform', e.transform);
  }

  function zoomFilter(e: ZoomEvent): boolean {
    if (e.type === 'wheel' && !e.ctrlKey) {
      return false;
    } else if (e.touches && e.touches.length < 2) {
      return false;
    } else {
      return true;
    }
  }
}
