# Implementation Plan

- [x] 1. Install and configure email service dependencies


  - Install nodemailer package: `npm install nodemailer`
  - Add email configuration to .env.example file
  - Document how to get Gmail app password in comments
  - _Requirements: 6.1, 6.3_

- [x] 2. Create database schema for password resets

  - [x] 2.1 Create password_resets table migration


    - Write SQL for creating password_resets table
    - Handle both SQLite and PostgreSQL syntax differences
    - Add indexes for token and user_id columns
    - _Requirements: 1.4_
  
  - [x] 2.2 Update init-db.js to create password_resets table


    - Add table creation logic to initialization script
    - Ensure table is created on application startup
    - _Requirements: 1.4_


- [ ] 3. Implement backend email service
  - [x] 3.1 Create email service module



    - Create email-service.js with Nodemailer configuration
    - Read EMAIL_USER and EMAIL_APP_PASSWORD from environment
    - Implement graceful fallback if credentials missing
    - Add error logging for email failures
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 3.2 Create email template for password reset


    - Design HTML email template with ShopManStore branding
    - Include reset link, username, and expiration notice
    - Ensure all text is in Spanish
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 4. Implement password reset request endpoint
  - [x] 4.1 Create POST /api/forgot-password route


    - Validate input is not empty
    - Find user by username or email
    - Generate secure random token (32 bytes)
    - Calculate expiration time (current time + 1 hour)
    - Invalidate any previous unused tokens for the user
    - Store token in database
    - Send reset email
    - Return generic success message (don't reveal if user exists)
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 4.1, 4.4, 5.1, 5.2_


  
  - [ ] 4.2 Add rate limiting for reset requests
    - Implement 5-minute cooldown between requests per user
    - Store last request time in memory or database
    - Return appropriate error if cooldown not elapsed
    - _Requirements: Security consideration_

- [x] 5. Implement token verification endpoint

  - Create GET /api/verify-reset-token/:token route
  - Check if token exists in database
  - Verify token is not expired
  - Verify token has not been used
  - Return validation result
  - _Requirements: 3.1, 4.2_


- [ ] 6. Implement password reset endpoint
  - [x] 6.1 Create POST /api/reset-password route


    - Validate token using verification logic
    - Validate passwords match
    - Validate password meets minimum requirements
    - Hash new password with bcrypt
    - Update user's password in database
    - Mark token as used
    - Return success message

    - _Requirements: 3.4, 3.5, 4.3, 5.4_

- [ ] 7. Update frontend forgot password modal
  - [x] 7.1 Implement forgot password form functionality

    - Connect "¿Olvidaste tu contraseña?" button to show modal
    - Add input validation for empty fields
    - Implement form submission to /api/forgot-password
    - Display success message after submission


    - Handle and display errors
    - _Requirements: 1.1, 1.2, 5.1, 5.5_

- [ ] 8. Create password reset page
  - [x] 8.1 Create reset password UI


    - Extract token from URL query parameter
    - Verify token on page load
    - Display reset form if token valid
    - Display error message if token invalid/expired
    - Add password and confirm password fields
    - Implement password visibility toggle
    - _Requirements: 3.1, 3.2, 3.3, 5.3_
  
  - [x] 8.2 Implement password reset form submission


    - Validate passwords match on client side
    - Submit to /api/reset-password endpoint
    - Display success message
    - Redirect to login page after 3 seconds
    - Handle and display errors
    - _Requirements: 3.4, 5.4, 5.5_

- [ ] 9. Write tests for password recovery system
  - [ ] 9.1 Write unit tests for token generation and validation
    - Test token uniqueness
    - Test expiration time calculation
    - Test token validation logic
    - _Requirements: 1.3, 3.1, 4.1_
  
  - [ ] 9.2 Write property test for input validation
    - **Property 1: Input validation consistency**
    - **Validates: Requirements 1.2**
    - Generate random strings (empty, whitespace, valid)
    - Verify validation behaves consistently
    - Use fast-check with 100+ iterations
  
  - [ ] 9.3 Write property test for token validation
    - **Property 2: Token validation correctness**
    - **Validates: Requirements 3.1**
    - Generate random tokens and timestamps
    - Verify validation logic correctness
    - Use fast-check with 100+ iterations
  
  - [ ] 9.4 Write property test for password matching
    - **Property 3: Password matching validation**
    - **Validates: Requirements 3.4**
    - Generate random password pairs
    - Verify matching logic
    - Use fast-check with 100+ iterations
  
  - [ ] 9.5 Write integration tests for full reset flow
    - Test complete flow: request → email → reset → login
    - Test expired token flow
    - Test multiple requests invalidating old tokens



    - Mock email service for testing
    - _Requirements: All_

- [ ] 10. Update documentation
  - Add Gmail app password setup instructions to README
  - Document environment variables needed
  - Add troubleshooting section for email issues
  - _Requirements: 6.1_

- [ ] 11. Test complete password recovery flow
  - Manually test with real Gmail account
  - Verify email delivery and formatting
  - Test on mobile devices
  - Verify all error messages are in Spanish
  - Test edge cases (expired tokens, invalid tokens, etc.)
  - _Requirements: All_
