# Password Reset - Frontend Integration & Testing Guide

**Date:** January 12, 2026  
**Status:** ✅ Complete and Ready for Testing

## Changes Made to Frontend

### 1. Updated Forgot Password Page
**File:** `src/views/pages/authentication/forgot-password.vue`

**Enhancements:**
- ✅ Added proper 429 (rate limiting) error handling with countdown timer
- ✅ Distinguished between inactive account (400) and validation errors (422)
- ✅ Improved error messages to match backend responses
- ✅ Form reset after successful submission
- ✅ Increased redirect delay to 5 seconds for better UX
- ✅ Better network error handling

### 2. Updated Reset Password Page
**File:** `src/views/pages/authentication/reset-password.vue`

**Enhancements:**
- ✅ Added password strength validator matching backend requirements
  - Minimum 8 characters
  - Must contain uppercase letter
  - Must contain lowercase letter
  - Must contain number
  - Must contain special character (@$!%*?&)
- ✅ Improved validation error display (joins multiple errors with periods)
- ✅ Better token expiration handling with automatic redirect
- ✅ Form fields cleared after successful submission for security
- ✅ Enhanced error messages
- ✅ Validation feedback before submission

### 3. Auth Service (No Changes Required)
**File:** `src/services/auth.service.js`

✅ Already correctly configured:
- `forgotPassword(email)` - POST to `/forgot-password`
- `resetPassword(resetData)` - POST to `/reset-password`

## Backend API Integration

### Request/Response Format

#### Forgot Password Endpoint
```http
POST /api/v1/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "We have emailed your password reset link!"
}
```

**Error Responses:**
- **400** - Inactive account: `{success: false, message: "Your account is not active..."}`
- **422** - Validation error: `{success: false, message: "...", errors: {email: [...]}}`
- **429** - Rate limit: `{success: false, message: "Too many password reset attempts. Please try again in 3600 seconds."}`

#### Reset Password Endpoint
```http
POST /api/v1/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "email": "user@example.com",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your password has been reset successfully!"
}
```

**Error Responses:**
- **400** - Invalid/expired token: `{success: false, message: "Invalid or expired reset token."}`
- **422** - Validation error: `{success: false, message: "...", errors: {password: [...]}}`

## Testing Instructions

### Prerequisites

1. **Start Backend Server:**
   ```bash
   cd d:\HR_management_system\3. Implementation\hrms-backend-api-v1
   php artisan serve
   ```
   Backend will run at: `http://localhost:8000`

2. **Start Frontend Server:**
   ```bash
   cd d:\HR_management_system\3. Implementation\hrms-frontend-dev
   npm run serve
   ```
   Frontend will run at: `http://localhost:8080`

3. **Create Test User (if not exists):**
   ```bash
   php artisan tinker
   ```
   ```php
   $user = new App\Models\User();
   $user->name = 'Test User';
   $user->email = 'test@example.com';
   $user->password = Hash::make('OldPassword123!');
   $user->status = 'active';
   $user->save();
   exit
   ```

### Test Case 1: Successful Password Reset Flow

**Step 1 - Request Password Reset:**
1. Navigate to: `http://localhost:8080/forgot-password`
2. Enter email: `test@example.com`
3. Click "Send Reset Link"

**Expected Result:**
- ✅ Success message: "We have emailed your password reset link!"
- ✅ Redirects to login page after 5 seconds
- ✅ Form is cleared
- ✅ Check `storage/logs/laravel.log` for email content

**Step 2 - Extract Reset Token:**
1. Open `storage/logs/laravel.log`
2. Find the most recent email log entry
3. Copy the reset URL, it will look like:
   ```
   http://localhost:8080/reset-password?token=abc123...&email=test@example.com
   ```
4. Copy the token value (64 characters)

**Step 3 - Reset Password:**
1. Click the reset link or manually navigate with token and email
2. Frontend should auto-populate email and token from URL
3. Enter new password: `NewPassword123!`
4. Confirm password: `NewPassword123!`
5. Click "Reset Password"

**Expected Result:**
- ✅ Success message: "Your password has been reset successfully! Redirecting to login..."
- ✅ Redirects to login page after 3 seconds
- ✅ Password fields are cleared
- ✅ All previous sessions are terminated

**Step 4 - Login with New Password:**
1. Navigate to: `http://localhost:8080/login`
2. Enter email: `test@example.com`
3. Enter password: `NewPassword123!`
4. Click "Login"

**Expected Result:**
- ✅ Successfully logged in
- ✅ Redirected to dashboard

---

### Test Case 2: Validation Errors

#### Test 2.1 - Invalid Email Format
1. Go to forgot-password page
2. Enter: `invalidemail`
3. Click submit

**Expected Result:**
- ❌ Validation error displayed
- Message: "Please enter a valid email address"

#### Test 2.2 - Non-existent Email
1. Go to forgot-password page
2. Enter: `nonexistent@example.com`
3. Click submit

**Expected Result:**
- ❌ Error message: "We could not find a user with that email address."

#### Test 2.3 - Weak Password
1. Get valid reset link
2. Enter password: `weak`
3. Try to submit

**Expected Result:**
- ❌ Validation error: "Password must be at least 8 characters"

#### Test 2.4 - Password Missing Requirements
1. Get valid reset link
2. Enter password: `password123` (no uppercase or special char)
3. Try to submit

**Expected Result:**
- ❌ Error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."

#### Test 2.5 - Password Mismatch
1. Get valid reset link
2. Enter password: `NewPassword123!`
3. Enter confirmation: `DifferentPassword123!`
4. Try to submit

**Expected Result:**
- ❌ Error: "Passwords must match"

---

### Test Case 3: Rate Limiting

**Test 3.1 - Forgot Password Rate Limit:**
1. Go to forgot-password page
2. Submit same email 4 times quickly
3. On 4th attempt, observe the response

**Expected Result:**
- ❌ Error: "Too many password reset attempts. Please try again in [X] seconds."
- ✅ Countdown timer appears showing remaining seconds
- ✅ Submit button disabled during countdown

**To Test Rate Limit Reset:**
```bash
# Clear rate limiter cache
php artisan cache:clear
```

---

### Test Case 4: Expired Token

**Test 4.1 - Manually Expire Token:**
1. Request password reset for test@example.com
2. In database, update the token's created_at:
   ```bash
   php artisan tinker
   ```
   ```php
   DB::table('password_reset_tokens')
     ->where('email', 'test@example.com')
     ->update(['created_at' => now()->subHours(2)]);
   exit
   ```
3. Try to use the reset link

**Expected Result:**
- ❌ Error: "Reset token has expired. Please request a new one."
- ✅ Redirects to forgot-password page after 5 seconds

---

### Test Case 5: Invalid Token

**Test 5.1 - Tampered Token:**
1. Get valid reset link
2. Manually modify the token in the URL (change a few characters)
3. Try to submit

**Expected Result:**
- ❌ Error: "Invalid reset token."

**Test 5.2 - Wrong Token Format:**
1. Navigate to: `http://localhost:8080/reset-password?token=short&email=test@example.com`

**Expected Result:**
- ❌ Error on page load: "Invalid reset token format. Please request a new password reset."
- ✅ Redirects to forgot-password page after 3 seconds

---

### Test Case 6: Inactive User Account

**Test 6.1 - Request Reset for Inactive Account:**
1. Create inactive user:
   ```bash
   php artisan tinker
   ```
   ```php
   $user = User::factory()->create([
     'email' => 'inactive@example.com',
     'status' => 'inactive'
   ]);
   exit
   ```
2. Try to request password reset for `inactive@example.com`

**Expected Result:**
- ❌ Error: "Your account is not active. Please contact the administrator."

---

### Test Case 7: Network Errors

**Test 7.1 - Backend Offline:**
1. Stop the Laravel backend server
2. Try to request password reset

**Expected Result:**
- ❌ Error: "Unable to connect to the server. Please check your internet connection and try again."
- No redirect or page freeze

---

### Test Case 8: Security Features

**Test 8.1 - Token Reuse Prevention:**
1. Get valid reset token
2. Use it to reset password successfully
3. Try to use the same token again

**Expected Result:**
- ❌ Error: "Invalid or expired reset token."
- Token should be deleted from database after successful reset

**Test 8.2 - Session Revocation:**
1. Login with old password and save token
2. Request and complete password reset
3. Try to use old auth token to access protected endpoint

**Expected Result:**
- ❌ Old token should be invalid
- Previous sessions terminated

**Test 8.3 - Multiple Requests Update Token:**
1. Request password reset for test@example.com
2. Request again for same email
3. Check database

**Expected Result:**
- ✅ Only one token exists for the email (latest one)
- Previous token was overwritten

---

### Test Case 9: Email Content Verification

**Check Email in Logs:**
```bash
tail -f storage/logs/laravel.log
```

**Expected Email Content:**
- Subject: "Reset Password Request"
- Body includes: "You are receiving this email because we received a password reset request"
- Button/Link with proper URL format
- Expiration notice: "This password reset link will expire in 60 minutes"
- Disclaimer: "If you did not request a password reset, no further action is required"

---

### Test Case 10: UI/UX Validation

**Frontend User Experience Checks:**

1. ✅ Loading spinner shows during API calls
2. ✅ Submit button disabled while loading
3. ✅ Submit button shows "Sending..." or "Resetting..." text
4. ✅ Success messages are green/positive
5. ✅ Error messages are red/negative
6. ✅ Messages can be dismissed
7. ✅ Form fields are responsive and styled correctly
8. ✅ Password visibility toggle works
9. ✅ Validation errors appear in real-time
10. ✅ Countdown timer for rate limiting is visible
11. ✅ Auto-redirect timers work correctly
12. ✅ Page remains usable during redirects

---

## Quick Testing Checklist

Use this checklist to verify all functionality:

- [ ] Forgot password form submits successfully
- [ ] Email is received/logged with reset link
- [ ] Reset link opens correct page with token and email
- [ ] Token format validation works on page load
- [ ] Password strength validation enforced
- [ ] Password confirmation matching works
- [ ] Successful password reset completes
- [ ] Can login with new password
- [ ] Old password no longer works
- [ ] Rate limiting prevents abuse (3 per hour)
- [ ] Expired tokens are rejected (> 60 minutes)
- [ ] Invalid tokens are rejected
- [ ] Inactive accounts cannot reset password
- [ ] Network errors handled gracefully
- [ ] All error messages are user-friendly
- [ ] UI feedback is clear and timely
- [ ] Redirects work as expected
- [ ] Security features work (token deletion, session revocation)

---

## Database Verification Queries

**Check Password Reset Tokens:**
```sql
SELECT * FROM password_reset_tokens;
```

**Check User Password Hash:**
```sql
SELECT id, email, password FROM users WHERE email = 'test@example.com';
```

**Check Personal Access Tokens (should be deleted after reset):**
```sql
SELECT * FROM personal_access_tokens WHERE tokenable_id = [user_id];
```

---

## Troubleshooting

### Issue: Email Not Received
**Solution:**
- Check `MAIL_MAILER=log` in .env
- Look in `storage/logs/laravel.log`
- For production, configure SMTP settings

### Issue: Token Invalid Immediately
**Solution:**
- Ensure token length is exactly 64 characters
- Check that token is URL-encoded in email
- Verify token hasn't been tampered with

### Issue: Rate Limiting Not Working
**Solution:**
```bash
php artisan cache:clear
php artisan config:clear
```

### Issue: Password Validation Too Strict
**Solution:**
- Backend requires: uppercase, lowercase, number, special character
- Frontend now matches these requirements
- Use password like: `SecurePass123!`

### Issue: Frontend Not Connecting to Backend
**Solution:**
- Verify `VUE_APP_API_BASE_URL` in frontend .env
- Check CORS configuration in backend
- Ensure both servers are running

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Update `APP_FRONTEND_URL` in backend .env to production URL
- [ ] Configure proper SMTP settings (not log driver)
- [ ] Set up queue workers for async email sending
- [ ] Enable rate limiting monitoring
- [ ] Schedule token cleanup: `php artisan auth:clean-resets`
- [ ] Test email delivery with real email service
- [ ] Verify SSL certificates for secure URLs
- [ ] Update CORS allowed origins
- [ ] Test all edge cases in production environment
- [ ] Monitor logs for errors
- [ ] Set up alerts for failed password resets

---

## API Documentation

OpenAPI documentation available at:
```
http://localhost:8000/api/documentation
```

Generate/update docs:
```bash
php artisan l5-swagger:generate
```

---

## Support

For issues or questions:
1. Check `storage/logs/laravel.log` for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure database migrations are up to date: `php artisan migrate:status`

---

**Implementation Complete!** ✅

The password reset functionality is now fully integrated between frontend and backend with comprehensive error handling, security features, and user-friendly feedback.
