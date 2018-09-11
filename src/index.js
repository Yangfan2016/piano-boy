import PIANO88ARR from "./resource/frequency-88.js"; // 基音频率
import SOURCEBASEVOICE from "./resource/source-voice.js"; // 88个base64音源
import JSONVOICEDATAARR from "./resource/preset-songs.js"; // 预设歌曲

var prefix = 'data:audio/mpeg;base64,';
var baseC4_index = 39;
var FPS = (60 / 150).toFixed(3);
var timerArr = [];
var keyboardEles = null;


function convertToNumberedMusicalNotation(str) {
    var strArr = ["c", "d", "e", "f", "g", "a", "b"];
    var isHalf = str.indexOf("#") != -1;
    str = str.replace("#", "").replace(/\d/g, "");
    str = strArr.indexOf(str.toLowerCase()) + 1;
    str = isHalf ? "#" + str : str;
    str = "" + str;
    return str;
}

function converToDiffNotation(str) {
    var strArr = ["c", "d", "e", "f", "g", "a", "b"];
    var arr = str.split("-").map((item, n) => {
        var v = item.split(":");
        var key = v[0] == 0 ? 0 : (v[0] > 7 ? (~~v[0] % 7) : v[0]);
        var times = key > 7 ? (~~(key / 7) + 1) : 1;
        var duration = v[1] == 0 ? 50 : (v[1] * 50 * (FPS / 0.4));

        return {
            key: strArr[key - 1] + (times + 3),
            times,
            duration
        };
    });
    return arr;
}

window.playPianoByFrequency = function playPianoByFrequency(n) {
    var src = prefix + SOURCEBASEVOICE[n];
    var audioNode = new Audio(src);
    audioNode.playbackRate = 1;
    audioNode.play();
    keyboardEles = keyboardsPanel.querySelectorAll(".keyboard");
    keyboardEles[n].classList.add("active");
    var timer = setTimeout(_ => {
        keyboardEles[n].classList.remove("active");
        clearTimeout(timer);
    }, 100);
}

function clearAllTimer() {
    timerArr.forEach(timer => {
        clearTimeout(timer);
    });
    timerArr = [];
}

function autoPlayFromNumberedMusicalNotation(arr) {
    var index = -1;
    var timeDelay = 0;

    arr.forEach((simpleInfo, n) => {
        for (var i = 0; i < PIANO88ARR.length; i++) {
            if (simpleInfo.key == PIANO88ARR[i].name) {
                index = i;
                break;
            }
        }
        (function (index2, n2) {
            timeDelay += simpleInfo.duration;
            timerArr[n] = setTimeout(_ => {
                console.log(index2, simpleInfo.duration);
                index2 != -1 && playPianoByFrequency(index2);
                if (n2 + 1 == arr.length) {
                    clearAllTimer();
                }
            }, timeDelay);
        }(index, n));
    });
}


keyboardsPanel.innerHTML = "";
PIANO88ARR.forEach((item, index) => {
    var isHalf = item.name.indexOf("#") != -1;
    keyboardsPanel.innerHTML += `
        <li class="keyboard${isHalf ? " half" : ""}${index == baseC4_index ? " baseC4" : ""}" data-voice="${item.name}" data-frequency="${item.frequency}" onclick="playPianoByFrequency(${index})">
            <span class="name">${convertToNumberedMusicalNotation(item.name)}</span>
        </li>
    `;
});

song.innerHTML = `<option value="-1">请选择</option>`;
JSONVOICEDATAARR.forEach((item, index) => {
    song.innerHTML += `
        <option value="${index}">${item.name}</option>
    `;
});

song.addEventListener("change", ev => {
    clearAllTimer();
    var songInfo = JSONVOICEDATAARR[song.value];
    songInfo && autoPlayFromNumberedMusicalNotation(converToDiffNotation(songInfo.str));
});

curKeyText.innerHTML = PIANO88ARR[baseC4_index].name.toUpperCase();

function upKey() {
    baseC4_index = baseC4_index + 12 <= 75 ? baseC4_index + 12 : baseC4_index;
    curKeyText.innerHTML = PIANO88ARR[baseC4_index].name.toUpperCase();
    keyboardEles = keyboardsPanel.querySelectorAll(".keyboard");
    keyboardEles[baseC4_index + 12 < 88 ? baseC4_index + 12 : 87].scrollIntoView({ block: "end", behavior: "smooth" });
}

function downKey() {
    baseC4_index = baseC4_index - 12 >= 3 ? baseC4_index - 12 : baseC4_index;
    curKeyText.innerHTML = PIANO88ARR[baseC4_index].name.toUpperCase();
    keyboardEles = keyboardsPanel.querySelectorAll(".keyboard");
    keyboardEles[baseC4_index - 12 > 0 ? baseC4_index - 12 : 0].scrollIntoView({ block: "end", behavior: "smooth" });
}

plusKey.addEventListener("click", ev => {
    upKey();
});
minusKey.addEventListener("click", ev => {
    downKey();
});

document.addEventListener("keydown", ev => {
    var curKeyEle = null;
    keyboardEles = keyboardsPanel.querySelectorAll(".keyboard");
    if (!keyboardEles) return false;
    switch (ev.keyCode + "") {
        case "97":
            curKeyEle = keyboardEles[baseC4_index];
            curKeyEle && curKeyEle.click();
            break;
        case "98":
            curKeyEle = keyboardEles[baseC4_index + 2];
            curKeyEle && curKeyEle.click();
            break;
        case "99":
            curKeyEle = keyboardEles[baseC4_index + 4];
            curKeyEle && curKeyEle.click();
            break;
        case "100":
            curKeyEle = keyboardEles[baseC4_index + 5];
            curKeyEle && curKeyEle.click();
            break;
        case "101":
            curKeyEle = keyboardEles[baseC4_index + 7];
            curKeyEle && curKeyEle.click();
            break;
        case "102":
            curKeyEle = keyboardEles[baseC4_index + 9];
            curKeyEle && curKeyEle.click();
            break;
        case "103":
            curKeyEle = keyboardEles[baseC4_index + 11];
            curKeyEle && curKeyEle.click();
            break;
        case "104":
            curKeyEle = keyboardEles[baseC4_index + 12];
            curKeyEle && curKeyEle.click();
            break;
        case "105":
            curKeyEle = keyboardEles[baseC4_index + 14];
            curKeyEle && curKeyEle.click();
            break;
        default:
            break;
    }
    // 升 key + 107
    if (ev.keyCode == 107) {
        upKey();
    }
    // 降 key - 109
    if (ev.keyCode == 109) {
        downKey();
    }
});