// src/view/elements/Link.ts
import d3 from '../../d3';
import { LinkData } from '../../types';

interface LinkProps {
  d: LinkData;
  entering?: boolean;
  exiting?: boolean;
}

export default function Link({ d, entering, exiting }: LinkProps): {
  template: string;
} {
  const path = createPath(d, entering, exiting);

  return {
    template: `
      <path d="${path}" fill="none" stroke="#fff" />
    `,
  };
}

export function createPath(d: LinkData, is_?: boolean): string {
  const line = d3.line().curve(d3.curveMonotoneY);
  const lineCurve = d3.line().curve(d3.curveBasis);
  const path_data = is_ ? d._d() : d.d;

  if (!d.curve) {
    return line(path_data);
  } else if (d.curve === true) {
    return lineCurve(path_data);
  }

  return '';
}
