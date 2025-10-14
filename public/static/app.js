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

// Get random motivational image
function getMotivationalImage() {
    const images = [
        {
            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            text: "Strong & Confident",
            message: "You have the power to transform!"
        },
        {
            url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            text: "Powerful & Determined",
            message: "Every rep brings you closer!"
        },
        {
            url: "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            text: "Fit & Healthy",
            message: "Your body is capable of amazing things!"
        },
        {
            url: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            text: "Sculpted & Strong",
            message: "Consistency creates champions!"
        },
        {
            url: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            text: "Athletic & Confident",
            message: "Believe in your transformation!"
        }
    ];
    return images[Math.floor(Math.random() * images.length)];
}

// Display question with animations and back button
function displayQuestion(question, progress = 0, showBack = true) {
    const content = document.getElementById('questionnaire-content');
    
    // Calculate actual progress
    const actualProgress = Math.max(progress, (question.id / 20) * 100);
    
    // Add motivational image every 5 questions
    const showMotivationalImage = question.id % 5 === 0 && question.id > 1;
    let motivationalSection = '';
    
    if (showMotivationalImage) {
        const motivImg = getMotivationalImage();
        motivationalSection = `
            <div class="mb-8 text-center bg-gradient-to-r from-blue-50 to-turquoise-50 rounded-2xl p-6">
                <img src="${motivImg.url}" alt="${motivImg.text}" 
                     class="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg hover-lift" />
                <p class="text-lg font-bold text-turquoise-600 mb-2">💪 ${motivImg.text}</p>
                <p class="text-md text-gray-600">${motivImg.message}</p>
            </div>
        `;
    }
    
    let questionHtml = `
        ${motivationalSection}
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
        questionHtml += '<div class="space-y-3 max-w-lg mx-auto">';
        question.options.forEach((option, index) => {
            questionHtml += `
                <button 
                    onclick="selectSingleAnswer('${question.id}', '${option.value}')"
                    class="option-button stagger-fade w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-cyan-400 hover:bg-blue-50 transition-all duration-200 group"
                    data-value="${option.value}"
                    style="animation-delay: ${index * 0.1}s"
                >
                    <div class="flex items-center">
                        <div class="w-5 h-5 border-2 border-gray-300 rounded-full mr-4 group-hover:border-cyan-500 transition-colors duration-200"></div>
                        <span class="text-gray-700 group-hover:text-gray-900 font-medium">${option.text}</span>
                    </div>
                </button>
            `;
        });
        questionHtml += '</div>';
        
    } else if (question.type === 'multiple') {
        questionHtml += '<div class="space-y-3 max-w-lg mx-auto">';
        question.options.forEach((option, index) => {
            const isChecked = responseHistory[question.id] && responseHistory[question.id].includes(option.value) ? 'checked' : '';
            questionHtml += `
                <label class="flex items-center p-5 border-2 border-gray-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:border-cyan-400 group ${isChecked ? 'bg-blue-50 border-cyan-500' : ''}">
                    <input 
                        type="checkbox" 
                        value="${option.value}"
                        class="mr-4 h-5 w-5 text-cyan-600 rounded focus:ring-cyan-500 focus:ring-2"
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
                <button onclick="submitMultipleAnswer('${question.id}')" class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:shadow-xl font-semibold transition-all hover:scale-105 flex items-center gap-2">
                    Continue
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        `;
        
    } else if (question.type === 'form') {
        // Add subtitle if exists
        if (question.subtitle) {
            questionHtml += `<p class="text-gray-600 text-center mb-6 text-base">${question.subtitle}</p>`;
        }
        
        questionHtml += '<div class="space-y-5 max-w-lg mx-auto">';
        question.fields.forEach(field => {
            if (field.type === 'select') {
                questionHtml += `
                    <div class="form-field-wrapper">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            ${field.icon ? field.icon + ' ' : ''}${field.label || field.name}
                        </label>
                        <select name="${field.name}" ${field.required ? 'required' : ''} 
                                class="form-input w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all">
                            <option value="">Select ${field.name}</option>
                            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    </div>
                `;
            } else {
                // Set realistic limits for different field types
                let minVal = field.min;
                let maxVal = field.max;
                let step = 'any';
                
                if (field.name === 'Age') {
                    minVal = 16;
                    maxVal = 100;
                    step = '1';
                } else if (field.name === 'height') {
                    minVal = 120;
                    maxVal = 250;
                    step = '0.1';
                } else if (field.name === 'current_weight' || field.name === 'target_weight') {
                    minVal = 30;
                    maxVal = 300;
                    step = '0.1';
                }
                
                questionHtml += `
                    <div class="form-field-wrapper">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            ${field.icon ? field.icon + ' ' : ''}${field.label || field.name}
                        </label>
                        <input 
                            type="${field.type}" 
                            name="${field.name}"
                            placeholder="${field.placeholder}"
                            ${minVal ? `min="${minVal}"` : ''}
                            ${maxVal ? `max="${maxVal}"` : ''}
                            ${field.type === 'number' ? `step="${step}"` : ''}
                            ${field.required ? 'required' : ''}
                            class="form-input w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-lg"
                        >
                    </div>
                `;
            }
        });
        questionHtml += `
            </div>
            <div class="mt-8 flex justify-end">
                <button onclick="submitFormAnswer('${question.id}')" class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:shadow-xl font-semibold transition-all hover:scale-105 flex items-center gap-2">
                    Next
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        `;
        
    } else if (question.type === 'textarea') {
        questionHtml += `
            <div class="max-w-lg mx-auto">
                <textarea 
                    id="textarea-${question.id}"
                    placeholder="${question.placeholder}"
                    rows="5"
                    class="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none text-base"
                ></textarea>
            </div>
            <div class="mt-8 flex justify-end">
                <button onclick="submitTextareaAnswer('${question.id}')" class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:shadow-xl font-semibold transition-all hover:scale-105 flex items-center gap-2">
                    Next
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        `;
    }
    
    content.innerHTML = questionHtml;
}

// Handle single answer selection
function selectSingleAnswer(questionId, value) {
    // Visual feedback
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('border-cyan-500', 'bg-blue-50');
        btn.classList.add('border-gray-200');
        const circle = btn.querySelector('div > div');
        if (circle) {
            circle.classList.remove('border-cyan-500', 'bg-cyan-500');
            circle.classList.add('border-gray-300');
            circle.innerHTML = '';
        }
    });
    
    const selectedBtn = document.querySelector(`[data-value="${value}"]`);
    selectedBtn.classList.add('border-cyan-500', 'bg-blue-50');
    const circle = selectedBtn.querySelector('div > div');
    if (circle) {
        circle.classList.add('border-cyan-500', 'bg-cyan-500');
        circle.classList.remove('border-gray-300');
        circle.innerHTML = '<div class="w-2 h-2 bg-white rounded-full"></div>';
    }
    
    // Submit answer after brief delay for visual feedback
    setTimeout(() => {
        submitAnswer(questionId, value);
    }, 300);
}

// Submit multiple choice answer
function submitMultipleAnswer(questionId) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const values = Array.from(checkboxes).map(cb => cb.value);
    
    if (values.length === 0) {
        showNotification('Please select at least one option.', 'warning');
        return;
    }
    
    submitAnswer(questionId, values);
}

// Submit form answer
function submitFormAnswer(questionId) {
    const formData = {};
    const inputs = document.querySelectorAll('input, select');
    let isValid = true;
    let errorMessage = '';
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const name = input.name;
        
        // Check if required field is empty
        if (input.required && !value) {
            isValid = false;
            input.classList.add('border-red-500');
            errorMessage = 'Please fill in all required fields.';
            return;
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                input.classList.add('border-red-500');
                errorMessage = 'Please enter a valid email address.';
                return;
            }
        }
        
        // Age validation
        if (name === 'Age' && value) {
            const age = parseInt(value);
            if (age < 16 || age > 100) {
                isValid = false;
                input.classList.add('border-red-500');
                errorMessage = 'Age must be between 16 and 100 years.';
                return;
            }
        }
        
        // Height validation
        if (name === 'height' && value) {
            const height = parseFloat(value);
            if (height < 120 || height > 250) {
                isValid = false;
                input.classList.add('border-red-500');
                errorMessage = 'Height must be between 120 and 250 cm.';
                return;
            }
        }
        
        // Weight validation (current and target)
        if ((name === 'current_weight' || name === 'target_weight') && value) {
            const weight = parseFloat(value);
            if (weight < 30 || weight > 300) {
                isValid = false;
                input.classList.add('border-red-500');
                errorMessage = 'Weight must be between 30 and 300 kg.';
                return;
            }
        }
        
        input.classList.remove('border-red-500');
        formData[input.name] = input.value;
    });
    
    if (!isValid) {
        showNotification(errorMessage, 'error');
        return;
    }
    
    // Store user name for later use
    if (formData.Name) {
        window.userName = formData.Name;
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
    
    // Get user's first name for personalization
    const userName = window.userName || 'there';
    const firstName = userName.split(' ')[0];
    
    content.innerHTML = `
        <div class="text-center">
            <!-- Success Animation -->
            <div class="mb-10 success-enter">
                <div class="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                    <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    🎉 Awesome Work, <span class="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">${firstName}!</span>
                </h2>
                <p class="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                    Your personal profile is ready! We've analyzed your responses and created a completely personalized transformation plan 
                    designed specifically for your <strong class="text-cyan-600 font-bold">${userPath}</strong> level journey.
                </p>
            </div>

            <!-- Personalized Insights -->
            <div class="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 rounded-3xl p-8 md:p-10 mb-10 shadow-lg border border-blue-100">
                <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                    <span class="text-3xl">✨</span>
                    Your Personalized Insights
                </h3>
                <div class="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    <div class="space-y-4">
                        <div class="flex items-center bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div class="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-4 flex items-center justify-center flex-shrink-0">
                                <span class="text-white font-bold">1</span>
                            </div>
                            <span class="text-gray-700 font-medium">${insights.goal}</span>
                        </div>
                        <div class="flex items-center bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div class="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mr-4 flex items-center justify-center flex-shrink-0">
                                <span class="text-white font-bold">2</span>
                            </div>
                            <span class="text-gray-700 font-medium">${insights.timeline}</span>
                        </div>
                        <div class="flex items-center bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div class="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full mr-4 flex items-center justify-center flex-shrink-0">
                                <span class="text-white font-bold">3</span>
                            </div>
                            <span class="text-gray-700 font-medium">${insights.approach}</span>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-4 flex items-center justify-center flex-shrink-0">
                                <span class="text-white font-bold">4</span>
                            </div>
                            <span class="text-gray-700 font-medium">${insights.lifestyle}</span>
                        </div>
                        <div class="flex items-center bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div class="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full mr-4 flex items-center justify-center flex-shrink-0">
                                <span class="text-white font-bold">5</span>
                            </div>
                            <span class="text-gray-700 font-medium">${insights.preference}</span>
                        </div>
                        <div class="flex items-center bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mr-4 flex items-center justify-center flex-shrink-0">
                                <span class="text-white font-bold">6</span>
                            </div>
                            <span class="text-gray-700 font-medium">${insights.motivation}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Success Gallery -->
            <div class="mb-10 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                    <span class="text-3xl">💪</span>
                    See What You Can Achieve!
                </h3>
                <div class="grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto mb-6">
                    <div class="hover-lift">
                        <img 
                            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                            alt="Strong woman transformation" 
                            class="rounded-2xl shadow-xl w-full h-32 md:h-40 object-cover hover:scale-105 transition-transform duration-300 border-4 border-white"
                        />
                    </div>
                    <div class="hover-lift">
                        <img 
                            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                            alt="Muscular man success" 
                            class="rounded-2xl shadow-xl w-full h-32 md:h-40 object-cover hover:scale-105 transition-transform duration-300 border-4 border-white"
                        />
                    </div>
                    <div class="hover-lift">
                        <img 
                            src="https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                            alt="Fit athletic transformation" 
                            class="rounded-2xl shadow-xl w-full h-32 md:h-40 object-cover hover:scale-105 transition-transform duration-300 border-4 border-white"
                        />
                    </div>
                </div>
                <div class="bg-white rounded-2xl p-4 max-w-2xl mx-auto">
                    <p class="text-base md:text-lg font-bold text-cyan-600 italic">
                        "Your transformation starts with your decision to begin!"
                    </p>
                </div>
            </div>

            <!-- Plan Selection Header -->
            <div class="mb-10 text-center">
                <h3 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                    Choose Your <span class="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Transformation</span> Package
                </h3>
                <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Select the level of support that matches your commitment to achieving your goals.
                    Each plan includes your personalized recommendations.
                </p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
                <!-- Basic Plan -->
                <div class="pricing-card-enter bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <!-- Plan Image -->
                    <div class="text-center mb-6">
                        <div class="w-24 h-24 rounded-2xl mx-auto mb-3 overflow-hidden shadow-lg">
                            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop" alt="Essential Plan" class="w-full h-full object-cover">
                        </div>
                        <p class="text-sm text-blue-600 font-bold uppercase tracking-wide">Start Your Journey</p>
                    </div>
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-black text-gray-900 mb-2">Essential Plan</h3>
                        <p class="text-gray-600 text-sm">Perfect for getting started</p>
                        <div class="mt-4">
                            <span class="text-4xl font-black text-blue-600">$9.90</span>
                        </div>
                    </div>
                    <ul class="text-left text-gray-700 mb-8 space-y-3">
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Your personalized 30-day transformation plan</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Daily calorie and macro targets for your body</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Weekly meal planning structure</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Progress tracking guidelines</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Motivation tips and mindset guidance</span></li>
                    </ul>
                    <button onclick="selectPlan('basic')" class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                        Get My Essential Plan →
                    </button>
                </div>
                
                <!-- Premium Plan -->
                <div class="pricing-card-enter bg-gradient-to-br from-cyan-50 to-blue-50 border-4 border-cyan-500 rounded-3xl p-6 md:p-8 relative transform md:scale-110 shadow-2xl z-10">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
                        ⭐ MOST POPULAR
                    </div>
                    <!-- Plan Image -->
                    <div class="text-center mb-6 mt-2">
                        <div class="w-24 h-24 rounded-2xl mx-auto mb-3 overflow-hidden shadow-lg">
                            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop" alt="Complete Plan" class="w-full h-full object-cover">
                        </div>
                        <p class="text-sm text-cyan-700 font-bold uppercase tracking-wide">Transform Completely</p>
                    </div>
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-black text-cyan-900 mb-2">Complete Plan</h3>
                        <p class="text-cyan-800 text-sm font-semibold">Everything you need to succeed</p>
                        <div class="mt-4">
                            <span class="text-4xl font-black text-cyan-600">$14.90</span>
                        </div>
                    </div>
                    <ul class="text-left text-cyan-900 mb-8 space-y-3">
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm font-medium">Everything in Essential Plan</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm font-bold">Detailed meal suggestions & recipes</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm font-medium">Grocery shopping lists</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm font-medium">Meal prep instructions</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm font-medium">Healthy snack alternatives</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm font-medium">Restaurant dining guidelines</span></li>
                    </ul>
                    <button onclick="selectPlan('premium')" class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg">
                        Get My Complete Plan →
                    </button>
                </div>
                
                <!-- Ultimate Plan -->
                <div class="pricing-card-enter bg-white border-2 border-orange-300 rounded-3xl p-6 md:p-8 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <!-- Plan Image -->
                    <div class="text-center mb-6">
                        <div class="w-24 h-24 rounded-2xl mx-auto mb-3 overflow-hidden shadow-lg">
                            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop" alt="Ultimate Plan" class="w-full h-full object-cover">
                        </div>
                        <p class="text-sm text-orange-600 font-bold uppercase tracking-wide">Achieve Excellence</p>
                    </div>
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-black text-gray-900 mb-2">Ultimate Plan</h3>
                        <p class="text-gray-600 text-sm">Maximum support & guidance</p>
                        <div class="mt-4">
                            <span class="text-4xl font-black text-orange-600">$29.90</span>
                        </div>
                    </div>
                    <ul class="text-left text-gray-700 mb-8 space-y-3">
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Everything in Complete Plan</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm font-bold">Personalized workout routines</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Exercise demonstrations and form guides</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm font-bold">Supplement recommendations</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Recovery and sleep optimization</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Advanced progress tracking methods</span></li>
                        <li class="flex items-start"><span class="text-green-500 mr-3 text-xl flex-shrink-0">✓</span><span class="text-sm">Plateau-breaking strategies</span></li>
                    </ul>
                    <button onclick="selectPlan('complete')" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                        Get My Ultimate Plan →
                    </button>
                </div>
            </div>
            
            <!-- Security Section -->
            <div class="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                <div class="grid md:grid-cols-2 gap-8 text-center max-w-3xl mx-auto">
                    <div class="flex flex-col items-center">
                        <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                            </svg>
                        </div>
                        <p class="text-gray-800 font-bold text-lg mb-1">Secure Payment</p>
                        <p class="text-blue-600 font-black text-xl">Kapital Bank</p>
                        <p class="text-gray-600 text-sm mt-2">Bank-level encryption for your safety</p>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                            </svg>
                        </div>
                        <p class="text-gray-800 font-bold text-lg mb-1">Privacy Protected</p>
                        <p class="text-purple-600 font-black text-xl">Your Data is Safe</p>
                        <p class="text-gray-600 text-sm mt-2">We never share your information</p>
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

// Unified notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existing = document.querySelector('.custom-notification');
    if (existing) {
        existing.remove();
    }
    
    // Define notification styles and icons based on type
    const styles = {
        success: {
            bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
            icon: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
            duration: 3000
        },
        error: {
            bg: 'bg-gradient-to-r from-red-500 to-pink-500',
            icon: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
            duration: 5000
        },
        warning: {
            bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
            icon: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
            duration: 4000
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            icon: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
            duration: 3000
        }
    };
    
    const style = styles[type] || styles.info;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification fixed top-6 right-6 ${style.bg} text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] transform translate-x-[calc(100%+2rem)] transition-all duration-500 ease-out max-w-md`;
    notification.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="flex-shrink-0">
                ${style.icon}
            </div>
            <span class="font-medium text-base">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translate(calc(100% + 2rem), 0)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 500);
    }, style.duration);
}

// Backward compatibility
function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
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

// Show custom confirmation dialog
function showConfirmDialog(message, onConfirm, onCancel) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4';
    overlay.style.animation = 'fadeIn 0.2s ease-out';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-3xl shadow-2xl max-w-md w-full transform scale-95 opacity-0 transition-all duration-300';
    dialog.innerHTML = `
        <div class="p-8">
            <!-- Warning Icon -->
            <div class="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
            </div>
            
            <!-- Message -->
            <h3 class="text-2xl font-bold text-gray-900 mb-3 text-center">Are you sure?</h3>
            <p class="text-gray-600 text-center mb-8 leading-relaxed">${message}</p>
            
            <!-- Action Buttons -->
            <div class="flex gap-3">
                <button id="cancel-btn" class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all">
                    Stay
                </button>
                <button id="confirm-btn" class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105">
                    Exit
                </button>
            </div>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        dialog.style.transform = 'scale(1)';
        dialog.style.opacity = '1';
    }, 10);
    
    // Handle buttons
    const confirmBtn = dialog.querySelector('#confirm-btn');
    const cancelBtn = dialog.querySelector('#cancel-btn');
    
    const closeDialog = (confirmed) => {
        dialog.style.transform = 'scale(0.95)';
        dialog.style.opacity = '0';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            overlay.remove();
            if (confirmed && onConfirm) onConfirm();
            else if (!confirmed && onCancel) onCancel();
        }, 200);
    };
    
    confirmBtn.addEventListener('click', () => closeDialog(true));
    cancelBtn.addEventListener('click', () => closeDialog(false));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog(false);
    });
}

// Close questionnaire with animation and confirmation
function closeQuestionnaire() {
    // Show confirmation if user has made progress
    if (questionHistory.length > 1) {
        showConfirmDialog(
            'Your progress will be lost if you exit now. Are you sure you want to leave?',
            () => {
                // User confirmed - proceed with closing
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
        );
        return;
    }
    
    // No progress made - close directly
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