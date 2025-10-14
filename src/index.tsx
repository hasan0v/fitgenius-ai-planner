import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

type D1Database = any;

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
      
      <script src="/static/app.js"></script>
    </div>
  )
})

// API Routes
// Database connection through Cloudflare D1

app.post('/api/questionnaire/start', async (c) => {
  const sessionId = crypto.randomUUID()
  
  try {
    // Store in D1 database
    await c.env.DB.prepare(`
      INSERT INTO questionnaire_sessions (id, current_step, responses, created_at, expires_at)
      VALUES (?, 1, '{}', datetime('now'), datetime('now', '+24 hours'))
    `).bind(sessionId).run()
    
    return c.json({ sessionId, question: questions[0] })
  } catch (error) {
    console.error('Failed to start questionnaire:', error)
    return c.json({ error: 'Failed to start questionnaire' }, 500)
  }
})

app.post('/api/questionnaire/answer', async (c) => {
  const { sessionId, questionId, answer } = await c.req.json()
  
  try {
    // Get current session from D1
    const session = await c.env.DB.prepare(
      'SELECT * FROM questionnaire_sessions WHERE id = ?'
    ).bind(sessionId).first()
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
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
    return c.json({ error: 'Failed to process answer' }, 500)
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

    const data = await response.json() as any
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

// Kapital Bank Payment Integration
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
    
    // Create Kapital Bank payment
    const paymentData = await createKapitalPayment(order, c.env || {})
    
    // Update order with Kapital session info
    await c.env.DB.prepare(`
      UPDATE orders 
      SET kapital_order_id = ?, kapital_session_id = ?
      WHERE id = ?
    `).bind(paymentData.orderId, paymentData.sessionId, orderId).run()
    
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
    amount: Math.round(order.amount * 100), // Convert to cents
    currency: '840', // USD currency code
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
    if (!orderId || !sessionId) {
      throw new Error('Missing payment parameters')
    }
    // Verify payment with Kapital Bank
    const isValid = await verifyKapitalPayment(orderId, sessionId)
    
    if (isValid) {
      // Find and update order status in database
      await c.env.DB.prepare(`
        UPDATE orders 
        SET status = 'paid', paid_at = datetime('now')
        WHERE kapital_order_id = ? AND kapital_session_id = ?
      `).bind(orderId, sessionId).run()
      
      // Get the updated order
      const foundOrder = await c.env.DB.prepare(`
        SELECT * FROM orders 
        WHERE kapital_order_id = ? AND kapital_session_id = ?
      `).bind(orderId, sessionId).first()
      
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
