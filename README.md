# Krishibid – Crop Leaf Disease Detection App

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Appetize.io-brightgreen)](https://appetize.io/app/b_fc3ajqenc6ejwcdketfo4egcsu)
[![APK Download](https://img.shields.io/badge/Download-APK-blue)](https://drive.google.com/file/d/10NI-Yfb_dBSD51O2CYjJOdg_Zx_HGS1x/view?usp=sharing)

A mobile application that integrates a TensorFlow Lite model for real-time crop disease prediction, enabling farmers and agricultural professionals to quickly identify diseases affecting corn, potato, rice, and wheat crops through image recognition.

## UI Design

The application's user interface was designed in [Figma](https://www.figma.com/proto/3BPmwcL8U65mSQFp04OCEi?node-id=0-1&t=1yGif17kzkJ9Cpev-6) to ensure a user-friendly and intuitive experience.

## Features

- **Real-time Crop Disease Detection**: Uses TensorFlow.js to identify diseases in corn, potato, rice, and wheat crops
- **Image Capture & Upload**: Take photos directly with the camera or select from gallery
- **Social Features**: 
  - Create and share posts about crop diseases
  - Real-time comments and reactions
  - Rating system
  - User profiles with customizable information
- **Interactive Maps**: Google Maps integration for location-based features
- **Smooth Animations**: Powered by React Native Reanimated and GSAP
- **User Authentication**: Secure login and signup with Firebase Authentication
- **Real-time Database**: Cloud Firestore for storing user data and posts
- **Pagination**: Efficient data loading for better performance

## Technologies & Development Tools

### Frontend Framework
- **React Native** (v0.74.2) - Cross-platform mobile app development
- **Expo** (v51.0.17) - Build, deploy, and iterate quickly

### Machine Learning
- **TensorFlow.js** (v4.17.0) - JavaScript library for training and deploying ML models
- **@tensorflow/tfjs-react-native** (v1.0.0) - TensorFlow.js platform adapter for React Native
- **Teachable Machine** - Model trained with 15 crop disease classes

### Backend & Database
- **Firebase** (v10.8.0)
  - Firebase Authentication - User authentication
  - Cloud Firestore - NoSQL database for storing posts, comments, and user data

### Navigation
- **@react-navigation/native** (v6.1.10) - Routing and navigation
- **@react-navigation/bottom-tabs** (v6.5.14) - Bottom tab navigation
- **@react-navigation/native-stack** (v6.9.18) - Stack navigation

### UI Components & Styling
- **React Native Paper** (v5.12.3) - Material Design components
- **React Native Elements** (@rneui/themed v4.0.0-rc.8) - Cross-platform UI toolkit
- **styled-components** (v6.1.8) - CSS-in-JS styling
- **react-native-vector-icons** (v10.0.3) - Customizable icons

### Animation Libraries
- **React Native Reanimated** (v3.10.1) - Fluid animations and interactions
- **GSAP** (v3.12.5) - Professional-grade animation library
- **gsap-rn** (v0.0.18) - GSAP for React Native

### Additional Features
- **React Native Maps** (v1.14.0) - Google Maps integration
- **expo-camera** (v15.0.14) - Camera functionality
- **expo-image-picker** (v15.0.6) - Image selection from gallery
- **expo-location** (v17.0.1) - Location services
- **react-native-ratings** (v8.1.0) - Star rating component
- **moment** (v2.30.1) - Date and time manipulation
- **@apollo/client** (v3.10.8) - GraphQL client (for GitHub API integration)
- **axios** (v1.6.7) - HTTP client

### State Management
- **@reduxjs/toolkit** (v2.0.1) - State management
- **react-redux** (v9.1.0) - React bindings for Redux

### Development Tools
- **Node.js** - JavaScript runtime
- **npm** or **Yarn** - Package manager
- **Expo CLI** - Command-line tool for Expo

## Disease Detection Model

The app uses a TensorFlow.js model trained with Teachable Machine to detect:

### Crop Types & Diseases
- **Corn**: Common Rust, Gray Leaf Spot, Healthy, Northern Leaf Blight
- **Potato**: Early Blight, Healthy, Late Blight
- **Rice**: Brown Spot, Healthy, Leaf Blast, Neck Blast
- **Wheat**: Brown Rust, Healthy, Yellow Rust

The model processes images at 224x224 resolution and provides real-time predictions.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **Yarn**
- **Git** - [Download](https://git-scm.com/)
- **Expo CLI** (will be installed globally)
- **VS Code** or **Android Studio** (for Android development) or **Xcode** (for iOS development on macOS)
- **Expo Go** app on your mobile device (for testing)
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS](https://apps.apple.com/app/expo-go/id982107779)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/shoaibramim/Krishibid.git
cd Krishibid
```

### 2. Install Dependencies

Using npm:
```bash
npm install --legacy-peer-deps
```

Or using Yarn:
```bash
yarn install
```

**Note**: The `--legacy-peer-deps` flag is used to handle peer dependency conflicts.

### 3. Firebase Configuration

The Firebase configuration is already included in [firebase.js](firebase.js). However, for production use, you should:

1. Create your own Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password provider)
3. Create a **Firestore Database**
4. Copy your Firebase config and replace the values in [firebase.js](firebase.js):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Environment Variables

Create a `.env` file in the root directory for environment variables:

```env
EXPO_PUBLIC_Github_Access_Token=your_github_token_here
```

**Note**: The GitHub token is used for Apollo GraphQL integration. If you're not using GitHub API features, you can skip this.

### 5. Google Maps API (Optional)

If you want to use Google Maps features:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add the API key to [app.json](app.json) under the appropriate platform configuration

### 6. Start the Development Server

```bash
npm start
# or
expo start
```

This will open the Expo Developer Tools in your browser.

### 7. Run on Device/Emulator

#### Option 1: Run on Physical Device
1. Install **Expo Go** app on your phone
2. Scan the QR code from the Expo Developer Tools using:
   - **Android**: Expo Go app
   - **iOS**: Camera app (will open in Expo Go)

#### Option 2: Run on Android Emulator
```bash
npm run android
# or
expo start --android
```

#### Option 3: Run on iOS Simulator (macOS only)
```bash
npm run ios
# or
expo start --ios
```

#### Option 4: Run on Web
```bash
npm run web
# or
expo start --web
```

## Building for Production

### Build APK (Android)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure the build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Build for iOS

```bash
eas build --platform ios
```

## 📁 Project Structure

```
Krishibid/
├── App.js                    # Main application entry point
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── firebase.js               # Firebase configuration
├── metro.config.js           # Metro bundler configuration
├── package.json              # Dependencies and scripts
├── assets/                   # Static assets
│   ├── fonts/               # Custom fonts (DM Sans)
│   └── trained_model/       # TensorFlow model files
│       ├── model.json
│       ├── metadata.json
│       └── weights.bin
├── components/              # Reusable components
│   └── PostCard.js         # Post component for feed
├── pages/                   # Application screens
│   ├── About.js            # About screen
│   ├── BottomTabs.js       # Bottom tab navigator
│   ├── ClickOrSelectImage.js  # Disease detection screen
│   ├── CreatePost.js       # Create post screen
│   ├── EditProfile.js      # Edit profile screen
│   ├── Feed.js             # Home feed screen
│   ├── Login.js            # Login screen
│   ├── Notifications.js    # Notifications screen
│   ├── Profile.js          # User profile screen
│   ├── Search.js           # Search screen
│   ├── SignUp.js           # Registration screen
│   └── StarterScreen.js    # Initial welcome screen
├── styles/                  # Styling files
│   └── PostStyle.js        # Post component styles
└── ERD/                     # Entity Relationship Diagrams
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   # Clear cache and restart
   expo start -c
   ```

2. **Dependency conflicts**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **Android build issues**
   - Ensure Android SDK is properly installed
   - Check Java version (JDK 11 or higher recommended)

4. **iOS build issues (macOS)**
   - Ensure Xcode is installed
   - Run `pod install` in the `ios` directory (if applicable)

5. **TensorFlow model loading issues**
   - Ensure model files are in `assets/trained_model/`
   - Check that `model.json` and `weights.bin` are properly bundled

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private. All rights reserved.

## Developer

**Shoaib Uddin**

- GitHub: [@shoaibramim](https://github.com/shoaibramim)

## Support

For support, issues, or feature requests, please open an issue on the GitHub repository.

---

**Note**: This app was developed as part of an academic project demonstrating the integration of machine learning with mobile application development for agricultural technology solutions.
