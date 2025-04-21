/* eslint-disable complexity */
import React, { useRef, useCallback, memo, useState, useEffect } from 'react';
import { TreeNode, CardDimensions, TreeData } from '../../types/familyTree';
import { useNodeAnimation } from '../../hooks/useNodeAnimation';
import {
  useLazyGetContactNoteListQuery,
  useAddContactNoteMutation,
} from '../../../../store/Services/noteService';

interface CardProps {
  node: TreeNode;
  cardDimensions: CardDimensions;
  showMiniTree: boolean;
  transitionTime: number;
  treeData: TreeData | null;
  onClick?: (node: TreeNode) => void;
  onEdit?: (node: TreeNode) => void;
  onMouseEnter?: (node: TreeNode) => void;
  onMouseLeave?: (node: TreeNode) => void;
  onAddChild?: (node: TreeNode) => void;
  onAddPartner?: (node: TreeNode) => void;
  onDelete?: (nodeId: string) => void;
  onUpdateRelationship?: (node: TreeNode, newType: string) => void;
}

const RELATIONSHIP_OPTIONS = [
  'Primary Root',
  'Partner',
  'Child',
  'Stepchild',
  'Sibling',
  'Parent',
  'Unknown',
  'Other',
];

const NOTE_TYPES = [
  'Research Update',
  'Call',
  'Email',
  'Meeting',
  'Task',
  'Offer Sent',
  'DC Ordered',
  'Other',
];

interface Note {
  id: string;
  type: string;
  content: string;
  createdBy: string;
  createdDate: string;
}

// Inline SVG Components
const ArrowIcon: React.FC<{
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ width = 21, height = 29, style }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 21 29"
    fill="none"
    style={style}
  >
    <g filter="url(#filter0_d_337_533)">
      <path
        d="M14.7801 11.0467L7.2809 18.7736C7.21122 18.8454 7.12851 18.9023 7.03747 18.9411C6.94644 18.98 6.84887 19 6.75033 19C6.6518 19 6.55423 18.98 6.46319 18.9411C6.37216 18.9023 6.28944 18.8454 6.21977 18.7736C6.15009 18.7018 6.09482 18.6165 6.05712 18.5227C6.01941 18.4289 6 18.3284 6 18.2269C6 18.1254 6.01941 18.0248 6.05712 17.931C6.09482 17.8372 6.15009 17.752 6.21977 17.6802L13.1893 10.5L6.21977 3.31979C6.07905 3.17481 6 2.97816 6 2.77312C6 2.56807 6.07905 2.37143 6.21977 2.22644C6.36048 2.08145 6.55133 2 6.75033 2C6.94933 2 7.14018 2.08145 7.2809 2.22644L14.7801 9.95332C14.8498 10.0251 14.9051 10.1103 14.9428 10.2041C14.9806 10.2979 15 10.3985 15 10.5C15 10.6015 14.9806 10.7021 14.9428 10.7959C14.9051 10.8897 14.8498 10.9749 14.7801 11.0467Z"
        fill="black"
      />
      <path
        d="M5.50221 16.9837L5.50217 16.9838C5.34111 17.1497 5.21489 17.3451 5.12928 17.558C5.0437 17.7709 5 17.9981 5 18.2269C5 18.4556 5.04369 18.6828 5.12928 18.8957C5.21488 19.1087 5.34111 19.3041 5.50217 19.47C5.66329 19.636 5.85619 19.7694 6.07066 19.8609C6.2852 19.9524 6.51625 20 6.75033 20C6.98442 20 7.21547 19.9524 7.43001 19.8609C7.64448 19.7694 7.83738 19.636 7.9985 19.47L15.4973 11.7435C15.6585 11.5776 15.7849 11.3822 15.8706 11.1691C15.9563 10.9562 16 10.7289 16 10.5C16 10.2711 15.9563 10.0438 15.8706 9.83086C15.7849 9.61801 15.6587 9.42272 15.4977 9.25687C15.4975 9.25674 15.4974 9.2566 15.4973 9.25647L7.9985 1.52999C7.67271 1.19431 7.22437 1 6.75033 1C6.2763 1 5.82795 1.19431 5.50217 1.52999C5.17736 1.86465 5 2.31235 5 2.77312C5 3.23388 5.17736 3.68158 5.50217 4.01625L5.50221 4.0163L11.7957 10.5L5.50221 16.9837Z"
        stroke="black"
        strokeWidth="2"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_337_533"
        x="0"
        y="0"
        width="21"
        height="29"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_337_533"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_337_533"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const NotesIcon: React.FC<{
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ width = 34, height = 34, style }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 34 34"
    fill="none"
    style={style}
  >
    <path
      d="M9.95837 11.5001C9.95837 11.1354 10.1032 10.7856 10.3611 10.5278C10.619 10.2699 10.9687 10.1251 11.3334 10.1251H22.3334C22.698 10.1251 23.0478 10.2699 23.3056 10.5278C23.5635 10.7856 23.7084 11.1354 23.7084 11.5001C23.7084 11.8647 23.5635 12.2145 23.3056 12.4723C23.0478 12.7302 22.698 12.8751 22.3334 12.8751H11.3334C10.9687 12.8751 10.619 12.7302 10.3611 12.4723C10.1032 12.2145 9.95837 11.8647 9.95837 11.5001ZM11.3334 18.3751H22.3334C22.698 18.3751 23.0478 18.2302 23.3056 17.9723C23.5635 17.7145 23.7084 17.3647 23.7084 17.0001C23.7084 16.6354 23.5635 16.2856 23.3056 16.0278C23.0478 15.7699 22.698 15.6251 22.3334 15.6251H11.3334C10.9687 15.6251 10.619 15.7699 10.3611 16.0278C10.1032 16.2856 9.95837 16.6354 9.95837 17.0001C9.95837 17.3647 10.1032 17.7145 10.3611 17.9723C10.619 18.2302 10.9687 18.3751 11.3334 18.3751ZM16.8334 21.1251H11.3334C10.9687 21.1251 10.619 21.2699 10.3611 21.5278C10.1032 21.7856 9.95837 22.1354 9.95837 22.5001C9.95837 22.8647 10.1032 23.2145 10.3611 23.4723C10.619 23.7302 10.9687 23.8751 11.3334 23.8751H16.8334C17.198 23.8751 17.5478 23.7302 17.8056 23.4723C18.0635 23.2145 18.2084 22.8647 18.2084 22.5001C18.2084 22.1354 18.0635 21.7856 17.8056 21.5278C17.5478 21.2699 17.198 21.1251 16.8334 21.1251ZM33.3334 3.25006V21.9311C33.3345 22.2924 33.2638 22.6503 33.1255 22.984C32.9871 23.3177 32.7837 23.6206 32.5273 23.8751L23.7084 32.694C23.4539 32.9504 23.151 33.1538 22.8173 33.2921C22.4836 33.4305 22.1257 33.5012 21.7645 33.5H3.08337C2.35403 33.5 1.65455 33.2103 1.13883 32.6946C0.623105 32.1789 0.333374 31.4794 0.333374 30.75V3.25006C0.333374 2.52071 0.623105 1.82124 1.13883 1.30552C1.65455 0.789792 2.35403 0.500061 3.08337 0.500061H30.5834C31.3127 0.500061 32.0122 0.789792 32.5279 1.30552C33.0436 1.82124 33.3334 2.52071 33.3334 3.25006ZM3.08337 30.75H20.9584V22.5001C20.9584 22.1354 21.1032 21.7856 21.3611 21.5278C21.619 21.2699 21.9687 21.1251 22.3334 21.1251H30.5834V3.25006H3.08337V30.75ZM23.7084 23.8751V28.8079L28.6395 23.8751H23.7084Z"
      fill="black"
    />
  </svg>
);

const DocumentIcon: React.FC<{
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ width = 35, height = 34, style }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 35 34"
    fill="none"
    style={style}
  >
    <path
      d="M4.28574 21.25H1.42858C1.0497 21.25 0.686331 21.3993 0.418421 21.6649C0.15051 21.9306 0 22.2909 0 22.6667V32.5833C0 32.9591 0.15051 33.3194 0.418421 33.5851C0.686331 33.8507 1.0497 34 1.42858 34H4.28574C5.99071 34 7.62585 33.3284 8.83144 32.1328C10.037 30.9373 10.7143 29.3158 10.7143 27.625C10.7143 25.9342 10.037 24.3127 8.83144 23.1172C7.62585 21.9216 5.99071 21.25 4.28574 21.25ZM4.28574 31.1667H2.85716V24.0833H4.28574C5.23294 24.0833 6.14135 24.4565 6.81113 25.1207C7.48091 25.7849 7.85718 26.6857 7.85718 27.625C7.85718 28.5643 7.48091 29.4651 6.81113 30.1293C6.14135 30.7935 5.23294 31.1667 4.28574 31.1667ZM34.5591 30.2972C34.8328 30.5569 34.9913 30.9138 34.9997 31.2894C35.008 31.665 34.8656 32.0285 34.6037 32.3C34.1063 32.831 33.5048 33.2557 32.836 33.548C32.1672 33.8403 31.4453 33.9941 30.7144 34C27.5626 34 25.0001 31.1401 25.0001 27.625C25.0001 24.1099 27.5626 21.25 30.7144 21.25C31.4453 21.2559 32.1672 21.4097 32.836 21.702C33.5048 21.9943 34.1063 22.419 34.6037 22.95C34.8599 23.2225 34.9975 23.5841 34.9868 23.9565C34.9761 24.3289 34.8179 24.6821 34.5464 24.9397C34.275 25.1972 33.9121 25.3384 33.5365 25.3325C33.1608 25.3267 32.8026 25.1744 32.5394 24.9085C32.3076 24.6555 32.0262 24.4518 31.7125 24.31C31.3987 24.1681 31.0592 24.091 30.7144 24.0833C29.1394 24.0833 27.8573 25.6771 27.8573 27.625C27.8573 29.5729 29.1394 31.1667 30.7144 31.1667C31.0592 31.159 31.3987 31.0819 31.7125 30.94C32.0262 30.7982 32.3076 30.5945 32.5394 30.3415C32.8014 30.07 33.1613 29.9129 33.54 29.9046C33.9188 29.8963 34.2853 30.0375 34.5591 30.2972ZM17.8572 21.25C14.7054 21.25 12.1429 24.1099 12.1429 27.625C12.1429 31.1401 14.7054 34 17.8572 34C21.009 34 23.5715 31.1401 23.5715 27.625C23.5715 24.1099 21.009 21.25 17.8572 21.25ZM17.8572 31.1667C16.2822 31.1667 15.0001 29.5729 15.0001 27.625C15.0001 25.6771 16.2822 24.0833 17.8572 24.0833C19.4322 24.0833 20.7144 25.6771 20.7144 27.625C20.7144 29.5729 19.4322 31.1667 17.8572 31.1667ZM3.57145 17C3.95033 17 4.31369 16.8507 4.5816 16.5851C4.84951 16.3194 5.00002 15.9591 5.00002 15.5833V2.83333H20.7144V11.3333C20.7144 11.7091 20.8649 12.0694 21.1328 12.3351C21.4007 12.6007 21.7641 12.75 22.143 12.75H30.7144V15.5833C30.7144 15.9591 30.8649 16.3194 31.1329 16.5851C31.4008 16.8507 31.7641 17 32.143 17C32.5219 17 32.8853 16.8507 33.1532 16.5851C33.4211 16.3194 33.5716 15.9591 33.5716 15.5833V11.3333C33.5717 11.1472 33.5349 10.9629 33.4632 10.791C33.3915 10.619 33.2864 10.4627 33.1537 10.331L23.1537 0.414375C23.0209 0.28286 22.8633 0.178574 22.6899 0.107474C22.5165 0.0363741 22.3306 -0.000145897 22.143 4.38031e-07H5.00002C4.24226 4.38031e-07 3.51553 0.298511 2.97971 0.829864C2.44389 1.36122 2.14287 2.08189 2.14287 2.83333V15.5833C2.14287 15.9591 2.29338 16.3194 2.56129 16.5851C2.8292 16.8507 3.19256 17 3.57145 17ZM23.5715 4.83615L28.6948 9.91667H23.5715V4.83615Z"
      fill="black"
    />
  </svg>
);

const DocDollarIcon: React.FC<{
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ width = 34, height = 34, style }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 34 34"
    fill="none"
    style={style}
  >
    <path
      d="M29.8267 9.84487L20.2813 0.394875C20.0257 0.142179 19.6794 0.000165714 19.3182 0H2.95455C2.23123 0 1.53754 0.284463 1.02608 0.790812C0.514616 1.29716 0.227279 1.98392 0.227279 2.7L0 30.5C0 30.858 0.143669 31.2014 0.3994 31.4546C0.655131 31.7078 1.00198 31.85 1.36364 31.85C1.7253 31.85 2.07214 31.7078 2.32787 31.4546C2.5836 31.2014 2.72727 30.858 2.72727 30.5L2.95455 2.7H17.9545V10.8C17.9545 11.158 18.0982 11.5014 18.3539 11.7546C18.6097 12.0078 18.9565 12.15 19.3182 12.15H27.5L27.5 20.5V21L27.5 23C28.2233 23 30.2273 23 30.2273 23C30.2273 22.3868 30.2273 21.8661 30.2273 21.15L30.2273 10.8C30.2274 10.6227 30.1923 10.447 30.1238 10.2832C30.0554 10.1193 29.9533 9.97034 29.8267 9.84487ZM20.6818 4.60856L25.5722 9.45H20.6818V4.60856Z"
      fill="black"
    />
    <path
      d="M16.6673 28.2186C17.5206 27.3981 18 26.2853 18 25.125C18 23.9647 17.5206 22.8519 16.6673 22.0314C15.814 21.2109 14.6567 20.75 13.45 20.75H9.55C9.03283 20.75 8.53684 20.5525 8.17114 20.2008C7.80545 19.8492 7.6 19.3723 7.6 18.875C7.6 18.3777 7.80545 17.9008 8.17114 17.5492C8.53684 17.1975 9.03283 17 9.55 17H15.4C15.7448 17 16.0754 16.8683 16.3192 16.6339C16.563 16.3995 16.7 16.0815 16.7 15.75C16.7 15.4185 16.563 15.1005 16.3192 14.8661C16.0754 14.6317 15.7448 14.5 15.4 14.5H12.8V13.25C12.8 12.9185 12.663 12.6005 12.4192 12.3661C12.1754 12.1317 11.8448 12 11.5 12C11.1552 12 10.8246 12.1317 10.5808 12.3661C10.337 12.6005 10.2 12.9185 10.2 13.25V14.5H9.55C8.34327 14.5 7.18596 14.9609 6.33266 15.7814C5.47937 16.6019 5 17.7147 5 18.875C5 20.0353 5.47937 21.1481 6.33266 21.9686C7.18596 22.7891 8.34327 23.25 9.55 23.25H13.45C13.9672 23.25 14.4632 23.4475 14.8289 23.7992C15.1946 24.1508 15.4 24.6277 15.4 25.125C15.4 25.6223 15.1946 26.0992 14.8289 26.4508C14.4632 26.8025 13.9672 27 13.45 27H7.6C7.25522 27 6.92456 27.1317 6.68076 27.3661C6.43696 27.6005 6.3 27.9185 6.3 28.25C6.3 28.5815 6.43696 28.8995 6.68076 29.1339C6.92456 29.3683 7.25522 29.5 7.6 29.5H10.2V30.75C10.2 31.0815 10.337 31.3995 10.5808 31.6339C10.8246 31.8683 11.1552 32 11.5 32C11.8448 32 12.1754 31.8683 12.4192 31.6339C12.663 31.3995 12.8 31.0815 12.8 30.75V29.5H13.45C14.6567 29.5 15.814 29.0391 16.6673 28.2186Z"
      fill="black"
    />
    <path
      d="M33.0625 22H19.5625C19.4133 22 19.2702 22.0593 19.1648 22.1648C19.0593 22.2702 19 22.4133 19 22.5625V32.125C19 32.4234 19.1185 32.7095 19.3295 32.9205C19.5405 33.1315 19.8266 33.25 20.125 33.25H32.5C32.7984 33.25 33.0845 33.1315 33.2955 32.9205C33.5065 32.7095 33.625 32.4234 33.625 32.125V22.5625C33.625 22.4133 33.5657 22.2702 33.4602 22.1648C33.3548 22.0593 33.2117 22 33.0625 22ZM31.6162 23.125L26.3125 27.9871L21.0088 23.125H31.6162ZM32.5 32.125H20.125V23.8415L25.9321 29.1648C26.0359 29.2601 26.1716 29.313 26.3125 29.313C26.4534 29.313 26.5891 29.2601 26.6929 29.1648L32.5 23.8415V32.125Z"
      fill="black"
    />
  </svg>
);

const Card: React.FC<CardProps> = ({
  node,
  cardDimensions,
  showMiniTree,
  transitionTime,
  treeData,
  onClick,
  onEdit,
  onMouseEnter,
  onMouseLeave,
  onAddChild,
  onAddPartner,
  onDelete,
  onUpdateRelationship,
}) => {
  const cardRef = useRef<SVGGElement>(null);
  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [notesPanelClosing, setNotesPanelClosing] = useState(false);
  const [arrowRotated, setArrowRotated] = useState(false);
  const [badgeHovered, setBadgeHovered] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({
    type: 'Research Update',
    content: '',
  });
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const [getContactNoteList, { data: notesData, isLoading }] =
    useLazyGetContactNoteListQuery();
  const [addContactNote] = useAddContactNoteMutation();

  // Animation hook
  useNodeAnimation(cardRef, node, transitionTime, treeData);

  // Fetch notes
  useEffect(() => {
    if (showNotesPanel && node.data.data.contactId) {
      getContactNoteList({
        contactId: Number(node.data.data.contactId),
        orderBy: 'dateCompleted,dateCreated',
        order: 'desc',
      });
    }
  }, [showNotesPanel, node.data.data.contactId, getContactNoteList]);

  // Transform API notes
  useEffect(() => {
    if (notesData?.rows) {
      const transformedNotes: Note[] = notesData.rows.map(note => ({
        id: note.noteId.toString(),
        type: note.type,
        content: note.notes,
        createdBy: note.fromUserId,
        createdDate: new Date(note.dateCompleted).toISOString().split('T')[0],
      }));
      setNotes(transformedNotes);
    }
  }, [notesData]);

  // Event handlers
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(node);
    }
  }, [onClick, node]);

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEdit) {
        onEdit(node);
      }
    },
    [onEdit, node]
  );

  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onAddPartner) {
        onAddPartner(node);
      }
    },
    [onAddPartner, node]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) {
        onDelete(node.data.id);
      }
    },
    [onDelete, node]
  );

  const handleRelationshipSelect = useCallback(
    (relationship: string) => {
      if (onUpdateRelationship) {
        onUpdateRelationship(node, relationship);
      }
      setShowRelationDropdown(false);
    },
    [onUpdateRelationship, node]
  );

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

  const toggleNotesPanel = useCallback(() => {
    if (showNotesPanel) {
      setNotesPanelClosing(true);
      setArrowRotated(false);
      setTimeout(() => {
        setShowNotesPanel(false);
        setNotesPanelClosing(false);
      }, 300);
    } else {
      setShowNotesPanel(true);
      setArrowRotated(true);
    }
  }, [showNotesPanel]);

  const handleSaveNote = async () => {
    if (!newNote.content.trim()) {
      setError('Note content is required');
      return;
    }
    if (!node.data.data.contactId) {
      setError('Contact ID is missing');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const notePayload = {
        contactId: node.data.data.contactId,
        type: newNote.type,
        memo: newNote.content,
      };
      const response = await addContactNote(notePayload).unwrap();
      if (response?.success) {
        getContactNoteList({
          contactId: Number(node.data.data.contactId),
          orderBy: 'dateCompleted,dateCreated',
          order: 'desc',
        });
        setNewNote({ type: 'Research Update', content: '' });
        setActiveTab('list');
      } else {
        setError('Failed to add note');
      }
    } catch (err) {
      setError('Error saving note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelCreate = () => {
    setActiveTab('list');
    setNewNote({ type: 'Research Update', content: '' });
    setError(null);
  };

  // Gender colors
  const getGenderColors = () => {
    if (node.data.data.gender === 'M') {
      return {
        primary: 'var(--male-primary-color)',
        secondary: 'var(--male-secondary-color)',
      };
    }
    return {
      primary: 'var(--female-primary-color)',
      secondary: 'var(--female-secondary-color)',
    };
  };

  const colors = getGenderColors();
  const isDeceased = !!node.data.data.deceased;
  const hasNotes = !!node.data.data.is_new_notes;
  const showCountyOfDeath =
    node.data.data.countyOfDeath &&
    (!node.data.data.address || node.data.data.deceased);
  const contactId = node.data.data.contactId;
  const fileId = node.data.data.fileId;
  const offerAmount = node.data.data.offerAmount || '$0.00';

  return (
    <g
      ref={cardRef}
      className={`card_cont ${node.data.main ? 'card-main' : ''} ${isDeceased ? 'card-deceased' : ''}`}
      transform={`translate(${node.x}, ${node.y})`}
      style={{ opacity: 0 }}
      data-id={node.data.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Relationship Badge */}
      <g
        className={`relationship-batch-container ${badgeHovered ? 'pulse' : ''}`}
        transform={`translate(${-cardDimensions.w / 2 + 15}, ${-cardDimensions.h / 2 - 23})`}
        onClick={e => {
          e.stopPropagation();
          setShowRelationDropdown(!showRelationDropdown);
        }}
        onMouseEnter={() => setBadgeHovered(true)}
        onMouseLeave={() => setBadgeHovered(false)}
      >
        <rect
          width={110}
          height={20}
          rx={10}
          ry={10}
          fill="var(--relationship-badge-color)"
          stroke={isDeceased ? 'var(--deceased-border-color)' : 'none'}
          strokeWidth={isDeceased ? 3 : 0}
          className="relationship-batch"
        />
        <text
          x={55}
          y={14}
          fill="#000"
          fontSize="12"
          fontWeight={badgeHovered ? 700 : 600}
          textAnchor="middle"
          className="relationship-batch-text"
        >
          {node.data.data.relationshipType || 'Unknown'}
        </text>
        {badgeHovered && (
          <path
            d="M 0 0 L 4 4 L 8 0"
            transform={`translate(${95}, 10) rotate(180)`}
            fill="#333"
          />
        )}
        {showRelationDropdown && (
          <g className="relationship-dropdown" transform={`translate(110, 0)`}>
            <rect
              width={160}
              height={RELATIONSHIP_OPTIONS.length * 30}
              fill="white"
              stroke="#ccc"
              strokeWidth={1}
              rx={8}
              ry={8}
              filter="url(#dropShadow)"
              className="dropdown-background"
            />
            {RELATIONSHIP_OPTIONS.map((option, index) => (
              <g
                key={option}
                transform={`translate(0, ${index * 30})`}
                onClick={e => {
                  e.stopPropagation();
                  handleRelationshipSelect(option);
                }}
                className="relationship-option"
              >
                <rect
                  width={160}
                  height={30}
                  fill={
                    option === node.data.data.relationshipType
                      ? 'rgba(25, 118, 210, 0.08)'
                      : 'transparent'
                  }
                  className="option-bg"
                />
                <text
                  x={10}
                  y={20}
                  fill="#000"
                  fontSize="14"
                  fontFamily="Roboto, sans-serif"
                >
                  {option}
                </text>
              </g>
            ))}
          </g>
        )}
      </g>

      {/* Main Card */}
      <g
        className={`card ${node.data.data.gender === 'M' ? 'card-male' : 'card-female'}`}
        transform={`translate(${-cardDimensions.w / 2}, ${-cardDimensions.h / 2})`}
      >
        <g className="card-inner" clipPath="url(#card_clip)">
          {/* Card Outline */}
          <rect
            width={cardDimensions.w}
            height={cardDimensions.h}
            rx={20}
            ry={20}
            className={`card-outline ${node.data.main ? 'card-main-outline' : ''}`}
            stroke={
              isDeceased
                ? 'var(--deceased-border-color)'
                : 'rgba(255, 255, 255, 0.2)'
            }
            strokeWidth={isDeceased ? 3 : 1}
            fill="none"
          />

          {/* Header */}
          <g
            className="card-header"
            onClick={handleClick}
            onMouseEnter={() => setHeaderHovered(true)}
            onMouseLeave={() => setHeaderHovered(false)}
          >
            <rect
              width={cardDimensions.w}
              height={34}
              fill="var(--header-color)"
              rx={20}
              ry={20}
            />
            <rect
              y={17}
              width={cardDimensions.w}
              height={17}
              fill="var(--header-color)"
            />
            <text
              x={12}
              y={22}
              fontSize="16"
              fontWeight="800"
              fill="#000"
              className="file-name"
              textAnchor="start"
              style={{ textOverflow: 'ellipsis', maxWidth: '75%' }}
            >
              {node.data.data.firstName} {node.data.data.lastName}
            </text>
            {headerHovered && (
              <g
                className="header-actions"
                transform={`translate(${cardDimensions.w - 65}, 17)`}
              >
                <g
                  transform="translate(-25, -8)"
                  onClick={handleAddClick}
                  style={{ cursor: 'pointer' }}
                >
                  <circle r="12" fill="#f5f5f5" />
                  <path
                    d="M -4 0 H 4 M 0 -4 V 4"
                    stroke="#000"
                    strokeWidth="2"
                  />
                </g>
                <g
                  transform="translate(0, -8)"
                  onClick={handleDeleteClick}
                  style={{ cursor: 'pointer' }}
                >
                  <circle r="12" fill="#f5f5f5" />
                  <path
                    d="M -3 -3 L 3 3 M -3 3 L 3 -3"
                    stroke="#f44336"
                    strokeWidth="2"
                  />
                </g>
              </g>
            )}
            <g transform={`translate(${cardDimensions.w - 20}, 17)`}>
              <ArrowIcon width={15} height={20} />
            </g>
          </g>

          {/* Body */}
          <g className="card-body">
            {/* Left Panel */}
            <rect
              y={34}
              width={cardDimensions.w / 2}
              height={cardDimensions.h - 34 - 18}
              fill={colors.secondary}
            />
            <g className="card-details">
              <text x={12} y={50} fontSize="12" fontWeight="700" fill="#000">
                Age: {node.data.data.age || 'Unknown'}
              </text>
              <text x={12} y={65} fontSize="12" fontWeight="700" fill="#000">
                Birth: {node.data.data.dOB || 'Unknown'}
              </text>
              <text x={12} y={80} fontSize="12" fontWeight="700" fill="#000">
                Death: {node.data.data.decDt || 'Unknown'}
              </text>
              {!showCountyOfDeath && node.data.data.address && (
                <text x={12} y={95} fontSize="10" fontWeight="700" fill="#000">
                  Address:
                  <tspan x={12} dy="12">
                    {node.data.data.address}
                  </tspan>
                </text>
              )}
              {showCountyOfDeath && (
                <text x={12} y={95} fontSize="12" fontWeight="700" fill="#000">
                  County of Death:
                  <tspan x={12} dy="12" fontSize="10">
                    {node.data.data.countyOfDeath}
                  </tspan>
                </text>
              )}
            </g>

            {/* Right Panel */}
            <rect
              x={cardDimensions.w / 2}
              y={34}
              width={cardDimensions.w / 2}
              height={cardDimensions.h - 34 - 18}
              fill="#FFFFFF"
            />
            <g className="division-of-interest">
              <rect
                x={cardDimensions.w / 2 + 10}
                y={50}
                width={123}
                height={19}
                rx={8}
                ry={8}
                stroke="#000"
                strokeWidth="1"
                fill="#fff"
              />
              <text
                x={cardDimensions.w / 2 + 71.5}
                y={62}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#000"
              >
                {node.data.data.divisionOfInterest || 'N/A'}
              </text>
              {hasNotes && (
                <g transform={`translate(${cardDimensions.w / 2 - 10}, 80)`}>
                  <circle r="10" fill="#FF0000" />
                  <text
                    x="0"
                    y="3"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    !
                  </text>
                </g>
              )}
              <rect
                x={cardDimensions.w / 2 + 10}
                y={80}
                width={123}
                height={19}
                rx={8}
                ry={8}
                stroke="#000"
                strokeWidth="1"
                fill="#fff"
              />
              <text
                x={cardDimensions.w / 2 + 20}
                y={92}
                fontSize="12"
                fontWeight="700"
                fill="#000"
              >
                {node.data.data.percentage || '0.000 %'}
              </text>
              <g transform={`translate(${cardDimensions.w - 25}, 85)`}>
                <ArrowIcon width={10} height={15} />
              </g>
              <g
                className="card-icons"
                transform={`translate(${cardDimensions.w / 2 + 10}, 110)`}
              >
                <g
                  transform="translate(0, 0)"
                  style={{ cursor: contactId ? 'pointer' : 'default' }}
                  onClick={() => contactId && console.log('Navigate to notes')}
                  className={`card-icon notes-icon ${hasNotes ? 'has-notes' : ''}`}
                >
                  <rect width={20} height={20} fill="transparent" />
                  <NotesIcon
                    width={20}
                    height={20}
                    style={{ fill: hasNotes ? '#FF0000' : '#000000' }}
                  />
                </g>
                <g
                  transform="translate(30, 0)"
                  style={{ cursor: fileId ? 'pointer' : 'default' }}
                  onClick={() => fileId && console.log('Navigate to documents')}
                  className="card-icon document-icon"
                >
                  <rect width={20} height={20} fill="transparent" />
                  <DocumentIcon width={20} height={20} />
                </g>
                <g
                  transform="translate(60, 0)"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setShowOfferPopup(true)}
                  onMouseLeave={() => setShowOfferPopup(false)}
                  className="card-icon doc-dollar-icon"
                >
                  <rect width={20} height={20} fill="transparent" />
                  <DocDollarIcon width={20} height={20} />
                  {showOfferPopup && contactId && (
                    <g className="offer-popup" transform="translate(-45, -90)">
                      <rect
                        width={200}
                        height={80}
                        rx={12}
                        ry={12}
                        fill="#FFFFFF"
                        stroke="#CCCCCC"
                        strokeWidth="1"
                        filter="url(#dropShadow)"
                      />
                      <text
                        x={100}
                        y={20}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#000000"
                      >
                        Offer Amount
                      </text>
                      <text
                        x={100}
                        y={45}
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fill="#000000"
                      >
                        {offerAmount}
                      </text>
                      <text
                        x={100}
                        y={65}
                        textAnchor="middle"
                        fontSize="14"
                        fill="#1976d2"
                        textDecoration="underline"
                        style={{ cursor: 'pointer' }}
                        onClick={() => console.log('Navigate to offer letter')}
                      >
                        Link to offer letter
                      </text>
                      <path
                        d="M 0 0 L 8 8 L 16 0"
                        transform="translate(92, -1) rotate(180)"
                        fill="#FFFFFF"
                        stroke="#CCCCCC"
                        strokeWidth="1"
                      />
                    </g>
                  )}
                </g>
              </g>
            </g>
          </g>

          {/* Bottom Bar */}
          <g
            className="bottom-bar"
            transform={`translate(0, ${cardDimensions.h - 18})`}
          >
            <rect
              width={cardDimensions.w}
              height={18}
              fill="var(--bottom-bar-color)"
              rx={0}
              ry={0}
              className="bottom-bar-rect"
            />
            <g
              transform={`translate(${cardDimensions.w / 2}, 9)`}
              onClick={toggleNotesPanel}
              style={{ cursor: 'pointer' }}
            >
              <g
                transform={arrowRotated ? 'rotate(180)' : ''}
                className={notesPanelClosing ? 'rotating' : ''}
              >
                <ArrowIcon width={15} height={20} />
              </g>
            </g>
          </g>
        </g>
      </g>

      {/* Notes Panel */}
      {showNotesPanel && (
        <g
          className={`notes-panel ${notesPanelClosing ? 'closing' : 'open'}`}
          transform={`translate(${-cardDimensions.w / 2}, ${cardDimensions.h / 2 + 18})`}
        >
          <rect
            width={cardDimensions.w}
            height={120}
            fill="#FFFFFF"
            stroke="#CCCCCC"
            strokeWidth="1"
            rx={16}
            ry={16}
          />
          {activeTab === 'list' ? (
            <>
              <rect width={cardDimensions.w} height={36} fill="#FFFFFF" />
              <g transform="translate(0, 4)">
                <rect
                  width={cardDimensions.w / 2}
                  height={28}
                  fill="#f0f0f0"
                  onClick={() => setActiveTab('list')}
                />
                <text
                  x={cardDimensions.w / 4}
                  y={20}
                  fontSize="12"
                  fontWeight="700"
                  fill="#000"
                >
                  Notes List
                </text>
                <rect
                  x={cardDimensions.w / 2}
                  width={cardDimensions.w / 2}
                  height={28}
                  fill="transparent"
                  onClick={() => setActiveTab('create')}
                />
                <text
                  x={(cardDimensions.w * 3) / 4}
                  y={20}
                  fontSize="12"
                  fontWeight="400"
                  fill="#000"
                >
                  Create Note
                </text>
              </g>
              <g transform={`translate(${cardDimensions.w / 2}, 10)`}>
                <g style={{ cursor: 'pointer' }} onClick={toggleNotesPanel}>
                  <circle r="10" fill="#F0F0F0" />
                  <path
                    d="M -6 0 L 6 0"
                    stroke="#000000"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
              </g>
              <g transform="translate(10, 40)">
                {isLoading ? (
                  <text
                    x={cardDimensions.w / 2 - 10}
                    y={20}
                    fontSize="12"
                    fill="#666"
                  >
                    Loading...
                  </text>
                ) : notes.length === 0 ? (
                  <text
                    x={cardDimensions.w / 2 - 10}
                    y={20}
                    fontSize="12"
                    fill="#666"
                  >
                    No notes found
                  </text>
                ) : (
                  notes.map((note, index) => (
                    <g key={note.id} transform={`translate(0, ${index * 40})`}>
                      <rect
                        width={cardDimensions.w - 20}
                        height={36}
                        rx={6}
                        ry={6}
                        fill="#f9f9f9"
                        stroke="#EEEEEE"
                        strokeWidth="1"
                      />
                      <text x={5} y={12} fontSize="10" fill="#666666">
                        {note.type} • {note.createdDate} • {note.createdBy}
                      </text>
                      <text x={5} y={28} fontSize="11" fill="#000000">
                        {note.content.length > 30
                          ? `${note.content.substring(0, 27)}...`
                          : note.content}
                      </text>
                    </g>
                  ))
                )}
              </g>
            </>
          ) : (
            <>
              <rect width={cardDimensions.w} height={36} fill="#f5f5f5" />
              <g transform="translate(10, 4)">
                <g transform="translate(0, 0)">
                  <rect
                    width={50}
                    height={24}
                    rx={4}
                    ry={4}
                    fill="#1976d2"
                    onClick={handleSaveNote}
                  />
                  <text
                    x={25}
                    y={16}
                    fontSize="11"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    {isSaving ? '...' : 'Save'}
                  </text>
                  <rect
                    x={60}
                    width={50}
                    height={24}
                    rx={4}
                    ry={4}
                    fill="transparent"
                    stroke="#000"
                    strokeWidth="1"
                    onClick={handleCancelCreate}
                  />
                  <text
                    x={85}
                    y={16}
                    fontSize="11"
                    fill="#000"
                    textAnchor="middle"
                  >
                    Cancel
                  </text>
                </g>
                <g transform={`translate(${cardDimensions.w - 120}, 0)`}>
                  <rect
                    width={100}
                    height={24}
                    rx={4}
                    ry={4}
                    fill="#FFFFFF"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <text x={10} y={16} fontSize="11" fill="#000">
                    {newNote.type}
                  </text>
                  <path
                    d="M 0 0 L 4 4 L 8 0"
                    transform="translate(85, 12) rotate(180)"
                    fill="#333"
                    onClick={() => console.log('Toggle note type')}
                  />
                </g>
              </g>
              <g transform={`translate(${cardDimensions.w / 2}, 10)`}>
                <g style={{ cursor: 'pointer' }} onClick={toggleNotesPanel}>
                  <circle r="10" fill="#F0F0F0" />
                  <path
                    d="M -6 0 L 6 0"
                    stroke="#000000"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
              </g>
              {error && (
                <text x={10} y={50} fontSize="12" fill="#d32f2f">
                  {error}
                </text>
              )}
              <g transform="translate(10, 40)">
                <rect
                  width={cardDimensions.w - 20}
                  height={60}
                  rx={4}
                  ry={4}
                  fill="#FFFFFF"
                  stroke="#000"
                  strokeWidth="1"
                />
                <foreignObject
                  x={5}
                  y={5}
                  width={cardDimensions.w - 30}
                  height={50}
                >
                  <textarea
                    value={newNote.content}
                    onChange={e =>
                      setNewNote(prev => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Enter your note here..."
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      fontSize: '12px',
                      fontFamily: 'Roboto, sans-serif',
                      resize: 'none',
                    }}
                  />
                </foreignObject>
              </g>
            </>
          )}
        </g>
      )}
    </g>
  );
};

export default memo(Card);
