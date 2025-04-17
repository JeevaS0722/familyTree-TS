import React, { useEffect, useRef, useState } from 'react';
import FamilyChart from '../index';
import { Datum, StoreState, TreeNode } from '../types';
import '../styles/family-chart.css';

interface FamilyTreeProps extends Omit<StoreState, 'tree'> {
  width?: number | string;
  height?: number | string;
  onPersonClick?: (person: Datum) => void;
  renderCard?: (person: Datum) => React.ReactNode;
  className?: string;
  customClassNames?: string;
  cardWidth?: number;
  cardHeight?: number;
  // Filemaster card specific props
  relationshipTitle?: string;
  divisionTitle?: string;
  showIcons?: boolean;
}

const FamilyTreeComponent: React.FC<FamilyTreeProps> = ({
  data,
  main_id,
  node_separation = 250,
  level_separation = 180, // Increased default level separation for taller cards
  is_horizontal = false,
  single_parent_empty_card = false,
  single_parent_empty_card_label = 'Unknown',
  width = 1000,
  height = 600,
  onPersonClick,
  renderCard,
  className = '',
  customClassNames = '',
  cardWidth = 320,
  cardHeight = 150,
  relationshipTitle = 'Relationship to file',
  divisionTitle = 'Division of Interest',
  showIcons = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<any>(null);

  // Initialize chart with all dependencies
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // Create chart container
    const container = containerRef.current;
    container.innerHTML = '';

    // Initialize the family chart
    const newChart = FamilyChart.createChart(container, data);

    // Configure chart with provided props
    newChart.setCardXSpacing(node_separation).setCardYSpacing(level_separation);

    if (is_horizontal) {
      newChart.setOrientationHorizontal();
    } else {
      newChart.setOrientationVertical();
    }

    newChart.setSingleParentEmptyCard(single_parent_empty_card, {
      label: single_parent_empty_card_label,
    });

    // Always use HTML card for better styling options
    const card = newChart.setCard(FamilyChart.CardHtml);
    // Set a custom card renderer
    card.setCustomCardRenderer((d: TreeNode) => {
      console.log('Custom card renderer called with data:', d);
      // Access any data from the node
      const name = d.data.data.name || 'Unknown';

      // Return your custom HTML
      return `
    <div class="card-inner my-custom-card">
      <h3>${name}</h3>
      <div class="custom-content">
        <!-- Your custom content here -->
        <p>This is a completely custom card</p>
      </div>
    </div>
  `;
    });

    // Apply path to main hover effect
    card.setOnHoverPathToMain();

    // Apply custom classes if provided
    if (customClassNames) {
      card.setCustomClassNames(customClassNames);
    }

    // Set filemaster specific options
    card.setRelationshipTitle(relationshipTitle);
    card.setDivisionTitle(divisionTitle);
    card.setShowIcons(showIcons);

    // Apply custom card dimensions if provided
    if (cardWidth || cardHeight) {
      const cardDimensions: Record<string, number> = {};
      if (cardWidth) {
        cardDimensions.width = cardWidth;
      }
      if (cardHeight) {
        cardDimensions.height = cardHeight;
      }
      card.setCardDim(cardDimensions);
    }

    // Set mini tree option (whether to show mini tree icon for navigation)
    card.setMiniTree(false); // Turn off mini tree for filemaster style

    // Set custom card display if renderCard is provided
    if (renderCard) {
      card.setCardDisplay((d: Datum) => {
        // Add safety checks to prevent accessing properties of undefined
        if (!d || !d.data) {
          return 'Unknown';
        }

        try {
          // Convert React component to string representation
          // This is a simplified approach - for complex React components
          // a different strategy would be needed
          const content = renderCard(d);
          if (typeof content === 'string') {
            return content;
          }

          // For non-string content, use default person data format
          return '';
        } catch (error) {
          console.error('Error rendering custom card:', error);
          return 'Error';
        }
      });
    }

    // Set custom click handler if onPersonClick is provided
    if (onPersonClick) {
      card.setOnCardClick((e: Event, d: any) => {
        if (d && d.data) {
          onPersonClick(d.data);
          newChart.updateMain(d); // Update main person as well
        }
      });
    }

    // Set main if provided
    if (main_id) {
      newChart.updateMainId(main_id);
    }

    // Initial update
    newChart.updateTree({ initial: true });

    setChart(newChart);

    // Cleanup function
    return () => {
      container.innerHTML = '';
    };
  }, [
    data,
    main_id,
    node_separation,
    level_separation,
    is_horizontal,
    single_parent_empty_card,
    single_parent_empty_card_label,
    onPersonClick,
    renderCard,
    customClassNames,
    cardWidth,
    cardHeight,
    relationshipTitle,
    divisionTitle,
    showIcons,
  ]);

  // Convert width/height to pixels if they're strings
  const widthPx = typeof width === 'string' ? width : `${width}px`;
  const heightPx = typeof height === 'string' ? height : `${height}px`;

  return (
    <div
      id="FamilyChart"
      ref={containerRef}
      className={`f3 ${className}`}
      style={{
        width: widthPx,
        height: heightPx,
      }}
    />
  );
};

export default FamilyTreeComponent;
