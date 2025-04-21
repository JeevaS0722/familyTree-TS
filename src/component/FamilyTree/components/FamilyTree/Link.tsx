// src/component/FamilyTree/components/FamilyTree/Link.tsx
import React, { useRef, useEffect, memo } from 'react';
import * as d3 from 'd3';
import { TreeLink } from '../../types/familyTree';
import { calculateAnimationDelay } from '../../utils/animationUtils';

interface LinkProps {
  link: TreeLink;
  transitionTime: number;
  treeData: TreeNode[];
  initialRender: boolean;
}

const Link: React.FC<LinkProps> = ({
  link,
  transitionTime,
  treeData,
  initialRender,
}) => {
  const linkRef = useRef<SVGPathElement>(null);
  const animationStarted = useRef(false);

  // Create path with proper curve interpolation
  const createPathData = (points: [number, number][]) => {
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

  // Get the final path data
  const getFinalPathData = () => {
    if (Array.isArray(link.d)) {
      return createPathData(link.d);
    } else if (typeof link.d === 'function') {
      return createPathData(link.d(link, 0));
    }
    return '';
  };

  // Get the initial (entry/exit) path data
  const getInitialPathData = () => {
    if (typeof link._d === 'function') {
      return createPathData(link._d());
    }
    return getFinalPathData();
  };

  // Handle animation
  useEffect(() => {
    if (!linkRef.current) {
      return;
    }

    const path = d3.select(linkRef.current);
    const finalPathData = getFinalPathData();
    const initialPathData = getInitialPathData();

    // Calculate delay - use same logic as nodes for synchronization
    const delay = initialRender
      ? calculateAnimationDelay(
          Array.isArray(link.source) ? link.source[0] : link.source,
          transitionTime,
          treeData
        )
      : 0;

    // Interrupt any ongoing animations
    path.interrupt();

    // Set initial path data if not yet animated
    if (!animationStarted.current && initialPathData !== finalPathData) {
      path.attr('d', initialPathData).style('opacity', 0);
    }

    // Animate to final path
    path
      .transition()
      .duration(transitionTime)
      .delay(delay)
      .attr('d', finalPathData)
      .style('opacity', 1)
      .on('start', () => {
        animationStarted.current = true;
      });

    return () => {
      path.interrupt();
    };
  }, [link, transitionTime, treeData, initialRender]);

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
