# nickyspatial_frontend

React frontend for the [nickyspatial](https://github.com/kshitijrajsharma/nickyspatial) project, a web application for remote sensing analysis. It provides a user-friendly interface to interact with the nickyspatial_api backend, enabling users to upload, process, and manage geospatial data.

## Features

- User Interface: A web-based interface for interacting with the backend API.

- Layer Management: Allows users to view, manage, and inspect geospatial layers.

- Processing Tools: Provides access to various geospatial analysis tools like segmentation and classification.

- Results Visualization: Displays results of geospatial processing in an intuitive manner.

## Getting Started

Follow these steps to get the frontend application up and running on your local machine.

### Prerequisites

You need to have a recent version of Node.js and npm installed.

### Installation

- Install dependencies:

```bash
npm install
```

- Start the development server:

```bash
npm start
```

The application will be available at http://localhost:3000.

## Connecting to the Backend

The frontend application is configured to connect to the nickyspatial_api backend. By default, it will assume the backend is running at http://localhost:8000.

If your backend is running on a different address, you will need to update the API endpoint in the application's configuration.

## Project Structure

.
├── public/
│   ├── index.html            # Main HTML file
│   └── ...
├── src/
│   ├── components/           # Reusable React components
│   ├── usecases/             # Business logic and API calls
│   ├── App.jsx               # Main application component
│   └── index.jsx             # Entry point for React
└── package.json
