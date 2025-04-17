# Wearly AI - Virtual Try-On E-Commerce Platform

A modern e-commerce platform with virtual try-on capabilities, built with React and Vite.

## 🌟 Features

- **Virtual Try-On**: Try clothes virtually using AI technology
- **Product Catalog**: Browse through a wide range of clothing items
- **User Authentication**: Secure login and signup functionality
- **Shopping Cart**: Add and manage items in your cart
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

Visit the live application: [Wearly AI](https://champion0g.github.io/Wearly-AI/)

## 🛠️ Technologies Used

- React 19.0.0
- Vite 6.2.6
- React Router DOM 7.5.0
- Tailwind CSS 4.1.3
- Hugging Face API for Virtual Try-On

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Champion0G/Wearly-AI.git
   cd Wearly-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_RAPID_API_KEY=your_rapid_api_key
   VITE_RAPID_API_HOST=apidojo-hm-hennes-mauritz-v1.p.rapidapi.com
   VITE_HUGGING_FACE_API_KEY=your_hugging_face_api_key
   VITE_USE_MOCK_DATA=false
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_RAPID_API_KEY | API key for RapidAPI H&M product data |
| VITE_RAPID_API_HOST | Host URL for RapidAPI |
| VITE_HUGGING_FACE_API_KEY | API key for Hugging Face AI services |
| VITE_USE_MOCK_DATA | Toggle between mock and real API data |

## 📱 Usage

1. **Browse Products**
   - Visit the home page to view available products
   - Use category filters to find specific items

2. **Virtual Try-On**
   - Select a product you want to try on
   - Click the "Try It On" button
   - Follow the simple steps to see how the item looks on you

3. **Shopping**
   - Add items to your cart
   - View and manage your cart
   - Proceed to checkout

## 🔧 Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Deploy to GitHub Pages: `npm run deploy`

## 📁 Project Structure

```
src/
├── assets/      # Static assets
├── components/  # Reusable components
├── context/     # React context providers
├── pages/       # Page components
├── styles/      # CSS styles
└── utils/       # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Ayush - Initial work and maintenance

## 🙏 Acknowledgments

- Hugging Face for providing the AI model
- RapidAPI for product data
- All contributors and users of the application
