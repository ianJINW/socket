# Environment Variables Setup

This guide explains how to set up environment variables for both frontend and backend.

## Quick Start

1. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your actual values (usually default is fine)
   ```

## Backend Environment Variables

### Required Variables

- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port (default: 4000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT access tokens (min 32 characters)
- `JWT_REFRESH_SECRET`: Secret key for JWT refresh tokens (min 32 characters)
- `ACCESS_TOKEN_TTL`: Access token expiration (default: 15m)
- `REFRESH_TOKEN_TTL`: Refresh token expiration (default: 30d)
- `STORAGE_DRIVER`: File storage driver (local/s3)
- `UPLOAD_MAX_MB`: Maximum file upload size in MB
- `UPLOAD_DIR`: Directory for local file storage
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins

### Optional Variables

- Payment gateway configuration (Stripe, Adyen, etc.)
- Email service configuration (SendGrid, SES, etc.)
- SMS service configuration (Twilio, Nexmo, etc.)
- S3 storage configuration (if using cloud storage)

## Frontend Environment Variables

### Required Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:4000/api/v1)

### Optional Variables

- `VITE_ENV`: Environment identifier
- `VITE_APP_NAME`: Application name
- Feature flags and external service API keys

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to version control
- Use strong, random secrets in production (minimum 32 characters)
- Rotate secrets regularly
- Use different secrets for development and production
- Store production secrets in secure secret management systems

## Generating Secure Secrets

You can generate secure secrets using:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Generate separate secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

