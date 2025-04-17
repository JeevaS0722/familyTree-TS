// src/CreateTree/checkIfRelativesConnectedWithoutPerson.ts
import { Person } from '../types';

/**
 * Checks if all relatives of a person are still connected to the main tree
 * if the person is removed
 *
 * @param datum - The person to check
 * @param data_stash - The full data array
 * @returns True if all relatives remain connected, false otherwise
 */
export function checkIfRelativesConnectedWithoutPerson(
  datum: Person,
  data_stash: Person[]
): boolean {
  const r = datum.rels;

  // Collect all relative IDs from the person's relationships
  const r_ids: string[] = [
    r.father,
    r.mother,
    ...(r.spouses || []),
    ...(r.children || []),
  ].filter(Boolean) as string[];

  const rels_not_to_main: string[] = [];

  // For each relative, check if they have a path to the main person
  for (let i = 0; i < r_ids.length; i++) {
    const line = findPersonLineToMain(
      data_stash.find(d => d.id === r_ids[i]) as Person,
      [datum]
    );

    if (!line) {
      rels_not_to_main.push(r_ids[i]);
      break;
    }
  }

  return rels_not_to_main.length === 0;

  /**
   * Finds a path from a person to the main person in the tree
   *
   * @param datum - The person to find a path from
   * @param without_persons - Persons to exclude from the path
   * @returns The path if found, undefined otherwise
   */
  function findPersonLineToMain(
    datum: Person,
    without_persons: Person[]
  ): Person[] | undefined {
    let line: Person[] | undefined;

    if (isM(datum)) {
      line = [datum];
    }

    checkIfAnyRelIsMain(datum, [datum]);
    return line;

    /**
     * Recursively checks if any relative is the main person
     *
     * @param d0 - The current person to check
     * @param history - The history of checked persons
     */
    function checkIfAnyRelIsMain(d0: Person, history: Person[]): void {
      if (line) {
        return;
      }

      history = [...history, d0];
      runAllRels(check);

      if (!line) {
        runAllRels(checkRels);
      }

      /**
       * Runs a function on all relatives of the current person
       *
       * @param f - The function to run on each relative
       */
      function runAllRels(f: (d_id: string) => void): void {
        const r = d0.rels;
        [r.father, r.mother, ...(r.spouses || []), ...(r.children || [])]
          .filter(
            d_id =>
              d_id && ![...without_persons, ...history].find(d => d.id === d_id)
          )
          .forEach(d_id => f(d_id as string));
      }

      /**
       * Checks if a relative is the main person
       *
       * @param d_id - The ID of the relative to check
       */
      function check(d_id: string): void {
        if (isM(d_id)) {
          line = history;
        }
      }

      /**
       * Recursively checks relatives of a relative
       *
       * @param d_id - The ID of the relative to check
       */
      function checkRels(d_id: string): void {
        const person = data_stash.find(d => d.id === d_id);
        if (person) {
          checkIfAnyRelIsMain(person, history);
        }
      }
    }
  }

  /**
   * Checks if a person or ID is the main person in the tree
   *
   * @param d0 - The person or ID to check
   * @returns True if it's the main person, false otherwise
   */
  function isM(d0: Person | string): boolean {
    return typeof d0 === 'object'
      ? d0.id === data_stash[0].id
      : d0 === data_stash[0].id;
  }
}
