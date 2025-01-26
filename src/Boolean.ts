export const fold =
  <R>(onFalse: () => R, onTrue: () => R) =>
  (t: boolean) => {
    return t ? onTrue() : onFalse();
  };

export const foldW =
  <R1, R2>(onFalse: () => R1, onTrue: () => R2) =>
  (t: boolean) => {
    return t ? onTrue() : onFalse();
  };

export const match = fold;

export const Eq = {
  equals: <A>(a: A, b: A) => a === b,
};
