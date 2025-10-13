let currentSession = null;
let currentQuestionIndex = 0;
let responses = {};
let questionHistory = []; // Track question history for back navigation
let responseHistory = {}; // Track response history

// Start questionnaire with animation
async function startQuestionnaire() {
    try {
        const response = await fetch('/api/questionnaire/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        currentSession = data.sessionId;
        
        // Reset navigation history
        questionHistory = [data.question];
        responseHistory = {};
        currentQuestionIndex = 0;
        
        const modal = document.getElementById('questionnaire-modal');
        const modalContent = document.getElementById('modal-content');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        modal.classList.remove('hidden');
        modal.classList.add('modal-show');
        
        // Animate modal content
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 50);
        
        displayQuestion(data.question, 0, false);
    } catch (error) {
        console.error('Error starting questionnaire:', error);
        showErrorMessage('Failed to start questionnaire. Please try again.');
    }
}

// Display question with animations and back button
function displayQuestion(question, progress = 0, showBack = true) {
    const content = document.getElementById('questionnaire-content');
    
    // Calculate actual progress
    const actualProgress = Math.max(progress, (question.id / 20) * 100);
    
    let questionHtml = `
        <div class="mb-8 fade-in-up">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-4">
                    ${showBack && questionHistory.length > 1 ? `
                        <button onclick="goBackQuestion()" class="back-button flex items-center px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 font-medium transition-all duration-300">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                            Back
                        </button>
                    ` : ''}
                    <span class="text-sm font-medium text-gray-500">Question ${question.id} of 20</span>
                </div>
                <span class="text-sm font-medium text-turquoise-600">${Math.round(actualProgress)}% Complete</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden">
                <div class="progress-fill h-3 rounded-full transition-all duration-500 ease-out" style="width: ${actualProgress}%"></div>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-tight">${question.text}</h3>
        </div>
    `;
    
    if (question.type === 'single') {
        questionHtml += '<div class="space-y-4">';
        question.options.forEach((option, index) => {
            questionHtml += `
                <button 
                    onclick="selectSingleAnswer('${question.id}', '${option.value}')"
                    class="question-option stagger-fade w-full text-left p-6 border-2 border-gray-200 rounded-xl hover:border-turquoise-400 transition-all duration-300 group"
                    data-value="${option.value}"
                    style="animation-delay: ${index * 0.1}s"
                >
                    <div class="flex items-center">
                        <div class="w-5 h-5 border-2 border-gray-300 rounded-full mr-4 group-hover:border-turquoise-500 transition-colors duration-200"></div>
                        <span class="text-gray-700 group-hover:text-gray-900 font-medium">${option.text}</span>
                    </div>
                </button>
            `;
        });
        questionHtml += '</div>';
        
    } else if (question.type === 'multiple') {
        questionHtml += '<div class="space-y-4">';
        question.options.forEach((option, index) => {
            const isChecked = responseHistory[question.id] && responseHistory[question.id].includes(option.value) ? 'checked' : '';
            questionHtml += `
                <label class="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:border-turquoise-300 group">
                    <input 
                        type="checkbox" 
                        value="${option.value}"
                        class="mr-4 h-5 w-5 text-turquoise-600 rounded focus:ring-turquoise-500 focus:ring-2"
                        onchange="updateMultipleAnswer('${question.id}')"
                        ${isChecked}
                    >
                    <span class="text-gray-700 group-hover:text-gray-900 font-medium">${option.text}</span>
                </label>
            `;
        });
        questionHtml += `
            </div>
            <div class="mt-8 flex justify-end">
                <button onclick="submitMultipleAnswer('${question.id}')" class="bg-gradient-to-r from-blue-600 to-turquoise-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold">
                    Continue →
                </button>
            </div>
        `;
        
    } else if (question.type === 'form') {
        questionHtml += '<div class="space-y-4">';
        question.fields.forEach(field => {
            if (field.type === 'select') {
                questionHtml += `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${field.name}</label>
                        <select name="${field.name}" ${field.required ? 'required' : ''} class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select ${field.name}</option>
                            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else {
                questionHtml += `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">${field.name}</label>
                        <input 
                            type="${field.type}" 
                            name="${field.name}"
                            placeholder="${field.placeholder}"
                            ${field.min ? `min="${field.min}"` : ''}
                            ${field.max ? `max="${field.max}"` : ''}
                            ${field.required ? 'required' : ''}
                            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                    </div>
                `;
            }
        });
        questionHtml += `
            </div>
            <div class="mt-6 flex justify-between">
                <button onclick="previousQuestion()" class="px-6 py-2 text-gray-600 hover:text-gray-800">← Previous</button>
                <button onclick="submitFormAnswer('${question.id}')" class="bg-gradient-to-r from-blue-600 to-turquoise-500 text-white px-6 py-3 rounded-lg hover:shadow-lg">Next →</button>
            </div>
        `;
        
    } else if (question.type === 'textarea') {
        questionHtml += `
            <textarea 
                id="textarea-${question.id}"
                placeholder="${question.placeholder}"
                rows="4"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div class="mt-6 flex justify-between">
                <button onclick="previousQuestion()" class="px-6 py-2 text-gray-600 hover:text-gray-800">← Previous</button>
                <button onclick="submitTextareaAnswer('${question.id}')" class="bg-gradient-to-r from-blue-600 to-turquoise-500 text-white px-6 py-3 rounded-lg hover:shadow-lg">Next →</button>
            </div>
        `;
    }
    
    content.innerHTML = questionHtml;
}

// Handle single answer selection
function selectSingleAnswer(questionId, value) {
    // Visual feedback
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('border-blue-500', 'bg-blue-100');
        btn.classList.add('border-gray-200');
    });
    
    document.querySelector(`[data-value="${value}"]`).classList.add('border-blue-500', 'bg-blue-100');
    
    // Submit answer after brief delay for visual feedback
    setTimeout(() => {
        submitAnswer(questionId, value);
    }, 200);
}

// Submit multiple choice answer
function submitMultipleAnswer(questionId) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const values = Array.from(checkboxes).map(cb => cb.value);
    
    if (values.length === 0) {
        alert('Please select at least one option.');
        return;
    }
    
    submitAnswer(questionId, values);
}

// Submit form answer
function submitFormAnswer(questionId) {
    const formData = {};
    const inputs = document.querySelectorAll('input, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
            formData[input.name] = input.value;
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
        return;
    }
    
    submitAnswer(questionId, formData);
}

// Submit textarea answer
function submitTextareaAnswer(questionId) {
    const value = document.getElementById(`textarea-${questionId}`).value.trim();
    submitAnswer(questionId, value);
}

// Submit answer to server
async function submitAnswer(questionId, answer) {
    try {
        // Save response to history
        responseHistory[questionId] = answer;
        
        const response = await fetch('/api/questionnaire/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: currentSession,
                questionId: questionId,
                answer: answer
            })
        });
        
        const data = await response.json();
        
        if (data.complete) {
            showPlanSelection(data.userPath, data.responses);
        } else {
            currentQuestionIndex++;
            // Add new question to history
            questionHistory.push(data.question);
            displayQuestion(data.question, data.progress, true);
        }
        
    } catch (error) {
        console.error('Error submitting answer:', error);
        showErrorMessage('Failed to submit answer. Please try again.');
    }
}

// Go back to previous question
function goBackQuestion() {
    if (questionHistory.length > 1) {
        // Remove current question from history
        questionHistory.pop();
        currentQuestionIndex--;
        
        // Get previous question
        const prevQuestion = questionHistory[questionHistory.length - 1];
        const progress = (prevQuestion.id / 20) * 100;
        
        displayQuestion(prevQuestion, progress, true);
    }
}

// Show plan selection with enhanced design and animations
function showPlanSelection(userPath, responses) {
    const content = document.getElementById('questionnaire-content');
    
    // Get personalized insights based on responses
    const insights = generatePersonalizedInsights(responses, userPath);
    
    content.innerHTML = `
        <div class="text-center">
            <!-- Success Animation -->
            <div class="mb-8 success-enter">
                <div class="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <h2 class="text-4xl font-bold text-gray-800 mb-4">🎉 Your Personal Profile is Ready!</h2>
                <p class="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Congratulations! We've analyzed your responses and created a completely personalized transformation plan 
                    designed specifically for your <strong class="text-turquoise-600">${userPath}</strong> level journey.
                </p>
            </div>

            <!-- Personalized Insights -->
            <div class="bg-gradient-to-r from-blue-50 to-turquoise-50 rounded-2xl p-8 mb-8 text-left">
                <h3 class="text-2xl font-bold text-gray-800 mb-4 text-center">Your Personalized Insights</h3>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-turquoise-500 rounded-full mr-3"></div>
                            <span class="text-gray-700">${insights.goal}</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                            <span class="text-gray-700">${insights.timeline}</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span class="text-gray-700">${insights.approach}</span>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                            <span class="text-gray-700">${insights.lifestyle}</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-pink-500 rounded-full mr-3"></div>
                            <span class="text-gray-700">${insights.preference}</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                            <span class="text-gray-700">${insights.motivation}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Plan Selection Header -->
            <div class="mb-8">
                <h3 class="text-3xl font-bold text-gray-800 mb-4">Choose Your Transformation Package</h3>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    Select the level of support that matches your commitment to achieving your goals.
                    Each plan includes your personalized recommendations.
                </p>
            </div>
            
            <div class="grid gap-8 max-w-5xl mx-auto">
                <!-- Basic Plan -->
                <div class="pricing-card-enter border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-400 transition-all duration-300 hover:shadow-xl bg-white">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-2xl font-bold text-gray-800 mb-2">Essential Plan</h3>
                            <p class="text-gray-600">Perfect for getting started</p>
                        </div>
                        <div class="text-right">
                            <span class="text-3xl font-bold text-blue-600">9.90</span>
                            <span class="text-gray-600"> AZN</span>
                        </div>
                    </div>
                    <ul class="text-left text-gray-700 mb-8 space-y-3">
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Your personalized 30-day transformation plan</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Daily calorie and macro targets for your body</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Weekly meal planning structure</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Progress tracking guidelines</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Motivation tips and mindset guidance</li>
                    </ul>
                    <button onclick="selectPlan('basic')" class="w-full bg-gradient-to-r from-blue-500 to-turquoise-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Get My Essential Plan
                    </button>
                </div>
                
                <!-- Premium Plan -->
                <div class="pricing-card-enter border-2 border-turquoise-400 rounded-2xl p-8 bg-gradient-to-br from-turquoise-50 to-blue-50 relative transform scale-105 shadow-lg">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-turquoise-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        ⭐ MOST POPULAR
                    </div>
                    <div class="flex justify-between items-start mb-6 mt-4">
                        <div>
                            <h3 class="text-2xl font-bold text-turquoise-800 mb-2">Complete Plan</h3>
                            <p class="text-turquoise-700">Everything you need to succeed</p>
                        </div>
                        <div class="text-right">
                            <span class="text-3xl font-bold text-turquoise-600">14.90</span>
                            <span class="text-turquoise-700"> AZN</span>
                        </div>
                    </div>
                    <ul class="text-left text-turquoise-800 mb-8 space-y-3">
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Everything in Essential Plan</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> <strong>Detailed meal suggestions & recipes</strong></li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Grocery shopping lists</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Meal prep instructions</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Healthy snack alternatives</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Restaurant dining guidelines</li>
                    </ul>
                    <button onclick="selectPlan('premium')" class="w-full bg-gradient-to-r from-turquoise-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Get My Complete Plan
                    </button>
                </div>
                
                <!-- Ultimate Plan -->
                <div class="pricing-card-enter border-2 border-orange-400 rounded-2xl p-8 bg-gradient-to-br from-orange-50 to-pink-50">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-2xl font-bold text-orange-800 mb-2">Ultimate Plan</h3>
                            <p class="text-orange-700">Maximum support & guidance</p>
                        </div>
                        <div class="text-right">
                            <span class="text-3xl font-bold text-orange-600">29.90</span>
                            <span class="text-orange-700"> AZN</span>
                        </div>
                    </div>
                    <ul class="text-left text-orange-800 mb-8 space-y-3">
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Everything in Complete Plan</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> <strong>Personalized workout routines</strong></li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Exercise demonstrations and form guides</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> <strong>Supplement recommendations</strong></li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Recovery and sleep optimization</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Advanced progress tracking methods</li>
                        <li class="flex items-center"><span class="text-green-500 mr-3">✓</span> Plateau-breaking strategies</li>
                    </ul>
                    <button onclick="selectPlan('complete')" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Get My Ultimate Plan
                    </button>
                </div>
            </div>
            
            <!-- Guarantee & Security -->
            <div class="mt-12 bg-white rounded-xl p-6 border border-gray-200">
                <div class="flex items-center justify-center space-x-8 text-sm text-gray-600">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                        Secure payment by Kapital Bank
                    </div>
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        30-day money-back guarantee
                    </div>
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                        Your data is private & secure
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate personalized insights based on user responses
function generatePersonalizedInsights(responses, userPath) {
    const goal = responses[1] || 'lose_weight';
    const timeframe = responses[6] || '3_months';
    const activityLevel = responses[3] || 'moderately_active';
    const dietPrefs = responses[7] || [];
    const motivation = responses[16] || 'health_improvement';

    return {
        goal: goal.includes('lose_weight') ? 'Primary focus on sustainable weight loss' : 
              goal.includes('build_muscle') ? 'Build muscle while losing fat' : 'Maintain health and wellness',
        timeline: timeframe.includes('1_month') ? 'Quick results in 4 weeks' :
                  timeframe.includes('3_months') ? 'Balanced 3-month transformation' : 'Long-term lifestyle change',
        approach: userPath === 'beginner' ? 'Gentle introduction to healthy habits' :
                  userPath === 'intermediate' ? 'Structured progressive approach' : 'Advanced optimization strategies',
        lifestyle: activityLevel.includes('sedentary') ? 'Desk-friendly exercise options' :
                   activityLevel.includes('very_active') ? 'High-performance nutrition plan' : 'Moderate activity integration',
        preference: dietPrefs.includes('vegetarian') ? 'Plant-based meal options' :
                   dietPrefs.includes('keto') ? 'Low-carb ketogenic approach' : 'Flexible dietary recommendations',
        motivation: motivation.includes('health') ? 'Health-focused transformation' :
                   motivation.includes('confidence') ? 'Confidence-building journey' : 'Energy and vitality enhancement'
    };
}

// Select plan and proceed to payment
async function selectPlan(planType) {
    try {
        showLoading('Generating your personalized plan...');
        
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: currentSession,
                planType: planType
            })
        });
        
        const data = await response.json();
        
        if (data.orderId) {
            // Create payment session
            const paymentResponse = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderId })
            });
            
            const paymentData = await paymentResponse.json();
            
            // Redirect to payment page
            window.location.href = paymentData.paymentUrl;
        } else {
            throw new Error('Failed to create order');
        }
        
    } catch (error) {
        console.error('Error selecting plan:', error);
        alert('Failed to process your selection. Please try again.');
        hideLoading();
    }
}

// Show loading overlay
function showLoading(message) {
    const content = document.getElementById('questionnaire-content');
    content.innerHTML = `
        <div class="text-center py-12">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Creating Your Plan</h3>
            <p class="text-gray-600">${message}</p>
        </div>
    `;
}

// Hide loading
function hideLoading() {
    // This would restore the previous content if needed
}

// Close questionnaire modal
function closeQuestionnaire() {
    document.getElementById('questionnaire-modal').classList.add('hidden');
    document.getElementById('questionnaire-modal').classList.remove('flex');
    currentSession = null;
    currentQuestionIndex = 0;
    responses = {};
}

// Previous question (for future implementation)
function previousQuestion() {
    // Implementation would depend on storing question history
    console.log('Previous question functionality to be implemented');
}

// Utility functions
function showErrorMessage(message) {
    // Create elegant error notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function showSuccessMessage(message) {
    // Create elegant success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Enhanced loading with better animation
function showLoading(message) {
    const content = document.getElementById('questionnaire-content');
    content.innerHTML = `
        <div class="text-center py-16 fade-in-up">
            <div class="relative mb-8">
                <div class="w-20 h-20 border-4 border-turquoise-200 border-t-turquoise-600 rounded-full animate-spin mx-auto"></div>
                <div class="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-orange-400 rounded-full animate-spin mx-auto" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Creating Your Personal Plan</h3>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="loading-dots justify-center">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p class="text-sm text-gray-500 mt-6">This may take a few moments...</p>
        </div>
    `;
}

// Close questionnaire with animation and confirmation
function closeQuestionnaire() {
    // Show confirmation if user has made progress
    if (questionHistory.length > 1) {
        if (!confirm('Are you sure you want to exit? Your progress will be lost.')) {
            return;
        }
    }
    
    const modal = document.getElementById('questionnaire-modal');
    const modalContent = document.getElementById('modal-content');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('modal-show');
        modalContent.classList.remove('scale-100', 'opacity-100');
        
        // Reset state
        currentSession = null;
        currentQuestionIndex = 0;
        responses = {};
        questionHistory = [];
        responseHistory = {};
    }, 200);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Prevent accidental clicks outside modal by removing click handler
    // Modal can only be closed via close button or ESC key
    
    // Add escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !document.getElementById('questionnaire-modal').classList.contains('hidden')) {
            closeQuestionnaire();
        }
    });
    
    // Add staggered animation to features on load
    const features = document.querySelectorAll('.feature-card');
    features.forEach((feature, index) => {
        feature.style.animationDelay = `${index * 0.1}s`;
        feature.classList.add('fade-in-up');
    });
});