import React, { useState } from 'react';

const CardFooter: React.FC = () => {
  const [arrowRotated, setArrowRotated] = useState(false);

  return (
    <g className="bottom-bar" transform="translate(0,140)">
      <rect x="0" y="0" width="300" height="20" fill="transparent" />
      <g
        transform={
          arrowRotated
            ? 'translate(140, 0) rotate(180 11 8)'
            : 'translate(140, 5)'
        }
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setArrowRotated(!arrowRotated);
        }}
        className="bottom-arrow-icon"
      >
        <rect x="-5" y="-5" width="30" height="20" fill="transparent" />
        <svg
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_808_149)">
            <path
              d="M10.646 6.48815L5.64597 1.80065C5.59952 1.7571 5.56267 1.7054 5.53753 1.64849C5.51238 1.59159 5.49944 1.5306 5.49944 1.46901C5.49944 1.40742 5.51238 1.34643 5.53753 1.28953C5.56267 1.23262 5.59952 1.18092 5.64597 1.13737C5.69243 1.09382 5.74758 1.05927 5.80827 1.0357C5.86897 1.01213 5.93402 1 5.99972 1C6.06542 1 6.13047 1.01213 6.19117 1.0357C6.25187 1.05927 6.30702 1.09382 6.35347 1.13737L10.9997 5.49382L15.646 1.13737C15.7398 1.04941 15.867 1 15.9997 1C16.1324 1 16.2597 1.04941 16.3535 1.13737C16.4473 1.22533 16.5 1.34462 16.5 1.46901C16.5 1.5934 16.4473 1.71269 16.3535 1.80065L11.3535 6.48815C11.307 6.53173 11.2519 6.56631 11.1912 6.5899C11.1305 6.61349 11.0654 6.62563 10.9997 6.62563C10.934 6.62563 10.869 6.61349 10.8083 6.5899C10.7476 6.56631 10.6924 6.53173 10.646 6.48815Z"
              fill="black"
            />
            <path
              d="M6.69547 0.772624L6.69544 0.772601C6.60124 0.684288 6.49113 0.615809 6.37216 0.56961C6.25323 0.523423 6.12676 0.5 5.99972 0.5C5.87268 0.5 5.74622 0.523423 5.62728 0.56961C5.50831 0.615808 5.3982 0.684288 5.304 0.772601C5.20973 0.860977 5.13311 0.967658 5.08018 1.08746C5.0272 1.20735 4.99944 1.33711 4.99944 1.46901C4.99944 1.60091 5.0272 1.73067 5.08018 1.85056C5.13311 1.97036 5.20973 2.07704 5.304 2.16542L10.3038 6.85273C10.398 6.94113 10.5081 7.00969 10.6271 7.05594C10.7461 7.10218 10.8726 7.12563 10.9997 7.12563C11.1268 7.12563 11.2533 7.10218 11.3723 7.05594C11.4913 7.00969 11.6015 6.94113 11.6956 6.85273L16.6954 2.16542C16.8862 1.98655 17 1.7368 17 1.46901C17 1.20122 16.8862 0.951467 16.6954 0.772601C16.5057 0.59476 16.255 0.5 15.9997 0.5C15.7445 0.5 15.4937 0.59476 15.304 0.772601L15.304 0.772624L10.9997 4.80841L6.69547 0.772624Z"
              stroke="black"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_808_149"
              x="0.499451"
              y="0"
              width="21.0005"
              height="15.6256"
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
                result="effect1_dropShadow_808_149"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_808_149"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </g>
    </g>
  );
};

export default CardFooter;
