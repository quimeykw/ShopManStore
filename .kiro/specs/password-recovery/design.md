# Design Document

## Overview

This feature implements a secure password recovery system using email-based token verification. The system generates unique, time-limited tokens when users request password resets, sends these tokens via email, and allows users to set new passwords through a secure form. The implementation uses Nodemailer for email delivery and follows security best practices for password reset workflows.

## Architecture

The password recovery system follows a standard token-based reset flow:

1. **Request Phase**: User submits username/email → System generates token → Email sent
2. **Verification Phase**: User clicks link → System validates token → Reset form displayed
3. **Reset Phase**: User submits new password → System updates password → Token invalidated

### Components

- **Frontend**: Modal forms for requesting and resetting passwords
- **Backend API**: Express routes for handling reset requests and password updates
- **Database**: New table for storing reset tokens with expiration
- **Email Service**: Nodemailer configured with Gmail SMTP

## Components and Interfaces

### Database Schema

New table: `password_resets`
```sql
CREATE TABLE IF NOT EXISTS password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  -- or SERIAL for PostgreSQL
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### API Endpoints

#### POST /api/forgot-password
Request password reset
```javascript
Request: { usernameOrEmail: string }
Response: { message: string }
```

#### POST /api/reset-password
Reset password with token
```javascript
Request: { 
  token: string,
  newPassword: string,
  confirmPassword: string
}
Response: { message: string }
```

#### GET /api/verify-reset-token/:token
Verify if token is valid
```javascript
Response: { valid: boolean, message?: string }
```

### Email Service Configuration

Using Nodemailer with Gmail:
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});
```

Environment variables needed:
- `EMAIL_USER`: Gmail address
- `EMAIL_APP_PASSWORD`: Gmail app-specific password
- `BASE_URL`: Application URL for reset links

### Frontend Components

1. **Forgot Password Modal**: Collects username/email
2. **Reset Password Page**: Form for entering new password
3. **Success/Error Messages**: User feedback

## Data Models

### PasswordReset Model
```javascript
{
  id: number,
  user_id: number,
  token: string,  // crypto.randomBytes(32).toString('hex')
  expires_at: Date,  // Current time + 1 hour
  used: boolean,
  created_at: Date
}
```

### Email Template
```javascript
{
  from: 'ShopManStore <noreply@shopmanstore.com>',
  to: user.email,
  subject: 'Recuperación de Contraseña - ShopManStore',
  html: `
    <h2>Recuperación de Contraseña</h2>
    <p>Hola ${user.username},</p>
    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
    <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
    <a href="${resetLink}">Restablecer Contraseña</a>
    <p>Este enlace expirará en 1 hora.</p>
    <p>Si no solicitaste este cambio, ignora este correo.</p>
  `
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Most requirements for this feature are example-based tests of specific workflows rather than universal properties. However, there are a few key properties that should hold across all inputs:

**Property 1: Input validation consistency**
*For any* input string (empty, whitespace-only, or valid), the validation function should consistently reject empty/whitespace-only inputs and accept non-empty inputs
**Validates: Requirements 1.2**

**Property 2: Token validation correctness**
*For any* token and timestamp, the validation function should return true if and only if the token exists, is not marked as used, and the current time is before the expiration time
**Validates: Requirements 3.1**

**Property 3: Password matching validation**
*For any* two password strings, the validation should return true if and only if both strings are identical
**Validates: Requirements 3.4**

**Example-Based Tests:**

Example 1: Password recovery form display
*When* user clicks "¿Olvidaste tu contraseña?", the forgot password modal should become visible
**Validates: Requirements 1.1**

Example 2: Token generation and storage
*When* a valid username/email is submitted, a unique token should be created in the database with expiration set to 1 hour from now
**Validates: Requirements 1.3, 1.4, 4.1**

Example 3: Email sending
*When* a reset token is generated, an email should be sent containing the reset link, username, and expiration notice
**Validates: Requirements 1.5, 2.1, 2.2, 2.3, 2.5**

Example 4: Password hashing
*When* a new password is set, the stored value should be a bcrypt hash, not plaintext
**Validates: Requirements 3.5**

Example 5: Expired token rejection
*When* a user attempts to use a token with expiration time in the past, the system should reject it with an error message
**Validates: Requirements 4.2**

Example 6: Token invalidation after use
*When* a password is successfully reset, the token's "used" flag should be set to true
**Validates: Requirements 4.3**

Example 7: Previous token invalidation
*When* a new reset request is made for a user, all previous unused tokens for that user should be marked as used
**Validates: Requirements 4.4**

Example 8: Security through obscurity
*When* a non-existent username/email is submitted, the response message should not reveal whether the user exists
**Validates: Requirements 5.2**

Example 9: Configuration loading
*When* the application starts, it should read EMAIL_USER and EMAIL_APP_PASSWORD from environment variables
**Validates: Requirements 6.1**

Example 10: Graceful email error handling
*When* email sending fails, the application should log the error but continue running without crashing
**Validates: Requirements 6.4**

## Error Handling

### Email Service Errors
- **SMTP Connection Failed**: Log error, return generic success message to user (security)
- **Invalid Credentials**: Log warning on startup, disable password recovery feature
- **Rate Limiting**: Implement cooldown period (5 minutes) between reset requests per user

### Token Errors
- **Token Not Found**: Display "Invalid or expired reset link"
- **Token Expired**: Display "Reset link has expired. Please request a new one"
- **Token Already Used**: Display "This reset link has already been used"

### Validation Errors
- **Empty Input**: Display "Please enter your username or email"
- **Passwords Don't Match**: Display "Passwords do not match"
- **Weak Password**: Display minimum password requirements

### Database Errors
- **Connection Failed**: Display "Service temporarily unavailable. Please try again later"
- **Query Failed**: Log error, display generic error message

## Testing Strategy

### Unit Tests

1. **Token Generation**: Verify tokens are unique and properly formatted
2. **Token Validation**: Test with valid, expired, used, and non-existent tokens
3. **Password Hashing**: Verify bcrypt is used correctly
4. **Input Validation**: Test empty, whitespace, and valid inputs
5. **Email Template**: Verify email contains required elements

### Property-Based Tests

We will use fast-check for property-based testing:

- **Library**: fast-check (JavaScript property-based testing library)
- **Test Configuration**: Minimum 100 iterations per property test
- **Properties to Test**:
  1. Input validation consistency (Property 1)
  2. Token validation correctness (Property 2)
  3. Password matching validation (Property 3)

Each property-based test will be tagged with:
```javascript
// Feature: password-recovery, Property X: [property name]
```

### Integration Tests

1. **Full Reset Flow**: Request → Email → Reset → Login
2. **Expired Token Flow**: Request → Wait → Attempt reset → Error
3. **Multiple Requests**: Request → Request again → Verify old token invalidated
4. **Email Service**: Mock email service and verify calls

### Manual Testing

- Test email delivery with real Gmail account
- Verify email formatting in different email clients
- Test reset flow on mobile devices
- Verify Spanish language throughout

## Security Considerations

1. **Token Security**: Use cryptographically secure random tokens (32 bytes)
2. **Time Limits**: Tokens expire after 1 hour
3. **One-Time Use**: Tokens are invalidated after successful use
4. **Rate Limiting**: Prevent abuse by limiting requests per user
5. **Information Disclosure**: Don't reveal if username/email exists
6. **HTTPS Required**: Reset links should only work over HTTPS in production
7. **Password Requirements**: Enforce minimum password strength
