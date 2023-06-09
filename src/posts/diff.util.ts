export class DiffUtil {
  // 문장에서 단어 찾기
  diffLineToWord = (originalText, modifiedText) => {
    const diff = [];
    const dp = [];
    // DP 테이블 초기화
    for (let i = 0; i <= originalText.length; i++) {
      dp[i] = [];
      dp[i][0] = i;
    }

    for (let j = 0; j <= modifiedText.length; j++) {
      dp[0][j] = j;
    }

    // 최소 편집 거리 계산
    for (let i = 1; i <= originalText.length; i++) {
      for (let j = 1; j <= modifiedText.length; j++) {
        if (originalText[i - 1] === modifiedText[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // 삭제
            dp[i][j - 1] + 1, // 추가
          );
        }
      }
    }

    // 변경 사항 추적
    let i = originalText.length;
    let j = modifiedText.length;
    let currentAddition = '';
    let addIdx = 0;

    let currentRemoval = '';
    let removeIdx = 0;

    // 단어 하나 하나 처리함.
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && originalText[i - 1] === modifiedText[j - 1]) {
        if (currentAddition !== '') {
          diff.unshift({ type: 'add', value: currentAddition, idx: addIdx });
          currentAddition = '';
        }
        if (currentRemoval !== '') {
          diff.unshift({
            type: 'remove',
            value: currentRemoval,
            idx: removeIdx,
          });
          currentRemoval = '';
        }
        // diff.unshift({ type: "equal", value: originalText[i - 1] });
        i--;
        j--;
      } else if (
        i > 0 &&
        j > 0 &&
        dp[i][j] === dp[i - 1][j] + 1 &&
        originalText[i - 1] !== modifiedText[j - 1]
      ) {
        // 삭제
        currentRemoval = originalText[i - 1] + currentRemoval;
        removeIdx = i - 1;
        i--;
        if (currentAddition !== '') {
          diff.unshift({ type: 'add', value: currentAddition, idx: addIdx });
          currentAddition = '';
        }
      } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
        // 추가
        currentAddition = modifiedText[j - 1] + currentAddition;
        addIdx = j - 1;
        j--;
        if (currentRemoval !== '') {
          diff.unshift({
            type: 'remove',
            value: currentRemoval,
            idx: removeIdx,
          });
          currentRemoval = '';
        }
      }
    }

    // 반복 후 마지막에 첫 문자열에 적용해줌.
    if (currentAddition !== '') {
      diff.unshift({ type: 'add', value: currentAddition, idx: addIdx });
    }
    if (currentRemoval !== '') {
      diff.unshift({ type: 'remove', value: currentRemoval, idx: removeIdx });
    }
    return diff;
  };

  applyLineToWord = (original, diff) => {
    let modified = original;

    for (let i = 0; i < diff.length; i++) {
      const { type, value, idx } = diff[i];
      if (type === 'add') {
        modified = modified.slice(0, idx) + value + modified.slice(idx);
        for (let j = i + 1; j < diff.length; j++) {
          // add는 modifiedText 기준으로 생성된 애들이기 때문에 이미 추가가 진행된 상태의 idx이기 때문에 적용을 안 해준다.
          if (diff[j].type === 'add') {
            // diff[j].idx += value.length;
          } else if (diff[j].type === 'remove') {
            diff[j].idx += value.length;
          }
        }
      } else if (type === 'remove') {
        modified = modified.slice(0, idx) + modified.slice(idx + value.length);
        for (let j = i + 1; j < diff.length; j++) {
          if (diff[j].type === 'add') {
            // diff[j].idx -= value.length;
          } else if (diff[j].type === 'remove') {
            diff[j].idx -= value.length;
          }
        }
      }
      console.log(modified, idx);
    }
    return modified;
  };

  // 문단에서 문장 찾기
  diffArticleToLine = (originalArticle, modifiedArticle) => {
    const diff = [];
    const dp = [];
    // DP 테이블 초기화
    for (let i = 0; i <= originalArticle.length; i++) {
      dp[i] = [];
      dp[i][0] = i;
    }

    for (let j = 0; j <= modifiedArticle.length; j++) {
      dp[0][j] = j;
    }

    // console.log(dp);

    // 최소 편집 거리 계산
    // 근대 이걸 좀 수정해야 할 것 같음.
    for (let i = 1; i <= originalArticle.length; i++) {
      for (let j = 1; j <= modifiedArticle.length; j++) {
        if (originalArticle[i - 1] === modifiedArticle[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // 삭제
            dp[i][j - 1] + 1, // 추가
            dp[i - 1][j - 1] + 1, // 수정
          );
        }
      }
    }
    // console.log(dp);

    // 변경 사항 추적
    let i = originalArticle.length;
    let j = modifiedArticle.length;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && originalArticle[i - 1] === modifiedArticle[j - 1]) {
        // diff.unshift({ type: "equal", value: originalArticle[i - 1] });
        i--;
        j--;
      } else if (
        i > 0 &&
        j > 0 &&
        dp[i][j] === dp[i - 1][j] + 1 &&
        originalArticle[i - 1] !== modifiedArticle[j - 1]
      ) {
        diff.unshift({
          type: 'remove',
          value: originalArticle[i - 1],
          idx: i - 1,
        });
        i--;
      } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
        diff.unshift({
          type: 'add',
          value: modifiedArticle[j - 1],
          idx: j - 1,
        });
        j--;
      } else {
        diff.unshift({
          type: 'modify',
          value: modifiedArticle[j - 1],
          idx: j - 1,
        });
        i--;
        j--;
      }
    }
    return diff;
  };

  applyArticleToLine = (original, diff) => {
    const modified = original.slice(); // 원본 배열을 복사하여 수정할 배열을 생성합니다.

    for (let i = 0; i < diff.length; i++) {
      const { type, value, idx } = diff[i];

      if (type === 'add') {
        modified.splice(idx, 0, value); // 해당 인덱스에 값을 추가합니다.
        for (let j = i + 1; j < diff.length; j++) {
          if (diff[j].type === 'remove') {
            diff[j].idx += 1;
          }
        }
      } else if (type === 'remove') {
        modified.splice(idx, 1); // 해당 인덱스의 값을 제거합니다.
        for (let j = i + 1; j < diff.length; j++) {
          if (diff[j].type === 'remove') {
            diff[j].idx -= 1;
          }
        }
      } else if (type === 'modify') {
        modified[idx] = value; // 해당 인덱스의 값을 수정합니다.
      }
    }

    return modified;
  };

  /* 특정 버전의 전체 스냅샷(original)에 변경 사항 데이터를 더해 전체 스냅샷을 만듦 */
  applyDiff = (original, diffs) => {
    let modified = original;

    for (let i = 0; i < diffs.length; i++) {
      const { type, value, idx } = diffs[i];
      if (type === "add") {
        modified = modified.slice(0, idx) + value + modified.slice(idx);
        for (let j = i + 1; j < diffs.length; j++) {
          if (diffs[j].type === "remove") {
            diffs[j].idx += value.length;
          }
        }
      } else if (type === "remove") {
        modified = modified.slice(0, idx) + modified.slice(idx + value.length);
        for (let j = i + 1; j < diffs.length; j++) {
          if (diffs[j].type === "add") {
            diffs[j].idx -= value.length;
          }
        }
      }
    }
    return modified;
  }
}
