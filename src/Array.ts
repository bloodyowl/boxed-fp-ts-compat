import { Array, Option } from "@swan-io/boxed";

export const map =
  <A, B>(f: (a: A) => B) =>
  (array: Array<A>) => {
    return array.map((a) => f(a));
  };

export const mapWithIndex =
  <A, B>(f: (i: number, a: A) => B) =>
  (array: Array<A>) => {
    return array.map((a, i) => f(i, a));
  };

export const every =
  <A>(f: (a: A) => boolean) =>
  (array: Array<A>) => {
    return array.every((a) => f(a));
  };

export const some =
  <A>(f: (a: A) => boolean) =>
  (array: Array<A>) => {
    return array.some((a) => f(a));
  };

export const filterMap =
  <A, B>(f: (a: A) => Option<B>) =>
  (array: Array<A>) => {
    return Array.filterMap(array, f);
  };

export const filter =
  <A>(f: (a: A) => boolean) =>
  (array: Array<A>) => {
    return array.filter((a) => f(a));
  };

export const findFirst =
  <A>(f: (a: A) => boolean) =>
  (array: Array<A>) => {
    return array.find((a) => f(a));
  };

export const append =
  <A>(a: A) =>
  (array: Array<A>) => {
    return [...array, a];
  };

export const compact = <A>(array: Array<Option<A>>) => {
  return Array.filterMap(array, (x) => x);
};

export const chunksOf =
  <A>(length: number) =>
  (array: Array<A>) =>
    Array.from({ length: Math.ceil(array.length / length) }, (_, index) =>
      array.slice(index * length, (index + 1) * length)
    );

export const head = <A>(array: Array<A>) => {
  return Option.fromUndefined(array.at(0));
};

export const last = <A>(array: Array<A>) => {
  return Option.fromUndefined(array.at(-1));
};

export const isEmpty = <A>(array: Array<A>) => {
  return array.length === 0;
};

export const isNonEmpty = <A>(array: Array<A>) => {
  return array.length > 0;
};

export const partition =
  <A>(f: (a: A) => boolean) =>
  (array: Array<A>) => {
    const right: Array<A> = [];
    const left: Array<A> = [];
    array.forEach((x) => {
      if (f(x)) {
        right.push(x);
      } else {
        left.push(x);
      }
    });
    return { left, right };
  };

export const reduce =
  <A, R>(r: R, f: (acc: R, a: A) => R) =>
  (array: Array<A>) => {
    return array.reduce((acc, a) => f(acc, a), r);
  };

export const size = <A>(array: Array<A>) => {
  return array.length;
};
