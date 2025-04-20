// src/components/FamilyTree/Card.tsx
import React, { useRef, useEffect, memo, useCallback } from 'react';
import * as d3 from 'd3';
import { TreeNode, CardDimensions, PersonData } from '../../types/familyTree';

interface CardProps {
  node: TreeNode;
  cardDimensions: CardDimensions;
  showMiniTree: boolean;
  transitionTime: number;
  onClick?: (node: TreeNode) => void;
  onEdit?: (person: PersonData) => void;
  onMouseEnter?: (node: TreeNode) => void;
  onMouseLeave?: (node: TreeNode) => void;
}

const Card: React.FC<CardProps> = ({
  node,
  cardDimensions,
  showMiniTree,
  transitionTime,
  onClick,
  onEdit,
  onMouseEnter,
  onMouseLeave,
}) => {
  const cardRef = useRef<SVGGElement>(null);
  const entering = !!node._x;
  const exiting = !!node.exiting;

  function calculateDelay(node: TreeNode, transitionTime: number): number {
    // Adapt the original delay calculation
    const delay_level = transitionTime * 0.4;
    let delay = node.depth * delay_level;

    if ((node.depth !== 0 || !!node.spouse) && !node.is_ancestry) {
      // Calculate delay using ancestry levels
      const ancestry_levels = 3; // Default value - in real code get from tree data
      delay += ancestry_levels * delay_level;
      if (node.spouse) {
        delay += delay_level;
      }
      delay += node.depth * delay_level;
    }

    return delay;
  }

  // Handle card animation
  useEffect(() => {
    if (!cardRef.current) {
      return;
    }

    const cardElement = d3.select(cardRef.current);

    // Calculate delay based on depth exactly as in original
    const delay = calculateDelay(node, transitionTime);

    if (entering || exiting) {
      // Entry or exit animation
      const startX = entering ? node._x! : node.x;
      const startY = entering ? node._y! : node.y;
      const endX = entering ? node.x : node._x!;
      const endY = entering ? node.y : node._y!;

      cardElement
        .attr('transform', `translate(${startX}, ${startY})`)
        .style('opacity', entering ? 0 : 1)
        .transition()
        .duration(transitionTime)
        .delay(delay) // Apply delay from original code
        .attr('transform', `translate(${endX}, ${endY})`)
        .style('opacity', entering ? 1 : 0);
    } else {
      // Regular position update
      cardElement
        .transition()
        .duration(transitionTime)
        .delay(delay) // Apply delay from original code
        .attr('transform', `translate(${node.x}, ${node.y})`)
        .style('opacity', 1);
    }
  }, [node.x, node.y, node._x, node._y, transitionTime]);

  // Get gender class for styling
  const getGenderClass = () => {
    if (node.data.data.gender === 'M') {
      return 'card-male';
    }
    if (node.data.data.gender === 'F') {
      return 'card-female';
    }
    return 'card-genderless';
  };

  // Handle card click
  const handleClick = () => {
    if (onClick) {
      onClick(node);
    }
  };

  // Handle edit click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(node.data);
    }
  };

  // Display text for card
  const displayText = () => {
    const { data } = node.data;

    if (node.data.to_add) {
      return 'ADD';
    }

    if (node.data._new_rel_data) {
      return node.data._new_rel_data.label;
    }

    return `${data['first name']} ${data['last name']}`;
  };

  const handleMouseEnter = useCallback(() => {
    if (!node.data.main && onMouseEnter) {
      onMouseEnter(node);
    }
  }, [node, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    if (!node.data.main && onMouseLeave) {
      onMouseLeave(node);
    }
  }, [node, onMouseLeave]);

  return (
    <g
      ref={cardRef}
      className={`card_cont ${node.data.main ? 'card-main' : ''}`}
      transform={`translate(${node.x}, ${node.y})`}
      style={{ opacity: 0 }}
      data-id={node.data.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <g
        className={`card ${getGenderClass()}`}
        transform={`translate(${-cardDimensions.w / 2}, ${-cardDimensions.h / 2})`}
      >
        <g className="card-inner" clipPath="url(#card_clip)">
          {/* Card outline */}
          <rect
            width={cardDimensions.w}
            height={cardDimensions.h}
            rx="4"
            ry="4"
            className={`card-outline ${node.data.main ? 'card-main-outline' : ''} ${node.data._new_rel_data ? 'card-new-outline' : ''}`}
          />
          {/* Card body */}
          <g className="card-body" onClick={handleClick}>
            <rect
              width={cardDimensions.w}
              height={cardDimensions.h}
              className="card-body-rect"
            />

            {/* Card text */}
            <g className="card-text" clipPath="url(#card_text_clip)">
              <g
                transform={`translate(${cardDimensions.text_x}, ${cardDimensions.text_y})`}
              >
                <text>
                  <tspan x="0" dy="14">
                    {displayText()}
                  </tspan>
                </text>
              </g>
            </g>

            <rect
              width={cardDimensions.w - 10}
              height={cardDimensions.h}
              style={{ mask: 'url(#fade)' }}
              className="text-overflow-mask"
            />
          </g>
          {/* Card image */}
          {!node.data.to_add && !node.data._new_rel_data && (
            <g
              style={{
                transform: `translate(${cardDimensions.img_x}px, ${cardDimensions.img_y}px)`,
              }}
              className="card_image"
              clipPath="url(#card_image_clip)"
            >
              {node.data.data.avatar ? (
                <image
                  href={node.data.data.avatar}
                  height={cardDimensions.img_h}
                  width={cardDimensions.img_w}
                  preserveAspectRatio="xMidYMin slice"
                />
              ) : (
                <g className="genderless-icon">
                  <rect
                    height={cardDimensions.img_h}
                    width={cardDimensions.img_w}
                    fill="rgb(59, 85, 96)"
                  />
                  <g transform={`scale(${cardDimensions.img_w * 0.001616})`}>
                    <path
                      transform="translate(50,40)"
                      fill="lightgrey"
                      d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z"
                    />
                  </g>
                </g>
              )}
            </g>
          )}
          {/* Edit pencil icon */}
          {!node.data.to_add && !node.data._new_rel_data && onEdit && (
            <g
              transform={`translate(${cardDimensions.w - 20}, ${cardDimensions.h - 20})scale(.6)`}
              style={{ cursor: 'pointer' }}
              className="card_edit pencil_icon"
              onClick={handleEditClick}
            >
              <circle fill="rgba(0,0,0,0)" r="17" cx="8.5" cy="8.5" />
              <path
                fill="currentColor"
                transform="translate(-1.5, -1.5)"
                d="M19.082,2.123L17.749,0.79c-1.052-1.052-2.766-1.054-3.819,0L1.925,12.794c-0.06,0.06-0.104,0.135-0.127,0.216l-1.778,6.224c-0.05,0.175-0.001,0.363,0.127,0.491c0.095,0.095,0.223,0.146,0.354,0.146c0.046,0,0.092-0.006,0.137-0.02l6.224-1.778c0.082-0.023,0.156-0.066,0.216-0.127L19.082,5.942C20.134,4.89,20.134,3.176,19.082,2.123z M3.076,13.057l9.428-9.428l3.738,3.739l-9.428,9.428L3.076,13.057z M2.566,13.961l3.345,3.344l-4.683,1.339L2.566,13.961z M18.375,5.235L16.95,6.66l-3.738-3.739l1.425-1.425c0.664-0.663,1.741-0.664,2.405,0l1.333,1.333C19.038,3.493,19.038,4.572,18.375,5.235z"
              />
            </g>
          )}
          {/* Mini tree icon */}
          {showMiniTree &&
            !node.data.to_add &&
            !node.data._new_rel_data &&
            !node.all_rels_displayed && (
              <g
                className="card_family_tree"
                style={{ cursor: 'pointer' }}
                onClick={handleClick}
              >
                <rect
                  x="-31"
                  y="-25"
                  width="72"
                  height="15"
                  fill="rgba(0,0,0,0)"
                />
                <g
                  transform={`translate(${cardDimensions.w * 0.8}, 6)scale(.9)`}
                >
                  <rect
                    x="-31"
                    y="-25"
                    width="72"
                    height="15"
                    fill="rgba(0,0,0,0)"
                  />
                  <line y2="-17.5" stroke="#fff" />
                  <line x1="-20" x2="20" y1="-17.5" y2="-17.5" stroke="#fff" />
                  <rect
                    x="-31"
                    y="-25"
                    width="25"
                    height="15"
                    rx="5"
                    ry="5"
                    className="card-male"
                  />
                  <rect
                    x="6"
                    y="-25"
                    width="25"
                    height="15"
                    rx="5"
                    ry="5"
                    className="card-female"
                  />
                </g>
              </g>
            )}
        </g>
      </g>
    </g>
  );
};

export default memo(Card);
