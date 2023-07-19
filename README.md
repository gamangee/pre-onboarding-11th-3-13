![header](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=원티드%20프리온보딩%2011차%203주차%20과제&fontSize=45)

![3주차 과제 시연영상](./3week-assignment.gif)

<br/>

# 목차

[1. 배포](#배포)
<br/>
[2. 프로젝트 실행 방법](#프로젝트-실행-방법)
<br/>
[3. 기술 스택과 폴더 구조](#기술-스택)
<br/>
[4. 기능 구현](#기능-구현)

> [이슈 목록 및 상세 화면](#1-이슈-목록-및-상세-화면)

> [Context API를 활용한 GITHUB API 연동](#2-context-api를-활용한-github-api-연동)

> [무한 스크롤](#3-무한-스크롤)

> [이슈 목록 5번째 셀마다 광고 이미지 출력](#4-이슈-목록-5번째-셀마다-광고-이미지-출력)

> [데이터 요청 시 로딩 표시](#5-데이터-요청-시-로딩-표시)

> [에러 화면 구현](#6-에러-화면-구현)

[5. 회고](#회고)

<br/>

# 배포

### [원티드 프리온보딩 인턴십 3주차 과제 - 배포 링크](https://pre-onboarding-11th-3-13.vercel.app/)

<br/>

## 프로젝트 실행 방법

1. 프로젝트 clone

```bash
    $ git clone https://github.com/gamangee/pre-onboarding-11th-3-13.git
```

2. 프로젝트 directory로 이동

```bash
 $ cd pre-onboarding-11th-3-13
```

3. root directory에 .env 파일 생성 후 아래 내용 추가

```bash
VITE_GITHUB_BASE_URL=https://api.github.com/repos
VITE_GITHUB_API_KEY="your github access token key"
```

4. 프로젝트 관련 라이브러리 다운로드

```bash
$ npm install
```

5. 프로젝트 실행

```bash
$ npm start
```

<br/>

## 기술 스택

![react](https://img.shields.io/badge/react-18.2.0-61DAFB?logo=react)
![javascript](https://img.shields.io/badge/typescript-5.0.2-3178C6?logo=typescript)
![emotion](https://img.shields.io/badge/emotion-11.11.1-F43059?logo=emotion)
![reactrouter](https://img.shields.io/badge/react--router--dom-6.14.1-CA4245?logo=reactrouter)
![axios](https://img.shields.io/badge/axios-1.4.0-5A29E4?logo=axios)
![eslint](https://img.shields.io/badge/eslint-8.44.0-A100FF?logo=eslint)
![prettier](https://img.shields.io/badge/prettier-3.0.0-F7B93E?logo=prettier)
![reactMarkdown](https://img.shields.io/badge/react--markdown-8.0.6-00A98F?logo=reactMarkdown)

<br/>

## 📂 폴더 구조

```bash
src
 ┣ api
 ┃ ┗ GithubIssueApi.tsx
 ┣ assets
 ┃ ┗ icons.tsx
 ┣ components
 ┃ ┣ IssueDetail
 ┃ ┃ ┗ Markdown.tsx
 ┃ ┗ IssueList
 ┃ ┃ ┣ Ad.tsx
 ┃ ┃ ┣ Filter.tsx
 ┃ ┃ ┗ ListItem.tsx
 ┣ context
 ┃ ┗ IssueContext.tsx
 ┣ pages
 ┃ ┣ IssueDetail
 ┃ ┃ ┣ IssueDetail.tsx
 ┃ ┃ ┗ IssueDetailCSS.tsx
 ┃ ┗ IssueList
 ┃ ┃ ┣ IssueList.tsx
 ┃ ┃ ┗ IssueListCSS.tsx
 ┣ types
 ┃ ┣ IssueDetailTypes.tsx
 ┃ ┣ IssueFilterTypes.tsx
 ┃ ┗ IssueListTypes.tsx
 ┣ App.tsx
 ┣ NotFound.tsx
 ┣ main.tsx
 ┗ vite-env.d.ts

```

<br/>

# 기능 구현

## 1. 이슈 목록 및 상세 화면

> 💡 전체적인 UI흐름을 위해 직관적인 컴포넌트 이름으로 화면을 어떻게 구현하였는지 표현하였습니다. 실제 코드에서는 컴포넌트 이름이 다를 수 있습니다.

1. IssueList Component

```js
<div>
  <Filter />
  {isFilterLoading ? (
    <FilterLoading />
  ) : (
    <IssueList> {isAdZone ? <Ad /> : <ListItem issue={issue} />} </IssueList>
  )}
  {isInfiniteScrollLoading && <ScrollLoading />}
</div>
```

2. IssueDetail Component

```js
<div>
  {isLoading && <DetailLoading />}
  {!isLoading && (
    <div>
      <GoToBackBtn />
      <DetailIssue />
      <Markdown />
    </div>
  )}
</div>
```

1️⃣ 처음에는 open 상태, 코멘트 많은 순으로 데이터를 보여줍니다.
<br />
2️⃣ 사용자가 정렬 필터를 선택할 때마다 새로운 데이터를 불러옵니다.
<br />
3️⃣ 또한 무한스크롤 기능으로 사용자가 간편하게 리스트를 확인할 수 있게 기능을 구현하였습니다.
<br />
4️⃣ 리스트 목록을 클릭하면 특정 이슈 페이지로 이동합니다.
<br />
5️⃣ 뒤로가기 버튼을 누르면 이전 페이지로 이동합니다.
<br />
6️⃣ 특정 이슈 페이지에서 글을 쓴 사람의 프로필 이미지를 클릭하면 깃헙 개인 링크로 이동합니다.

<br />

## 2. Context API를 활용한 GITHUB API 연동

1. Github API axios class로 구현

```js

const headers = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: `Bearer ${GITHUB_API_KEY}`,
  'X-GitHub-Api-Version': '2022-11-28',
};

class GithubAPIManager {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: GITHUB_BASE_URL,
      headers,
    });
  }
  async getIssueList(
    owner: string,
    repo: string,
    page: number,
    state: StateFilter,
    sort: SortFilter,
    direction: DirectionFilter
  ) {
    try {
      const response = await this.axiosInstance.get(
        `/${owner}/${repo}/issues`,
        {
          params: {
            state,
            sort,
            direction,
            page,
          },
        }
      );

      const issues = response.data.map(
        (issue: IssueOriginProps): IssueProps => ({
          id: issue.id,
          issueNumber: issue.number,
          title: issue.title,
          author: issue.user.login,
          createdAt: issue.created_at,
          commentCount: issue.comments,
          labels: issue.labels.map(
            (label: LabelOrginProps): LabelProps => ({
              id: label.id,
              name: label.name,
              color: label.color,
            })
          ),
        })
      );

      return issues;
    } catch (error) {
      console.log(error);
    }
  }

  async getIssueDetail(owner: string, repo: string, issueId: string) {
    try {
      const response = await this.axiosInstance.get(
        `/${owner}/${repo}/issues/${issueId}`
      );

      const issueDetailData = response.data;

      const issueDetail: IssueDetailProps = {
        id: issueDetailData.id,
        number: issueDetailData.number,
        title: issueDetailData.title,
        comments: issueDetailData.comments,
        createdAt: issueDetailData.created_at,
        body: issueDetailData.body,
        userId: issueDetailData.user.id,
        author: issueDetailData.user.login,
        profileUrl: issueDetailData.user.avatar_url,
        profileLink: issueDetailData.user.html_url,
      };

      return issueDetail;
    } catch (error) {
      console.log(error);
    }
  }
}

export const githubApi = new GithubAPIManager();
```

👉 통신 관련 로직을 함수 대신 class로 생성하여 상태값을 기억할 수 있게 하였습니다.
또한 axios로 데이터를 받아와 headers와 params를 인자로 넣어주어 가독성을 높였습니다.
github api에서 불어온 데이터를 다 사용하지 않는 점을 생각하여 화면 UI에 필요한 key값만 issues, issueDetail에 담아 contextAPI에서 관리하도록 하였습니다.

2. Issue 관련 정보를 담고 있는 ContextAPI

```js
export function IssueProvider({ children }: IssueProviderProps) {
  const [issueListInfo, setIssueListInfo] = useState<IssueProps[]>([]);
  const [issueDetailInfo, setIssueDetailInfo] = useState<IssueDetailProps>({
    id: 0,
    number: 0,
    title: '',
    comments: 0,
    createdAt: null,
    body: '',
    userId: 0,
    author: '',
    profileUrl: '',
    profileLink: '',
  });

  const [stateFilter, setStateFilter] = useState<StateFilter>(StateFilter.Open);
  const [sortFilter, setSortFilter] = useState<SortFilter>(SortFilter.Comments);
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>(
    DirectionFilter.Desc
  );

  const getIssueListInfo = (issues: IssueProps[], isAppend: boolean = true) => {
    setIssueListInfo((prev: IssueProps[]) =>
      isAppend ? [...prev, ...issues] : [...issues]
    );
  };

  const getIssueDetailInfo = (issueDetail: IssueDetailProps) => {
    setIssueDetailInfo(issueDetail);
  };

  return (
    <IssueContext.Provider
      value={{
        issueListInfo,
        getIssueListInfo,
        issueDetailInfo,
        getIssueDetailInfo,
        stateFilter,
        setStateFilter,
        sortFilter,
        setSortFilter,
        directionFilter,
        setDirectionFilter,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export const useIssueContext = () => useContext(IssueContext);
```

👉 ContextAPI를 생생하여 이슈리스트, 특정이슈, 정렬값(state, sort, direction) 정보를 담았습니다. useIssueContext라는 훅을 만들고 이 부분만 export 해서 다른 컴포넌트에서 바로 꺼내쓸 수 있도록 하였습니다.

<br />

## 3. 무한 스크롤

1. intersectionObserver API 사용

```js
 const lastIssueElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (isInfiniteScrollLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isInfiniteScrollLoading]
  );
```

👉 이슈 목록리스트의 마지막 li에 lastIssueElementRef을 지정하여 관찰하게 하였습니다.
화면에서 타켓요소인 li의 마지막 요소에 교차할 때 useState의 page값을 1씩 증가시킵니다.

2. 기존 데이터 뒤에 새로운 데이터 불러오기

```js
useEffect(() => {
  const getMoreIssueLists = async () => {
    if (page === 1) return;

    setIsInfiniteScrollLoading(true);
    try {
      const issueListData = await githubApi.getIssueList(
        owner,
        repo,
        page,
        stateFilter,
        sortFilter,
        directionFilter
      );
      getIssueListInfo(issueListData, true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsInfiniteScrollLoading(false);
    }
  };

  getMoreIssueLists();
}, [page]);
```

👉 사용자가 이슈리스트의 마지막 요소 아래로 스크롤 하려고 할 때 useState의 page값이 증가합니다.
이때 useEffect 의존성 배열에 page가 있기 때문에 getMoreIssueLists 함수가 실행됩니다.
이러한 흐름으로 새로운 리스트를 보여줄 수 있습니다.

3. 새로운 데이터 불러오기 vs 기존데이터 뒤에 새로운 데이터 붙이기

```js
  const getIssueListInfo = (issues: IssueProps[], isAppend: boolean = true) => {
    setIssueListInfo((prev: IssueProps[]) =>
      isAppend ? [...prev, ...issues] : [...issues]
    );
  };
```

👉 무한스크롤 기능을 구현하려면 api 요청으로 받아온 데이터를 받을 때 한번 더 생각해보아야 합니다!
사용자가 스크롤했을 때 자연스럽게 새로운 데이터를 불러오게 해주려면 기존 데이터 뒤에 새로운 데이터를 붙이는 방식으로 구현해야 하기 때문입니다.
👉 이슈 리스트를 불러오는 api는 무한스크롤과 정렬필터 기능을 할 때 쓰입니다. 하지만 각각 다른 params를 받아야하기 때문에 getIssueListInfo의 두번째 인자로 불리언값을 받아서 구분하였습니다.

<br />

## 4. 이슈 목록 5번째 셀마다 광고 이미지 출력

1. 다섯번째 셀 찾기

```js
 const adZone = (index: number) => (index + 1) % 5 === 0;
```

👉 IssueList 배열의 index를 활용하여 배열의 다섯번째 위치일 때를 adZone이라는 변수에 할당하였습니다.

2. 조건에 따라 Ad / ListItem 보여주기

```js
<ul css={listStyle}>
  {issueListInfo?.map((issue, index) => {
    const issueId = issue.issueNumber;
    const isAdZone = adZone(index);
    return (
      <li
        ref={index === issueListInfo.length - 1 ? lastIssueElementRef : null}
        css={itemStyle}
        key={index + issue.title}
        onClick={() => {
          goToDetail(issueId, isAdZone);
        }}
      >
        {isAdZone ? <Ad /> : <ListItem issue={issue} />}
        <div css={line} />
      </li>
    );
  })}
</ul>
```

👉 이슈리스트 배열을 담고 있는 issueListInfo에서 5번째 셀을 찾아 맞으면 Ad, 아닐 시에는 ListItem 컴포넌트를 보여주도록 분기 처리하였습니다.

<br />

## 5. 데이터 요청 시 로딩 표시

1. IssueList Component
   1-1. 무한스크롤

```js
const [isInfiniteScrollLoading, setIsInfiniteScrollLoading] = useState(false);

{
  isInfiniteScrollLoading && <div css={scrollLoading}>Scroll Loading...</div>;
}
```

👉 무한스크롤의 핵심은 사용자가 스크롤을 내렸을 경우 기존데이터 아래로 새로운 데이터를 불어와야 합니다.
이때 데이터를 받고 있을 시에는 사용자가 에러가 아님을 인지할 수 있도록 화면 하단에 Scroll Loading라는 글씨를 보여주도록 처리하였습니다.

1-2. 정렬 필터

```js
const [isFilterLoading, setIsFilterLoading] = useState(false);

<div>
  <Filter />
  {isFilterLoading ? (
    <div css={filterLoading}>Filter Loading...</div>
  ) : (
    <ul>{이슈리스트}</ul>
  )}
</div>;
```

👉 정렬 필터를 선택할 때마다 새로운 데이터를 요청해야 합니다. 데이터를 받고 있을 때는 select태그 아래에 있는 리스트들 대신 Filter Loading라는 표시가 보이도록 설정하였습니다.

2. IssueDetail Component

```js
const [isLoading, setIsLoading] = useState(false);

<div>
  {isLoading && <div css={detailLoading}>Detail Loading...</div>}
  {!isLoading && <IssueDetail />}
</div>;
```

👉 로딩 상태를 IssueDetail 전체 코드에 감싸주어 데이터를 받아오고 있을 때는 Detail Loading 이라는 글씨가 보이도록 하였습니다.

<br />

## 6. 에러 화면 구현

1. errorElement

```js
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: '/', element: <IssueList /> },
      {
        path: '/issue/:issueId',
        element: <IssueDetail />,
      },
    ],
  },
]);
```

👉 react-router-dom 버전6의 createBrowserRouter으로 라우터를 만들었습니다.
errorElement 속성을 이용하여 루트 경로인 '/' 포함 children 컴포넌트에서 발생하는 모든 에러는 NotFound 컴포넌트로 갈 수 있도록 지정하였습니다.

2. NotFound Component

```js
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

const TextAlign = css`
  text-align: center;
  margin-top: 200px;
  font-size: 24px;
`;

const goHomeBtn = css`
  outline: none;
  border: none;
  background-color: #000000;
  color: #ffffff;
  padding: 10px 30px;
  margin-top: 30px;
  border-radius: 10px;
  cursor: pointer;
`;

export default function NotFound() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/');
  };
  return (
    <div css={TextAlign}>
      <h1>NotFound</h1>
      <div>페이지를 찾을 수 없습니다.</div>
      <button css={goHomeBtn} onClick={goToHome}>
        home
      </button>
    </div>
  );
}
```

👉 home 버튼을 구현하여 클릭 시 메인페이지로 이동하게 navigate 처리하였습니다.

<br />

## 회고

> 🤦🏻‍♀️ **어이없는 실수가 원인을 찾기 더 어렵다**

이번 과제는 무한스크롤 기능에 대해서 고민해보는 시간을 가져보라는 의미가 아니였나 예상해봅니다. 무한스크롤 기능을 구현하는 여러 가지 방식 중에서도 브라우저 성능을 고려하여 스크롤 위치를 감지하는 방식 보다 root영역에 target이 교차할 때를 감지하는 intersection observer API를 사용해 보았습니다. observe함수가 target 즉 li의 마지막 요소에 도달했을 때 새로운 데이터를 불러오면 되겠다고 생각했습니다.

그러던 중 지정해 놓은 target에 스크롤이 도달하면 전체 리스트 페이지가 새로 랜더링되는 치명적인 현상을 발견하였습니다. 도대체 왜 저의 코드에서만 이런 현상이 일어난 것인지 데이터의 흐름을 파악하기 위해 콘솔도 여러 번 찍어보고 다른 사람들이 한 코드도 찾아 읽어보고 했지만 이틀을 디버깅해도 원인을 찾을 수가 없었습니다. 그래서 새로운 마음으로 처음부터 다시 코드를 쳐보자 마음을 먹었습니다. 페이지가 마운트되서 언마운트될 때 까지를 상상하며 코드를 살펴보던 그 때 비로소 발견했습니다.

원인은 데이터 요청 중 로딩 표시하는 범위였습니다. 과제 필수 요구 사항에 데이터를 받아올 때 로딩 표시를 해야하는 조건이 있었습니다. 제가 이 조건을 보자마자 react-query가 허용이 안되기 때문에 useState로 loading을 만들어서 코드 전체에 걸어두었던 것입니다.

```js
<div>
  {loading && <div>Data Loading...</div>}
  {!loading && <IssueList />}
</div>
```

위의 조건을 없애고 나니 기존 데이터에서 새로운 데이터가 추가되는 방식으로 제대로 작동하는 것을 확인했습니다.

마치 의식적으로 걸어두었던 조건문이 저의 발목을 잡았을 거라고는 전혀 예상하지 못했습니다. 그래도 다른 사람은 어떻게 구현했는지 찾아보고 코드 한줄 한줄 꼼꼼히 비교하며 읽어볼 수 있는 경험을 하게 되어 좋았습니다. 또 스스로 문제를 파악하고 이를 해결하려고 노력해보니 뿌듯한 마음이 드네요😁
