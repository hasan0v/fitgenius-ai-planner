import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FitGenius - Personalized Weight Loss Plans</title>
        <meta name="description" content="Get completely personalized weight loss plans tailored to your lifestyle. Transform your body with custom meal plans, workouts, and expert guidance." />
        
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&family=Rajdhani:wght@700&family=Bebas+Neue&display=swap" rel="stylesheet" />
        
        {/* Font Awesome Icons */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        {/* Custom Styles */}
        <link href="/static/styles.css" rel="stylesheet" />
        
        {/* Tailwind Config */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    'primary-blue': '#2C5D82',
                    'bright-turquoise': '#1FBCC9',
                    'energizing-orange': '#FF8A3D',
                    'coral-pink': '#FF6F7A',
                    'health-green': '#2ECC71',
                    'neutral-gray': '#9AA0A6'
                  }
                }
              }
            }
          `
        }} />
        
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💪</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
})
