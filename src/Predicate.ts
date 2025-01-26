export type Predicate<A> = (a: A) => boolean;

export const not = <A>(predicate: Predicate<A>): Predicate<A> => {
  return (a: A) => !predicate(a);
};

export const or = <A>(second: Predicate<A>) => {
  return (first: Predicate<A>) => {
    return (a: A) => first(a) || second(a);
  };
};

export const and = <A>(second: Predicate<A>) => {
  return (first: Predicate<A>) => {
    return (a: A) => first(a) && second(a);
  };
};

export const everyPredicates = <A>(
  ...predicates: Array<Predicate<A>>
): Predicate<A> => {
  return (a: A) => predicates.every((f) => f(a));
};

export const somePredicates = <A>(
  ...predicates: Array<Predicate<A>>
): Predicate<A> => {
  return (a: A) => predicates.some((f) => f(a));
};
