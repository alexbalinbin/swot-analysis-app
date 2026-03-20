// Interactive functionality for the SWOT Educational Section

document.addEventListener('DOMContentLoaded', function() {
    // Add toggle functionality to the example scenario
    const scenario = document.querySelector('.scenario');
    const scenarioToggle = document.createElement('button');
    scenarioToggle.textContent = 'Show/Hide Example Details';
    scenarioToggle.className = 'toggle-btn';
    scenario.insertBefore(scenarioToggle, scenario.firstChild.nextSibling);

    scenarioToggle.addEventListener('click', function() {
        const exampleSwot = document.querySelector('.example-swot');
        const insights = scenario.querySelector('p:last-child');

        if (exampleSwot.style.display === 'none') {
            exampleSwot.style.display = 'grid';
            insights.style.display = 'block';
            this.textContent = 'Hide Example Details';
        } else {
            exampleSwot.style.display = 'none';
            insights.style.display = 'none';
            this.textContent = 'Show Example Details';
        }
    });

    // Initialize knowledge check quiz
    initializeQuiz();

    // Start SWOT button handlers
    const startButtons = document.querySelectorAll('#start-swot, #start-swot-bottom');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            scrollToInteractiveSWOT();
        });
    });

    // Add keyboard navigation for CTA buttons
    startButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToInteractiveSWOT();
            }
        });
    });
});

function scrollToInteractiveSWOT() {
    const interactiveSection = document.getElementById('interactive-swot');
    if (interactiveSection) {
        interactiveSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function initializeQuiz() {
    const questions = document.querySelectorAll('.question');
    const quizResult = document.getElementById('quiz-result');
    let currentQuestionIndex = 0;

    // Show first question
    if (questions.length > 0) {
        questions[0].classList.add('active');
    }

    // Add click handlers to all quiz options
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quiz-option')) {
            handleQuizAnswer(e.target);
        }
    });

    // Add keyboard handlers for quiz options
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('quiz-option') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleQuizAnswer(e.target);
        }
    });

    function handleQuizAnswer(option) {
        const isCorrect = option.dataset.correct === 'true';
        const currentQuestion = questions[currentQuestionIndex];
        const allOptions = currentQuestion.querySelectorAll('.quiz-option');

        // Clear previous states
        allOptions.forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });

        // Mark selected option
        option.classList.add('selected');

        // Show result
        quizResult.classList.remove('show', 'correct', 'incorrect');
        setTimeout(() => {
            if (isCorrect) {
                option.classList.add('correct');
                quizResult.textContent = currentQuestionIndex === 0
                    ? 'Correct! Economic downturn is an external factor.'
                    : 'Correct! Increasing competition is a threat.';
                quizResult.classList.add('correct', 'show');

                // Move to next question or complete
                if (currentQuestionIndex < questions.length - 1) {
                    setTimeout(() => {
                        // Hide current question
                        currentQuestion.classList.remove('active');
                        // Show next question
                        currentQuestionIndex++;
                        questions[currentQuestionIndex].classList.add('active');
                        // Reset result
                        quizResult.classList.remove('show');
                    }, 2000);
                } else {
                    setTimeout(() => {
                        quizResult.textContent = '🎉 Quiz completed! You understand SWOT basics well.';
                        quizResult.classList.add('correct', 'show');
                    }, 2000);
                }
            } else {
                option.classList.add('incorrect');
                quizResult.textContent = 'Not quite. Try again!';
                quizResult.classList.add('incorrect', 'show');
            }
        }, 300);
    }
}
        }
    });
}

// Add some CSS for the quiz
const style = document.createElement('style');
style.textContent = `
    .toggle-btn {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin: 10px 0;
    }

    .toggle-btn:hover {
        background-color: #2980b9;
    }
`;
document.head.appendChild(style);