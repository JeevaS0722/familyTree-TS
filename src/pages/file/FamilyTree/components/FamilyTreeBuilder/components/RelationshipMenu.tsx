// src/pages/file/FamilyTree/components/CircularMenu.tsx
import React, { useEffect, useState } from 'react';
import { TreeNode } from '../types/familyTree';

interface CircularMenuProps {
  node: TreeNode;
  position: { x: number; y: number };
  existingFamilyMembers: TreeNode[];
  onAddRelative: (relationType: string) => void;
  onClose: () => void;
}

const CircularMenu: React.FC<CircularMenuProps> = ({
  node,
  position,
  onAddRelative,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRadius = 160; // Radius of the circular menu
  const buttonRadius = 40; // Radius of each button
  const hasFather = !!node.data.rels.father;
  const hasMother = !!node.data.rels.mother;

  // Open the menu with animation after mounting
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.circular-menu') && !target.closest('.card_cont')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Calculate positions for each menu item on the circle
  const getItemPosition = (index: number, total: number) => {
    const firstAngle = -90; // Start from the top
    // Adjust the angle range based on number of items (if we have fewer items, use a smaller arc)
    const angleRange = Math.min(180, total * 40);
    const angleStep = angleRange / (total - 1);

    const angle = firstAngle - angleRange / 2 + index * angleStep;
    const radians = (angle * Math.PI) / 180;

    return {
      left: menuRadius * Math.cos(radians),
      top: menuRadius * Math.sin(radians),
    };
  };

  // Filter options based on existing relationships
  const menuItems = [
    { type: 'father', label: 'Add Father', color: '#7EADFF', show: !hasFather },
    { type: 'mother', label: 'Add Mother', color: '#FF96BC', show: !hasMother },
    { type: 'spouse', label: 'Add Spouse', color: '#FF96BC', show: true },
    { type: 'son', label: 'Add Son', color: '#7EADFF', show: true },
    { type: 'daughter', label: 'Add Daughter', color: '#FF96BC', show: true },
  ].filter(item => item.show);

  // Calculate container position
  // Position centered on the right side of the card
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x - 160}px`,
    top: `${position.y - 215}px`,
    width: `${menuRadius * 2}px`,
    height: `${menuRadius * 2}px`,
    zIndex: 1000,
    pointerEvents: 'none', // Don't block other interactions
  };

  // Main blue circle background
  const circleStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${menuRadius * 2}px`,
    height: `${menuRadius * 2}px`,
    borderRadius: '50%',
    backgroundColor: '#1976d2',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
    transform: isOpen ? 'scale(1)' : 'scale(0)',
    opacity: isOpen ? 1 : 0,
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
    pointerEvents: 'auto',
  };

  // Close button in the center of the circle
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1976d2',
    fontSize: '30px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    pointerEvents: 'auto',
  };

  return (
    <div className="circular-menu" style={containerStyle}>
      {/* Main circle background */}
      <div style={circleStyle}></div>

      {/* Menu items positioned in an arc */}
      {menuItems.map((item, index) => {
        const pos = getItemPosition(index, menuItems.length);

        // Menu item button style
        const itemStyle: React.CSSProperties = {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: isOpen
            ? `translate(calc(-50% + ${pos.left}px), calc(-50% + ${pos.top}px))`
            : 'translate(-50%, -50%)',
          width: `${buttonRadius * 2}px`,
          height: `${buttonRadius * 2}px`,
          borderRadius: '50%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isOpen ? 1 : 0,
          pointerEvents: 'auto',
          transition: `transform 0.3s ease-out ${0.05 * index}s, opacity 0.3s ease-out ${0.05 * index}s`,
          cursor: 'pointer',
          zIndex: 1001,
        };

        // Text label style
        const labelStyle: React.CSSProperties = {
          position: 'absolute',
          left: '50%',
          top: '120%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        };

        return (
          <div
            key={item.type}
            style={itemStyle}
            onClick={() => {
              onAddRelative(item.type);
            }}
          >
            <span
              style={{
                color: item.color,
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              +
            </span>
            <div style={labelStyle}>{item.label}</div>
          </div>
        );
      })}

      {/* Close button */}
      <div style={closeButtonStyle} onClick={onClose}>
        ✕
      </div>
    </div>
  );
};

export default CircularMenu;
