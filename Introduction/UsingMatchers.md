# Using Matchers

Jest는 다양한 방법으로 값을 테스트하기 위해 "Matcher"라는 것을 사용하고 있습니다. 이 문서에서는 주로 쓰이는 Matcher들을 소개하려고 합니다. 모든 Matcher들에 대한 정보를 알고 싶다면, [`expect` API doc]문서를 참고해주세요.

## 주로 쓰이는 Matcher

값을 테스트하는 가장 단순한 방법은 *정확히 동일한지*를 알아보는 것입니다.
```jsx
test('2 + 2는 4다`, () => {
    expect(2 + 2).toBe(4);
});
```
