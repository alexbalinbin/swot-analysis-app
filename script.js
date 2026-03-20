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

    // Generate Insights button handler
    const generateInsightsBtn = document.getElementById('generate-insights');
    if (generateInsightsBtn) {
        generateInsightsBtn.addEventListener('click', generateStrategyReport);
    }

    // Export Analysis button handler
    const exportSwotBtn = document.getElementById('export-swot');
    if (exportSwotBtn) {
        exportSwotBtn.addEventListener('click', exportAnalysis);
    }

    // Reset button handler
    const resetSwotBtn = document.getElementById('reset-swot');
    if (resetSwotBtn) {
        resetSwotBtn.addEventListener('click', resetAnalysis);
    }

    // Load saved data on page load
    loadSavedData();

    // Auto-save on input change
    setupAutoSave();
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
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleQuizAnswer(this);
        });

        // Add keyboard support
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleQuizAnswer(this);
            }
        });
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

    .report-section {
        margin: 20px 0;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .report-section h3 {
        color: #2c3e50;
        margin-top: 0;
    }

    .insights-list {
        list-style-type: disc;
        margin-left: 20px;
    }

    .actions-list {
        list-style-type: none;
        padding: 0;
    }

    .actions-list li {
        margin: 10px 0;
        padding: 10px;
        background-color: white;
        border-left: 4px solid #3498db;
    }
`;
document.head.appendChild(style);

function generateStrategyReport() {
    const problemTextarea = document.getElementById('problem-textarea');
    const strengthsTextarea = document.querySelector('.builder-quadrant.strengths textarea');
    const weaknessesTextarea = document.querySelector('.builder-quadrant.weaknesses textarea');
    const opportunitiesTextarea = document.querySelector('.builder-quadrant.opportunities textarea');
    const threatsTextarea = document.querySelector('.builder-quadrant.threats textarea');

    const problem = problemTextarea.value.trim();
    const strengths = parseTextarea(strengthsTextarea.value);
    const weaknesses = parseTextarea(weaknessesTextarea.value);
    const opportunities = parseTextarea(opportunitiesTextarea.value);
    const threats = parseTextarea(threatsTextarea.value);

    // Validation
    if (!problem) {
        alert('Please describe the organizational problem first.');
        problemTextarea.focus();
        return;
    }

    const totalItems = strengths.length + weaknesses.length + opportunities.length + threats.length;
    if (totalItems < 3) {
        alert('Please enter at least 3 SWOT items across all categories for a meaningful analysis.');
        return;
    }

    // Remove existing report if any
    const existingReport = document.getElementById('strategy-report');
    if (existingReport) {
        existingReport.remove();
    }

    // Create report container
    const reportContainer = document.createElement('div');
    reportContainer.id = 'strategy-report';
    reportContainer.className = 'report-section';

    // Generate report content
    const reportHTML = generateReportHTML(problem, strengths, weaknesses, opportunities, threats);

    reportContainer.innerHTML = reportHTML;

    // Insert after the builder actions
    const builderActions = document.querySelector('.builder-actions');
    builderActions.parentNode.insertBefore(reportContainer, builderActions.nextSibling);

    // Scroll to report
    reportContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function parseTextarea(text) {
    return text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('•') || line.length > 1);
}

function generateReportHTML(problem, strengths, weaknesses, opportunities, threats) {
    // Situation Summary
    const summary = generateSituationSummary(problem, strengths, weaknesses, opportunities, threats);

    // Key Strategic Insights
    const insights = generateKeyInsights(strengths, weaknesses, opportunities, threats);

    // Recommended Action Steps
    const shortTermActions = generateShortTermActions(strengths, weaknesses, opportunities, threats);
    const mediumTermActions = generateMediumTermActions(strengths, weaknesses, opportunities, threats);
    const riskMitigationActions = generateRiskMitigationActions(strengths, weaknesses, opportunities, threats);

    return `
        <h2>Strategy Report</h2>
        <div class="report-section">
            <h3>1. Situation Summary</h3>
            <p>${summary}</p>
        </div>
        <div class="report-section">
            <h3>2. Key Strategic Insights</h3>
            <ul class="insights-list">
                ${insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
        <div class="report-section">
            <h3>3. Recommended Action Steps</h3>
            <h4>Short-Term Actions (0–3 months)</h4>
            <ul class="actions-list">
                ${shortTermActions.map(action => `<li>${action}</li>`).join('')}
            </ul>
            <h4>Medium-Term Strategy (3–12 months)</h4>
            <ul class="actions-list">
                ${mediumTermActions.map(action => `<li>${action}</li>`).join('')}
            </ul>
            <h4>Risk Mitigation Actions</h4>
            <ul class="actions-list">
                ${riskMitigationActions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        </div>
    `;
}

function generateSituationSummary(problem, strengths, weaknesses, opportunities, threats) {
    const sentences = [];

    sentences.push(`The organization is addressing: ${problem}.`);

    if (strengths.length > 0) {
        sentences.push(`Key strengths include ${strengths.slice(0, 2).join(' and ')}${strengths.length > 2 ? ' among others' : ''}.`);
    }

    if (weaknesses.length > 0) {
        sentences.push(`However, challenges exist such as ${weaknesses.slice(0, 2).join(' and ')}${weaknesses.length > 2 ? ' and other weaknesses' : ''}.`);
    }

    if (opportunities.length > 0) {
        sentences.push(`External opportunities present themselves through ${opportunities.slice(0, 2).join(' and ')}${opportunities.length > 2 ? ' plus additional prospects' : ''}.`);
    }

    if (threats.length > 0) {
        sentences.push(`Meanwhile, potential threats include ${threats.slice(0, 2).join(' and ')}${threats.length > 2 ? ' alongside other risks' : ''}.`);
    }

    return sentences.slice(0, 4).join(' ');
}

function generateKeyInsights(strengths, weaknesses, opportunities, threats) {
    const insights = [];

    if (strengths.length > 0 && opportunities.length > 0) {
        insights.push(`Leverage core strengths to capitalize on emerging opportunities.`);
    }

    if (weaknesses.length > 0) {
        insights.push(`Address critical weaknesses to prevent them from undermining strategic initiatives.`);
    }

    if (threats.length > 0 && strengths.length > 0) {
        insights.push(`Use organizational strengths as a buffer against external threats.`);
    }

    if (opportunities.length > 0 && weaknesses.length > 0) {
        insights.push(`Prioritize opportunities that can help overcome identified weaknesses.`);
    }

    if (threats.length > 0) {
        insights.push(`Develop contingency plans for the most significant external threats.`);
    }

    return insights.slice(0, 4); // Limit to 4 insights
}

function generateShortTermActions(strengths, weaknesses, opportunities, threats) {
    const actions = [];

    if (weaknesses.length > 0) {
        actions.push(`Conduct a detailed assessment of the most critical weaknesses to identify quick wins for improvement.`);
    }

    if (opportunities.length > 0) {
        actions.push(`Evaluate the top 2-3 opportunities for immediate feasibility and potential impact.`);
    }

    if (strengths.length > 0) {
        actions.push(`Document and communicate key strengths to ensure they are leveraged across teams.`);
    }

    return actions.slice(0, 3);
}

function generateMediumTermActions(strengths, weaknesses, opportunities, threats) {
    const actions = [];

    if (strengths.length > 0 && opportunities.length > 0) {
        actions.push(`Develop specific initiatives that combine organizational strengths with market opportunities.`);
    }

    if (weaknesses.length > 0) {
        actions.push(`Create a capability-building plan to address identified skill or resource gaps.`);
    }

    if (threats.length > 0) {
        actions.push(`Establish monitoring systems for key external threats and early warning indicators.`);
    }

    return actions.slice(0, 3);
}

function generateRiskMitigationActions(strengths, weaknesses, opportunities, threats) {
    const actions = [];

    if (threats.length > 0) {
        actions.push(`Develop risk mitigation strategies for each major threat, including backup plans.`);
    }

    if (weaknesses.length > 0 && threats.length > 0) {
        actions.push(`Strengthen vulnerable areas that could be exploited by external threats.`);
    }

    actions.push(`Establish regular SWOT review cycles to adapt to changing conditions.`);

    return actions.slice(0, 3);
}

function exportAnalysis() {
    const problemTextarea = document.getElementById('problem-textarea');
    const strengthsTextarea = document.querySelector('.builder-quadrant.strengths textarea');
    const weaknessesTextarea = document.querySelector('.builder-quadrant.weaknesses textarea');
    const opportunitiesTextarea = document.querySelector('.builder-quadrant.opportunities textarea');
    const threatsTextarea = document.querySelector('.builder-quadrant.threats textarea');

    const content = `
SWOT Analysis Export

Organizational Problem:
${problemTextarea.value}

Strengths:
${strengthsTextarea.value}

Weaknesses:
${weaknessesTextarea.value}

Opportunities:
${opportunitiesTextarea.value}

Threats:
${threatsTextarea.value}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swot-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetAnalysis() {
    if (confirm('Are you sure you want to reset all inputs and remove the generated report? This action cannot be undone.')) {
        const problemTextarea = document.getElementById('problem-textarea');
        const textareas = document.querySelectorAll('.builder-quadrant textarea');

        problemTextarea.value = '';
        textareas.forEach(textarea => textarea.value = '');

        // Remove report if exists
        const report = document.getElementById('strategy-report');
        if (report) {
            report.remove();
        }

        // Clear localStorage
        localStorage.removeItem('swot-analysis-data');

        // Scroll back to top of interactive section
        const interactiveSection = document.getElementById('interactive-swot');
        interactiveSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function loadSavedData() {
    const savedData = localStorage.getItem('swot-analysis-data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const problemTextarea = document.getElementById('problem-textarea');
            const strengthsTextarea = document.querySelector('.builder-quadrant.strengths textarea');
            const weaknessesTextarea = document.querySelector('.builder-quadrant.weaknesses textarea');
            const opportunitiesTextarea = document.querySelector('.builder-quadrant.opportunities textarea');
            const threatsTextarea = document.querySelector('.builder-quadrant.threats textarea');

            if (data.problem) problemTextarea.value = data.problem;
            if (data.strengths) strengthsTextarea.value = data.strengths;
            if (data.weaknesses) weaknessesTextarea.value = data.weaknesses;
            if (data.opportunities) opportunitiesTextarea.value = data.opportunities;
            if (data.threats) threatsTextarea.value = data.threats;
        } catch (e) {
            console.warn('Failed to load saved SWOT data:', e);
        }
    }
}

function setupAutoSave() {
    const inputs = [
        document.getElementById('problem-textarea'),
        ...document.querySelectorAll('.builder-quadrant textarea')
    ];

    inputs.forEach(input => {
        input.addEventListener('input', saveData);
    });
}

function saveData() {
    const problemTextarea = document.getElementById('problem-textarea');
    const strengthsTextarea = document.querySelector('.builder-quadrant.strengths textarea');
    const weaknessesTextarea = document.querySelector('.builder-quadrant.weaknesses textarea');
    const opportunitiesTextarea = document.querySelector('.builder-quadrant.opportunities textarea');
    const threatsTextarea = document.querySelector('.builder-quadrant.threats textarea');

    const data = {
        problem: problemTextarea.value,
        strengths: strengthsTextarea.value,
        weaknesses: weaknessesTextarea.value,
        opportunities: opportunitiesTextarea.value,
        threats: threatsTextarea.value,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('swot-analysis-data', JSON.stringify(data));
}