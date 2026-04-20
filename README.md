# Americoders Server

Backend API for the Americoders education platform.

This service powers the server-side functionality for Americoders, including API routing, database connectivity, authentication-related middleware, CSRF protection, and other backend services used by the client application.

## Tech Stack

* Node.js
* Express
* MongoDB / Mongoose
* JWT
* CSRF protection
* Cookie-based middleware
* Stripe
* SendGrid
* AWS SDK

## Project Structure

* `controllers/`
* `middlewares/`
* `models/`
* `routes/`
* `utils/`
* `index.js`
* `server.js`
* `package.json`

## What the Server Does

* Connects to MongoDB with Mongoose
* Loads all route files from the `routes` directory automatically
* Mounts API routes under `/api`
* Enables CORS
* Parses JSON request bodies
* Uses cookie parsing and CSRF protection
* Logs requests with Morgan
* Starts an Express server on the configured port

## Requirements

* Node.js 16+ recommended
* npm
* MongoDB connection string

## Environment Variables

Create a `.env` file in the project root.

Minimum required variables:

`MONGO_URI=your_mongodb_connection_string`
`PORT=8000`

Depending on which routes or features you use, you may also need additional environment variables for:

* JWT/auth configuration
* Stripe payments
* SendGrid email delivery
* AWS services/uploads

## Installation

Clone the repository and install dependencies.

`git clone https://github.com/josephdubon/americoders-server.git`
`cd americoders-server`
`npm install`

Then create a `.env` file with:

`MONGO_URI=your_mongodb_connection_string`
`PORT=8000`

## Running the Server

Start the development server with:

`npm start`

This runs:

`nodemon -r esm server.js`

By default, the app runs on:

`http://localhost:8000`

## API Routing

All route files in the `routes` directory are automatically loaded and mounted under `/api`.

Example route pattern:

`/api/...`

The server also exposes a CSRF token endpoint:

`GET /api/csrf-token`

## Core Server Behavior

The startup flow is:

1. Load environment variables
2. Connect to MongoDB
3. Configure middleware
4. Auto-register routes from `routes`
5. Enable CSRF protection
6. Start the server

## Available Middleware and Backend Capabilities

Based on installed dependencies, this server supports functionality such as:

* authentication with JWT
* password hashing with bcrypt
* CSRF-protected requests
* file/form handling
* email sending
* payment integration
* AWS-related backend operations

## Related Repositories

* Client: [https://github.com/josephdubon/americoders-client](https://github.com/josephdubon/americoders-client)

## Notes

This repository represents the backend side of a larger real-world education platform. Some setup details may depend on external services and private environment configuration used during deployment.

## License

ISC
