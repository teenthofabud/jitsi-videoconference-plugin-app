# AI GENERATED 

# jitsi-videoconference-plugin

A modern Angular application built with PrimeNG components, featuring a clean design and responsive layout.

## 🚀 Features

- **Modern Angular 20**: Built with the latest Angular framework
- **PrimeNG Components**: Professional UI components with consistent theming
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Clean Navigation**: Pure PrimeNG MenuBar implementation
- **Legal Pages**: Privacy Policy and Terms of Service with bulleted content
- **Professional Styling**: Typography hierarchy with serif and sans-serif fonts

## 🛠️ Tech Stack

- **Frontend**: Angular 20
- **UI Library**: PrimeNG 20
- **Styling**: CSS3 with PrimeNG theming
- **Icons**: PrimeIcons
- **Fonts**: Inter (headings) + Georgia (content)
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd launch-pad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/` to view the application.

## 🏗️ Build

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:vercel
```

The build artifacts will be stored in the `dist/launch-pad/` directory.

## 🚀 Deployment to Vercel

This project is configured for seamless deployment to Vercel:

### Option 1: Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Option 2: GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy on every push

### Configuration Files
- `vercel.json`: Vercel deployment configuration
- `.vercelignore`: Files to exclude from deployment
- Updated `angular.json`: Optimized production build settings

## 🧪 Testing

Run unit tests:
```bash
npm test
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/          # PrimeNG MenuBar navigation
│   │   └── footer/          # Footer component
│   ├── pages/
│   │   ├── home/            # Landing page
│   │   ├── contact/         # Contact form
│   │   ├── privacy/         # Privacy policy (bulleted)
│   │   └── terms/           # Terms of service (bulleted)
│   └── app.module.ts        # Main app module
├── assets/                  # Static assets
└── styles.css              # Global styles
```

## 🎨 Design Features

- **Typography**: Inter for headings, Georgia for content
- **Color Scheme**: Blue primary theme with PrimeNG
- **Layout**: Centered content with max-width containers
- **Navigation**: Right-aligned menu items with icons
- **Content**: Bulleted lists for better readability

## 🔧 Development

### Adding New Components
```bash
ng generate component component-name
```

### Adding PrimeNG Components
1. Import the module in `app.module.ts`
2. Add to the imports array
3. Use in templates

### Customizing Themes
Modify the theme configuration in `app.module.ts`:
```typescript
const BluePreset = definePreset(Aura, {
  semantic: {
    primary: {
      // Your color values
    }
  }
});
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please contact us at info@launchpad.com
