// src/Cards/utils.ts
import { Person } from '../types';

type CardDisplayInput =
  | string
  | string[]
  | ((d: Person) => string)
  | ((d: Person) => string)[];

/**
 * Processes different formats of card display functions into a standardized array
 * @param card_display - The card display function(s) or field name(s)
 * @returns An array of functions that generate display strings from person data
 */
export function processCardDisplay(
  card_display: CardDisplayInput
): ((d: Person) => string)[] {
  const card_display_arr: ((d: Person) => string)[] = [];

  if (Array.isArray(card_display)) {
    card_display.forEach(d => {
      if (typeof d === 'function') {
        card_display_arr.push(d as (d: Person) => string);
      } else if (typeof d === 'string') {
        card_display_arr.push(d1 => {
          const value = d1.data[d];
          return value !== undefined ? String(value) : '';
        });
      } else if (Array.isArray(d)) {
        card_display_arr.push(d1 =>
          d
            .map(d2 => (d1.data[d2] !== undefined ? String(d1.data[d2]) : ''))
            .join(' ')
        );
      }
    });
  } else if (typeof card_display === 'function') {
    card_display_arr.push(card_display as (d: Person) => string);
  } else if (typeof card_display === 'string') {
    card_display_arr.push(d1 => {
      const value = d1.data[card_display];
      return value !== undefined ? String(value) : '';
    });
  }

  return card_display_arr;
}
