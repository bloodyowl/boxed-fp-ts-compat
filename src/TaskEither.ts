import { Future, Option, Result } from "@swan-io/boxed";
import { constVoid } from "./function";

export type TaskEither<E, A> = Future<Result<A, E>>;

export const right = <E = never, A = never>(x: A) => Future.value(Result.Ok(x));
export const left = <E = never, A = never>(x: E) =>
  Future.value(Result.Error(x));

export const fromEither = <A, E>(either: Result<A, E>) => Future.value(either);

export const map =
  <A, E, B>(f: (a: A) => B) =>
  (t: Future<Result<A, E>>) =>
    t.mapOk(f);

export const mapLeft =
  <A, E, F>(f: (a: E) => F) =>
  (t: Future<Result<A, E>>) =>
    t.mapError(f);

export const flatMap =
  <A, E, F, B>(f: (a: A) => Future<Result<B, F>>) =>
  (t: Future<Result<A, E>>) =>
    t.flatMapOk(f);

export const chain = flatMap;
export const chainW = flatMap;

export const fold =
  <A, E, R>(onLeft: (e: E) => Future<R>, onRight: (a: A) => Future<R>) =>
  (t: Future<Result<A, E>>) => {
    return t.flatMap((result) => result.match({ Ok: onRight, Error: onLeft }));
  };

export const foldW =
  <A, E, R1, R2 = R1>(
    onLeft: (e: E) => Future<R1>,
    onRight: (a: A) => Future<R2>
  ) =>
  (t: Future<Result<A, E>>) => {
    return t.flatMap<R1 | R2>((result) =>
      result.match({ Ok: onRight, Error: onLeft })
    );
  };

export const match = fold;

export const getOrElse =
  <A, E>(fallback: () => Future<A>) =>
  (t: Future<Result<A, E>>) => {
    return t.map((t) => {
      if (t.isOk()) {
        return t.get();
      } else {
        return fallback();
      }
    });
  };

export const orElse =
  <A, E, B, F>(fallback: (e: E) => Future<Result<B, F>>) =>
  (t: Future<Result<A, E>>): Future<Result<A | B, E | F>> => {
    return t.flatMap<Result<A | B, E | F>>((r) => {
      if (r.isOk()) {
        return Future.value(r);
      } else {
        return fallback(r.getError());
      }
    });
  };

export const alt = orElse;

export const Do = Future.value(Result.Ok({}));

export const bind =
  <
    K extends string,
    VA extends any,
    VE extends any,
    I extends Record<string, any>,
    E extends any
  >(
    fieldName: K,
    getValue: (record: I) => Future<Result<VA, VE>>
  ) =>
  (
    input: Future<Result<I, E>>
  ): Future<
    Result<
      I & {
        [k in K]: VA;
      },
      E | VE
    >
  > => {
    return input.flatMapOk((record) =>
      getValue(record).mapOk((value) => ({
        ...record,
        [fieldName]: value,
      }))
    );
  };

export const bindW = bind;

export const bindTo =
  <A, E, K extends string>(key: K) =>
  (t: Future<Result<A, E>>): Future<Result<{ [key in K]: A }, E>> =>
    t.mapOk((value) => ({ [key]: value } as { [key in K]: A }));

export const chainEitherK =
  <A, E, F, B>(f: (a: A) => Result<B, F>) =>
  (t: Future<Result<A, E>>) =>
    t.mapOkToResult(f);

export const chainEitherKW = chainEitherK;

export const fromOption =
  <A, E>(getError: () => E) =>
  (o: Option<A>) => {
    return Future.value(o.toResult(getError()));
  };

export const sequenceArray = <A, E>(array: Array<Future<Result<A, E>>>) => {
  return Future.all(array).map(Result.all);
};

export const tap =
  <A, E, F, B>(f: (a: A) => Future<Result<B, F>>) =>
  (t: Future<Result<A, E>>) =>
    t.flatMapOk((x) => {
      return f(x).mapOk(() => Result.Ok(x));
    });

export const chainFirst = tap;
export const chainFirstW = tap;

export const tryCatch = <A, E>(
  getPromise: () => Promise<A>,
  mapError: (error: unknown) => E
) => {
  return Future.fromPromise(getPromise()).mapError(mapError);
};

export const apS =
  <
    K extends string,
    VA extends any,
    VE extends any,
    I extends Record<string, any>,
    E extends any
  >(
    fieldName: K,
    getValue: () => Future<Result<VA, VE>>
  ) =>
  (
    input: Future<Result<I, E>>
  ): Future<
    Result<
      I & {
        [k in K]: VA;
      },
      E | VE
    >
  > => {
    return Future.all([input, getValue()])
      .map(Result.all)
      .mapOk(([record, value]) => ({
        ...record,
        [fieldName]: value,
      }));
  };

export const apSW = apS;

export const asUnit = <A, E>(t: TaskEither<E, A>) => {
  return t.mapOk(constVoid);
};

export const fromPredicate =
  <A, E>(matchesPredicate: (a: A) => boolean, fallback: () => E) =>
  (t: A) => {
    return Future.value(
      Option.fromPredicate(t, matchesPredicate).toResult(fallback())
    );
  };

export const filterOrElse =
  <A, E>(predicate: (a: A) => boolean, fallback: (a: A) => E) =>
  (t: Future<Result<A, E>>): Future<Result<A, E>> => {
    return t.mapOkToResult((a) => {
      return Option.fromPredicate(a, predicate).toResult(fallback(a));
    });
  };

export const filterOrElseW =
  <A, E, F>(predicate: (a: A) => boolean, fallback: (a: A) => F) =>
  (t: Future<Result<A, E>>): Future<Result<A, E | F>> => {
    return t.mapOkToResult((a) => {
      return Option.fromPredicate(a, predicate).toResult(fallback(a));
    });
  };

export const asSideEffect = <A, E, B>(
  getFuture: (a: A) => Future<Result<B, E>>
) => {
  return (a: A) => getFuture(a).mapOk(() => a);
};
