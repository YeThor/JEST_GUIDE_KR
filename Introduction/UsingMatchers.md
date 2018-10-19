# Using Matchers

Jest 는 다양한 방법으로 값을 테스트하기 위해 "Matcher"라는 것을 사용하고 있습니다. 이 문서에서는 주로 쓰이는 Matcher 들을 소개하려고 합니다. 모든 Matcher 들에 대한 정보를 알고 싶다면, [`expect` API doc]문서를 참고해주세요.

## 주로 쓰이는 Matcher

값을 테스트하는 가장 단순한 방법은 *정확히 동일한지*를 알아보는 것입니다.

```jsx
test('2 + 2는 4다`, () => {
    expect(2 + 2).toBe(4);
});
```

이 코드에서 `expect(2 + 2)`는 expectation(기댓값) 객체를 반환합니다. expectation 객체에는 주로 Matcher 를 적용하여 값을 비교합니다. 위 코드에서 `.toBe(4)`는 Matcher 입니다. Jest 는 실행되면 테스트를 통과하지 못한 모든 Matcher 를 추적하여 에러 메세지에 출력해줄 것입니다.

`toBe`는 두 값이 엄격하게 동일한지를 체크하기 위해 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)를 사용합니다. 그저 객체의 값이 같은지만을 체크하고 싶다면, `toEqual`을 사용해도 좋습니다.

```jsx
test("객체 할당", () => {
  const data = { one: 1 };
  data["two"] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});
```

`toEqual`은 각 객체나 배열의 모든 값을 재귀적으로 돌면서 체크합니다. Matcher 에 `not`을 붙이면 반대의 의미를 테스트할 수 있습니다.

```jsx
test("양수끼리 더하면 0이 될 수 없다", () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```

## 참 & 거짓

때로는 `undefined`, `null` 그리고 `false`의 값을 구분하여 테스트해야할 경우가 있습니다. Jest 는 이러한 니즈를 충족하는 다음의 기능을 제공합니다.

- `toBeNull`은 `null`인 값에만 매칭됩니다.
- `toBeUndefined`는 `undefined`인 값에만 매칭됩니다.
- `toBeDefined`는 `toBeUndefined`의 반대 경우를 테스트할 때 쓰입니다.
- `toBeTruthy`는 `true`로 취급되는 값이 있으면 매칭됩니다.
- `toBeFalsy`는 `false`로 취급되는 값이 있으면 매칭됩니다.

```jsx
test("null", () => {
  const n = null;

  // 모두 true를 반환합니다.
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test("zero", () => {
  const z = 0;

  // 모두 true를 반환합니다.
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

Matcher 는 테스트하고자 하는 코드의 의도에 맞게 최대한 정확하게 써야 합니다.

## 숫자

숫자를 비교하는 가장 흔한 방법은 두 값이 동일한지를 살펴보는 것입니다.

```jsx
test("2에 2를 더한다", () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThan(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe와 toEqual은 숫자에 대해서는 동일하게 동작합니다.
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```

정수가 아닌 실수값인 경우, 두 값이 동일한지 테스트할 때 `toEqual` 대신 `toBeCloseTo`를 써야 합니다. 그러지 않으면 작은 끝수처리 오차로 인해 테스트가 오동작할 수 있습니다.

```jsx
test("실수값을 더한다", () => {
  const value = 0.1 + 0.2;

  // expect(value).toBe(0.3); 소숫점 단위의 오차로 인해 테스트를 통과하지 못합니다.
  expect(value).toBeCloseTo(0.3); // 제대로 동작합니다.
});
```

## 문자열

`toMatch`를 사용하면 정규식을 이용한 문자열 테스트가 가능합니다.

```jsx
test("team에는 I라는 글자가 없다", () => {
  expect("team").not.toMatch(/I/);
});

test("그러나 Christoph에는 stop이라는 글자가 포함되어 있다.", () => {
  expect("Christoph").toMatch(/stop/);
});
```

## 배열

`toContain`을 사용하면 배열이 특정 요소를 가지고 있는지 테스트할 수 있습니다.

```jsx
const shoppingList = [
  "diapers",
  "kleenex",
  "trash bags",
  "paper towels",
  "beer"
];

test("shoppingList에 beer가 포함되어 있다", () => {
  expect(shoppingList).toContain("beer");
});
```

## 예외 처리

에러를 던져야 하는 함수를 테스트하고 싶다면, `toThrow`를 사용합니다.

```jsx
function compileAndroidCode() {
  throw new ConfigError("잘못된 JDK를 사용하고 있습니다.");
}

test("compileAndroidCode 함수는 에러를 내야 한다", () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(ConfigError);

  // 정확한 에러메세지 문자열이나, 정규식을 활용할 수도 있습니다.
  expect(compileAndroidCode).toThrow("잘못된 JDK를 사용하고 있습니다.");
  expect(compileAndroidCode).toThrow(/JDK/);
});
```

## 더 알아보고 싶다면

이건 그저 맛보기였을 뿐입니다. 사용 가능한 모든 Matcher 들을 보고 싶다면, [참고 문서](https://jestjs.io/docs/en/expect)를 확인하세요.

사용 가능한 Matcher 들에 대해 배웠으니, 다음 단계에선 Jest 로 [비동기 코드를 테스트하는 방법]에 대해 배워보도록 하겠습니다.
