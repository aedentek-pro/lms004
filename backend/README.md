# Purple LMS - Backend

This directory contains the complete backend for the Purple LMS application, built with NestJS, Prisma, PostgreSQL, and designed for deployment on Google Cloud.

## Features

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Authentication**: JWT (Access Tokens + Refresh Tokens) & Role-Based Access Control (RBAC)
- **File Storage**: Google Cloud Storage for secure file uploads via signed URLs.
- **Real-time**: WebSocket gateway using Socket.IO for notifications.
- **API Documentation**: OpenAPI (Swagger) at `/api/docs`.
- **Testing**: Unit and E2E tests with Jest.
- **Containerization**: Docker & Docker Compose for local development.
- **Deployment**: Ready for Google Cloud Run.

## 1. Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) and Docker Compose
- A Google Cloud Platform (GCP) project for file uploads.

### Step-by-Step Instructions

1.  **Clone the Repository**
    If you haven't already, clone the main project repository.

2.  **Navigate to Backend Directory**
    ```bash
    cd backend
    ```

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Set Up Environment Variables**
    Copy the example environment file and fill in the required values.
    ```bash
    cp .env.example .env
    ```
    You will need to fill out the following in the `.env` file:
    - `DATABASE_URL`: The connection string for your PostgreSQL database. The `docker-compose.yml` file sets this up for you.
    - `JWT_SECRET`: A long, random, secret string for signing access tokens.
    - `JWT_REFRESH_SECRET`: A different long, random, secret string for refresh tokens.
    - `GCS_PROJECT_ID`: Your Google Cloud project ID.
    - `GCS_BUCKET_NAME`: The name of your GCS bucket for uploads.
    - `GCS_CLIENT_EMAIL` & `GCS_PRIVATE_KEY`: Credentials from a GCP service account JSON key file.

5.  **Set Up Google Cloud Storage (GCS)**
    - In your GCP project, create a new Cloud Storage bucket.
    - Create a Service Account with the "Storage Object Admin" (`roles/storage.objectAdmin`) role.
    - Create a JSON key for this service account and download it.
    - Open the JSON key file and copy the `client_email` and `private_key` values into your `.env` file. The `private_key` value often contains `\n` characters; these must be preserved within double quotes in the `.env` file.
    - Update `GCS_PROJECT_ID` and `GCS_BUCKET_NAME` in your `.env` file.

6.  **Start Local Database & Services**
    This command will start PostgreSQL and Redis containers.
    ```bash
    docker-compose up -d
    ```

7.  **Run Database Migrations**
    This command applies the Prisma schema to your local database, creating the necessary tables.
    ```bash
    npx prisma migrate dev --name init
    ```

8.  **Seed the Database**
    This command populates the database with sample data that mirrors the frontend's mock data.
    ```bash
    npx prisma db seed
    ```

9.  **Start the Backend Server**
    ```bash
    npm run start:dev
    ```
    The server will be running at `http://localhost:3001`.
    The API documentation will be available at `http://localhost:3001/api/docs`.

## 2. Running Tests

- **Run all tests (unit and e2e):**
  ```bash
  npm test
  ```

- **Run unit tests only:**
  ```bash
  npm run test:unit
  ```

- **Run end-to-end (e2e) tests:**
  *Requires the Docker services to be running.*
  ```bash
  npm run test:e2e
  ```

## 3. Deployment to Google Cloud Run

The `infra/gcloud-deploy.sh` script provides a template for deploying the application.

### Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/install) installed and authenticated (`gcloud auth login`).
- A GCP project with billing enabled.
- Required APIs enabled: Cloud Run, Cloud SQL, Cloud Storage, Secret Manager.

### Deployment Steps

1.  **Configure `infra/gcloud-deploy.sh`**
    Open the script and update the placeholder variables at the top (PROJECT_ID, REGION, SERVICE_NAME, etc.).

2.  **Run the Deployment Script**
    The script will:
    - Provision a Cloud SQL (Postgres) instance.
    - Provision a Google Cloud Storage bucket.
    - Create secrets in Secret Manager for your `.env` variables.
    - Build and push a Docker image to Google Artifact Registry.
    - Deploy the image to Cloud Run, connecting it to the database and secrets.

    ```bash
    chmod +x infra/gcloud-deploy.sh
    ./infra/gcloud-deploy.sh
    ```
    Follow the prompts in the script. You will need to enter your database password and other secrets when prompted.

## 4. Frontend Integration Snippets

Here are examples of how the frontend can interact with this backend.

### Login Request
```javascript
// Using fetch API
async function login(email, password) {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const { data } = await response.json();
  // data contains: { accessToken, user: { id, name, role } }
  localStorage.setItem('accessToken', data.accessToken);
  return data.user;
}
```

### File Upload Flow (with Signed URL)

This is a three-step process for secure file uploads.

```javascript
// 1. Get the signed upload URL from your backend
async function getSignedUrl(filename, contentType) {
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:3001/api/uploads/signed-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ filename, contentType }),
  });
  const { data } = await response.json();
  // data contains: { uploadUrl, fileKey }
  return data;
}

// 2. Upload the file directly to Google Cloud Storage using the signed URL
async function uploadFileToGCS(uploadUrl, file) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }
}

// 3. (Example) Call your backend to create an assignment submission record
async function createSubmission(assignmentId, fileKey, submissionText) {
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch(`http://localhost:3001/api/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      submissionText,
      s3Key: fileKey, // The key returned from getSignedUrl
    }),
  });
  // Handle response...
}

// --- Putting it all together ---
async function handleFileUpload(assignmentId, file, text) {
  try {
    // Step 1
    const { uploadUrl, fileKey } = await getSignedUrl(file.name, file.type);
    
    // Step 2
    await uploadFileToGCS(uploadUrl, file);
    
    // Step 3
    await createSubmission(assignmentId, fileKey, text);
    
    console.log('Submission successful!');
  } catch (error) {
    console.error('An error occurred during file upload:', error);
  }
}
```
