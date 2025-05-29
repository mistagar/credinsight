# CredInsight

CredInsight is a financial risk assessment application that helps analyze customer transactions and identify potential risks.

## Project Structure

The project is divided into two main parts:

- **Backend**: A .NET 6.0 API that handles data processing, risk assessment, and authentication
- **Frontend**: A Next.js application providing the user interface

## Backend

The backend is built with ASP.NET Core 6.0 and includes:

- REST APIs for customers, transactions, logins, and risk assessments
- Entity Framework Core for data management
- Risk assessment services for financial analysis
- Authentication and authorization services

### Getting Started with Backend

1. Ensure you have .NET 6.0 SDK installed
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Run the application:
   ```
   dotnet run
   ```

## Frontend

The frontend is built with Next.js and includes:

- Modern UI components built with React
- TypeScript for type safety
- Responsive layouts for various devices
- API integration with the backend

### Getting Started with Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   pnpm install
   ```
3. Start the development server:
   ```
   pnpm dev
   ```

## Features

- Customer management
- Transaction monitoring
- Login activity tracking
- Risk assessment and analysis
- AI-assisted insights

## Development

This project uses:

- .NET 6.0 for backend development
- Next.js for frontend
- Entity Framework for data access
- TypeScript for type-safe JavaScript
