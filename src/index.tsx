import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

type Bindings = {
  DB: D1Database;
  OPENROUTER_API_KEY: string;
  KAPITAL_MERCHANT_ID: string;
  KAPITAL_APPROVE_URL: string;
  KAPITAL_CANCEL_URL: string;
  KAPITAL_DECLINE_URL: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Use JSX renderer
app.use(renderer)

// Questionnaire data structure
const questions = [
  {
    id: 1,
    text: "What's your primary goal?",
    type: "single",
    options: [
      { value: "lose_weight", text: "Lose weight effectively", path: "beginner" },
      { value: "build_muscle", text: "Build muscle while losing fat", path: "intermediate" },
      { value: "maintain_health", text: "Maintain current weight & improve health", path: "advanced" }
    ]
  },
  {
    id: 2,
    text: "What's your current experience with diet plans?",
    type: "single",
    options: [
      { value: "never_tried", text: "I've never tried a structured diet", path: "beginner" },
      { value: "tried_few", text: "I've tried a few diets before", path: "intermediate" },
      { value: "very_experienced", text: "I'm very experienced with nutrition", path: "advanced" }
    ]
  },
  {
    id: 3,
    text: "How would you describe your current activity level?",
    type: "single",
    options: [
      { value: "sedentary", text: "Mostly sitting, little to no exercise" },
      { value: "lightly_active", text: "Light exercise 1-3 days per week" },
      { value: "moderately_active", text: "Moderate exercise 3-5 days per week" },
      { value: "very_active", text: "Hard exercise 6-7 days per week" },
      { value: "extremely_active", text: "Very hard exercise, physical job" }
    ]
  },
  {
    id: 4,
    text: "Please provide your basic information:",
    type: "form",
    fields: [
      { name: "name", type: "text", placeholder: "Your full name", required: true },
      { name: "email", type: "email", placeholder: "Email address", required: true },
      { name: "age", type: "number", placeholder: "Age", min: 16, max: 80, required: true },
      { name: "gender", type: "select", options: ["Female", "Male", "Other"], required: true }
    ]
  },
  {
    id: 5,
    text: "Physical measurements:",
    type: "form",
    fields: [
      { name: "height", type: "number", placeholder: "Height (cm)", min: 140, max: 220, required: true },
      { name: "current_weight", type: "number", placeholder: "Current weight (kg)", min: 40, max: 200, required: true },
      { name: "target_weight", type: "number", placeholder: "Target weight (kg)", min: 40, max: 200, required: true }
    ]
  },
  {
    id: 6,
    text: "What's your target timeframe?",
    type: "single",
    options: [
      { value: "1_month", text: "1 month (quick results)" },
      { value: "3_months", text: "3 months (balanced approach)" },
      { value: "6_months", text: "6 months (sustainable change)" },
      { value: "1_year", text: "1 year+ (lifestyle transformation)" }
    ]
  },
  {
    id: 7,
    text: "Do you have any dietary preferences or restrictions?",
    type: "multiple",
    options: [
      { value: "none", text: "No restrictions" },
      { value: "vegetarian", text: "Vegetarian" },
      { value: "vegan", text: "Vegan" },
      { value: "keto", text: "Ketogenic (low-carb)" },
      { value: "mediterranean", text: "Mediterranean" },
      { value: "paleo", text: "Paleo" },
      { value: "gluten_free", text: "Gluten-free" },
      { value: "dairy_free", text: "Dairy-free" },
      { value: "halal", text: "Halal" }
    ]
  },
  {
    id: 8,
    text: "Any health conditions we should consider?",
    type: "multiple",
    options: [
      { value: "none", text: "No health conditions" },
      { value: "diabetes", text: "Diabetes" },
      { value: "hypertension", text: "High blood pressure" },
      { value: "thyroid", text: "Thyroid issues" },
      { value: "heart_condition", text: "Heart condition" },
      { value: "joint_problems", text: "Joint problems" },
      { value: "food_allergies", text: "Food allergies" },
      { value: "other", text: "Other (specify in next step)" }
    ]
  },
  {
    id: 9,
    text: "How much time can you dedicate to meal preparation daily?",
    type: "single",
    options: [
      { value: "15_min", text: "15 minutes or less" },
      { value: "30_min", text: "30 minutes" },
      { value: "60_min", text: "1 hour" },
      { value: "90_min", text: "1.5 hours" },
      { value: "unlimited", text: "I love cooking, time is not an issue" }
    ]
  },
  {
    id: 10,
    text: "What's your weekly budget for groceries?",
    type: "single",
    options: [
      { value: "budget_50", text: "Under 50 AZN" },
      { value: "budget_100", text: "50-100 AZN" },
      { value: "budget_150", text: "100-150 AZN" },
      { value: "budget_200", text: "150-200 AZN" },
      { value: "budget_unlimited", text: "200+ AZN (budget is not a concern)" }
    ]
  },
  {
    id: 11,
    text: "How often do you eat out or order takeaway?",
    type: "single",
    options: [
      { value: "never", text: "Never / rarely" },
      { value: "weekly", text: "1-2 times per week" },
      { value: "several_weekly", text: "3-4 times per week" },
      { value: "daily", text: "Almost daily" }
    ]
  },
  {
    id: 12,
    text: "What type of exercise do you prefer?",
    type: "multiple",
    options: [
      { value: "none", text: "I prefer not to exercise" },
      { value: "walking", text: "Walking" },
      { value: "running", text: "Running/Jogging" },
      { value: "gym", text: "Gym/Weight training" },
      { value: "home_workouts", text: "Home workouts" },
      { value: "yoga", text: "Yoga/Pilates" },
      { value: "swimming", text: "Swimming" },
      { value: "sports", text: "Sports (football, basketball, etc.)" },
      { value: "cycling", text: "Cycling" }
    ]
  },
  {
    id: 13,
    text: "How many days per week can you commit to exercise?",
    type: "single",
    options: [
      { value: "0_days", text: "0 days (diet only approach)" },
      { value: "1_2_days", text: "1-2 days" },
      { value: "3_4_days", text: "3-4 days" },
      { value: "5_6_days", text: "5-6 days" },
      { value: "daily", text: "Every day" }
    ]
  },
  {
    id: 14,
    text: "What's your biggest challenge with previous diet attempts?",
    type: "single",
    options: [
      { value: "no_previous", text: "This is my first attempt" },
      { value: "cravings", text: "Uncontrollable cravings" },
      { value: "time_management", text: "Time management" },
      { value: "social_eating", text: "Social eating situations" },
      { value: "motivation", text: "Lack of motivation" },
      { value: "results_slow", text: "Results were too slow" },
      { value: "too_restrictive", text: "Plans were too restrictive" },
      { value: "no_guidance", text: "Lack of proper guidance" }
    ]
  },
  {
    id: 15,
    text: "How do you prefer to track your progress?",
    type: "multiple",
    options: [
      { value: "weight_scale", text: "Daily weigh-ins" },
      { value: "measurements", text: "Body measurements" },
      { value: "photos", text: "Progress photos" },
      { value: "clothes_fit", text: "How clothes fit" },
      { value: "energy_levels", text: "Energy levels" },
      { value: "app_tracking", text: "Mobile app tracking" },
      { value: "no_tracking", text: "I prefer not to track" }
    ]
  },
  {
    id: 16,
    text: "What motivates you most to reach your goals?",
    type: "single",
    options: [
      { value: "health_improvement", text: "Improving my health" },
      { value: "confidence", text: "Feeling more confident" },
      { value: "appearance", text: "Looking better" },
      { value: "energy", text: "Having more energy" },
      { value: "family", text: "Being a better example for my family" },
      { value: "fitness_goals", text: "Achieving fitness milestones" },
      { value: "medical_reasons", text: "Medical recommendations" }
    ]
  },
  {
    id: 17,
    text: "Do you have any food intolerances or allergies? (Optional)",
    type: "textarea",
    placeholder: "Please describe any specific food intolerances, allergies, or medical dietary requirements..."
  },
  {
    id: 18,
    text: "What's your work schedule like?",
    type: "single",
    options: [
      { value: "regular_9_5", text: "Regular 9-5 office job" },
      { value: "shift_work", text: "Shift work / irregular hours" },
      { value: "night_shifts", text: "Night shifts" },
      { value: "freelancer", text: "Freelancer / flexible schedule" },
      { value: "student", text: "Student" },
      { value: "retired", text: "Retired / not working" }
    ]
  },
  {
    id: 19,
    text: "How would you describe your stress levels?",
    type: "single",
    options: [
      { value: "low_stress", text: "Low - I'm generally relaxed" },
      { value: "moderate_stress", text: "Moderate - some stressful periods" },
      { value: "high_stress", text: "High - often stressed" },
      { value: "very_high_stress", text: "Very high - constantly stressed" }
    ]
  },
  {
    id: 20,
    text: "Finally, what's your ideal outcome from this program?",
    type: "textarea",
    placeholder: "Describe your dream transformation and how you want to feel after completing the program..."
  }
]

// Main application routes
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-turquoise-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200 to-turquoise-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-20 animate-bounce" style="animation-delay: 2s;"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-15 animate-spin" style="animation-duration: 20s;"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16 fade-in-up">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-turquoise-500 p-6 rounded-full shadow-2xl hover-lift">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
          </div>

          <h1 className="logo-text text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-700 via-turquoise-600 to-blue-800 bg-clip-text text-transparent mb-6 animate-gradient tracking-tight">
            FitGenius
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light">
            Your Personal Weight Loss Journey
          </p>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover a completely <span className="font-bold text-turquoise-600">personalized transformation plan</span> 
            created just for you. Every recommendation is tailored to your unique lifestyle, goals, and preferences.
          </p>

          {/* Hero Image */}
          <div className="mb-12 hover-lift">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Healthy lifestyle transformation" 
              className="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full object-cover h-96 md:h-[500px]"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto border border-white/50">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
              Why Choose a <span className="text-gradient">Personalized</span> Approach?
            </h2>
            
            <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Unlike generic diet plans, our system creates a completely unique program based on your specific needs, 
              preferences, and lifestyle. Every detail matters in your transformation journey.
            </p>
            
            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="text-center group feature-card">
                <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-orange-600 transition-colors duration-300">100% Personalized</h3>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Every recommendation is crafted specifically for your unique profile and goals</p>
              </div>
              
              <div className="text-center group feature-card">
                <div className="bg-gradient-to-br from-turquoise-400 to-blue-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zM4 7v2h16V7H4z M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-8H6v8z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-turquoise-600 transition-colors duration-300">Lifestyle Integration</h3>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Plans that fit seamlessly into your daily routine and work schedule</p>
              </div>
              
              <div className="text-center group feature-card">
                <div className="bg-gradient-to-br from-green-400 to-blue-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-green-600 transition-colors duration-300">Detailed Guide</h3>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Comprehensive 30-day plan with daily guidance and motivation</p>
              </div>
              
              <div className="text-center group feature-card">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-purple-600 transition-colors duration-300">Proven Methods</h3>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Science-based approaches tailored to your specific needs</p>
              </div>
            </div>
            
            {/* Success Stories Section */}
            <div className="bg-gradient-to-r from-blue-50 to-turquoise-50 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Real Transformations</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="Success story" 
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-lg"
                  />
                  <p className="text-sm text-gray-600 italic mb-2">"Lost 12kg in 2 months with my personalized plan!"</p>
                  <p className="text-xs text-gray-500 font-semibold">Sarah M.</p>
                </div>
                <div className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="Success story" 
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-lg"
                  />
                  <p className="text-sm text-gray-600 italic mb-2">"Finally a plan that fits my busy lifestyle."</p>
                  <p className="text-xs text-gray-500 font-semibold">Ahmed R.</p>
                </div>
                <div className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="Success story" 
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover shadow-lg"
                  />
                  <p className="text-sm text-gray-600 italic mb-2">"Best investment in my health journey!"</p>
                  <p className="text-xs text-gray-500 font-semibold">Leyla K.</p>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Ready to Start Your <span className="text-gradient">Personal</span> Transformation?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Take our comprehensive assessment to discover what your unique body needs for successful, 
                sustainable weight loss that fits your life.
              </p>
              
              <button 
                onclick="startQuestionnaire()" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-5 px-10 rounded-full text-xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl pulse-glow"
              >
                <span className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Start Your Personal Assessment
                </span>
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                ✨ Free assessment • 💯 Personalized results • 🔒 Secure & private
              </p>
            </div>
          </div>
        </section>
      </div>
      
      {/* Questionnaire Modal - Fullscreen */}
      <div id="questionnaire-modal" className="fixed inset-0 bg-gradient-to-br from-blue-900/95 to-turquoise-900/95 backdrop-blur-sm hidden z-50">
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 relative" id="modal-content">
            {/* Close button - only show on larger screens */}
            <button 
              onclick="closeQuestionnaire()" 
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 hidden md:flex"
              title="Close (ESC)"
            >
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            <div id="questionnaire-content" className="p-8 md:p-12">
              {/* Dynamic content will be loaded here */}
            </div>
          </div>
        </div>
      </div>
      
      <script src="/static/app.js"></script>
    </div>
  )
})

// API Routes
// In-memory storage for development (replace with D1 in production)
const sessions = new Map()

app.post('/api/questionnaire/start', async (c) => {
  const sessionId = crypto.randomUUID()
  
  try {
    // Store in memory for development
    sessions.set(sessionId, {
      current_step: 1,
      responses: {},
      user_path: null,
      created_at: new Date()
    })
    
    return c.json({ sessionId, question: questions[0] })
  } catch (error) {
    return c.json({ error: 'Failed to start questionnaire' }, 500)
  }
})

app.post('/api/questionnaire/answer', async (c) => {
  const { sessionId, questionId, answer } = await c.req.json()
  
  try {
    // Get current session from memory
    const session = sessions.get(sessionId)
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    
    // Update responses
    session.responses[questionId] = answer
    
    // Determine user path based on responses
    let userPath = session.user_path
    if (!userPath && session.responses[1] && session.responses[2]) {
      const goal = session.responses[1]
      const experience = session.responses[2]
      
      if (goal?.includes && goal.includes('lose_weight') && experience?.includes && experience.includes('never_tried')) {
        userPath = 'beginner'
      } else if ((goal?.includes && goal.includes('build_muscle')) || (experience?.includes && experience.includes('tried_few'))) {
        userPath = 'intermediate'
      } else {
        userPath = 'advanced'
      }
    }
    
    // Update session
    session.user_path = userPath
    session.current_step += 1
    
    // Check if questionnaire is complete
    if (session.current_step > questions.length) {
      return c.json({ complete: true, userPath, responses: session.responses })
    }
    
    // Return next question
    const nextQuestion = questions[session.current_step - 1]
    return c.json({ 
      question: nextQuestion, 
      userPath, 
      progress: (session.current_step / questions.length) * 100 
    })
    
  } catch (error) {
    console.error('Answer processing error:', error)
    return c.json({ error: 'Failed to process answer' }, 500)
  }
})

// In-memory storage for orders (development only)
const orders = new Map()
const users = new Map()
let nextUserId = 1
let nextOrderId = 1

app.post('/api/generate-plan', async (c) => {
  const { sessionId, planType } = await c.req.json()
  
  try {
    // Get session data from memory
    const session = sessions.get(sessionId)
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    
    const responses = session.responses
    
    // Generate AI plan using OpenRouter (or fallback)
    const aiPlan = await generateAIPlan(responses, session.user_path, planType, c.env?.OPENROUTER_API_KEY || 'demo')
    
    // Create user record in memory
    const userId = nextUserId++
    users.set(userId, {
      id: userId,
      email: responses[4]?.email || '',
      name: responses[4]?.name || '',
      age: responses[4]?.age || 0,
      gender: responses[4]?.gender || '',
      height: responses[5]?.height || 0,
      current_weight: responses[5]?.current_weight || 0,
      target_weight: responses[5]?.target_weight || 0,
      activity_level: responses[3] || '',
      dietary_preferences: responses[7] || [],
      health_conditions: responses[8] || [],
      questionnaire_data: responses,
      user_path: session.user_path || 'beginner',
      created_at: new Date()
    })
    
    // Determine plan price
    const prices = { basic: 9.90, premium: 14.90, complete: 29.90 }
    const amount = prices[planType] || 9.90
    
    // Create order in memory
    const orderId = nextOrderId++
    orders.set(orderId, {
      id: orderId,
      user_id: userId,
      plan_type: planType,
      amount: amount,
      status: 'pending',
      ai_plan_content: aiPlan,
      created_at: new Date()
    })
    
    return c.json({ 
      orderId: orderId,
      userId: userId,
      amount,
      planType,
      preview: aiPlan.preview // Show a preview of the plan
    })
    
  } catch (error) {
    console.error('Error generating plan:', error)
    return c.json({ error: 'Failed to generate plan' }, 500)
  }
})

// AI Plan Generation Function
async function generateAIPlan(responses: any, userPath: string, planType: string, apiKey: string) {
  // Construct detailed prompt based on user responses
  const userInfo = {
    name: responses[4]?.name || 'User',
    age: responses[4]?.age || 30,
    gender: responses[4]?.gender || 'Not specified',
    height: responses[5]?.height || 170,
    currentWeight: responses[5]?.current_weight || 70,
    targetWeight: responses[5]?.target_weight || 65,
    goal: responses[1] || 'lose_weight',
    experience: responses[2] || 'beginner',
    activityLevel: responses[3] || 'moderate',
    timeframe: responses[6] || '3_months',
    dietaryPreferences: responses[7] || ['none'],
    healthConditions: responses[8] || ['none'],
    mealPrepTime: responses[9] || '30_min',
    budget: responses[10] || 'budget_100',
    eatingOut: responses[11] || 'weekly',
    exercisePreferences: responses[12] || ['walking'],
    exerciseDays: responses[13] || '3_4_days',
    challenges: responses[14] || 'motivation',
    tracking: responses[15] || ['weight_scale'],
    motivation: responses[16] || 'health_improvement',
    allergies: responses[17] || '',
    workSchedule: responses[18] || 'regular_9_5',
    stress: responses[19] || 'moderate_stress',
    idealOutcome: responses[20] || ''
  }
  
  const prompt = `As a team of expert nutritionists, fitness trainers, and wellness coaches, create a comprehensive, personalized 30-day weight loss plan for the following client. Focus on practical, science-based recommendations without mentioning AI or automated systems:

CLIENT PROFILE:
- Name: ${userInfo.name}
- Age: ${userInfo.age} years old
- Gender: ${userInfo.gender}  
- Height: ${userInfo.height}cm
- Current Weight: ${userInfo.currentWeight}kg
- Target Weight: ${userInfo.targetWeight}kg
- Experience Level: ${userPath}
- Primary Goal: ${userInfo.goal}
- Activity Level: ${userInfo.activityLevel}
- Target Timeframe: ${userInfo.timeframe}
- Dietary Preferences: ${userInfo.dietaryPreferences.join(', ')}
- Health Conditions: ${userInfo.healthConditions.join(', ')}
- Meal Prep Time Available: ${userInfo.mealPrepTime}
- Weekly Grocery Budget: ${userInfo.budget}
- Eating Out Frequency: ${userInfo.eatingOut}
- Exercise Preferences: ${userInfo.exercisePreferences.join(', ')}
- Exercise Days per Week: ${userInfo.exerciseDays}
- Previous Challenges: ${userInfo.challenges}
- Tracking Preferences: ${userInfo.tracking.join(', ')}
- Primary Motivation: ${userInfo.motivation}
- Allergies/Intolerances: ${userInfo.allergies || 'None specified'}
- Work Schedule: ${userInfo.workSchedule}
- Stress Level: ${userInfo.stress}
- Ideal Outcome: ${userInfo.idealOutcome}

PLAN TYPE: ${planType.toUpperCase()}
${planType === 'basic' ? '- Focus on nutrition and basic guidance' : ''}
${planType === 'premium' ? '- Include detailed meal suggestions and recipes' : ''}
${planType === 'complete' ? '- Include workouts, supplements, and comprehensive guidance' : ''}

Please create a detailed, structured 30-day plan with the following sections:

1. EXECUTIVE SUMMARY (1-2 paragraphs)
   - Personalized greeting and motivation
   - Plan overview tailored to their specific goals

2. CALORIC & NUTRITIONAL TARGETS
   - Daily calorie target (calculated for their stats and goals)
   - Macronutrient breakdown (protein, carbs, fats)
   - Daily water intake recommendation

3. WEEKLY BREAKDOWN (4 weeks)
   For each week, provide:
   - Weekly focus and goals
   - Sample daily meal structure
   ${planType !== 'basic' ? '- Specific meal suggestions with portions' : ''}
   ${planType === 'complete' ? '- Exercise schedule for the week' : ''}
   - Key tips and motivation

4. DAILY MEAL STRUCTURE
   - Meal timing recommendations
   - Portion control guidelines
   ${planType !== 'basic' ? '- Specific food suggestions for each meal' : ''}
   ${planType !== 'basic' ? '- Healthy snack options' : ''}

${planType !== 'basic' ? `5. MEAL SUGGESTIONS & RECIPES
   - 10+ breakfast options
   - 15+ lunch options  
   - 15+ dinner options
   - Healthy snack alternatives
   - Quick meal prep ideas` : ''}

${planType === 'complete' ? `6. EXERCISE PROGRAM
   - Weekly workout schedule
   - Specific exercises for their preferences
   - Beginner modifications
   - Progressive difficulty increase

7. SUPPLEMENT RECOMMENDATIONS
   - Essential supplements for weight loss
   - Timing and dosage recommendations
   - Budget-friendly options` : ''}

8. PROGRESS TRACKING
   - Weekly check-in guidelines
   - Measurements to track
   - How to adjust the plan based on progress

9. MINDSET & MOTIVATION
   - Daily affirmations
   - Overcoming common challenges
   - Building sustainable habits

10. TROUBLESHOOTING GUIDE
   - What to do if progress stalls
   - Handling cravings and temptations
   - Adjusting for special occasions

Ensure the plan is:
- Scientifically sound and safe
- Realistic and sustainable
- Culturally appropriate for Azerbaijan
- Adaptable to their lifestyle
- Motivational and encouraging

Format your response as structured JSON with clear sections and subsections. Make it detailed enough for a 10+ page PDF guide.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fitgenius.pages.dev',
        'X-Title': 'FitGenius Weight Loss Plan Generator'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    let planContent = data.choices[0].message.content

    // Try to parse as JSON, if it fails, structure it
    try {
      const parsedPlan = JSON.parse(planContent)
      return {
        fullPlan: parsedPlan,
        preview: generatePreview(parsedPlan, userInfo)
      }
    } catch {
      // If not JSON, create structured plan
      return {
        fullPlan: {
          executiveSummary: planContent.substring(0, 500) + '...',
          caloricTargets: { dailyCalories: Math.round(1200 + (userInfo.currentWeight * 12)) },
          weeklyBreakdown: [{
            week: 1,
            focus: 'Building foundation habits',
            content: 'Focus on establishing meal timing and portion control...'
          }]
        },
        preview: generatePreview(null, userInfo)
      }
    }
  } catch (error) {
    console.error('AI generation error:', error)
    // Return a fallback plan
    return {
      fullPlan: generateFallbackPlan(userInfo, planType),
      preview: generatePreview(null, userInfo)
    }
  }
}

function generatePreview(plan: any, userInfo: any) {
  const weightToLose = userInfo.currentWeight - userInfo.targetWeight
  const weeksToGoal = Math.max(4, Math.round(weightToLose / 0.5)) // Safe 0.5kg per week
  
  return {
    personalizedGreeting: `Hi ${userInfo.name}! Your personalized ${userInfo.targetWeight}kg weight loss journey starts now.`,
    keyStats: {
      dailyCalories: Math.round(1200 + (userInfo.currentWeight * 10)),
      weeklyWeightLoss: '0.5-1kg',
      timeToGoal: `${weeksToGoal} weeks`,
      workoutsPerWeek: userInfo.exerciseDays.includes('daily') ? 7 : parseInt(userInfo.exerciseDays.charAt(0)) || 3
    },
    quickTips: [
      'Start each day with a glass of water and protein-rich breakfast',
      'Plan your meals in advance to avoid impulse eating',
      'Track your progress with photos and measurements, not just weight',
      'Focus on building sustainable habits rather than quick fixes'
    ]
  }
}

function generateFallbackPlan(userInfo: any, planType: string) {
  const dailyCalories = Math.round(1200 + (userInfo.currentWeight * 10))
  
  return {
    executiveSummary: `Welcome ${userInfo.name}! This personalized 30-day plan is designed to help you lose weight safely and sustainably. Based on your profile, we've calculated your daily caloric needs and created a structured approach that fits your lifestyle.`,
    caloricTargets: {
      dailyCalories: dailyCalories,
      protein: Math.round(userInfo.currentWeight * 1.6),
      carbs: Math.round(dailyCalories * 0.45 / 4),
      fats: Math.round(dailyCalories * 0.25 / 9),
      water: '2.5-3 liters daily'
    },
    weeklyBreakdown: [
      {
        week: 1,
        focus: 'Foundation Building',
        goals: 'Establish meal timing and portion control',
        tips: 'Focus on consistency over perfection'
      },
      {
        week: 2,
        focus: 'Habit Formation', 
        goals: 'Increase vegetable intake and reduce processed foods',
        tips: 'Meal prep on weekends for busy weekdays'
      },
      {
        week: 3,
        focus: 'Optimization',
        goals: 'Fine-tune portions based on hunger and energy',
        tips: 'Listen to your body and adjust as needed'
      },
      {
        week: 4,
        focus: 'Sustainability',
        goals: 'Plan for long-term success beyond 30 days',
        tips: 'Celebrate your progress and plan your next phase'
      }
    ]
  }
}

app.get('/api/payment/:orderId', async (c) => {
  const orderId = parseInt(c.req.param('orderId'))
  
  try {
    const order = orders.get(orderId)
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    const user = users.get(order.user_id)
    
    return c.json({
      ...order,
      name: user?.name,
      email: user?.email
    })
    
  } catch (error) {
    return c.json({ error: 'Failed to get order' }, 500)
  }
})

// Generate PDF after payment
app.post('/api/generate-pdf/:orderId', async (c) => {
  const orderId = parseInt(c.req.param('orderId'))
  
  try {
    const order = orders.get(orderId)
    const user = order ? users.get(order.user_id) : null
    
    if (!order || !user || order.status !== 'paid') {
      return c.json({ error: 'Order not found or not paid' }, 404)
    }
    
    // Generate beautiful PDF
    const pdfContent = await generatePDFContent(
      { ...order, ...user }, 
      order.ai_plan_content, 
      user.questionnaire_data
    )
    const pdfUrl = await createPDF(pdfContent, orderId.toString())
    
    // Update order with PDF URL
    order.pdf_url = pdfUrl
    
    return c.json({ pdfUrl, success: true })
    
  } catch (error) {
    console.error('PDF generation error:', error)
    return c.json({ error: 'Failed to generate PDF' }, 500)
  }
})

async function generatePDFContent(order: any, aiPlan: any, responses: any) {
  return {
    title: `${order.name}'s Personalized Weight Loss Plan`,
    subtitle: 'Your 30-Day Transformation Journey with FitGenius',
    userInfo: {
      name: order.name,
      age: order.age,
      currentWeight: order.current_weight,
      targetWeight: order.target_weight,
      planType: order.plan_type
    },
    plan: aiPlan.fullPlan || {},
    generatedDate: new Date().toISOString().split('T')[0]
  }
}

async function createPDF(content: any, orderId: string) {
  // For now, return a mock PDF URL
  // In production, this would integrate with a PDF service like Puppeteer, jsPDF, or an external API
  return `https://example.com/pdfs/fitgenius-plan-${orderId}.pdf`
}

// Kapital Bank Payment Integration
app.post('/api/payment/create', async (c) => {
  const { orderId } = await c.req.json()
  
  try {
    const order = orders.get(parseInt(orderId))
    const user = order ? users.get(order.user_id) : null
    
    if (!order || !user) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    // Create Kapital Bank payment
    const paymentData = await createKapitalPayment({...order, ...user}, c.env || {})
    
    // Update order with Kapital session info
    order.kapital_order_id = paymentData.orderId
    order.kapital_session_id = paymentData.sessionId
    
    return c.json({
      paymentUrl: paymentData.paymentUrl,
      orderId: paymentData.orderId,
      sessionId: paymentData.sessionId
    })
    
  } catch (error) {
    console.error('Payment creation error:', error)
    return c.json({ error: 'Failed to create payment' }, 500)
  }
})

async function createKapitalPayment(order: any, env: any) {
  // Kapital Bank API integration
  const paymentRequest = {
    merchantId: env.KAPITAL_MERCHANT_ID,
    amount: Math.round(order.amount * 100), // Convert to qəpik (cents)
    currency: '944', // AZN currency code
    description: `FitGenius ${order.plan_type} Plan - Order #${order.id}`,
    language: 'AZ',
    approveUrl: env.KAPITAL_APPROVE_URL,
    cancelUrl: env.KAPITAL_CANCEL_URL,
    declineUrl: env.KAPITAL_DECLINE_URL
  }
  
  // For sandbox/development, return mock data
  // In production, this would make actual API calls to Kapital Bank
  const mockOrderId = Date.now().toString()
  const mockSessionId = 'SESSION_' + Math.random().toString(36).substring(7).toUpperCase()
  
  return {
    orderId: mockOrderId,
    sessionId: mockSessionId,
    paymentUrl: `https://e-commerce.kapitalbank.az/?ORDERID=${mockOrderId}&SESSIONID=${mockSessionId}`
  }
}

// Payment callback routes
app.get('/payment/approve', async (c) => {
  const orderId = c.req.query('ORDERID')
  const sessionId = c.req.query('SESSIONID')
  
  try {
    // Verify payment with Kapital Bank
    const isValid = await verifyKapitalPayment(orderId, sessionId)
    
    if (isValid) {
      // Find and update order status
      let foundOrder = null
      for (const [id, order] of orders) {
        if (order.kapital_order_id === orderId && order.kapital_session_id === sessionId) {
          order.status = 'paid'
          order.paid_at = new Date()
          foundOrder = order
          break
        }
      }
      
      if (foundOrder) {
        
        return c.html(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Successful - FitGenius</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
              <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">🎉 Payment Successful!</h2>
                <p class="text-gray-600 mb-6">Your personalized weight loss plan is being generated...</p>
                <button 
                  onclick="generatePDF('${foundOrder?.id}')"
                  class="bg-gradient-to-r from-blue-500 to-turquoise-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg w-full"
                >
                  Download Your Plan PDF
                </button>
                <p class="text-sm text-gray-500 mt-4">You'll also receive a copy via email</p>
              </div>
            </div>
            <script>
              async function generatePDF(orderId) {
                try {
                  const response = await fetch('/api/generate-pdf/' + orderId, { method: 'POST' });
                  const data = await response.json();
                  if (data.pdfUrl) {
                    window.open(data.pdfUrl, '_blank');
                  }
                } catch (error) {
                  alert('PDF generation in progress. Check your email in a few minutes.');
                }
              }
            </script>
          </body>
          </html>
        `)
      }
    }
    
    throw new Error('Payment verification failed')
    
  } catch (error) {
    return c.html(`
      <html><head><script src="https://cdn.tailwindcss.com"></script></head><body>
      <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 class="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
          <p class="text-gray-600 mb-6">There was an issue processing your payment.</p>
          <button 
            onclick="window.location.href='/'"
            class="bg-gradient-to-r from-blue-500 to-turquoise-500 text-white font-bold py-3 px-6 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
      </body></html>
    `)
  }
})

app.get('/payment/cancel', async (c) => {
  return c.html(`
    <html><head><script src="https://cdn.tailwindcss.com"></script></head><body>
    <div class="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 class="text-2xl font-bold text-yellow-600 mb-4">Payment Cancelled</h2>
        <p class="text-gray-600 mb-6">You cancelled the payment process.</p>
        <button 
          onclick="window.location.href='/'"
          class="bg-gradient-to-r from-blue-500 to-turquoise-500 text-white font-bold py-3 px-6 rounded-lg"
        >
          Return Home
        </button>
      </div>
    </div>
    </body></html>
  `)
})

app.get('/payment/decline', async (c) => {
  return c.html(`
    <html><head><script src="https://cdn.tailwindcss.com"></script></head><body>
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">Payment Declined</h2>
        <p class="text-gray-600 mb-6">Your payment was declined. Please check your card details and try again.</p>
        <button 
          onclick="window.location.href='/'"
          class="bg-gradient-to-r from-blue-500 to-turquoise-500 text-white font-bold py-3 px-6 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
    </body></html>
  `)
})

async function verifyKapitalPayment(orderId: string, sessionId: string) {
  // In production, this would verify the payment with Kapital Bank API
  // For development, always return true
  return true
}

app.get('/payment/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-turquoise-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Your Payment</h2>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order #{orderId}</p>
          <p className="text-sm text-gray-500 mb-6">Kapital Bank payment integration will be implemented here</p>
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg">
            Pay with Kapital Bank
          </button>
        </div>
      </div>
    </div>
  )
})

export default app
