# 설치 및 시작

> 원문 https://jestjs.io/docs/en/getting-started

`yarn`을 이용하여 설치하거나,

```
$yarn add --dev jest
```

`npm`을 이용하여 설치할 수 있습니다.

```
npm install --save-dev jest
```

두 개의 숫자를 더하는 간단한 함수를 예시로 삼아 테스트를 작성하겠습니다. 먼저, `sum.js` 파일을 만듭니다:

```js
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

그 다음, `sum.test.js`라는 이름의 테스트 파일을 작성합니다. 이 파일에서 실제 테스트가 일어납니다:

```js
const sum = require("./sum");

test("1 + 2 의 값은 3과 같다", () => {
  expect(sum(1, 2)).toBe(3);
});
```

`package.json` 파일 안에 다음을 추가합니다.

```
{
    "scripts": {
        "test": "jest"
    }
}
```

마지막으로, `yarn test`를 터미널에서 실행하면 Jest 는 다음 메세지를 출력할 것입니다.

```
PASS ./sum.test.js
:heavy_check_mark: adds 1 + 2 to equal 3 (5ms)
```

**Jest 를 이용한 첫번째 테스트 작성을 성공적으로 끝마쳤습니다!**

이 테스트는 두 값(`1 + 2`, `3`)이 정확히 동일한지 테스트하기 위해 `expect`와 `toBe`를 사용했습니다. Jest 가 테스트할 수 있는 것들을 더 배워보고 싶다면, [Using Matchers] 문서를 참고하세요.

## 커맨드 라인에서 실행하기

CLI 에서 Jest 를 바로 실행시킬 수도 있습니다. 다양하고 유용한 옵션들도 사용 가능합니다. (단, `yarn global add jest` 등을 이용한 설치로 전역적인 Jest 사용이 가능해야 합니다.)

설정 파일인 `config.json`와 함께 Jest 로 `my-test`파일을 테스트해보겠습니다. 실행 후에는 네이티브 OS 알림들이 표시될 것입니다.

```
jest my-test --notify --config=config.json
```

커맨드 라인을 이용한 `jest` 명령어 사용에 대해 더 자세히 배우고 싶다면, [Jest CLI Options]문서를 참고하세요.

## 추가 설정

### 기본 설정 파일 만들기

다음 명령어를 실행하면 Jest 는 당신의 현 프로젝트에 기반하여 몇가지 질문을 한 다음, 기본적인 설정 파일을 생성해줄 것입니다. 이 파일의 각 옵션에는 짧은 설명도 포함되어 있습니다.

```
jest --init
```

### 바벨 사용

[Babel]을 쓰기 위해선 `babel-jest`와 `regenerator-runtime` 패키지가 설치되어 있어야 합니다.

```
yarn add --dev babel-jest babel-core regenerator-runtime
```

> Note: 만일 Babel 7 버전을 사용하고 있다면, `babel-jest`,`babel-core@^7.0.0-bridge.0` 그리고 `@babel/core`를 설치해야 합니다: <br>`yarn add --dev babel-jest babel-core@^7.0.0-bridge.0 @babel/core regenerator-runtime`<br><br>node_modules 를 트랜스파일하기 위해선 `babel.config.js`를 이용해야 합니다. 더 자세한 것은 https://babeljs.io/docs/en/next/config-files 를 참고하세요.<br><br> 다음 저장소에서도 예시를 확인할 수 있습니다:https://github.com/facebook/jest/tree/master/examples/babel-7

_Note: `npm` 3,4 버전, 혹은 `yarn`을 사용중이라면 명시적으로 `regenerator-runtime`을 설치할 필요는 없습니다._

프로젝트의 루트 폴더에 `.babelrc` 파일을 꼭 추가하세요. 예를 들어 ES6 와 [React.js]가 사용된 프로젝트에 `babel-preset-env`와 `babel-preset-react` 프리셋을 적용하고 싶다면 다음처럼 작성하면 됩니다.

```json
{
  "presets": ["env", "react"]
}
```

이제 모든 ES6 기능과 React 특유적인 문법들을 사용할 수 있도록 환경이 세팅되었습니다.

> Note: 만일 `env`옵션과 함께 더 복잡한 Babel 설정을 사용하고 있다면, Jest 는 자동적으로 `NODE_ENV`를 `test`로 정의할 것입니다. 다시 말해, Jest 는 `NODE_ENV`가 정의되어 있지 않을때 Babel 이 기본적으로 수행했을 `development` 섹션을 사용하지 않습니다.

> Note: 만약 프로젝트가 `{"modules": false}` 등의 옵션으로 ES6 모듈을 트랜스파일하지 않더라도, 테스트 환경에선 ES6 모듈을 트랜스파일하는 방향으로 옵션이 설정되어 있어야만 합니다.

```json
{
  "presets": [["env", { "modules": false }], "react"],
  "env": {
    "test": {
      "presets": [["env"], "react"]
    }
  }
}
```

> Note: `babel-jest`는 Jest 가 설치될 때 자동 설치됩니다. 또한 현 프로젝트에 바벨 설정이 적용되어있다면 파일들을 자동으로 변환할 것입니다. 이를 막고 싶다면, 명시적으로 `transform` 설정 옵션을 다음처럼 리셋시켜야 합니다.

```json
// package.json
{
  "jest": {
    "transform": {}
  }
}
```

### Webpack 사용하기

Webpack 은 여러 자원과 컴파일을 매니징할 수 있게 도와주는 모듈 번들러입니다. Jest 는 이러한 Webpack 이 적용되어있는 프로젝트에서도 쓸 수 있습니다. Webpack 은 그 어떤 툴보다 더 유용하고 멋진 기능을 제공하고 있습니다. 관련 내용이 궁금하다면 [Webpack 과 함께 사용하기] 문서를 보시기 바랍니다.

### Typescript 사용하기

Typescript 를 Jest 와 함께 쓰고 싶다면 [ts-jest]를 사용하면 됩니다.
