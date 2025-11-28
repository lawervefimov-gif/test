class SubsidiarTest {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = 10;
        
        this.loadQuestions();
        this.initEventListeners();
        this.showQuestion();
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('./assets/data/questions.json');
            const data = await response.json();
            this.questions = data.questions;
        } catch (error) {
            console.error('Ошибка загрузки вопросов:', error);
            // Fallback вопросы
            this.questions = this.getFallbackQuestions();
        }
    }
    
    getFallbackQuestions() {
        // Резервные вопросы на случай проблем с загрузкой JSON
        return [
            { id: 1, text: "Были ли сделки по продаже активов по заниженной цене?", riskWeight: 1 },
            { id: 2, text: "Выводили ли деньги через займы учредителям?", riskWeight: 1 },
            // ... остальные вопросы
        ];
    }
    
    initEventListeners() {
        document.querySelectorAll('.btn-answer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAnswer(e.target.dataset.answer);
            });
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartTest();
        });
    }
    
    handleAnswer(answer) {
        if (answer === 'yes') {
            this.score += 1;
        }
        
        this.currentQuestion++;
        
        if (this.currentQuestion < this.totalQuestions) {
            this.showQuestion();
        } else {
            this.showResult();
        }
    }
    
    showQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) return;
        
        document.getElementById('question-text').textContent = question.text;
        this.updateProgress();
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = 
            `Вопрос ${this.currentQuestion + 1} из ${this.totalQuestions}`;
    }
    
    showResult() {
        document.getElementById('test-container').style.display = 'none';
        document.getElementById('result-container').style.display = 'block';
        
        const resultContent = document.getElementById('result-content');
        let resultHTML = '';
        
        if (this.score <= 2) {
            resultHTML = this.getLowRiskResult();
        } else if (this.score <= 5) {
            resultHTML = this.getMediumRiskResult();
        } else {
            resultHTML = this.getHighRiskResult();
        }
        
        resultContent.innerHTML = resultHTML;
    }
    
    getLowRiskResult() {
        return `
            <div class="result low-risk">
                <h3>✅ Низкий уровень риска (${this.score}/10)</h3>
                <p>На основе ваших ответов, признаки явных злоупотреблений не прослеживаются.</p>
                <p><strong>Рекомендация:</strong> Проведите аудит корпоративных процедур для исключения скрытых угроз.</p>
            </div>
        `;
    }
    
    getMediumRiskResult() {
        return `
            <div class="result medium-risk">
                <h3>⚠️ Средний уровень риска (${this.score}/10)</h3>
                <p>В вашей деятельности есть несколько "красных флажков".</p>
                <p><strong>Рекомендация:</strong> Срочно займитесь приведением документов и операций в порядок.</p>
            </div>
        `;
    }
    
    getHighRiskResult() {
        return `
            <div class="result high-risk">
                <h3>🚨 Высокий уровень риска (${this.score}/10)</h3>
                <p>Вероятность привлечения к субсидиарной ответственности очень высока.</p>
                <p><strong>Рекомендация:</strong> Требуется срочный анализ ситуации с экспертом.</p>
            </div>
        `;
    }
    
    restartTest() {
        this.currentQuestion = 0;
        this.score = 0;
        document.getElementById('test-container').style.display = 'block';
        document.getElementById('result-container').style.display = 'none';
        this.showQuestion();
    }
}

// Инициализация теста при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new SubsidiarTest();
});
