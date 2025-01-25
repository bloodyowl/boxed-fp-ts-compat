import { Option, Result } from "@swan-io/boxed";

export type Either<E, A> = Result<A, E>;

export const right = Result.Ok;
export const left = Result.Error;

export const map =
  <A, E, B>(f: (a: A) => B) =>
  (t: Result<A, E>) =>
    t.map(f);

export const flatMap =
  <A, E, F, B>(f: (a: A) => Result<B, F>) =>
  (t: Result<A, E>) =>
    t.flatMap(f);

export const chain = flatMap;
export const chainW = flatMap;

export const fold =
  <A, E, R>(onLeft: (e: E) => R, onRight: (a: A) => R) =>
  (t: Result<A, E>) => {
    return t.match({ Error: onLeft, Ok: onRight });
  };

export const foldW =
  <A, E, R1, R2>(onLeft: (e: E) => R1, onRight: (a: A) => R2) =>
  (t: Result<A, E>) => {
    return t.match({ Error: onLeft, Ok: onRight });
  };

export const match = fold;

export const getOrElse =
  <A, E>(fallback: () => A) =>
  (t: Result<A, E>) => {
    if (t.isOk()) {
      return t.get();
    } else {
      return fallback();
    }
  };

export const orElse =
  <A, E>(fallback: () => Result<A, E>) =>
  (t: Result<A, E>) => {
    if (t.isOk()) {
      return t;
    } else {
      return fallback();
    }
  };

export const alt = orElse;

export const Do = Result.Ok({});

export const bind =
  <
    K extends string,
    VA extends any,
    VE extends any,
    I extends Record<string, any>,
    E extends any
  >(
    fieldName: K,
    getValue: () => Result<VA, VE>
  ) =>
  (
    input: Result<I, E>
  ): Result<
    I & {
      [k in K]: VA;
    },
    E | VE
  > => {
    return input.flatMap((record) =>
      getValue().map((value) => ({
        ...record,
        [fieldName]: value,
      }))
    );
  };

export const tryCatch = <A, E>(
  getValue: () => A,
  mapError: (error: unknown) => E
) => {
  return Result.fromExecution(getValue).mapError(mapError);
};

export const fromPredicate =
  <A, E>(matchesPredicate: (a: A) => boolean, fallback: () => E) =>
  (t: A) => {
    return Option.fromPredicate(t, matchesPredicate).toResult(fallback());
  };

export const isRight = <A, E>(
  t: Result<A, E>
): t is Result<A, E> & { tag: "Ok" } => {
  return t.isOk();
};

export const isLeft = <A, E>(
  t: Result<A, E>
): t is Result<A, E> & { tag: "Error" } => {
  return t.isError();
};
