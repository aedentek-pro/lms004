# Infrastructure for Purple LMS Backend

This directory contains scripts and configuration for provisioning the necessary cloud infrastructure on Google Cloud Platform (GCP) to run the Purple LMS backend.

## Scripts

### `gcloud-deploy.sh`

This is the primary script for deploying the entire backend application to GCP. It uses the `gcloud` command-line tool to automate the provisioning and deployment process.

**What it does:**

1.  **Sets GCP Project**: Configures the `gcloud` CLI to use the specified project ID.
2.  **Enables APIs**: Enables all necessary APIs, such as Cloud Run, Cloud SQL, and Secret Manager.
3.  **Provisions Cloud SQL**: Creates a new PostgreSQL instance on Cloud SQL to serve as the application's database. It will prompt you for a database user password.
4.  **Provisions GCS Bucket**: Creates a Google Cloud Storage bucket for file uploads.
5.  **Manages Secrets**: Creates secrets in Google Secret Manager to securely store sensitive information like database passwords, JWT secrets, and service account keys. You will be prompted to enter these values.
6.  **Builds & Pushes Docker Image**: Builds the backend's Docker image and pushes it to Google Artifact Registry.
7.  **Deploys to Cloud Run**: Deploys the container image to a new Cloud Run service, connecting it to the Cloud SQL instance and mounting the secrets as environment variables.

### How to Use

1.  **Install Google Cloud SDK**: Make sure you have the `gcloud` CLI installed and authenticated.
2.  **Configure Variables**: Open `gcloud-deploy.sh` in a text editor and update the configuration variables at the top of the file (e.g., `PROJECT_ID`, `REGION`).
3.  **Make Executable**:
    ```bash
    chmod +x gcloud-deploy.sh
    ```
4.  **Run the Script**:
    ```bash
    ./gcloud-deploy.sh
    ```
5.  **Follow Prompts**: The script will guide you through the process, prompting for necessary information like passwords and secrets.

### Post-Deployment

After the script finishes, you will need to connect to your new Cloud SQL database (likely via the [Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/postgres/connect-auth-proxy)) and run the Prisma migrations to set up the database schema:

```bash
# First, update your DATABASE_URL in the .env file to point to the new Cloud SQL instance
# Then, start the Cloud SQL Auth Proxy in a separate terminal

# In your project terminal:
npx prisma migrate deploy
```
