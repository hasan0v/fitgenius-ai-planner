import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

type D1Database = any;

type Bindings = {
  DB: D1Database;
  OPENROUTER_API_KEY: string;
  GEMINI_API_KEY: string;
  EPOINT_API_URL: string;
  EPOINT_CHECK_URL: string;
  EPOINT_PUBLIC_KEY: string;
  EPOINT_PRIVATE_KEY: string;
  EPOINT_SUCCESS_URL: string;
  EPOINT_ERROR_URL: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files - will be handled by Cloudflare Pages
// app.use('/static/*', serveStatic({ root: './public' }))

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
      { name: "Name", type: "text", placeholder: "Your full name", required: true },
      { name: "Email", type: "email", placeholder: "Email address", required: true },
      { name: "Age", type: "number", placeholder: "Age", min: 16, max: 100, required: true },
      { name: "Gender", type: "select", options: ["Female", "Male", "Other"], required: true }
    ]
  },
  {
    id: 5,
    text: "📏 Let's get your measurements",
    subtitle: "This helps us calculate your perfect calorie target and track your amazing progress!",
    type: "form",
    fields: [
      { name: "height", type: "number", placeholder: "Height (cm)", min: 120, max: 250, required: true, icon: "📏", label: "Height" },
      { name: "current_weight", type: "number", placeholder: "Current weight (kg)", min: 30, max: 300, required: true, icon: "⚖️", label: "Current Weight" },
      { name: "target_weight", type: "number", placeholder: "Target weight (kg)", min: 30, max: 300, required: true, icon: "🎯", label: "Target Weight" }
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
      { value: "budget_50", text: "Under 50 USD" },
      { value: "budget_100", text: "50-100 USD" },
      { value: "budget_150", text: "100-150 USD" },
      { value: "budget_200", text: "150-200 USD" },
      { value: "budget_unlimited", text: "200+ USD (budget is not a concern)" }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-blue-200 to-turquoise-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between mb-8 py-4">
          <div className="flex items-center space-x-3">
            <img src="/images/logo.png" alt="FitGenius Logo" className="h-16 w-auto hover:scale-105 transition-transform duration-300" loading="eager" />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Success Stories</a>
            <button onclick="startQuestionnaire()" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Start Now
            </button>
          </div>
          
          {/* Mobile Navigation - Icons Only */}
          <div className="flex md:hidden items-center space-x-3">
            <a href="#features" className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-cyan-50 transition-all" title="Features">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </a>
            <a href="#testimonials" className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-cyan-50 transition-all" title="Success Stories">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
              </svg>
            </a>
            <button onclick="startQuestionnaire()" className="p-2.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all" title="Start Now">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-20 fade-in-up">
          <div className="max-w-4xl mx-auto">
            {/* Hero Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-pink-100 rounded-full px-6 py-2 mb-6 border border-orange-200">
              <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-orange-700 font-semibold text-sm">AI-Powered Personal Transformation Plans</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Transform Your Body,
              <span className="block mt-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Transform Your Life
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get a <span className="font-bold text-orange-600">100% personalized</span> 30-day weight loss plan
              tailored to your body, lifestyle, and goals. No generic advice—just results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onclick="startQuestionnaire()" 
                className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl flex items-center"
              >
                <span>Start Your Free Assessment</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
              <a href="#testimonials" className="bg-white text-gray-700 font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-cyan-400 transition-all duration-300 inline-block">
                Watch Success Stories
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <img src="https://i.pravatar.cc/40?img=1" alt="User" className="w-8 h-8 rounded-full border-2 border-white" loading="lazy" />
                  <img src="https://i.pravatar.cc/40?img=2" alt="User" className="w-8 h-8 rounded-full border-2 border-white" loading="lazy" />
                  <img src="https://i.pravatar.cc/40?img=3" alt="User" className="w-8 h-8 rounded-full border-2 border-white" loading="lazy" />
                  <img src="https://i.pravatar.cc/40?img=4" alt="User" className="w-8 h-8 rounded-full border-2 border-white" loading="lazy" />
                </div>
                <span className="font-semibold text-gray-700">2,847+ transformations</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="font-semibold text-gray-700">4.9/5 rating</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span className="font-semibold text-gray-700">30-day guarantee</span>
              </div>
            </div>
          </div>

          {/* Hero Image Section */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=500&q=80" 
                  alt="Fit woman transformation" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-2xl font-bold mb-1">-15kg</p>
                  <p className="text-sm opacity-90">in 3 months</p>
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ✓ Verified
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&h=500&q=80" 
                  alt="Muscular man transformation" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-2xl font-bold mb-1">-22kg</p>
                  <p className="text-sm opacity-90">in 4 months</p>
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ✓ Verified
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1550259979-ed79b48d2a30?auto=format&fit=crop&w=400&h=500&q=80" 
                  alt="Athletic woman transformation" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-2xl font-bold mb-1">-12kg</p>
                  <p className="text-sm opacity-90">in 2 months</p>
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ✓ Verified
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto border border-white/50">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
              Why Choose a <span className="text-gradient">Personalized</span> Approach?
            </h2>
            
            <p className="text-base text-gray-600 mb-10 text-center max-w-3xl mx-auto">
              Unlike generic diet plans, our system creates a completely unique program based on your specific needs, 
              preferences, and lifestyle.
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
                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-cyan-600 transition-colors duration-300">Lifestyle Integration</h3>
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
            
            {/* Success Stories Section - More Credible */}
            <div id="testimonials" className="bg-gradient-to-r from-blue-50 to-turquoise-50 rounded-2xl p-8 mb-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Real Transformations from Our Community</h3>
              
              {/* Main Transformation Stories - Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* Success Story 1 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover-lift">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="https://randomuser.me/api/portraits/women/44.jpg" 
                      alt="Aysel profile" 
                      className="w-14 h-14 rounded-full object-cover shadow-md"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-bold text-gray-800">Naoe T.</p>
                      <div className="flex text-yellow-400 text-xs">
                        ⭐⭐⭐⭐⭐
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">"Lost 15kg in 3 months! The personalized meal plan fit perfectly with my busy work schedule."</p>
                  <p className="text-xs text-gray-400">March 2025 • Osaka</p>
                </div>
                
                {/* Success Story 2 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover-lift">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Elchin profile" 
                      className="w-14 h-14 rounded-full object-cover shadow-md"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-bold text-gray-800">Michael M.</p>
                      <div className="flex text-yellow-400 text-xs">
                        ⭐⭐⭐⭐⭐
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">"Dropped 22kg and built muscle! The workout routine was challenging but achievable."</p>
                  <p className="text-xs text-gray-400">January 2025 • Rome</p>
                </div>
                
                {/* Success Story 3 */}
                <div className="bg-white rounded-xl p-5 shadow-md hover-lift">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="https://randomuser.me/api/portraits/women/65.jpg" 
                      alt="Leyla profile" 
                      className="w-14 h-14 rounded-full object-cover shadow-md"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-bold text-gray-800">Leyla K.</p>
                      <div className="flex text-yellow-400 text-xs">
                        ⭐⭐⭐⭐⭐
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">"Finally a plan that works! Lost 12kg and feel more energetic than ever."</p>
                  <p className="text-xs text-gray-400">February 2025 • Tabriz</p>
                </div>
              </div>
              
              {/* Trust Badge */}
              <div className="text-center mt-6 p-4 bg-white rounded-lg">
                <p className="text-lg font-semibold text-gray-800">
                  <span className="text-yellow-400 text-2xl mr-2">⭐</span>
                  Rated 4.9/5 from 2,847 verified users
                </p>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Ready to Start Your Transformation?
              </h3>
              <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
                Take our 3-minute assessment to discover what your body needs for successful, 
                sustainable weight loss.
              </p>
              
              <button 
                onclick="startQuestionnaire()" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl pulse-glow inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Get Your Personal Plan
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
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
      
      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">FitGenius</h3>
              <p className="text-gray-400 text-sm">
                Your AI-powered partner in achieving sustainable weight loss and building healthier habits.
              </p>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-cyan-400">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-cyan-400">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            
            {/* Connect */}
            <div>
              <h4 className="font-semibold mb-4 text-cyan-400">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/fit.geniuss/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} FitGenius. All rights reserved.</p>
            <p className="mt-2 text-xs">
              <span className="text-yellow-400">⚠️</span> Medical Disclaimer: This service provides general wellness information only. 
              Always consult with a healthcare provider before starting any weight loss program.
            </p>
          </div>
        </div>
      </footer>
      
      <script src="/static/app.js"></script>
    </div>
  )
})

// API Routes
// Database connection through Cloudflare D1

app.post('/api/questionnaire/start', async (c) => {
  const sessionId = crypto.randomUUID()
  
  try {
    // Check if database is available
    if (!c.env?.DB) {
      console.warn('Database not available, proceeding without persistence')
      return c.json({ sessionId, question: questions[0] })
    }
    
    // Store in D1 database
    await c.env.DB.prepare(`
      INSERT INTO questionnaire_sessions (id, current_step, responses, created_at, expires_at)
      VALUES (?, 1, '{}', datetime('now'), datetime('now', '+24 hours'))
    `).bind(sessionId).run()
    
    return c.json({ sessionId, question: questions[0] })
  } catch (error) {
    console.error('Failed to start questionnaire:', error)
    // Return the question anyway so the frontend can work
    return c.json({ sessionId, question: questions[0] })
  }
})

app.post('/api/questionnaire/answer', async (c) => {
  const { sessionId, questionId, answer } = await c.req.json()
  
  try {
    // Check if database is available
    if (!c.env?.DB) {
      console.warn('Database not available, returning next question directly')
      const nextQuestion = questions[parseInt(questionId)] || questions[questions.length - 1]
      return c.json({ 
        question: nextQuestion, 
        userPath: 'beginner', 
        progress: (parseInt(questionId) / questions.length) * 100 
      })
    }
    
    // Get current session from D1
    const session = await c.env.DB.prepare(
      'SELECT * FROM questionnaire_sessions WHERE id = ?'
    ).bind(sessionId).first()
    
    if (!session) {
      // Return next question anyway to keep flow working
      const nextQuestion = questions[parseInt(questionId)] || questions[questions.length - 1]
      return c.json({ 
        question: nextQuestion, 
        userPath: 'beginner', 
        progress: (parseInt(questionId) / questions.length) * 100 
      })
    }
    
    // Parse existing responses
    const responses = JSON.parse(session.responses || '{}')
    
    // Update responses
    responses[questionId] = answer
    
    // Determine user path based on responses
    let userPath = session.user_path
    if (!userPath && responses[1] && responses[2]) {
      const goal = responses[1]
      const experience = responses[2]
      
      if (goal?.includes && goal.includes('lose_weight') && experience?.includes && experience.includes('never_tried')) {
        userPath = 'beginner'
      } else if ((goal?.includes && goal.includes('build_muscle')) || (experience?.includes && experience.includes('tried_few'))) {
        userPath = 'intermediate'
      } else {
        userPath = 'advanced'
      }
    }
    
    // Update session in database
    const currentStep = session.current_step + 1
    await c.env.DB.prepare(`
      UPDATE questionnaire_sessions 
      SET current_step = ?, responses = ?, user_path = ?
      WHERE id = ?
    `).bind(currentStep, JSON.stringify(responses), userPath, sessionId).run()
    
    // Check if questionnaire is complete
    if (currentStep > questions.length) {
      return c.json({ complete: true, userPath, responses })
    }
    
    // Return next question
    const nextQuestion = questions[currentStep - 1]
    return c.json({ 
      question: nextQuestion, 
      userPath, 
      progress: (currentStep / questions.length) * 100 
    })
    
  } catch (error) {
    console.error('Answer processing error:', error)
    // Return next question to keep flow working
    const nextQuestionIndex = parseInt(questionId) || 1
    const nextQuestion = questions[nextQuestionIndex] || questions[questions.length - 1]
    return c.json({ 
      question: nextQuestion, 
      userPath: 'beginner', 
      progress: (nextQuestionIndex / questions.length) * 100 
    })
  }
})

// Generate personalized plan and create order
app.post('/api/generate-plan', async (c) => {
  const { sessionId, planType } = await c.req.json()
  
  try {
    // Get session data from D1
    const session = await c.env.DB.prepare(
      'SELECT * FROM questionnaire_sessions WHERE id = ?'
    ).bind(sessionId).first()
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    
    const responses = JSON.parse(session.responses || '{}')
    
    // Generate AI plan using OpenRouter (or fallback)
    const aiPlan = await generateAIPlan(responses, session.user_path, planType, c.env?.OPENROUTER_API_KEY || 'demo')
    
    // Extract user data from responses
    const userData = responses[4] || {}
    const measurements = responses[5] || {}
    
    // Create or update user in database
    const userResult = await c.env.DB.prepare(`
      INSERT INTO users (email, name, age, gender, height, current_weight, target_weight, 
                        activity_level, dietary_preferences, questionnaire_data, user_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        age = excluded.age,
        questionnaire_data = excluded.questionnaire_data,
        user_path = excluded.user_path
      RETURNING id
    `).bind(
      userData.Email,
      userData.Name,
      userData.Age,
      userData.Gender,
      measurements.height,
      measurements.current_weight,
      measurements.target_weight,
      responses[3],
      JSON.stringify(responses[7]),
      JSON.stringify(responses),
      session.user_path
    ).first()
    
    const userId = userResult.id
    
    // Determine plan amount in USD
    const planAmounts: Record<string, number> = {
      'basic': 9.90,
      'premium': 14.90,
      'complete': 29.90
    }
    const amount = planAmounts[planType as string] || 14.90
    
    // Create order in database
    const orderResult = await c.env.DB.prepare(`
      INSERT INTO orders (user_id, plan_type, amount, currency, status, ai_plan_content)
      VALUES (?, ?, ?, 'USD', 'pending', ?)
      RETURNING id
    `).bind(userId, planType, amount, JSON.stringify(aiPlan)).first()
    
    const orderId = orderResult.id
    
    return c.json({ orderId, preview: aiPlan.preview })
    
  } catch (error) {
    console.error('Plan generation error:', error)
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
  
  const prompt = `Create a comprehensive, personalized 30-day weight loss plan as a JSON object. Focus on practical, science-based recommendations:

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

IMPORTANT: Return ONLY valid JSON in this exact structure:
{
  "executiveSummary": { "greeting": "string", "overview": "string", "motivation": "string" },
  "nutritionTargets": { "dailyCalories": number, "protein": "string", "carbs": "string", "fats": "string", "water": "string" },
  "weeklyPlan": [
    { "week": 1, "focus": "string", "goals": ["string"], "mealStructure": "string", "tips": ["string"] }
  ],
  "mealPlan": {
    "breakfast": [{ "name": "string", "calories": number, "description": "string" }],
    "lunch": [{ "name": "string", "calories": number, "description": "string" }],
    "dinner": [{ "name": "string", "calories": number, "description": "string" }],
    "snacks": [{ "name": "string", "calories": number }]
  },
  "workoutPlan": {
    "schedule": [{ "day": "string", "type": "string", "exercises": ["string"], "duration": "string" }]
  },
  "progressTracking": { "weekly": ["string"], "measurements": ["string"], "tips": ["string"] },
  "mindset": { "affirmations": ["string"], "challenges": ["string"], "habits": ["string"] }
}`

  try {
    // Try OpenRouter first
    if (apiKey && apiKey !== 'demo' && !apiKey.includes('your_')) {
      console.log('Attempting OpenRouter API...')
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fitgenius.pages.dev',
        'X-Title': 'FitGenius Weight Loss Plan Generator'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite-preview-09-2025',
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

      const data = await response.json() as any
      let planContent = data.choices[0].message.content
      
      // Try to parse as JSON
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
    } else {
      console.warn('OpenRouter API key not configured, trying Gemini...')
    }
  } catch (openRouterError) {
    console.error('OpenRouter failed:', openRouterError)
    console.log('Trying Gemini API as fallback...')
  }
  
  // Try Gemini API as fallback
  try {
    // Note: env might not be available in function signature, need to pass it
    const geminiKey = (globalThis as any).GEMINI_API_KEY
    
    if (geminiKey && !geminiKey.includes('your-')) {
      console.log('Attempting Gemini 2.5 Pro API...')
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-latest:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000,
            responseMimeType: 'application/json'
          }
        })
      })
      
      if (response.ok) {
        const data: any = await response.json()
        const planContent = data.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (planContent) {
          try {
            const parsedPlan = JSON.parse(planContent)
            return {
              fullPlan: parsedPlan,
              preview: generatePreview(parsedPlan, userInfo)
            }
          } catch {
            // If not valid JSON, use text content
            return {
              fullPlan: {
                executiveSummary: { greeting: `Hi ${userInfo.name}!`, overview: planContent.substring(0, 500) },
                nutritionTargets: { dailyCalories: Math.round(1200 + (userInfo.currentWeight * 10)) }
              },
              preview: generatePreview(null, userInfo)
            }
          }
        }
      }
    }
  } catch (geminiError) {
    console.error('Gemini API also failed:', geminiError)
  }
  
  // Final fallback: use comprehensive hardcoded plan
  console.log('Using comprehensive hardcoded fallback plan')
  try {
    const fallbackPlan = generateFallbackPlan(userInfo, planType)
    return {
      fullPlan: fallbackPlan,
      preview: generatePreview(fallbackPlan, userInfo)
    }
  } catch (error) {
    console.error('AI generation error:', error)
    // Return a minimal fallback plan
    const minimalPlan = generateFallbackPlan(userInfo, planType)
    return {
      fullPlan: minimalPlan,
      preview: generatePreview(null, userInfo)
    }
  }
}

// Remove old error handling that's now integrated above
// The function now handles all fallbacks internally
function oldCodeBlock_ToRemove() {
  const data = {} as any
  let planContent = data.choices?.[0]?.message?.content || ''

  // This comment marks where old code was removed - fallback logic now integrated above
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
    executiveSummary: {
      greeting: `Welcome ${userInfo.name}!`,
      overview: `This personalized 30-day plan is designed to help you lose weight safely and sustainably. Based on your profile, we've calculated your daily caloric needs and created a structured approach that fits your lifestyle.`,
      motivation: `You're taking an important step towards a healthier you. Let's make this journey successful together!`
    },
    nutritionTargets: {
      dailyCalories: dailyCalories,
      protein: `${Math.round(userInfo.currentWeight * 1.6)}g (25-30%)`,
      carbs: `${Math.round(dailyCalories * 0.45 / 4)}g (40-45%)`,
      fats: `${Math.round(dailyCalories * 0.25 / 9)}g (25-30%)`,
      water: '2.5-3 liters daily'
    },
    weeklyPlan: [
      {
        week: 1,
        focus: 'Foundation Building',
        goals: ['Establish meal timing', 'Practice portion control', 'Stay hydrated'],
        mealStructure: 'Breakfast (400 cal), Lunch (500 cal), Dinner (400 cal), Snacks (200 cal)',
        tips: ['Focus on consistency over perfection', 'Prepare meals in advance', 'Track your water intake']
      },
      {
        week: 2,
        focus: 'Habit Formation', 
        goals: ['Increase vegetable intake', 'Reduce processed foods', 'Add light exercise'],
        mealStructure: 'Continue with Week 1 structure, add more vegetables',
        tips: ['Meal prep on weekends', 'Try new healthy recipes', 'Walk 20 minutes daily']
      },
      {
        week: 3,
        focus: 'Optimization',
        goals: ['Fine-tune portions', 'Increase activity', 'Manage stress'],
        mealStructure: 'Adjust portions based on hunger and energy levels',
        tips: ['Listen to your body', 'Add strength training', 'Practice mindful eating']
      },
      {
        week: 4,
        focus: 'Sustainability',
        goals: ['Build lasting habits', 'Plan for maintenance', 'Celebrate progress'],
        mealStructure: 'Continue optimized meal structure',
        tips: ['Review your progress', 'Set new goals', 'Plan your next phase']
      }
    ],
    mealPlan: {
      breakfast: [
        { name: 'Greek Yogurt with Berries', calories: 350, description: 'High protein, antioxidants' },
        { name: 'Oatmeal with Banana', calories: 400, description: 'Fiber-rich, sustained energy' },
        { name: 'Scrambled Eggs with Toast', calories: 380, description: 'Protein-packed start' },
        { name: 'Smoothie Bowl', calories: 420, description: 'Fruits, protein powder, nuts' },
        { name: 'Avocado Toast', calories: 390, description: 'Healthy fats, whole grain' }
      ],
      lunch: [
        { name: 'Grilled Chicken Salad', calories: 450, description: 'Lean protein, mixed greens' },
        { name: 'Quinoa Buddha Bowl', calories: 500, description: 'Complete protein, vegetables' },
        { name: 'Turkey Wrap', calories: 480, description: 'Whole wheat, lean meat, veggies' },
        { name: 'Lentil Soup', calories: 420, description: 'Plant protein, fiber' },
        { name: 'Tuna Salad', calories: 460, description: 'Omega-3, low-carb' }
      ],
      dinner: [
        { name: 'Baked Salmon with Vegetables', calories: 480, description: 'Omega-3, roasted veggies' },
        { name: 'Chicken Stir-Fry', calories: 450, description: 'Lean protein, colorful vegetables' },
        { name: 'Vegetable Pasta', calories: 420, description: 'Whole grain, tomato sauce' },
        { name: 'Grilled Fish with Salad', calories: 440, description: 'Light, nutritious' },
        { name: 'Turkey Meatballs', calories: 460, description: 'Lean protein, marinara' }
      ],
      snacks: [
        { name: 'Apple with Almond Butter', calories: 180 },
        { name: 'Protein Bar', calories: 200 },
        { name: 'Mixed Nuts', calories: 160 },
        { name: 'Carrot Sticks with Hummus', calories: 120 }
      ]
    },
    workoutPlan: planType !== 'basic' ? {
      schedule: [
        { day: 'Monday', type: 'Cardio', exercises: ['Brisk walking 30min', 'Light stretching'], duration: '30 minutes' },
        { day: 'Wednesday', type: 'Strength', exercises: ['Bodyweight squats', 'Push-ups', 'Planks'], duration: '25 minutes' },
        { day: 'Friday', type: 'Cardio', exercises: ['Jogging or cycling 30min'], duration: '30 minutes' },
        { day: 'Saturday', type: 'Active Recovery', exercises: ['Yoga or stretching'], duration: '20 minutes' }
      ]
    } : undefined,
    progressTracking: {
      weekly: ['Weigh yourself same time each week', 'Take progress photos', 'Measure waist circumference'],
      measurements: ['Weight', 'Waist', 'Energy levels', 'Sleep quality', 'Mood'],
      tips: ['Focus on trends not daily fluctuations', 'Celebrate non-scale victories', 'Adjust plan based on results']
    },
    mindset: {
      affirmations: [
        'I am committed to my health journey',
        'Every healthy choice matters',
        'I am becoming stronger every day',
        'Progress, not perfection',
        'I deserve to feel my best'
      ],
      challenges: ['Stay consistent when motivation is low', 'Plan for social situations', 'Manage stress without food'],
      habits: ['Drink water first thing', 'Prep meals weekly', 'Move daily', 'Sleep 7-8 hours', 'Practice gratitude']
    }
  }
}

app.get('/api/payment/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  
  try {
    const order = await c.env.DB.prepare(`
      SELECT o.*, u.email, u.name 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `).bind(orderId).first()
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    return c.json(order)
    
  } catch (error) {
    return c.json({ error: 'Failed to get order' }, 500)
  }
})

// Generate PDF after payment
app.post('/api/generate-pdf/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  
  try {
    const order = await c.env.DB.prepare(`
      SELECT o.*, u.* 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND o.status = 'paid'
    `).bind(orderId).first()
    
    if (!order) {
      return c.json({ error: 'Order not found or not paid' }, 404)
    }
    
    // Parse AI plan content
    const aiPlanContent = JSON.parse(order.ai_plan_content || '{}')
    const questionnaireData = JSON.parse(order.questionnaire_data || '{}')
    
    // Generate beautiful PDF
    const pdfContent = await generatePDFContent(order, aiPlanContent, questionnaireData)
    const pdfUrl = await createPDF(pdfContent, orderId.toString())
    
    // Update order with PDF URL
    await c.env.DB.prepare(`
      UPDATE orders SET pdf_url = ? WHERE id = ?
    `).bind(pdfUrl, orderId).run()
    
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

// Epoint Payment Integration
app.post('/api/payment/create', async (c) => {
  const { orderId } = await c.req.json()
  
  try {
    // Get order and user from D1 database
    const order = await c.env.DB.prepare(`
      SELECT o.*, u.email, u.name 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `).bind(orderId).first()
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }
    
    // Create Epoint payment
    const paymentData = await createEpointPayment(order, c.env || {})
    
    // Update order with Epoint transaction info
    await c.env.DB.prepare(`
      UPDATE orders 
      SET epoint_transaction_id = ?
      WHERE id = ?
    `).bind(paymentData.transactionId, orderId).run()
    
    return c.json({
      paymentUrl: paymentData.paymentUrl,
      transactionId: paymentData.transactionId,
      status: paymentData.status
    })
    
  } catch (error) {
    console.error('Payment creation error:', error)
    return c.json({ error: 'Failed to create payment' }, 500)
  }
})

// Helper function to generate Epoint signature
async function generateEpointSignature(data: string, privateKey: string): Promise<string> {
  const signatureString = privateKey + data + privateKey
  // SHA1 hash
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(signatureString)
  const hashBuffer = await crypto.subtle.digest('SHA-1', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashBinary = String.fromCharCode(...hashArray)
  return btoa(hashBinary)
}

async function createEpointPayment(order: any, env: any) {
  // Epoint API integration
  const apiUrl = env.EPOINT_API_URL || 'https://epoint.az/api/1/request'
  
  // Create payment request
  const paymentRequest = {
    public_key: env.EPOINT_PUBLIC_KEY,
    amount: parseFloat(order.amount.toFixed(2)),
    currency: 'AZN',
    description: `FitGenius ${order.plan_type || 'plan'}`,
    order_id: order.id.toString(),
    language: 'az',
    is_installment: 0
  }
  
  try {
    console.log('Creating Epoint payment:', paymentRequest)
    
    // Encode data as base64
    const jsonString = JSON.stringify(paymentRequest)
    const encodedData = btoa(jsonString)
    
    // Generate signature
    const signature = await generateEpointSignature(encodedData, env.EPOINT_PRIVATE_KEY)
    
    // Create form data
    const formData = new URLSearchParams()
    formData.append('data', encodedData)
    formData.append('signature', signature)
    
    // Call Epoint API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Epoint API error:', errorText)
      console.error('Request was:', JSON.stringify(paymentRequest, null, 2))
      throw new Error(`Payment creation failed: ${response.status} - ${errorText}`)
    }
    
    const data: any = await response.json()
    console.log('Epoint payment created:', data)
    
    // Return payment details
    // Expected response: { status: "success", transaction: "TRANS_ID", redirect_url: "..." }
    return {
      transactionId: data.transaction,
      paymentUrl: data.redirect_url,
      status: data.status
    }
  } catch (error) {
    console.error('Epoint payment creation error:', error)
    throw error
  }
}

// Epoint callback handler (result_url)
app.post('/api/payment/callback', async (c) => {
  try {
    // Get data and signature from Epoint
    const formData = await c.req.parseBody()
    const receivedData = formData.data as string
    const receivedSignature = formData.signature as string
    
    // Verify signature to prevent fraud
    const expectedSignature = await generateEpointSignature(receivedData, c.env.EPOINT_PRIVATE_KEY)
    
    if (receivedSignature !== expectedSignature) {
      console.error('Invalid signature from Epoint callback')
      return c.text('Invalid signature', 403)
    }
    
    // Decode payment result
    const decodedData = atob(receivedData)
    const paymentResult = JSON.parse(decodedData)
    
    console.log('Epoint callback received:', paymentResult)
    
    // Extract payment details
    const orderId = paymentResult.order_id
    const status = paymentResult.status
    const transactionId = paymentResult.transaction
    const amount = paymentResult.amount
    const cardMask = paymentResult.card_mask
    
    if (status === 'success') {
      // Payment successful - update database
      await c.env.DB.prepare(`
        UPDATE orders 
        SET status = 'paid', 
            paid_at = datetime('now'),
            epoint_transaction_id = ?
        WHERE id = ?
      `).bind(transactionId, orderId).run()
      
      // Get order with user data for AI generation
      const foundOrder = await c.env.DB.prepare(`
        SELECT o.*, u.questionnaire_data, u.user_path, u.name, u.email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `).bind(orderId).first()
      
      if (foundOrder) {
        // Generate AI plan in background
        generateAndStorePlan(foundOrder, c.env).catch(err => 
          console.error('AI generation error:', err)
        )
      }
      
      console.log(`Payment successful for order ${orderId}, transaction ${transactionId}`)
    } else {
      // Payment failed
      const errorCode = paymentResult.code
      const errorMessage = paymentResult.message
      
      await c.env.DB.prepare(`
        UPDATE orders 
        SET status = 'failed'
        WHERE id = ?
      `).bind(orderId).run()
      
      console.log(`Payment failed for order ${orderId}: ${errorMessage}`)
    }
    
    // Must return 200 OK to acknowledge receipt
    return c.text('OK', 200)
    
  } catch (error) {
    console.error('Callback processing error:', error)
    return c.text('Error', 500)
  }
})

// NEW ROUTES - Matching Epoint registration URLs
// These match the exact URLs registered with Epoint: fitgenius.top/success, /error, /result

// Result URL - Server-to-server callback from Epoint
app.post('/result', async (c) => {
  try {
    // Get data and signature from Epoint
    const formData = await c.req.parseBody()
    const receivedData = formData.data as string
    const receivedSignature = formData.signature as string
    
    // Verify signature to prevent fraud
    const expectedSignature = await generateEpointSignature(receivedData, c.env.EPOINT_PRIVATE_KEY)
    
    if (receivedSignature !== expectedSignature) {
      console.error('Invalid signature from Epoint callback')
      return c.text('Invalid signature', 403)
    }
    
    // Decode payment result
    const decodedData = atob(receivedData)
    const paymentResult = JSON.parse(decodedData)
    
    console.log('Epoint /result callback received:', paymentResult)
    
    // Extract payment details
    const orderId = paymentResult.order_id
    const status = paymentResult.status
    const transactionId = paymentResult.transaction
    
    if (status === 'success') {
      // Payment successful - update database
      await c.env.DB.prepare(`
        UPDATE orders 
        SET status = 'paid', 
            paid_at = datetime('now'),
            epoint_transaction_id = ?
        WHERE id = ?
      `).bind(transactionId, orderId).run()
      
      // Get order with user data for AI generation
      const foundOrder = await c.env.DB.prepare(`
        SELECT o.*, u.questionnaire_data, u.user_path, u.name, u.email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `).bind(orderId).first()
      
      if (foundOrder) {
        // Generate AI plan in background
        generateAndStorePlan(foundOrder, c.env).catch(err => 
          console.error('AI generation error:', err)
        )
      }
      
      console.log(`Payment successful for order ${orderId}, transaction ${transactionId}`)
    } else {
      // Payment failed
      await c.env.DB.prepare(`
        UPDATE orders 
        SET status = 'failed'
        WHERE id = ?
      `).bind(orderId).run()
      
      console.log(`Payment failed for order ${orderId}`)
    }
    
    // Must return 200 OK to acknowledge receipt
    return c.text('OK', 200)
    
  } catch (error) {
    console.error('Callback processing error:', error)
    return c.text('Error', 500)
  }
})

// Success URL - User redirect after successful payment
app.get('/success', async (c) => {
  const transactionId = c.req.query('transaction') || c.req.query('transaction_id')
  const orderId = c.req.query('order_id')
  
  try {
    // If we have transaction ID, try to verify and find order
    let foundOrder = null
    
    if (transactionId) {
      // Verify payment with Epoint
      const isValid = await verifyEpointPayment(transactionId, c.env)
      
      if (isValid) {
        // Update order if not already updated by callback
        await c.env.DB.prepare(`
          UPDATE orders 
          SET status = 'paid', paid_at = datetime('now')
          WHERE epoint_transaction_id = ? AND status != 'paid'
        `).bind(transactionId).run()
        
        // Get the order
        foundOrder = await c.env.DB.prepare(`
          SELECT o.*, u.questionnaire_data, u.user_path, u.name, u.email
          FROM orders o
          JOIN users u ON o.user_id = u.id
          WHERE o.epoint_transaction_id = ?
        `).bind(transactionId).first()
        
        if (foundOrder) {
          // Generate AI plan in background (if not already generated)
          generateAndStorePlan(foundOrder, c.env).catch(err => console.error('AI generation error:', err))
        }
      }
    } else if (orderId) {
      // Fallback: find by order ID
      foundOrder = await c.env.DB.prepare(`
        SELECT o.*, u.name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `).bind(orderId).first()
    }
    
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
            <h1 class="text-3xl font-bold text-gray-800 mb-4">Payment Successful! 🎉</h1>
            <p class="text-gray-600 mb-6">Your payment has been processed successfully.</p>
            ${foundOrder ? `
              <div class="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 mb-6">
                <p class="text-sm text-gray-700 mb-2">Order ID: <strong>#${foundOrder.id}</strong></p>
                <p class="text-sm text-gray-700">We're generating your personalized plan now!</p>
              </div>
              <a href="/payment/${foundOrder.id}" class="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200">
                View My Plan
              </a>
            ` : `
              <p class="text-gray-500 text-sm mb-6">Your plan will be ready shortly. Check your email for details.</p>
              <a href="/" class="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200">
                Return Home
              </a>
            `}
          </div>
        </div>
      </body>
      </html>
    `)
  } catch (error) {
    console.error('Success page error:', error)
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Processing - FitGenius</title>
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
            <h1 class="text-3xl font-bold text-gray-800 mb-4">Payment Received! ✓</h1>
            <p class="text-gray-600 mb-6">Your payment is being processed.</p>
            <a href="/" class="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200">
              Return Home
            </a>
          </div>
        </div>
      </body>
      </html>
    `)
  }
})

// Error URL - User redirect after failed payment
app.get('/error', async (c) => {
  const errorMessage = c.req.query('message') || 'Payment could not be completed'
  const orderId = c.req.query('order_id')
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed - FitGenius</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Payment Failed</h1>
          <p class="text-gray-600 mb-2">${errorMessage}</p>
          <p class="text-gray-500 text-sm mb-6">Don't worry, you haven't been charged.</p>
          ${orderId ? `
            <a href="/payment/${orderId}" class="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 mb-3">
              Try Again
            </a>
            <br>
          ` : ''}
          <a href="/" class="inline-block text-gray-600 hover:text-gray-800 underline mt-2">
            Return Home
          </a>
        </div>
      </div>
    </body>
    </html>
  `)
})

// OLD ROUTES - Keep for backward compatibility
// Payment callback routes
app.get('/payment/success', async (c) => {
  // Epoint sends transaction ID as query parameter
  const transactionId = c.req.query('transaction') || c.req.query('transaction_id')
  
  try {
    if (!transactionId) {
      throw new Error('Missing transaction ID')
    }
    
    // Verify payment with Epoint
    const isValid = await verifyEpointPayment(transactionId, c.env)
    
    if (isValid) {
      // Find and update order status in database
      await c.env.DB.prepare(`
        UPDATE orders 
        SET status = 'paid', paid_at = datetime('now')
        WHERE epoint_transaction_id = ?
      `).bind(transactionId).run()
      
      // Get the updated order with user data
      const foundOrder = await c.env.DB.prepare(`
        SELECT o.*, u.questionnaire_data, u.user_path, u.name, u.email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.epoint_transaction_id = ?
      `).bind(transactionId).first()
      
      if (foundOrder) {
        // Generate AI plan in background (don't wait)
        generateAndStorePlan(foundOrder, c.env).catch(err => console.error('AI generation error:', err))
        
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
                <p class="text-gray-600 mb-6">Your personalized weight loss plan is being generated by our AI...</p>
                <div id="status" class="mb-4 text-sm text-gray-500">⏳ Generating your plan...</div>
                <button 
                  id="downloadBtn"
                  onclick="downloadPDF('${foundOrder?.id}')"
                  disabled
                  class="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download Your Plan PDF
                </button>
                <p class="text-sm text-gray-500 mt-4">Your plan will be ready in 15-30 seconds</p>
              </div>
            </div>
            <script>
              let checkCount = 0;
              const maxChecks = 60; // Check for 60 seconds
              
              async function checkPlanStatus(orderId) {
                try {
                  const response = await fetch('/api/plan-status/' + orderId);
                  const data = await response.json();
                  
                  if (data.ready) {
                    document.getElementById('status').innerHTML = '✅ Your plan is ready!';
                    document.getElementById('downloadBtn').disabled = false;
                    return true;
                  } else {
                    checkCount++;
                    if (checkCount < maxChecks) {
                      setTimeout(() => checkPlanStatus(orderId), 1000);
                    } else {
                      document.getElementById('status').innerHTML = '⏰ Taking longer than expected. Please try downloading in a minute.';
                      document.getElementById('downloadBtn').disabled = false;
                    }
                  }
                } catch (error) {
                  console.error('Status check error:', error);
                  document.getElementById('downloadBtn').disabled = false;
                }
              }
              
              function downloadPDF(orderId) {
                window.location.href = '/api/download-plan/' + orderId;
              }
              
              // Start checking plan status
              checkPlanStatus('${foundOrder?.id}');
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

app.get('/payment/error', async (c) => {
  return c.html(`
    <html><head><script src="https://cdn.tailwindcss.com"></script></head><body>
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
        <p class="text-gray-600 mb-6">Your payment could not be processed. Please check your card details and try again.</p>
        <button 
          onclick="window.location.href='/'"
          class="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
    </body></html>
  `)
})

async function verifyEpointPayment(transactionId: string, env: any) {
  // Verify payment status with Epoint API
  const checkUrl = env.EPOINT_CHECK_URL || 'https://epoint.az/api/1/get-status'
  
  const requestData = {
    public_key: env.EPOINT_PUBLIC_KEY,
    transaction: transactionId,
    language: 'az'
  }
  
  try {
    // Encode data as base64
    const jsonString = JSON.stringify(requestData)
    const encodedData = btoa(jsonString)
    
    // Generate signature
    const signature = await generateEpointSignature(encodedData, env.EPOINT_PRIVATE_KEY)
    
    // Create form data
    const formData = new URLSearchParams()
    formData.append('data', encodedData)
    formData.append('signature', signature)
    
    // Call Epoint Status API
    const response = await fetch(checkUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    
    if (!response.ok) {
      console.error('Epoint verification failed:', response.status)
      return false
    }
    
    const data: any = await response.json()
    
    // Check if payment status is 'success' or 'paid'
    return data.status === 'success' || data.status === 'paid' || data.status === 'approved'
  } catch (error) {
    console.error('Payment verification error:', error)
    return false
  }
}

// Generate AI plan and store in database after successful payment
async function generateAndStorePlan(order: any, env: any) {
  try {
    console.log('Generating AI plan for order:', order.id)
    
    // Parse questionnaire data
    const questionnaireData = JSON.parse(order.questionnaire_data || '{}')
    
    // Generate AI plan (will try OpenRouter, then Gemini, then fallback)
    // Store Gemini key in global for access in generateAIPlan
    if (env.GEMINI_API_KEY) {
      (globalThis as any).GEMINI_API_KEY = env.GEMINI_API_KEY
    }
    const aiResult = await generateAIPlan(questionnaireData, order.user_path, order.plan_type, env.OPENROUTER_API_KEY)
    
    // Store AI plan in database
    await env.DB.prepare(`
      UPDATE orders 
      SET ai_plan_content = ?
      WHERE id = ?
    `).bind(JSON.stringify(aiResult.fullPlan), order.id).run()
    
    console.log('AI plan generated and stored successfully')
    
    // Note: PDF generation would happen here when user requests download
    // We don't generate PDF immediately to save resources
    
  } catch (error) {
    console.error('Failed to generate and store plan:', error)
  }
}

// Check if AI plan is ready
app.get('/api/plan-status/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  
  try {
    const order = await c.env.DB.prepare(
      'SELECT ai_plan_content FROM orders WHERE id = ?'
    ).bind(orderId).first()
    
    return c.json({ ready: !!order?.ai_plan_content })
  } catch (error) {
    return c.json({ ready: false })
  }
})

// API endpoint to download generated PDF
app.get('/api/download-plan/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  
  try {
    // Get order with AI plan
    const order = await c.env.DB.prepare(`
      SELECT o.*, u.name, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND o.status = 'paid'
    `).bind(orderId).first()
    
    if (!order || !order.ai_plan_content) {
      return c.json({ error: 'Plan not found or not yet generated' }, 404)
    }
    
    const aiPlan = JSON.parse(order.ai_plan_content)
    
    // Generate PDF
    const pdfBuffer = await generatePDF(aiPlan, order)
    
    // Return PDF
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="FitGenius-Plan-${order.name}.pdf"`
      }
    })
    
  } catch (error) {
    console.error('PDF download error:', error)
    return c.json({ error: 'Failed to generate PDF' }, 500)
  }
})

// Generate visually appealing PDF from AI plan data
async function generatePDF(aiPlan: any, order: any): Promise<Uint8Array> {
  const PDFDocument = (await import('pdfkit')).default as any
  
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      })
      
      const chunks: Buffer[] = []
      
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))))
      doc.on('error', reject)
      
      // Colors
      const primaryColor = '#06B6D4' // Cyan
      const secondaryColor = '#3B82F6' // Blue
      const darkGray = '#1F2937'
      const lightGray = '#6B7280'
      
      // Cover Page
      doc.rect(0, 0, doc.page.width, 250).fill(primaryColor)
      
      doc.fontSize(40).fillColor('white').font('Helvetica-Bold')
        .text('FitGenius', 50, 80, { align: 'center' })
      
      doc.fontSize(28).font('Helvetica')
        .text('Your Personalized Weight Loss Plan', 50, 140, { align: 'center' })
      
      doc.fontSize(16).font('Helvetica-Bold').fillColor(darkGray)
        .text(`Prepared for: ${order.name}`, 50, 300)
      
      doc.fontSize(14).font('Helvetica').fillColor(lightGray)
        .text(`Plan Type: ${order.plan_type.toUpperCase()}`, 50, 330)
        .text(`Generated: ${new Date().toLocaleDateString()}`, 50, 350)
      
      // Executive Summary
      doc.addPage()
      doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
        .text('Executive Summary', 50, 50)
      
      doc.fontSize(12).fillColor(darkGray).font('Helvetica')
        .text(aiPlan.executiveSummary?.greeting || 'Welcome to your transformation journey!', 50, 100, {
          width: 500,
          align: 'left'
        })
      
      doc.moveDown().text(aiPlan.executiveSummary?.overview || '', {
        width: 500
      })
      
      // Nutrition Targets
      doc.addPage()
      doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
        .text('Nutrition Targets', 50, 50)
      
      const nutrition = aiPlan.nutritionTargets || {}
      doc.fontSize(14).fillColor(darkGray).font('Helvetica-Bold')
        .text('Daily Caloric Target:', 50, 120)
      doc.fontSize(18).fillColor(secondaryColor).font('Helvetica-Bold')
        .text(`${nutrition.dailyCalories || 1500} calories`, 50, 145)
      
      doc.fontSize(12).fillColor(darkGray).font('Helvetica')
        .text(`Protein: ${nutrition.protein || '25-30%'}`, 50, 190)
        .text(`Carbohydrates: ${nutrition.carbs || '40-45%'}`, 50, 210)
        .text(`Fats: ${nutrition.fats || '25-30%'}`, 50, 230)
        .text(`Water: ${nutrition.water || '2-3 liters/day'}`, 50, 250)
      
      // Weekly Plan
      doc.addPage()
      doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
        .text('4-Week Breakdown', 50, 50)
      
      const weeklyPlan = aiPlan.weeklyPlan || []
      let yPos = 120
      
      weeklyPlan.slice(0, 4).forEach((week: any, index: number) => {
        if (yPos > 700) {
          doc.addPage()
          yPos = 50
        }
        
        doc.fontSize(16).fillColor(secondaryColor).font('Helvetica-Bold')
          .text(`Week ${week.week || index + 1}: ${week.focus || 'Building Habits'}`, 50, yPos)
        
        yPos += 30
        doc.fontSize(11).fillColor(darkGray).font('Helvetica')
          .text(week.mealStructure || '', 50, yPos, { width: 500 })
        
        yPos += 80
      })
      
      // Meal Plan
      if (aiPlan.mealPlan) {
        doc.addPage()
        doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
          .text('Meal Plan Options', 50, 50)
        
        // Breakfast
        doc.fontSize(18).fillColor(secondaryColor).font('Helvetica-Bold')
          .text('Breakfast Options', 50, 110)
        
        yPos = 140
        const breakfasts = aiPlan.mealPlan.breakfast || []
        breakfasts.slice(0, 5).forEach((meal: any) => {
          doc.fontSize(12).fillColor(darkGray).font('Helvetica-Bold')
            .text(`• ${meal.name}`, 50, yPos)
          doc.fontSize(10).font('Helvetica').fillColor(lightGray)
            .text(`${meal.calories} cal - ${meal.description || ''}`, 60, yPos + 15, { width: 480 })
          yPos += 45
        })
        
        // Lunch
        doc.addPage()
        doc.fontSize(18).fillColor(secondaryColor).font('Helvetica-Bold')
          .text('Lunch Options', 50, 50)
        
        yPos = 80
        const lunches = aiPlan.mealPlan.lunch || []
        lunches.slice(0, 5).forEach((meal: any) => {
          doc.fontSize(12).fillColor(darkGray).font('Helvetica-Bold')
            .text(`• ${meal.name}`, 50, yPos)
          doc.fontSize(10).font('Helvetica').fillColor(lightGray)
            .text(`${meal.calories} cal - ${meal.description || ''}`, 60, yPos + 15, { width: 480 })
          yPos += 45
        })
        
        // Dinner
        yPos += 20
        if (yPos > 650) {
          doc.addPage()
          yPos = 50
        }
        
        doc.fontSize(18).fillColor(secondaryColor).font('Helvetica-Bold')
          .text('Dinner Options', 50, yPos)
        
        yPos += 30
        const dinners = aiPlan.mealPlan.dinner || []
        dinners.slice(0, 5).forEach((meal: any) => {
          if (yPos > 700) {
            doc.addPage()
            yPos = 50
          }
          doc.fontSize(12).fillColor(darkGray).font('Helvetica-Bold')
            .text(`• ${meal.name}`, 50, yPos)
          doc.fontSize(10).font('Helvetica').fillColor(lightGray)
            .text(`${meal.calories} cal - ${meal.description || ''}`, 60, yPos + 15, { width: 480 })
          yPos += 45
        })
      }
      
      // Workout Plan
      if (aiPlan.workoutPlan && order.plan_type !== 'basic') {
        doc.addPage()
        doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
          .text('Workout Schedule', 50, 50)
        
        yPos = 110
        const schedule = aiPlan.workoutPlan.schedule || []
        schedule.forEach((day: any) => {
          if (yPos > 700) {
            doc.addPage()
            yPos = 50
          }
          
          doc.fontSize(14).fillColor(secondaryColor).font('Helvetica-Bold')
            .text(`${day.day}: ${day.type}`, 50, yPos)
          doc.fontSize(11).fillColor(darkGray).font('Helvetica')
            .text(`Duration: ${day.duration}`, 50, yPos + 20)
          doc.fontSize(10).fillColor(lightGray)
            .text(day.exercises?.join(', ') || '', 50, yPos + 40, { width: 500 })
          
          yPos += 85
        })
      }
      
      // Progress Tracking
      doc.addPage()
      doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
        .text('Progress Tracking', 50, 50)
      
      doc.fontSize(12).fillColor(darkGray).font('Helvetica')
        .text('Track these metrics weekly:', 50, 110)
      
      yPos = 140
      const tracking = aiPlan.progressTracking || {}
      const measurements = tracking.measurements || ['Weight', 'Waist circumference', 'Energy levels', 'Sleep quality']
      measurements.forEach((metric: string) => {
        doc.fontSize(11).text(`✓ ${metric}`, 70, yPos)
        yPos += 20
      })
      
      // Mindset & Motivation
      doc.addPage()
      doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
        .text('Mindset & Motivation', 50, 50)
      
      const mindset = aiPlan.mindset || {}
      if (mindset.affirmations) {
        doc.fontSize(14).fillColor(secondaryColor).font('Helvetica-Bold')
          .text('Daily Affirmations', 50, 110)
        
        yPos = 140
        mindset.affirmations.slice(0, 5).forEach((affirmation: string) => {
          doc.fontSize(11).fillColor(darkGray).font('Helvetica-Oblique')
            .text(`"${affirmation}"`, 70, yPos, { width: 470 })
          yPos += 35
        })
      }
      
      // Footer on last page
      doc.fontSize(10).fillColor(lightGray).font('Helvetica')
        .text('© 2025 FitGenius - Your Partner in Health & Wellness', 50, doc.page.height - 80, {
          align: 'center',
          width: doc.page.width - 100
        })
      
      doc.end()
      
    } catch (error) {
      reject(error)
    }
  })
}

app.get('/payment/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-turquoise-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Your Payment</h2>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order #{orderId}</p>
          <p className="text-sm text-gray-500 mb-6">Secure payment processing with Epoint</p>
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg">
            Pay with Epoint
          </button>
        </div>
      </div>
    </div>
  )
})

// Terms of Service Page
app.get('/terms', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <title>Terms of Service - FitGenius | AI Weight Loss Platform</title>
        <meta name="description" content="Read FitGenius Terms of Service. Learn about our policies, user agreements, and guidelines for using our AI-powered weight loss planning platform." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fitgenius.top/terms" />
        
        <meta property="og:title" content="Terms of Service - FitGenius" />
        <meta property="og:description" content="FitGenius Terms of Service and user agreement for our AI-powered weight loss platform." />
        <meta property="og:url" content="https://fitgenius.top/terms" />
        <meta property="og:type" content="website" />
        
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
        {/* Navigation Bar */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="FitGenius Logo" className="h-12 w-auto hover:scale-105 transition-transform duration-300" />
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Home</a>
              <a href="/about" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">About</a>
              <a href="/faq" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">FAQ</a>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-cyan-200/50 p-8 md:p-12">
            <div className="mb-8">
              <a href="/" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Home
              </a>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-gray-600">Last Updated: January 2025</p>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-8 text-gray-700 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="mb-4">
                    By accessing and using FitGenius ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                  </p>
                  <p>
                    These terms apply to all visitors, users, and others who access or use the Service. We reserve the right to update and change the Terms of Service at any time without notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                  <p className="mb-4">
                    FitGenius provides personalized weight loss and fitness planning services powered by artificial intelligence. Our Service includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Personalized questionnaire assessment</li>
                    <li>AI-generated customized fitness and nutrition plans</li>
                    <li>Downloadable PDF reports with detailed recommendations</li>
                    <li>Meal planning and workout schedules</li>
                    <li>Progress tracking guidelines</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Medical Disclaimer</h2>
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
                    <p className="mb-4 font-semibold text-yellow-800">IMPORTANT NOTICE:</p>
                    <p className="mb-4">
                      FitGenius is NOT a medical service and does not provide medical advice, diagnosis, or treatment. The information and plans provided are for educational and informational purposes only.
                    </p>
                    <p className="mb-4">
                      Before starting any weight loss, exercise, or nutrition program, you should consult with a qualified healthcare professional, especially if you have any pre-existing medical conditions, are taking medications, are pregnant or nursing, or have any concerns about your health.
                    </p>
                    <p>
                      Individual results may vary. The plans generated are general recommendations and may not be suitable for everyone. Always listen to your body and seek professional medical advice if you experience any adverse effects.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Account and Responsibilities</h2>
                  <p className="mb-4">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
                  </p>
                  <p className="mb-4">You are responsible for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Safeguarding your account password</li>
                    <li>Any activities or actions under your account</li>
                    <li>Providing accurate health and fitness information in questionnaires</li>
                    <li>Using the Service in a lawful manner</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment and Pricing</h2>
                  <p className="mb-4">
                    Access to personalized plans requires a one-time payment. Prices are displayed in AZN and processed through our secure payment partner, Epoint.
                  </p>
                  <p className="mb-4">
                    Payment terms:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All payments are processed securely via Epoint payment gateway</li>
                    <li>Prices are subject to change without prior notice</li>
                    <li>You agree to pay all charges at the prices then in effect</li>
                    <li>Payment is required before plan generation and delivery</li>
                    <li>We accept major credit and debit cards</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. No Refund Policy</h2>
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
                    <p className="mb-4 text-gray-800">
                      Due to the digital and personalized nature of our Service, <strong>all sales are final and non-refundable</strong>. Once your AI-generated plan has been created and delivered, no refunds will be issued.
                    </p>
                    <p className="mb-4">
                      By completing your purchase, you acknowledge that:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>You have provided accurate information in the questionnaire</li>
                      <li>Your personalized plan will be generated based on this information</li>
                      <li>The service will be considered delivered once the plan is available for download</li>
                      <li>No refunds will be provided after plan delivery</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property Rights</h2>
                  <p className="mb-4">
                    The Service and its original content, features, and functionality are and will remain the exclusive property of FitGenius. The Service is protected by copyright, trademark, and other laws.
                  </p>
                  <p className="mb-4">
                    You may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Reproduce, duplicate, copy, or exploit any portion of the Service without express written permission</li>
                    <li>Modify or create derivative works based on the Service</li>
                    <li>Share, redistribute, or resell your personalized plan to others</li>
                    <li>Use the Service for any commercial purposes without our consent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                  <p className="mb-4">
                    In no event shall FitGenius, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                    <li>Personal injury or property damage</li>
                    <li>Any results (or lack thereof) from following our recommendations</li>
                    <li>Unauthorized access to or use of our servers and/or any personal information stored therein</li>
                  </ul>
                  <p className="mt-4">
                    Our total liability shall not exceed the amount you paid for the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. User Conduct</h2>
                  <p className="mb-4">You agree not to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use the Service for any unlawful purpose</li>
                    <li>Attempt to gain unauthorized access to any portion of the Service</li>
                    <li>Interfere with or disrupt the Service or servers</li>
                    <li>Transmit any viruses, malware, or malicious code</li>
                    <li>Collect or harvest any information about other users</li>
                    <li>Impersonate any person or entity</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">10. Third-Party Services</h2>
                  <p className="mb-4">
                    Our Service may contain links to third-party websites or services (including payment processors) that are not owned or controlled by FitGenius.
                  </p>
                  <p>
                    We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that FitGenius shall not be responsible or liable for any damage or loss caused by or in connection with the use of any such content or services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">11. Privacy</h2>
                  <p>
                    Your use of the Service is also governed by our Privacy Policy. Please review our <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a> to understand our practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
                  <p className="mb-4">
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                  <p>
                    Upon termination, your right to use the Service will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive termination.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">13. Dispute Resolution</h2>
                  <p className="mb-4">
                    Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the commercial arbitration rules of the applicable jurisdiction.
                  </p>
                  <p>
                    You agree to first attempt to resolve any dispute informally by contacting us at <a href="mailto:contact@fitgenius.top" className="text-cyan-600 hover:text-cyan-700">contact@fitgenius.top</a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">14. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Continued use of the Service after changes constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">15. Contact Us</h2>
                  <p className="mb-4">
                    If you have any questions about these Terms, please contact us:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p>Email: <a href="mailto:contact@fitgenius.top" className="text-cyan-400 hover:text-cyan-300">contact@fitgenius.top</a></p>
                    <p className="mt-2">Website: <a href="/" className="text-cyan-400 hover:text-cyan-300">fitgenius.top</a></p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">FitGenius</h3>
                <p className="text-gray-400 text-sm">Your AI-powered partner in achieving sustainable weight loss and building healthier habits.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Connect</h4>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/fit.geniuss/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} FitGenius. All rights reserved.</p>
              <p className="mt-2 text-xs"><span className="text-yellow-400">⚠️</span> Medical Disclaimer: This service provides general wellness information only. Always consult with a healthcare provider before starting any weight loss program.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
})

// FAQ Page
app.get('/faq', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <title>FAQ - Frequently Asked Questions | FitGenius Weight Loss Plans</title>
        <meta name="description" content="Find answers to common questions about FitGenius AI-powered weight loss plans, pricing, privacy, refunds, and how our personalized fitness programs work." />
        <meta name="keywords" content="weight loss FAQ, FitGenius questions, diet plan help, fitness program FAQ, personalized plan questions" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fitgenius.top/faq" />
        
        <meta property="og:title" content="FAQ - FitGenius Weight Loss Plans" />
        <meta property="og:description" content="Get answers to frequently asked questions about our AI-powered personalized weight loss plans." />
        <meta property="og:url" content="https://fitgenius.top/faq" />
        <meta property="og:type" content="website" />
        
        {/* FAQ Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How much does a personalized weight loss plan cost?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our personalized weight loss plan is priced at $9.99 (one-time payment). This includes a comprehensive, AI-generated PDF plan customized to your specific goals, dietary preferences, activity level, and lifestyle."
              }
            },
            {
              "@type": "Question",
              "name": "What information do I need to provide to get my plan?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You'll complete a detailed questionnaire covering: Current weight & goal weight, Height, age, gender, Activity level, Dietary preferences (vegan, vegetarian, etc.), Health conditions or restrictions, Fitness experience level, and Daily schedule/availability."
              }
            },
            {
              "@type": "Question",
              "name": "How quickly will I receive my personalized plan?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Your plan is generated instantly after payment confirmation. You'll receive a downloadable PDF via email within seconds. The email includes your complete plan and instructions to get started."
              }
            },
            {
              "@type": "Question",
              "name": "Is my personal and payment information secure?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. We use industry-standard encryption (SSL/TLS) for all data transmission. Payment processing is handled by Stripe, a PCI-DSS compliant payment processor. We never store your full credit card details."
              }
            }
          ]
        })}
        </script>
        
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
        {/* Navigation Bar */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="FitGenius Logo" className="h-12 w-auto hover:scale-105 transition-transform duration-300" />
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Home</a>
              <a href="/about" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">About</a>
              <a href="/faq" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">FAQ</a>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-cyan-200/50 p-8 md:p-12">
            <div className="mb-8">
              <a href="/" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Home
              </a>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
              <p className="text-gray-600">Find answers to common questions about FitGenius and our services</p>
            </div>

            <div className="space-y-6">
              {/* Getting Started */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                  Getting Started
                </h2>
                
                <div className="space-y-6 ml-11">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">❓</span> What is FitGenius?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      FitGenius is an AI-powered platform that creates personalized weight loss and fitness plans tailored to your unique goals, lifestyle, and preferences. Our advanced algorithms analyze your inputs and generate comprehensive 30-day plans including meal plans, workout routines, and progress tracking guidance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">❓</span> How does the questionnaire work?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Our questionnaire collects detailed information about your health profile, fitness goals, dietary preferences, lifestyle habits, and any medical considerations. This data is crucial for generating a plan that's safe and effective for your specific situation. The questionnaire takes about 5-10 minutes to complete.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">❓</span> What plan options are available?
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      We offer three plan types:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="text-gray-700"><strong>Basic Plan:</strong> Personalized meal plans and nutritional guidance without workout routines</li>
                      <li className="text-gray-700"><strong>Standard Plan:</strong> Meal plans combined with beginner-friendly workout routines (3-4 times per week)</li>
                      <li className="text-gray-700"><strong>Premium Plan:</strong> Complete fitness and nutrition program with advanced workout plans, nutrition optimization, and detailed progress tracking</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">❓</span> How long does it take to get my plan?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      After successful payment, your personalized plan is generated instantly using our AI system. You'll receive a PDF download link via email within seconds, and can access it anytime from your account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment & Pricing */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                  Payment & Pricing
                </h2>
                
                <div className="space-y-6 ml-11">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">💳</span> What payment methods do you accept?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment partner, Epoint. All transactions are encrypted and PCI-DSS compliant for your security.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">💳</span> Is there a refund policy?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      No refunds are issued for generated plans. However, if you experience a technical issue or your plan is not generated properly, we'll regenerate it at no additional cost. For payment disputes, please contact our support team at contact@fitgenius.top.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">💳</span> Is my payment information secure?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Yes, absolutely. We don't store your full payment card details on our servers. All credit card information is processed securely through Epoint, which is PCI-DSS Level 1 certified. Your transaction data is encrypted end-to-end.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">💳</span> Can I get an invoice?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Yes, you'll receive a detailed invoice via email after successful payment. The invoice includes plan details, amount paid, and can be used for expense reporting or record-keeping.
                    </p>
                  </div>
                </div>
              </div>

              {/* Plans & Features */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                  Plans & Features
                </h2>
                
                <div className="space-y-6 ml-11">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🏃</span> How personalized is my plan?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Your plan is fully personalized based on 15+ factors including age, current weight, target weight, height, activity level, dietary preferences, food restrictions, health conditions, fitness experience, workout preferences, sleep patterns, stress levels, and more. Our AI analyzes all this data to create a unique plan just for you.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🏃</span> Can I update my plan?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Plans are generated based on your questionnaire responses at purchase time. If your situation changes significantly or you'd like a plan adjustment, you can purchase a new plan at any time with updated information. Contact us at contact@fitgenius.top for custom plan modifications.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🏃</span> What's included in the PDF?
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Your PDF plan includes:
                    </p>
                    <ul className="space-y-2 ml-4 text-gray-700">
                      <li>✓ Personalized welcome message and goal breakdown</li>
                      <li>✓ Daily caloric targets and macro nutrient recommendations</li>
                      <li>✓ 4-week structured meal plan with variety</li>
                      <li>✓ 50+ meal options across breakfast, lunch, dinner, and snacks</li>
                      <li>✓ Workout routines (if applicable to your plan)</li>
                      <li>✓ Weekly goals and progress tracking sheets</li>
                      <li>✓ Tips for sustainability and habit building</li>
                      <li>✓ Troubleshooting advice for common challenges</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🏃</span> Are there follow-up plans or coaching?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Currently, FitGenius provides one-time, 30-day plans. After completing your plan, you can purchase a new plan for the next phase of your journey. We're developing personalized coaching features for future releases. Subscribe to our updates for announcements!
                    </p>
                  </div>
                </div>
              </div>

              {/* Health & Safety */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">4</span>
                  Health & Safety
                </h2>
                
                <div className="space-y-6 ml-11">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">⚕️</span> Is FitGenius a substitute for professional medical advice?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      No. FitGenius provides general wellness information and personalized fitness guidance only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult with a healthcare provider before starting any weight loss program, especially if you have existing health conditions or take medications.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">⚕️</span> Can people with health conditions use FitGenius?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Yes, our questionnaire includes a section for health conditions and medications. We use this information to generate safer, more appropriate plans. However, individuals with serious health conditions should consult their healthcare provider before using any plan. Our plans are designed to be adaptable and can be modified based on professional medical advice.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">⚕️</span> What if I don't feel comfortable with something in my plan?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      You can modify any aspect of your plan as needed. Skip exercises that don't work for you, substitute meals you don't like with similar alternatives, and adjust portions based on how you feel. It's your plan—make it work for your life. If you'd like professional guidance, consult a doctor, nutritionist, or personal trainer.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">⚕️</span> How quickly will I see results?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Results vary based on individual factors like starting weight, metabolism, adherence, and exercise. Most people see initial changes (energy levels, bloating reduction) within 1-2 weeks and noticeable weight loss within 4-6 weeks. Remember: sustainable weight loss is typically 0.5-1 kg per week. Consistency is more important than speed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy & Data */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">5</span>
                  Privacy & Data
                </h2>
                
                <div className="space-y-6 ml-11">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🔒</span> How is my personal information protected?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      We take data privacy very seriously. Your information is encrypted in transit (HTTPS/TLS) and stored securely in our database with access controls. We comply with GDPR and CCPA regulations, and we never sell your personal data. Read our full Privacy Policy for detailed information.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🔒</span> Can I delete my data?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Yes. You have the right to request deletion of your personal data at any time. Contact us at contact@fitgenius.top with a deletion request, and we'll remove your information within 30 days (subject to legal retention requirements for financial records).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🔒</span> Will my health data be shared?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      No. Your health and fitness questionnaire responses are used solely to generate your personalized plan. We do not share your health data with third parties, advertisers, or other users. Your data is only accessible by our AI systems for plan generation and by our support team if needed to assist you.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🔒</span> How long is my data stored?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Your account and plan data are retained as long as your account is active. Transaction records are kept for 7 years for accounting and legal compliance. You can request data deletion anytime, and we'll remove your information within 30 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Support */}
              <div className="pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">6</span>
                  Technical Support
                </h2>
                
                <div className="space-y-6 ml-11">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🔧</span> The questionnaire isn't loading. What should I do?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Try refreshing your browser (F5 or Ctrl+R), clearing your browser cache, or using a different browser. Make sure JavaScript is enabled. If the issue persists, email us at contact@fitgenius.top with your browser details, and we'll investigate.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🔧</span> I'm not receiving my plan PDF after payment.
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Check your email (including spam/promotions folder). PDFs are sent within seconds of successful payment. If you still don't see it after 5 minutes, contact us at contact@fitgenius.top with your order ID, and we'll regenerate and send your plan immediately.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🔧</span> The payment form isn't working.
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Ensure your browser allows pop-ups and JavaScript. Try clearing cookies and cache, or use a different browser. Verify your internet connection is stable. If issues continue, contact support at contact@fitgenius.top, and we'll process your payment manually.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <span className="text-cyan-600 mr-2">🔧</span> I have a different technical issue. How can I reach support?
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Email our support team at contact@fitgenius.top with a detailed description of the issue, your browser/device info, and any error messages you see. We aim to respond within 24 hours. For urgent issues, include "URGENT" in the subject line.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Didn't find your answer?</h3>
                <p className="text-gray-600 mb-4">Our support team is here to help. Contact us anytime!</p>
                <a href="mailto:contact@fitgenius.top" className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">FitGenius</h3>
                <p className="text-gray-400 text-sm">Your AI-powered partner in achieving sustainable weight loss and building healthier habits.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Connect</h4>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/fit.geniuss/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} FitGenius. All rights reserved.</p>
              <p className="mt-2 text-xs"><span className="text-yellow-400">⚠️</span> Medical Disclaimer: This service provides general wellness information only. Always consult with a healthcare provider before starting any weight loss program.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
})

// About Page
app.get('/about', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <title>About FitGenius - AI-Powered Weight Loss Platform | Our Mission</title>
        <meta name="description" content="Learn about FitGenius - the AI-powered platform revolutionizing personalized weight loss. Discover our mission to make fitness accessible and sustainable for everyone." />
        <meta name="keywords" content="about FitGenius, AI fitness platform, weight loss technology, personalized health, fitness mission" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fitgenius.top/about" />
        
        <meta property="og:title" content="About FitGenius - AI-Powered Weight Loss Platform" />
        <meta property="og:description" content="Learn about our mission to revolutionize personalized weight loss through AI technology." />
        <meta property="og:url" content="https://fitgenius.top/about" />
        <meta property="og:type" content="website" />
        
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
        {/* Navigation Bar */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="FitGenius Logo" className="h-12 w-auto hover:scale-105 transition-transform duration-300" />
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Home</a>
              <a href="/about" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">About</a>
              <a href="/faq" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">FAQ</a>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-cyan-200/50 p-8 md:p-12">
            <a href="/" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Home
            </a>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About FitGenius</h1>
            <p className="text-gray-700 mb-6">FitGenius creates personalized, AI-generated 30-day weight loss plans tailored to your goals, lifestyle, and medical considerations. Our mission is to make safe, effective, and sustainable weight loss accessible to everyone.</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What we do</h3>
                <p className="text-gray-700">We analyze your questionnaire responses and generate a structured plan that includes nutrition targets, a weekly meal plan, workout recommendations, and progress-tracking guidance. Plans are generated instantly after purchase and delivered as a downloadable PDF.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our values</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
                  <li>Evidence-informed guidance</li>
                  <li>Personalization and safety first</li>
                  <li>Sustainability over quick fixes</li>
                  <li>Privacy and data protection</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
              <p className="text-gray-700">For questions or support, email us at <a href="mailto:contact@fitgenius.top" className="text-cyan-600 hover:text-cyan-700">contact@fitgenius.top</a>.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">FitGenius</h3>
                <p className="text-gray-400 text-sm">Your AI-powered partner in achieving sustainable weight loss and building healthier habits.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Connect</h4>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/fit.geniuss/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} FitGenius. All rights reserved.</p>
              <p className="mt-2 text-xs"><span className="text-yellow-400">⚠️</span> Medical Disclaimer: This service provides general wellness information only. Always consult with a healthcare provider before starting any weight loss program.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
})

// Contact Page
app.get('/contact', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <title>Contact FitGenius - Get Support for Your Weight Loss Journey</title>
        <meta name="description" content="Contact FitGenius support team. Get help with your personalized weight loss plan, technical issues, or general inquiries. Email, phone, and Instagram support available." />
        <meta name="keywords" content="contact FitGenius, customer support, weight loss help, fitness support, FitGenius contact" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fitgenius.top/contact" />
        
        <meta property="og:title" content="Contact FitGenius - Customer Support" />
        <meta property="og:description" content="Get in touch with FitGenius support team for help with your weight loss journey." />
        <meta property="og:url" content="https://fitgenius.top/contact" />
        <meta property="og:type" content="website" />
        
        {/* Local Business Structured Data */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact FitGenius",
          "description": "Contact FitGenius for support with your personalized weight loss plan",
          "url": "https://fitgenius.top/contact"
        })}
        </script>
        
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
        {/* Navigation Bar */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="FitGenius Logo" className="h-12 w-auto hover:scale-105 transition-transform duration-300" />
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Home</a>
              <a href="/about" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">About</a>
              <a href="/faq" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">FAQ</a>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-cyan-200/50 p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-gray-600 mb-12">Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.</p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                      <a href="mailto:contact@fitgenius.top" className="text-cyan-600 hover:text-cyan-700 transition-colors">contact@fitgenius.top</a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                      <a href="tel:+994553858220" className="text-cyan-600 hover:text-cyan-700 transition-colors">+994 55 385 82 20</a>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
                      <a href="https://www.instagram.com/fit.geniuss/" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 transition-colors">@fit.geniuss</a>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-sm text-gray-700"><strong>Typical response time:</strong> Within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Tell us more about your inquiry..."
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">FitGenius</h3>
                <p className="text-gray-400 text-sm">Your AI-powered partner in achieving sustainable weight loss and building healthier habits.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Connect</h4>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/fit.geniuss/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} FitGenius. All rights reserved.</p>
              <p className="mt-2 text-xs"><span className="text-yellow-400">⚠️</span> Medical Disclaimer: This service provides general wellness information only. Always consult with a healthcare provider before starting any weight loss program.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
})

// Privacy Policy Page
app.get('/privacy', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <title>Privacy Policy - FitGenius | Data Protection & Security</title>
        <meta name="description" content="Read FitGenius Privacy Policy. Learn how we collect, use, and protect your personal data. GDPR and CCPA compliant privacy practices for your weight loss journey." />
        <meta name="keywords" content="FitGenius privacy, data protection, GDPR, CCPA, privacy policy, data security" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fitgenius.top/privacy" />
        
        <meta property="og:title" content="Privacy Policy - FitGenius" />
        <meta property="og:description" content="FitGenius Privacy Policy - Learn how we protect your personal data." />
        <meta property="og:url" content="https://fitgenius.top/privacy" />
        <meta property="og:type" content="website" />
        
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
        {/* Navigation Bar */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="FitGenius Logo" className="h-12 w-auto hover:scale-105 transition-transform duration-300" />
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Home</a>
              <a href="/about" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">About</a>
              <a href="/faq" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">FAQ</a>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-lg border border-cyan-200/50 p-8 md:p-12">
            <div className="mb-8">
              <a href="/" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 transition-colors mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Home
              </a>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-gray-600">Last Updated: January 2025</p>
            </div>

            <div className="prose max-w-none">
              <div className="space-y-8 text-gray-700 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                  <p className="mb-4">
                    Welcome to FitGenius ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
                  </p>
                  <p>
                    Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Personal Information You Provide</h3>
                  <p className="mb-4">We collect information that you voluntarily provide when using our Service, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Account Information:</strong> Name, email address, phone number</li>
                    <li><strong>Health & Fitness Data:</strong> Age, gender, height, weight, fitness goals, dietary preferences, activity level, medical conditions, fitness experience</li>
                    <li><strong>Payment Information:</strong> Processed securely through Epoint (we do not store your full payment card details)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Automatically Collected Information</h3>
                  <p className="mb-4">When you access our Service, we automatically collect certain information, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, referring URLs</li>
                    <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to track activity and store information</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Information from Third Parties</h3>
                  <p>We may receive information about you from third parties, such as:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Payment processors (Epoint) confirming transaction details</li>
                    <li>Analytics providers (if applicable)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                  <p className="mb-4">We use the information we collect for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Provide Services:</strong> Generate personalized fitness and nutrition plans based on your questionnaire responses</li>
                    <li><strong>Process Payments:</strong> Handle transactions securely through our payment partner</li>
                    <li><strong>Communication:</strong> Send you order confirmations, plan delivery, and support responses</li>
                    <li><strong>Improve Service:</strong> Analyze usage patterns to enhance user experience and plan quality</li>
                    <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
                    <li><strong>Security:</strong> Detect and prevent fraud, abuse, or security incidents</li>
                    <li><strong>Marketing:</strong> Send promotional emails (you can opt-out at any time)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Share Your Information</h2>
                  <p className="mb-4">We do not sell your personal information. We may share your information in the following situations:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">4.1 Service Providers</h3>
                      <p>We share information with third-party service providers who perform services on our behalf:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                        <li><strong>Epoint:</strong> Payment processing</li>
                        <li><strong>AI Services:</strong> OpenRouter and Google Gemini for plan generation</li>
                        <li><strong>Cloudflare:</strong> Hosting and infrastructure</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">4.2 Legal Requirements</h3>
                      <p>We may disclose your information if required by law or in response to valid requests by public authorities.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">4.3 Business Transfers</h3>
                      <p>If we are involved in a merger, acquisition, or sale of assets, your information may be transferred.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">4.4 With Your Consent</h3>
                      <p>We may share your information for any other purpose with your explicit consent.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
                  <p className="mb-4">
                    We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Account and questionnaire data: Retained while your account is active</li>
                    <li>Transaction records: Retained for 7 years for accounting and legal purposes</li>
                    <li>Usage data: Typically retained for 2 years</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
                  <p className="mb-4">
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <p className="mb-4">Security measures include:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encryption of data in transit (HTTPS/TLS)</li>
                    <li>Secure database storage with access controls</li>
                    <li>Regular security audits and updates</li>
                    <li>Payment processing through PCI-DSS compliant providers</li>
                  </ul>
                  <p className="mt-4 text-yellow-400">
                    However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights</h2>
                  <p className="mb-4">Depending on your location, you may have the following rights:</p>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">🔍 Right to Access</h3>
                      <p>Request a copy of the personal information we hold about you</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">✏️ Right to Rectification</h3>
                      <p>Request correction of inaccurate or incomplete information</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">🗑️ Right to Deletion</h3>
                      <p>Request deletion of your personal information (subject to legal obligations)</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">🚫 Right to Restriction</h3>
                      <p>Request restriction of processing of your personal information</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">📦 Right to Data Portability</h3>
                      <p>Receive your data in a structured, machine-readable format</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">⛔ Right to Object</h3>
                      <p>Object to processing of your personal information</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">📧 Right to Opt-Out</h3>
                      <p>Unsubscribe from marketing communications at any time</p>
                    </div>
                  </div>

                  <p className="mt-4">
                    To exercise any of these rights, please contact us at <a href="mailto:contact@fitgenius.top" className="text-cyan-400 hover:text-cyan-300">contact@fitgenius.top</a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
                  <p className="mb-4">We use cookies and similar tracking technologies to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Maintain your session and keep you logged in</li>
                    <li>Remember your preferences</li>
                    <li>Analyze site traffic and usage patterns</li>
                    <li>Improve site functionality and user experience</li>
                  </ul>
                  <p className="mt-4">
                    You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
                  <p className="mb-4">
                    Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country.
                  </p>
                  <p>
                    We ensure appropriate safeguards are in place to protect your information when transferred internationally, in compliance with applicable data protection laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
                  <p className="mb-4">
                    Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
                  </p>
                  <p>
                    If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information from our systems.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">11. Third-Party Links</h2>
                  <p>
                    Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">12. California Privacy Rights (CCPA)</h2>
                  <p className="mb-4">If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Right to know what personal information is collected, used, shared, or sold</li>
                    <li>Right to delete personal information held by us</li>
                    <li>Right to opt-out of the sale of personal information (we do not sell your information)</li>
                    <li>Right to non-discrimination for exercising your CCPA rights</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">13. European Privacy Rights (GDPR)</h2>
                  <p className="mb-4">If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Legal basis for processing: Consent, contract performance, legitimate interests</li>
                    <li>Right to withdraw consent at any time</li>
                    <li>Right to lodge a complaint with a supervisory authority</li>
                    <li>All rights listed in Section 7 of this policy</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">14. Changes to This Privacy Policy</h2>
                  <p className="mb-4">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically for any changes. Changes are effective when posted on this page.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">15. Contact Us</h2>
                  <p className="mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <p className="mb-2"><strong className="text-white">Email:</strong> <a href="mailto:contact@fitgenius.top" className="text-cyan-400 hover:text-cyan-300">contact@fitgenius.top</a></p>
                    {/* <p className="mb-2"><strong className="text-white">Support:</strong> <a href="mailto:contact@fitgenius.top" className="text-cyan-400 hover:text-cyan-300">contact@fitgenius.top</a></p> */}
                    <p><strong className="text-white">Website:</strong> <a href="/" className="text-cyan-400 hover:text-cyan-300">fitgenius.top</a></p>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    We aim to respond to all legitimate requests within 30 days.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">FitGenius</h3>
                <p className="text-gray-400 text-sm">Your AI-powered partner in achieving sustainable weight loss and building healthier habits.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Connect</h4>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/fit.geniuss/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} FitGenius. All rights reserved.</p>
              <p className="mt-2 text-xs"><span className="text-yellow-400">⚠️</span> Medical Disclaimer: This service provides general wellness information only. Always consult with a healthcare provider before starting any weight loss program.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
})

export default app
