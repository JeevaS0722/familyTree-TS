// src/component/FamilyTree/components/FamilyTree/Link.tsx - SIMPLIFIED VERSION
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
    try {
      if (Array.isArray(link.d)) {
        return createPathFromPoints(link.d);
      } else if (typeof link.d === 'function') {
        return createPathFromPoints(link.d(link, 0));
      }
    } catch (e) {
      console.error('Error creating path data:', e);
    }
    return '';
  };

  // Create path from points
  const createPathFromPoints = (points: [number, number][]) => {
    try {
      const line = link.curve
        ? d3.line().curve(d3.curveBasis)
        : d3.line().curve(d3.curveMonotoneY);
      return line(points) || '';
    } catch (e) {
      console.error('Error creating path line:', e);
      return '';
    }
  };

  // Create entry/exit path data
  const createEntryExitPathData = () => {
    try {
      if (typeof link._d === 'function') {
        return createPathFromPoints(link._d());
      }
    } catch (e) {
      console.error('Error creating entry/exit path:', e);
    }
    return createPathData();
  };

  // Handle link animation
  useEffect(() => {
    if (!linkRef.current) {
      return;
    }

    try {
      const path = d3.select(linkRef.current);
      const pathData = createPathData();
      const entryExitPathData = createEntryExitPathData();

      // Determine delay based on depth
      const delay = link.depth * (transitionTime * 0.3);

      // Set initial path and animate
      if (entryExitPathData !== pathData) {
        path.attr('d', entryExitPathData).style('opacity', 0);
      }

      // Simple transition without storing reference
      path
        .transition()
        .duration(transitionTime)
        .delay(delay)
        .attr('d', pathData)
        .style('opacity', 1);
    } catch (e) {
      console.error('Error setting up link animation:', e);
    }
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
