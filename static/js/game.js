// 사용변수
const GAME_TIME = 10;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];
const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score')
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.button');

init();

function init() {
    buttonChange('게임로딩중...');
    getWords();
    wordInput.addEventListener('compositionend', checkMatch); // 'keyup' 대신 'compositionend' 사용
}


// 게임 실행
function run() {
    if (isPlaying) {
        return;
    }
    isPlaying = true;
    time = GAME_TIME;
    wordInput.focus();
    scoreDisplay.innerText = 0;
    timeInterval = setInterval(countDown, 1000);
    checkInterval = setInterval(checkStatus, 50)
    buttonChange('게임 중')
}

function checkStatus() {
    if (!isPlaying && time === 0) {
        buttonChange('게임시작')
        clearInterval(checkInterval)
    }
}

// 단어 불러오기
function getWords() {
    words = ["가는 말이 고아야 오는 말이 곱다", "바르고 고운 말을 씁시다", "기차 화통을 삶아 먹었다", "귀신 씨나락 까먹는 소리", "길은 갈 탓, 말은 할 탓", "남의 말이라면 쌍지팡이 짚고 나선다", "내가 한 말을 사돈이 한다", "같은 말이라도 아 다르고 어 다르다", "비속어를 사용하지 맙시다", "비속어는 상대방을 모욕하는 행동입니다", "글 속에 글 있고 말 속에 말 있다", "길이 아니면 가지 말고, 말이 아니면 탓 하지 마라", "남아일언 중천금이다", "말로 온 공을 갚는다", "말이 말을 만든다", "말이 씨가 된다", "말이 입힌 상처는 칼이 입힌 상처보다 크다", "발 없는 말이 천 리 간다", "사공이 많으면 배가 산으로 올라간다", "하늘 무서운 말", "호랑이도 제 말 하면 온다", "우리말을 가꾸어요"];
    buttonChange('게임시작')
    console.log(words)
}

// 단어일치 체크
function checkMatch() {
    if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        if (!isPlaying) {
            return;
        }
        score++;
        scoreDisplay.innerText = score;
        time = GAME_TIME;
        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];

        // setTimeout 함수를 사용해 입력 필드를 비우는 코드를 다음 이벤트 루프로 미룹니다.
        setTimeout(() => {
            wordInput.value = "";
        }, 0);
    }
}


function countDown() {
    // (조건) ? 참일 경우 : 거짓일 경우
    time > 0 ? time-- : isPlaying = false;
    if (!isPlaying) {
        clearInterval(timeInterval)
    }
    timeDisplay.innerText = time;
}


function buttonChange(text) {
    button.innerText = text;
    text === '게임시작' ? button.classList.remove('loading') : button.classList.add('loading')
}