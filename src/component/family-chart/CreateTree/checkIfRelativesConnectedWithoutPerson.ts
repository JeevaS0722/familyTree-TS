import { Datum } from '../types';

export function checkIfRelativesConnectedWithoutPerson(
  datum: Datum,
  data_stash: Datum[]
): boolean {
  const r = datum.rels,
    r_ids = [
      r.father,
      r.mother,
      ...(r.spouses || []),
      ...(r.children || []),
    ].filter(r_id => !!r_id) as string[],
    rels_not_to_main: string[] = [];

  for (let i = 0; i < r_ids.length; i++) {
    const line = findPersonLineToMain(
      data_stash.find(d => d.id === r_ids[i])!,
      [datum]
    );
    if (!line) {
      rels_not_to_main.push(r_ids[i]);
      break;
    }
  }
  return rels_not_to_main.length === 0;

  function findPersonLineToMain(
    datum: Datum,
    without_persons: Datum[]
  ): Datum[] | undefined {
    let line: Datum[] | undefined;
    if (isM(datum)) {
      line = [datum];
    }
    checkIfAnyRelIsMain(datum, [datum]);
    return line;

    function checkIfAnyRelIsMain(d0: Datum, history: Datum[]): void {
      if (line) {
        return;
      }
      history = [...history, d0];
      runAllRels(check);
      if (!line) {
        runAllRels(checkRels);
      }

      function runAllRels(f: (d_id: string) => void): void {
        const r = d0.rels;
        [r.father, r.mother, ...(r.spouses || []), ...(r.children || [])]
          .filter(
            d_id =>
              d_id && ![...without_persons, ...history].find(d => d.id === d_id)
          )
          .forEach(d_id => f(d_id as string));
      }

      function check(d_id: string): void {
        if (isM(d_id)) {
          line = history;
        }
      }

      function checkRels(d_id: string): void {
        const person = data_stash.find(d => d.id === d_id);
        if (person) {
          checkIfAnyRelIsMain(person, history);
        }
      }
    }
  }

  function isM(d0: Datum | string): boolean {
    return typeof d0 === 'object'
      ? d0.id === data_stash[0].id
      : d0 === data_stash[0].id;
  } // todo: make main more exact
}
