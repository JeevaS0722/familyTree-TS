// src/component/FamilyTree/components/FamilyTree/Link.tsx
import React, { useRef, useEffect, memo } from 'react';
import * as d3 from 'd3';
import { TreeLink, TreeNode } from '../types/familyTree';
import { calculateAnimationDelay } from '../utils/animationUtils';

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

  const createPathData = (points: [number, number][]) => {
    try {
      const line = link.curve
        ? d3.line().curve(d3.curveBasis)
        : d3.line().curve(d3.curveMonotoneY);
      return line(points) || '';
    } catch (e) {
      return '';
    }
  };

  const getFinalPathData = () => {
    if (Array.isArray(link.d)) {
      return createPathData(link.d);
    } else if (typeof link.d === 'function') {
      return createPathData(link.d(link, 0));
    }
    return '';
  };

  const getInitialPathData = () => {
    if (typeof link._d === 'function') {
      return createPathData(link._d());
    }
    return getFinalPathData();
  };

  useEffect(() => {
    if (!linkRef.current) {
      return;
    }

    const path = d3.select(linkRef.current);
    const finalPathData = getFinalPathData();
    const initialPathData = getInitialPathData();

    const delay = initialRender
      ? calculateAnimationDelay(
          Array.isArray(link.source) ? link.source[0] : link.source,
          transitionTime,
          treeData
        )
      : 0;

    path.interrupt();

    if (!animationStarted.current && initialPathData !== finalPathData) {
      path.attr('d', initialPathData).style('opacity', 0);
    }

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

  const isSingleParentLink = link.is_single_parent === true;

  return (
    <path
      ref={linkRef}
      className={`link ${link.spouse ? 'spouse-link' : ''} 
                 ${link.is_ancestry ? 'ancestry-link' : ''} 
                 ${isSingleParentLink ? 'single-parent-link' : ''}`}
      fill="none"
      stroke="#fff"
      strokeWidth={1}
      data-link-id={link.id}
    />
  );
};

export default memo(Link);
