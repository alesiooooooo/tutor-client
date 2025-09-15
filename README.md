# Tutors Client - Next.js Application

A comprehensive tutoring platform client application built with Next.js 15, featuring user authentication, booking management, and a modern UI with Material-UI.

## 🚀 Features

### Authentication System

- **User Registration**: Complete signup flow with email validation
- **User Login**: Secure authentication with JWT tokens
- **Session Management**: HTTP-only cookies for secure token storage
- **Logout Functionality**: Secure session termination
- **Protected Routes**: Dashboard access restricted to authenticated users

### Booking Management

- **Create Bookings**: Schedule tutoring sessions with available tutors
- **View Bookings**: Display user's current and past bookings with real-time status indicators
- **Delete Bookings**: Cancel scheduled sessions (only for upcoming or ongoing lessons)
- **Tutor Selection**: Browse and select from available tutors
- **Time Slot Management**: Select date and time for sessions
- **Status Classification**: Client-side logic automatically categorizes bookings:
  - `In Progress` - Currently ongoing sessions (green border)
  - `Upcoming` - Future scheduled sessions (blue border)
  - `Past` - Completed sessions (default styling)
- **Timezone Handling**: UTC timestamps converted to user's local timezone for display### User Interface

- **Modern Design**: Clean, responsive UI built with Material-UI
- **Dashboard**: Centralized user control panel
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages and user feedback
- **Loading States**: Visual feedback during API operations

### Technical Features

- **Server Actions**: Next.js 15 Server Actions for form handling
- **Server Components**: Optimized rendering with React Server Components
- **Type Safety**: Full TypeScript implementation
- **API Integration**: RESTful API communication with backend services
- **Docker Support**: Containerized deployment with Docker Compose

## 🛠 Technology Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Authentication**: JWT tokens with HTTP-only cookies
- **Styling**: Material-UI components and theming
- **Containerization**: Docker & Docker Compose
- **Package Manager**: npm

## 📁 Project Structure

```
app/
├── auth/
│   ├── login/
│   │   ├── page.tsx          # Login page component
│   │   └── actions.ts        # Login server actions
│   ├── logout/
│   │   └── actions.ts        # Logout server actions
│   └── signup/
│       ├── page.tsx          # Registration page component
│       └── actions.ts        # Registration server actions
├── dashboard/
│   ├── page.tsx              # Dashboard main page
│   ├── DashboardClient.tsx   # Dashboard client component
│   ├── LogoutButton.tsx      # Logout functionality
│   └── booking/
│       ├── actions.ts        # Booking management server actions
│       ├── CreateBookingForm.tsx    # Booking creation form
│       └── CreateBookingButton.tsx  # Booking action button
├── layout.tsx                # Root layout with Material-UI provider
└── page.tsx                  # Landing page
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker and Docker Compose (for containerized setup)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
API_BASE_URL=http://localhost:3010
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010

# Port for Next.js dev server
PORT=3001
```

### Development Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

### Docker Setup

1. **Build and run with Docker Compose:**

   ```bash
   npm run docker:build
   ```

2. **Stop the containers:**

   ```bash
   npm run docker:stop
   ```

3. **Access the application:**
   - Development: [http://localhost:3009](http://localhost:3009)

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker
npm run docker:build # Build and start Docker containers
npm run docker:stop  # Stop Docker containers
```

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with email and password
2. **Login**: Authentication returns JWT token stored in HTTP-only cookie
3. **Session**: Token automatically included in API requests
4. **Logout**: Cookie cleared and session terminated
5. **Protection**: Dashboard routes require valid authentication

## 📊 API Integration

The application communicates with a backend API for:

- **Authentication endpoints**: `/auth/login`, `/auth/signup`
- **Booking endpoints**: `/booking` (GET, POST, DELETE)
- **Tutor endpoints**: `/tutor` (GET)

All API requests include proper error handling and loading states.

## 🐳 Docker Configuration

The application includes a multi-stage Dockerfile optimized for production:

- **Stage 1**: Dependencies installation
- **Stage 2**: Application build
- **Stage 3**: Production runtime

Key features:

- Node.js 18 Alpine base image
- Production optimizations
- Security best practices
- Network accessibility (`0.0.0.0` binding)

## Development Practices

- **TypeScript**: Full type safety throughout the application
- **Server Components**: Optimized rendering and data fetching
- **Server Actions**: Modern form handling without client-side JavaScript
- **Error Boundaries**: Comprehensive error handling
- **Component Reusability**: Modular, reusable UI components

## 🔄 State Management

- **Server State**: Managed through Server Actions and revalidation
- **Form State**: Native form handling with Server Actions
- **UI State**: Component-level state management
- **Authentication State**: Cookie-based session management
