# Angular Portfolio

A modern, responsive portfolio website built with Angular 17, featuring project showcase, image galleries, and contact form.

## 🚀 Features

- **Modern Angular 17** with standalone components
- **Responsive Design** with Tailwind CSS
- **Dark Mode** support with theme toggle
- **Project Gallery** with image carousel and preview
- **Contact Form** with validation
- **TypeScript** for type safety
- **GitHub Pages** deployment ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/vinil2001/angular-portfolio.git
cd angular-portfolio

# Install dependencies
npm install

# Run development server
ng serve

# Open http://localhost:4200
```

## 🛠️ Build & Deploy

### Local Build
```bash
# Build for production
ng build --configuration production

# The build artifacts will be stored in the dist/ directory
```

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages. When you push to the `main` branch, GitHub Actions will:

1. Build the application
2. Deploy to GitHub Pages
3. Your site will be available at: `https://vinil2001.github.io/angular-portfolio/`

#### Manual Deployment
```bash
# Build with base href
ng build --configuration production

# Deploy to GitHub Pages
npx angular-cli-ghpages --dir=dist/angular-portfolio
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── image-carousel/  # Image gallery component
│   │   ├── tech-filter/     # Technology filter
│   │   └── theme-toggle/    # Dark mode toggle
│   ├── features/            # Feature modules
│   │   ├── portfolio/       # Portfolio listing
│   │   ├── project-detail/  # Project details
│   │   └── contact/         # Contact form
│   ├── models/              # TypeScript interfaces
│   ├── core/                # Core services
│   └── app.routes.ts        # Routing configuration
├── styles.scss              # Global styles
└── index.html               # Main HTML
```

## 🎨 Customization

### Adding Projects
Edit `src/app/core/services/portfolio.ts` and add your projects to the `loadDefaultProjects()` method:

```typescript
{
  id: 1,
  title: 'Your Project',
  description: 'Project description',
  icon: '🚀',
  link: 'https://github.com/your-repo',
  technologies: ['Angular', 'TypeScript', 'Tailwind'],
  featured: true,
  images: ['image1.jpg', 'image2.jpg']
}
```

### Updating Contact Info
Edit `src/app/features/contact/contact.component.html` and update the contact information.

### Theme Colors
Edit `src/styles.scss` and modify the CSS variables in the `:root` selector.

## 🌐 Deployment Options

### GitHub Pages (Recommended)
- Free hosting
- Automatic HTTPS
- Custom domain support
- CI/CD with GitHub Actions

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/angular-portfolio
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📝 Scripts

```bash
# Start development server
ng serve

# Run tests
ng test

# Build for production
ng build

# Run linting
ng lint

# Deploy to GitHub Pages
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: https://vinil2001.github.io/angular-portfolio/
- **CV**: https://vinil2001.github.io/cv-andrii-boiko/
- **LinkedIn**: https://linkedin.com/in/andrii-boiko

## ⭐ Acknowledgments

- [Angular](https://angular.io/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Heroicons](https://heroicons.com/) - Icon library
- [Picsum](https://picsum.photos/) - Placeholder images
