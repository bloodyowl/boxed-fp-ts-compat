## how to refactor

### side effects

```ts
pipe(a, taskEither.tap(f));
```

into:

```ts
a.flatMapOk(asSideEffect(f));
```

**note:** it most likely means that `f` shouldn't return `TaskEither<E, void>` but rather `TaskEither<E, A>`.

## not replaced

### apAcc

```ts
const amountValidation = validateAmountValue(input.value);
const currencyValidation = validateCurrencyCode(input.currency);

const errors = [
  ...match(amountValidation)
    .with(Result.P.Error(P.select()), (error) => [error])
    .otherwise([]),
  ...match(currencyValidation)
    .with(Result.P.Error(P.select()), (error) => [error])
    .otherwise([]),
];

const validatedInput =
  errors.length > 0 ? Result.Error(errors) : Result.Ok(input);
```

### sequenceSeqArray

Futures are sequential.

```ts
Future.concurrent(futureGetters, { concurrency: 1 });
```

### elem/Eq

Just use `===`.

```ts
const eqBirthdate = { equals: (x: Date, y: Date) => dayjs(x).isSame(y, "day") };

!option.elem(eqBirthdate)(expected, actual);
```

into

```ts
actual.map((date) => dayjs(date).isSame(expected, "day")).getOr(false);
```

and

```ts
option.elem(string.Eq)(expected, actual);
```

into

```ts
actual === Option.Some(expected);
```

### array.match

```ts
array.match(
  () => taskEither.right([]),
  (ids) => {
    // data-loaders are request-scoped, so we can assert that the context of the first line will be the only one
    const [{ context }] = ids;
    const accountMembershipIds = [
      ...new Set(ids.map(({ accountMembershipId }) => accountMembershipId)),
    ];
    return pipe(
      this.accountMembershipRepository.findByIds(accountMembershipIds, context),
      taskEither.map(
        array.map((accountMembership) => ({ accountMembership, context }))
      )
    );
  }
// );
```

into

```ts
match(array)
  .with([], () => Future.value(Result.Ok([])))
  .otherwise((ids) => {
    const [{ context }] = ids;
    const accountMembershipIds = [
      ...new Set(ids.map(({ accountMembershipId }) => accountMembershipId)),
    ];

    return this.accountMembershipRepository
      .findByIds(accountMembershipIds, context)
      .map((accountMembership) => ({ accountMembership, context }));
  });
```

### array.takeLeft

Use `array.slice(0, x)`

### array.uniq

Use `Set`:

```ts
array.uniq(eq.struct({ id: eqString }));
```

into

```ts
const seen = new Set();
const filtered = array.filter((item) => {
  if (seen.has(item.id)) {
    return false;
  }
  seen.add(item.id);
  return true;
});
```
