let currentSession = null;
let currentQuestionIndex = 0;
let responses = {};

// Start questionnaire
async function startQuestionnaire() {
    try {
        const response = await fetch('/api/questionnaire/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        currentSession = data.sessionId;
        
        document.getElementById('questionnaire-modal').classList.remove('hidden');
        document.getElementById('questionnaire-modal').classList.add('flex');
        
        displayQuestion(data.question);
    } catch (error) {
        console.error('Error starting questionnaire:', error);
        alert('Failed to start questionnaire. Please try again.');
    }
}

// Display question
function displayQuestion(question, progress = 0) {
    const content = document.getElementById('questionnaire-content');
    
    let questionHtml = `
        <div class="mb-6">
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div class="bg-gradient-to-r from-blue-600 to-turquoise-500 h-2 rounded-full" style="width: ${progress}%"></div>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">Question ${question.id} of 20</h3>
            <p class="text-lg text-gray-700 mb-6">${question.text}</p>
        </div>
    `;
    
    if (question.type === 'single') {
        questionHtml += '<div class="space-y-3">';
        question.options.forEach((option, index) => {
            questionHtml += `
                <button 
                    onclick="selectSingleAnswer('${question.id}', '${option.value}')"
                    class="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition duration-200 option-button"
                    data-value="${option.value}"
                >
                    ${option.text}
                </button>
            `;
        });
        questionHtml += '</div>';
        
    } else if (question.type === 'multiple') {
        questionHtml += '<div class="space-y-3">';
        question.options.forEach((option, index) => {
            questionHtml += `
                <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        value="${option.value}"
                        class="mr-3 h-4 w-4 text-blue-600 rounded"
                        onchange="updateMultipleAnswer('${question.id}')"
                    >
                    <span>${option.text}</span>
                </label>
            `;
        });
        questionHtml += `
            </div>
            <div class="mt-6 flex justify-between">
                <button onclick="previousQuestion()" class="px-6 py-2 text-gray-600 hover:text-gray-800">← Previous</button>
                <button onclick="submitMultipleAnswer('${question.id}')" class="bg-gradient-to-r from-blue-600 to-turquoise-500 text-white px-6 py-3 rounded-lg hover:shadow-lg">Next →</button>
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
            displayQuestion(data.question, data.progress);
        }
        
    } catch (error) {
        console.error('Error submitting answer:', error);
        alert('Failed to submit answer. Please try again.');
    }
}

// Show plan selection
function showPlanSelection(userPath, responses) {
    const content = document.getElementById('questionnaire-content');
    
    content.innerHTML = `
        <div class="text-center">
            <div class="mb-8">
                <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <h2 class="text-3xl font-bold text-gray-800 mb-4">🎉 Assessment Complete!</h2>
                <p class="text-lg text-gray-600 mb-8">
                    Based on your responses, we've identified you as a <strong class="text-blue-600">${userPath}</strong> level user.
                    <br>Choose your personalized plan below:
                </p>
            </div>
            
            <div class="grid gap-6">
                <!-- Basic Plan -->
                <div class="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition duration-200">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Basic Plan - 9.90 AZN</h3>
                    <ul class="text-left text-gray-600 mb-4 space-y-1">
                        <li>✓ Personalized 30-day weight loss plan</li>
                        <li>✓ Daily calorie and macro targets</li>
                        <li>✓ Weekly meal planning structure</li>
                        <li>✓ Progress tracking guidelines</li>
                        <li>✓ Motivation tips and mindset guidance</li>
                    </ul>
                    <button onclick="selectPlan('basic')" class="w-full bg-gradient-to-r from-blue-500 to-turquoise-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg">
                        Choose Basic Plan
                    </button>
                </div>
                
                <!-- Premium Plan -->
                <div class="border-2 border-turquoise-400 rounded-xl p-6 bg-turquoise-50 relative">
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-turquoise-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        POPULAR
                    </div>
                    <h3 class="text-xl font-bold text-turquoise-800 mb-2">Premium Plan - 14.90 AZN</h3>
                    <ul class="text-left text-turquoise-700 mb-4 space-y-1">
                        <li>✓ Everything in Basic Plan</li>
                        <li>✓ <strong>Detailed meal suggestions & recipes</strong></li>
                        <li>✓ Grocery shopping lists</li>
                        <li>✓ Meal prep instructions</li>
                        <li>✓ Healthy snack alternatives</li>
                        <li>✓ Restaurant dining guidelines</li>
                    </ul>
                    <button onclick="selectPlan('premium')" class="w-full bg-gradient-to-r from-turquoise-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg">
                        Choose Premium Plan
                    </button>
                </div>
                
                <!-- Complete Plan -->
                <div class="border-2 border-orange-400 rounded-xl p-6 bg-orange-50">
                    <h3 class="text-xl font-bold text-orange-800 mb-2">Complete Plan - 29.90 AZN</h3>
                    <ul class="text-left text-orange-700 mb-4 space-y-1">
                        <li>✓ Everything in Premium Plan</li>
                        <li>✓ <strong>Personalized workout routines</strong></li>
                        <li>✓ Exercise demonstrations and form guides</li>
                        <li>✓ <strong>Supplement recommendations</strong></li>
                        <li>✓ Recovery and sleep optimization</li>
                        <li>✓ Advanced progress tracking methods</li>
                        <li>✓ Plateau-breaking strategies</li>
                    </ul>
                    <button onclick="selectPlan('complete')" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg">
                        Choose Complete Plan
                    </button>
                </div>
            </div>
            
            <p class="text-sm text-gray-500 mt-6">
                Secure payment powered by Kapital Bank • 30-day money-back guarantee
            </p>
        </div>
    `;
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add click outside modal to close
    document.getElementById('questionnaire-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeQuestionnaire();
        }
    });
});