# MediClaims - Medical Claims Management System

A comprehensive web application designed to help health insurance professionals efficiently manage and process medical insurance claims. The platform provides an intuitive interface for viewing, filtering, and analyzing medical claims data with robust authentication and data visualization capabilities.

## Features

- **Claims Dashboard**: Interactive data grid with sorting, filtering, and pagination
- **User Authentication**: Secure login/logout with Clerk authentication
- **Claims Analytics**: View comprehensive claims data with real-time statistics
- **Search & Filter**: Advanced search capabilities across all claim fields
- **Responsive Design**: Modern, mobile-friendly interface
- **Data Export**: Export claims data to CSV format
- **Real-time Updates**: Live data synchronization with MongoDB

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **AG Grid** - Enterprise data grid for claims visualization
- **Clerk** - Authentication and user management

### Backend & Database
- **MongoDB** - NoSQL database for claims storage
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB Driver** - Direct database connectivity

### Development & Testing
- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- MongoDB database (local or cloud)
- Clerk account for authentication

### Environment Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Configuration
MONGODB_HOST=your_mongodb_host
MONGODB_DATABASE=your_database_name
MONGODB_COLLECTION=your_collection_name

# MongoDB User Credentials
MONGODB_USER=your_mongodb_username
MONGODB_SECRET=your_mongodb_password

# Next.js Environment
NODE_ENV=development
```

### Running the Application

#### Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

#### Production Build
```bash
npm run build
npm start
```

#### Unit Tests
Run the test suite:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── claims-grid/      # Claims-related components
│   │   ├── MedicalClaimsGrid.tsx
│   │   ├── MedicalClaimsGridWrapper.tsx
│   │   └── MedicalClaimsFilters.tsx
│   └── ...               # Other UI components
├── config/               # Configuration files
│   └── gridColumns.ts    # AG Grid column definitions
├── lib/                  # Utility libraries
│   └── database/         # Database connections and queries
├── types/                # TypeScript type definitions
└── middleware.ts         # Clerk authentication middleware
```

## Key Features in Detail

### Claims Dashboard
- Interactive data grid displaying medical claims
- Sortable columns (especially date fields)
- Configurable page sizes (25, 50, 100 records)
- Real-time search across all fields
- Export functionality for data analysis

### Authentication Flow
- Secure sign-in/sign-up with Clerk
- Protected dashboard routes
- Automatic session management
- Welcome page for authenticated users

### Data Management
- MongoDB integration for claims storage
- Efficient pagination and filtering
- Real-time data synchronization
- Robust error handling and validation

## Testing

The application includes comprehensive unit tests covering:
- Component rendering and functionality
- User interactions and navigation
- API integration and data handling
- Authentication flows

Run tests with:
```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.
