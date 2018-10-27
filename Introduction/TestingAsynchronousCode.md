# Testing Asynchronous Code

> 비동기 코드를 테스트하는 방법

비동기 코드는 자바스크립트에서 흔하게 볼 수 있는 코드입니다. 비동기적으로 동작하는 코드를 테스트하기 위해서, Jest는 그 코드가 언제 동작을 완료하는지 알아야만 다음 테스트로 넘어가는 우를 범하지 않을 것입니다. Jest는 다음과 같은 방법으로 비동기 코드를 테스트할 수 있습니다.

## Callbacks

콜백 함수는 가장 흔하게 볼 수 있는 비동기 패턴입니다.

`fetchData(callback)`라는 함수를 예시로 들어보겠습니다. 이 함수는 데이터를 요청한 후 데이터가 도착하면 `callback(data)`를 호출합니다. 여기서 반환된 데이터 값이 문자열 `'peanut butter'`임을 테스트해야 하는 상황이라고 가정해보겠습니다.

기본적으로, Jest는 마지막 코드까지 실행되면 테스트를 끝마칩니다. 다시 말해 다음 코드로 작성된 테스트는 의도한 대로 작동하지 _않을_ 것입니다.

```jsx
// 이렇게 하지 마세요!
test("data의 값은 peanut butter이다", () => {
  function callback(data) {
    expect(data).toBe("peanut butter");
  }

  fetchData(callback);
});
```

`fetchData`가 실행되는 순간, 테스트는 콜백 함수가 미처 호출되지 못한 채로 종료되어버립니다.

이를 바로잡고 싶다면, `test`의 방식을 조금 바꾸어야 합니다. 기존 코드처럼 빈 인수를 넣는 대신, `done`이라는 인수를 넣으면 됩니다. 그러면 Jest는 `done`이 호출될 때까지 테스트를 종료하지 않고 기다릴 것입니다.

```jsx
test("data의 값은 peanut butter이다", done => {
  function callback(data) {
    expect(data).toBe("peanut butter");
    done();
  }

  fetchData(callback);
});
```

만약 `done`이 실행되지 않는다면 테스트는 실패할 것입니다. 정확히 의도한 대로죠.

## Promises

만약 Promise를 사용 중이라면, 비동기 코드를 더 쉽게 테스트할 수 있습니다. Jest로 하여금 테스트로부터 Promise를 리턴하게 하면, Jest는 해당 Promise가 resolve 될 때까지 기다립니다. 만약 Promise가 reject되면, 테스트는 실패합니다.

`fetchData`라는 함수를 다시 예시로 들어보겠습니다. 이전과 달리 이 함수는 callback을 쓰지 않고, 문자열 `'peanut butter'`로 resolve되는 Promise를 반환합니다. 이런 경우엔 다음처럼 테스트하면 됩니다.

```jsx
test("data의 값은 peanut butter이다", () => {
  expect.assertions(1);
  return fetchData().then(data => {
    expect(data).toBe("peanut butter");
  });
});
```

Promise를 반환하는 것을 잊지 마세요. 만일 이 `return` 코드를 빠뜨린다면, 테스트는 `fetchData`의 동작이 완료되기도 전에 종료될 것입니다.

만약 Promise가 reject되는 경우를 테스트하고 싶다면, `.catch` 메소드를 사용하면 됩니다. `expect.assertions`를 추가하는 것을 잊지 마세요. 이 함수는 assertion(*번역자: 단언이라는 뜻, 즉 테스트로 `~일 것이다`라고 선언한 부분을 일컫습니다. 쉽게는 `expect` 구문이라고 보면 됩니다.*)이 정확히 몇 번 실행되었는지를 테스트합니다. 이를 추가하지 않을 경우, 만약 Promise가 resolve되어버리면 테스트는 그대로 통과되어버릴 것입니다. 

```jsx
test('error가 나면서 데이터 fetch에 실패한다', () => {
    expect.assertions(1);
    return fetchData().catch(e => expect(e).toMatch('error'));
});
```

## .resolves / .rejects


