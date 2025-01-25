import { Option } from "@swan-io/boxed";

export { type Option };

export const some = Option.Some;
export const of = Option.Some;

export const none = Option.None();

export const map =
  <A, B>(f: (a: A) => B) =>
  (t: Option<A>) =>
    t.map(f);

export const flatMap =
  <A, B>(f: (a: A) => Option<B>) =>
  (t: Option<A>) =>
    t.flatMap(f);

export const chain = flatMap;

export const fromNullable = Option.fromNullable;

export const toNullable = <A>(t: Option<A>) => t.toNull();

export const toUndefined = <A>(t: Option<A>) => t.toUndefined();

export const fold =
  <A, R>(onNone: () => R, onSome: (a: A) => R) =>
  (t: Option<A>) => {
    return t.match({ None: onNone, Some: onSome });
  };

export const foldW =
  <A, R1, R2>(onNone: () => R1, onSome: (a: A) => R2) =>
  (t: Option<A>) => {
    return t.match({ None: onNone, Some: onSome });
  };

export const match = fold;

export const getOrElse =
  <A>(fallback: () => A) =>
  (t: Option<A>) => {
    if (t.isSome()) {
      return t.get();
    } else {
      return fallback();
    }
  };

export const orElse =
  <A>(fallback: () => Option<A>) =>
  (t: Option<A>) => {
    if (t.isSome()) {
      return t;
    } else {
      return fallback();
    }
  };

export const alt = orElse;

export const Do = Option.Some({});

export const bind =
  <K extends string, V extends any, I extends Record<string, any>>(
    fieldName: K,
    getValue: () => Option<V>
  ) =>
  (
    input: Option<I>
  ): Option<
    I & {
      [k in K]: V;
    }
  > => {
    return input.flatMap((record) =>
      getValue().map((value) => ({
        ...record,
        [fieldName]: value,
      }))
    );
  };

export const isSome = <A>(t: Option<A>): t is Option<A> & { tag: "Some" } => {
  return t.isSome();
};

export const isNone = <A>(t: Option<A>): t is Option<A> & { tag: "None" } => {
  return t.isNone();
};

export const fromPredicate =
  <A>(matchesPredicate: (a: A) => boolean) =>
  (t: A) => {
    return Option.fromPredicate(t, matchesPredicate);
  };
