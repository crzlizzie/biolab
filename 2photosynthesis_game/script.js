// 游戏数据和配置
const gameData = {
    // 物质变化规则表
    substanceRules: {
        // 光照不变，CO2减少
        "light-constant-co2-decrease": {
            NADPH: "increase",
            ATP: "increase",
            C3: "decrease",
            C5: "increase",
            CH2O: "decrease"
        },
        // 光照不变，CO2增加
        "light-constant-co2-increase": {
            NADPH: "decrease",
            ATP: "decrease",
            C3: "increase",
            C5: "decrease",
            CH2O: "increase"
        },
        // CO2不变，光照减少
        "co2-constant-light-decrease": {
            NADPH: "decrease",
            ATP: "decrease",
            C3: "increase",
            C5: "decrease",
            CH2O: "decrease"
        },
        // CO2不变，光照增加
        "co2-constant-light-increase": {
            NADPH: "increase",
            ATP: "increase",
            C3: "decrease",
            C5: "increase",
            CH2O: "increase"
        }
    },
    
    // 游戏状态
    gameState: {
        currentMode: null,
        currentCondition: null,
        startTime: null,
        endTime: null,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0
    }
};

// DOM元素
const elements = {
    practiceModeBtn: document.getElementById('practice-mode'),
    challengeModeBtn: document.getElementById('challenge-mode'),
    gameContainer: document.getElementById('game-container')
};

// 初始化游戏
function initGame() {
    // 绑定模式选择按钮事件
    elements.practiceModeBtn.addEventListener('click', () => startPracticeMode());
    elements.challengeModeBtn.addEventListener('click', () => startChallengeMode());
}

// 开始练习模式
function startPracticeMode() {
    gameData.gameState.currentMode = 'practice';
    renderGameInterface();
}

// 开始挑战模式
function startChallengeMode() {
    gameData.gameState.currentMode = 'challenge';
    renderGameInterface();
}

// 渲染游戏界面
function renderGameInterface() {
    elements.gameContainer.classList.remove('hidden');
    
    let html = `
        <div class="game-header">
            <h2>${gameData.gameState.currentMode === 'practice' ? '练习模式' : '挑战模式'}</h2>
            ${gameData.gameState.currentMode === 'challenge' ? '<div class="timer">时间: <span id="timer">30</span>秒</div>' : ''}
        </div>
        
        <div class="photosynthesis-diagram">
            <img src="https://ts1.tc.mm.bing.net/th/id/R-C.664339a64b89279f503ec6067eb9dd85?rik=SI80Tk5MMMXwIw&riu=http%3a%2f%2fexp-picture.cdn.bcebos.com%2f054056fe1e425d6b565c0b9011883913e9e5002a.jpg%3fx-bce-process%3dimage%252Fcrop%252Cx_0%252Cy_0%252Cw_756%252Ch_554%252Fformat%252Cf_auto%252Fquality%252Cq_80&ehk=O9fhjMyRo7GKPVSEQQ5TNy0YAaW0CDqZrGjNi94NsHI%3d&risl=&pid=ImgRaw&r=0" alt="光合作用流程图">
        </div>
        
        <div class="condition-controls">
    `;
    
    if (gameData.gameState.currentMode === 'practice') {
        html += `
            <div class="control-group">
                <label>选择条件变化</label>
                <div>
                    <button class="change-button" data-change="light-decrease">减少光照强度</button>
                    <button class="change-button" data-change="light-increase">增加光照强度</button>
                    <button class="change-button" data-change="co2-decrease">减少二氧化碳浓度</button>
                    <button class="change-button" data-change="co2-increase">增加二氧化碳浓度</button>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="control-group">
                <p id="random-condition" style="font-size: 1.2em; font-weight: bold; text-align: center;">随机条件变化将在此显示</p>
                <button class="change-button" id="start-challenge">开始挑战</button>
            </div>
        `;
    }
    
    html += `
        </div>
        
        <div class="substance-changes">
            <h3>请判断下列物质的含量变化：</h3>
            <div class="substance-list">
                <div class="substance-item">
                    <label for="nadph-change">NADPH</label>
                    <div class="change-controls">
                        <button class="arrow-btn" data-target="nadph-change" data-value="increase">↑</button>
                        <span id="nadph-change" class="change-value">请选择</span>
                        <button class="arrow-btn" data-target="nadph-change" data-value="decrease">↓</button>
                    </div>
                </div>
                <div class="substance-item">
                    <label for="atp-change">ATP</label>
                    <div class="change-controls">
                        <button class="arrow-btn" data-target="atp-change" data-value="increase">↑</button>
                        <span id="atp-change" class="change-value">请选择</span>
                        <button class="arrow-btn" data-target="atp-change" data-value="decrease">↓</button>
                    </div>
                </div>
                <div class="substance-item">
                    <label for="c3-change">C₃</label>
                    <div class="change-controls">
                        <button class="arrow-btn" data-target="c3-change" data-value="increase">↑</button>
                        <span id="c3-change" class="change-value">请选择</span>
                        <button class="arrow-btn" data-target="c3-change" data-value="decrease">↓</button>
                    </div>
                </div>
                <div class="substance-item">
                    <label for="c5-change">C₅</label>
                    <div class="change-controls">
                        <button class="arrow-btn" data-target="c5-change" data-value="increase">↑</button>
                        <span id="c5-change" class="change-value">请选择</span>
                        <button class="arrow-btn" data-target="c5-change" data-value="decrease">↓</button>
                    </div>
                </div>
                <div class="substance-item">
                    <label for="ch2o-change">(CH₂O)</label>
                    <div class="change-controls">
                        <button class="arrow-btn" data-target="ch2o-change" data-value="increase">↑</button>
                        <span id="ch2o-change" class="change-value">请选择</span>
                        <button class="arrow-btn" data-target="ch2o-change" data-value="decrease">↓</button>
                    </div>
                </div>
            </div>
        </div>
        
        <button class="submit-button" id="submit-answer">提交答案</button>
        
        <div class="feedback" id="feedback"></div>
        
        <div class="data-record">
            <h3>答题记录</h3>
            <div class="data-item">
                <span>总题数：</span>
                <span id="total-questions">0</span>
            </div>
            <div class="data-item">
                <span>正确答案：</span>
                <span id="correct-answers">0</span>
            </div>
            <div class="data-item">
                <span>错误答案：</span>
                <span id="incorrect-answers">0</span>
            </div>
            <div class="data-item">
                <span>正确率：</span>
                <span id="accuracy">0%</span>
            </div>
        </div>
        
        <div class="knowledge-section">
            <h3>知识讲解</h3>
            <div id="knowledge-content">
                <p>光合作用是绿色植物通过叶绿体，利用光能，把二氧化碳和水转化成储存能量的有机物（如葡萄糖），并释放出氧气的过程。</p>
                <p>光合作用包括光反应和暗反应两个阶段：</p>
                <p>1. 光反应：在叶绿体的类囊体薄膜上进行，主要包括水的光解和ATP、NADPH的生成。</p>
                <p>2. 暗反应：在叶绿体的基质中进行，主要包括二氧化碳的固定、三碳化合物的还原和C₅的再生。</p>
                <p>当环境条件发生变化时，光合作用过程中的相关物质含量会发生相应的变化。</p>
            </div>
        </div>
    `;
    
    elements.gameContainer.innerHTML = html;
    
    // 绑定事件
    bindGameEvents();
}

// 绑定游戏事件
function bindGameEvents() {
    // 练习模式的条件变化按钮事件
    if (gameData.gameState.currentMode === 'practice') {
        // 条件变化按钮事件
        const changeButtons = document.querySelectorAll('.change-button');
        changeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const changeType = button.getAttribute('data-change');
                setCurrentCondition(changeType);
            });
        });
    } else {
        // 挑战模式的开始按钮事件
        const startChallengeBtn = document.getElementById('start-challenge');
        startChallengeBtn.addEventListener('click', startRandomChallenge);
    }
    
    // 箭头按钮事件监听
    const arrowButtons = document.querySelectorAll('.arrow-btn');
    arrowButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const value = button.getAttribute('data-value');
            const targetElement = document.getElementById(targetId);
            
            if (value === 'increase') {
                targetElement.textContent = '增加';
                targetElement.setAttribute('data-value', 'increase');
            } else if (value === 'decrease') {
                targetElement.textContent = '减少';
                targetElement.setAttribute('data-value', 'decrease');
            }
        });
    });
    
    // 提交答案按钮事件
    const submitButton = document.getElementById('submit-answer');
    submitButton.addEventListener('click', checkAnswer);
}

// 设置当前条件变化
function setCurrentCondition(changeType) {
    switch (changeType) {
        case 'light-decrease':
            gameData.gameState.currentCondition = 'co2-constant-light-decrease';
            break;
        case 'light-increase':
            gameData.gameState.currentCondition = 'co2-constant-light-increase';
            break;
        case 'co2-decrease':
            gameData.gameState.currentCondition = 'light-constant-co2-decrease';
            break;
        case 'co2-increase':
            gameData.gameState.currentCondition = 'light-constant-co2-increase';
            break;
    }
    
    // 显示当前条件变化
    const conditionText = document.createElement('p');
    conditionText.style.fontSize = '1.2em';
    conditionText.style.fontWeight = 'bold';
    conditionText.style.textAlign = 'center';
    conditionText.style.marginTop = '20px';
    
    switch (gameData.gameState.currentCondition) {
        case 'co2-constant-light-decrease':
            conditionText.textContent = '当前条件：CO₂浓度不变，光照强度减少';
            break;
        case 'co2-constant-light-increase':
            conditionText.textContent = '当前条件：CO₂浓度不变，光照强度增加';
            break;
        case 'light-constant-co2-decrease':
            conditionText.textContent = '当前条件：光照强度不变，CO₂浓度减少';
            break;
        case 'light-constant-co2-increase':
            conditionText.textContent = '当前条件：光照强度不变，CO₂浓度增加';
            break;
    }
    
    const controls = document.querySelector('.condition-controls');
    const existingConditionText = controls.querySelector('p[data-condition]');
    if (existingConditionText) {
        existingConditionText.remove();
    }
    conditionText.setAttribute('data-condition', 'true');
    controls.appendChild(conditionText);
}

// 开始随机挑战
function startRandomChallenge() {
    // 随机选择条件变化
    const conditions = [
        'co2-constant-light-decrease',
        'co2-constant-light-increase',
        'light-constant-co2-decrease',
        'light-constant-co2-increase'
    ];
    
    const randomIndex = Math.floor(Math.random() * conditions.length);
    gameData.gameState.currentCondition = conditions[randomIndex];
    
    // 显示当前条件变化
    const conditionElement = document.getElementById('random-condition');
    switch (gameData.gameState.currentCondition) {
        case 'co2-constant-light-decrease':
            conditionElement.textContent = '当前条件：CO₂浓度不变，光照强度减少';
            break;
        case 'co2-constant-light-increase':
            conditionElement.textContent = '当前条件：CO₂浓度不变，光照强度增加';
            break;
        case 'light-constant-co2-decrease':
            conditionElement.textContent = '当前条件：光照强度不变，CO₂浓度减少';
            break;
        case 'light-constant-co2-increase':
            conditionElement.textContent = '当前条件：光照强度不变，CO₂浓度增加';
            break;
    }
    
    // 开始计时
    gameData.gameState.startTime = Date.now();
    startTimer();
}

// 开始计时器
function startTimer() {
    let timeLeft = 30;
    const timerElement = document.getElementById('timer');
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // 时间到，自动提交答案
            checkAnswer();
        }
    }, 1000);
}

// 检查答案
function checkAnswer() {
    if (!gameData.gameState.currentCondition) {
        alert('请先选择或生成条件变化');
        return;
    }
    
    // 获取用户选择的答案
    const userAnswers = {
        NADPH: document.getElementById('nadph-change').getAttribute('data-value'),
        ATP: document.getElementById('atp-change').getAttribute('data-value'),
        C3: document.getElementById('c3-change').getAttribute('data-value'),
        C5: document.getElementById('c5-change').getAttribute('data-value'),
        CH2O: document.getElementById('ch2o-change').getAttribute('data-value')
    };
    
    // 检查是否所有物质都已选择
    for (let substance in userAnswers) {
        if (!userAnswers[substance]) {
            alert('请为所有物质选择变化情况');
            return;
        }
    }
    
    // 获取正确答案
    const correctAnswers = gameData.substanceRules[gameData.gameState.currentCondition];
    
    // 检查答案是否正确（对每个物质单独判断）
    let isCorrect = true;
    const substanceResults = {};
    
    for (let substance in userAnswers) {
        const userAnswer = userAnswers[substance];
        const correctAnswer = correctAnswers[substance];
        substanceResults[substance] = {
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: userAnswer === correctAnswer
        };
        
        if (userAnswer !== correctAnswer) {
            isCorrect = false;
        }
    }
    
    // 记录游戏数据
    gameData.gameState.totalQuestions++;
    if (isCorrect) {
        gameData.gameState.correctAnswers++;
    } else {
        gameData.gameState.incorrectAnswers++;
    }
    
    // 计算正确率
    const accuracy = (gameData.gameState.correctAnswers / gameData.gameState.totalQuestions) * 100;
    
    // 更新数据记录
    document.getElementById('total-questions').textContent = gameData.gameState.totalQuestions;
    document.getElementById('correct-answers').textContent = gameData.gameState.correctAnswers;
    document.getElementById('incorrect-answers').textContent = gameData.gameState.incorrectAnswers;
    document.getElementById('accuracy').textContent = accuracy.toFixed(1) + '%';
    
    // 显示反馈
    const feedbackElement = document.getElementById('feedback');
    if (isCorrect) {
        feedbackElement.className = 'feedback correct';
        feedbackElement.innerHTML = `
            <h3>回答正确！</h3>
            <p>🎉 太棒了！你正确判断了所有物质的变化情况。</p>
        `;
    } else {
        feedbackElement.className = 'feedback incorrect';
        let feedbackHtml = '<h3>回答结果</h3><div class="substance-results">';
        
        for (let substance in substanceResults) {
            const result = substanceResults[substance];
            const isSubstanceCorrect = result.isCorrect;
            const userAnswerText = result.userAnswer === 'increase' ? '增加' : '减少';
            const correctAnswerText = result.correctAnswer === 'increase' ? '增加' : '减少';
            
            feedbackHtml += `
                <div class="substance-result ${isSubstanceCorrect ? 'correct' : 'incorrect'}">
                    <span class="substance-name">${substance}：</span>
                    <span class="user-answer">你的答案：${userAnswerText}</span>
                    ${!isSubstanceCorrect ? `<span class="correct-answer">正确答案：${correctAnswerText}</span>` : ''}
                </div>
            `;
        }
        
        feedbackHtml += '</div>';
        
        // 添加解释
        let explanation = getExplanation(gameData.gameState.currentCondition);
        feedbackHtml += `<div class="explanation"><h4>解释：</h4><p>${explanation}</p></div>`;
        
        feedbackElement.innerHTML = feedbackHtml;
    }
    
    // 挑战模式下，3秒后自动开始新挑战
    if (gameData.gameState.currentMode === 'challenge') {
        setTimeout(() => {
            startRandomChallenge();
            // 重置选择
            document.getElementById('nadph-change').textContent = '请选择';
            document.getElementById('nadph-change').removeAttribute('data-value');
            document.getElementById('atp-change').textContent = '请选择';
            document.getElementById('atp-change').removeAttribute('data-value');
            document.getElementById('c3-change').textContent = '请选择';
            document.getElementById('c3-change').removeAttribute('data-value');
            document.getElementById('c5-change').textContent = '请选择';
            document.getElementById('c5-change').removeAttribute('data-value');
            document.getElementById('ch2o-change').textContent = '请选择';
            document.getElementById('ch2o-change').removeAttribute('data-value');
            // 清空反馈
            feedbackElement.innerHTML = '';
        }, 3000);
    }
}

// 获取解释
function getExplanation(condition) {
    switch (condition) {
        case 'light-constant-co2-decrease':
            return '当光照不变，CO₂浓度减少时，CO₂固定减少，C₃生成减少，C₅积累增加；光反应继续产生NADPH和ATP，但暗反应消耗减少，因此NADPH和ATP积累增加；(CH₂O)生成减少。';
        case 'light-constant-co2-increase':
            return '当光照不变，CO₂浓度增加时，CO₂固定增加，C₃生成增加，C₅消耗增加；光反应产生的NADPH和ATP被更多地消耗，因此含量减少；(CH₂O)生成增加。';
        case 'co2-constant-light-decrease':
            return '当CO₂不变，光照减少时，光反应减弱，NADPH和ATP生成减少；C₃还原减少，C₃积累增加，C₅生成减少；(CH₂O)生成减少。';
        case 'co2-constant-light-increase':
            return '当CO₂不变，光照增加时，光反应增强，NADPH和ATP生成增加；C₃还原增加，C₃减少，C₅生成增加；(CH₂O)生成增加。';
        default:
            return '';
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', initGame);