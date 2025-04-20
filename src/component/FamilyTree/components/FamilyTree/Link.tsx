// src/components/FamilyTree/Link.tsx
import React, { useRef, useEffect, memo } from 'react';
import * as d3 from 'd3';
import { TreeLink } from '../../types/familyTree';

interface LinkProps {
  link: TreeLink;
  transitionTime: number;
}

const Link: React.FC<LinkProps> = ({ link, transitionTime }) => {
  const linkRef = useRef<SVGPathElement>(null);

  // Create path data
  const createPathData = () => {
    if (Array.isArray(link.d)) {
      // If link.d is an array of points
      return createPathFromPoints(link.d);
    } else if (typeof link.d === 'function') {
      // If link.d is a function that returns points
      return createPathFromPoints(link.d(link, 0));
    }
    return '';
  };

  // Create path from points
  const createPathFromPoints = (points: [number, number][]) => {
    const line = link.curve
      ? d3.line().curve(d3.curveBasis)
      : d3.line().curve(d3.curveMonotoneY);

    return line(points);
  };

  // Create entry/exit path data
  const createEntryExitPathData = () => {
    if (typeof link._d === 'function') {
      return createPathFromPoints(link._d());
    }
    return '';
  };

  // Handle link animation
  useEffect(() => {
    if (!linkRef.current) {
      return;
    }

    const path = d3.select(linkRef.current);
    const pathData = createPathData();
    const entryExitPathData = createEntryExitPathData();

    // Set initial path
    path.attr('d', entryExitPathData || pathData).style('opacity', 0);

    // Animate path
    path
      .transition()
      .duration(transitionTime)
      .attr('d', pathData)
      .style('opacity', 1);
  }, [link, transitionTime]);

  return (
    <path
      ref={linkRef}
      className={`link ${link.spouse ? 'spouse-link' : ''} ${link.is_ancestry ? 'ancestry-link' : ''}`}
      fill="none"
      stroke="#fff"
      strokeWidth={1}
      data-link-id={link.id}
    />
  );
};

export default memo(Link);
