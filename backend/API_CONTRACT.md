# 📘 Notice Board Portal – API Contract

**Base URL:** `/api/v1`

All API responses follow this format:

```json
{
  "success": true | false,
  "message": "string",
  "data": object | null
}
```

---

## 🔐 Authentication

### Student Login

**POST** `/auth/student/login`

**Request Body:**

```json
{
  "roll_no": "12411025",
  "password": "your_password"
}
```

**Success Response:**

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "accessToken": "JWT_TOKEN",
        "role": "STUDENT"
    }
}
```

---

### Professor Login

**POST** `/auth/professor/login`

**Request Body:**

```json
{
  "email": "prof@iiitsonepat.ac.in",
  "password": "your_password"
}
```

**Success Response:**

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "accessToken": "JWT_TOKEN"
    }
}
```

---

### Logout

**POST** `/auth/logout`
<!-- 
**Headers:**

```
Authorization: Bearer <accessToken>
``` -->

**Response:**

```json
{
    "success": true,
    "message": "Logged out successfully",
    "data": null
}
```

---

## 🔑 Password Reset

### Forgot Password (Send OTP)

**POST** `/auth/forgot-password`

**Request Body (Student):**

```json
{
  "role": "STUDENT",
  "roll_no": "12411025"
}
```

**Request Body (Professor):**

```json
{
  "role": "PROFESSOR",
  "email": "prof@iiitsonepat.ac.in"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Verification code sent to registered email",
    "data": null
}
```

---

### Reset Password

**PATCH** `/auth/reset-password`

**Request Body (Student):**

```json
{
  "role": "STUDENT",
  "roll_no": "12411025",
  "otp": "123456",
  "new_password": "NewPassword123"
}
```

**Request Body (Professor):**

```json
{
  "role": "PROFESSOR",
  "email": "prof@iiitsonepat.ac.in",
  "otp": "123456",
  "new_password": "NewPassword123"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Password reset successfully",
    "data": null
}
```

---

## 👤 Guest Access

- No login required
- Can view public notices only

---

## 🔒 Authorization Rules

| Role      | Access Level          |
|-----------|-----------------------|
| GUEST     | View public notices   |
| STUDENT   | View notices          |
| PROFESSOR | View + Create notices |


---

## 🔁 Token Usage

- Store `accessToken` on frontend
- Send with protected requests:

```
Authorization: Bearer <accessToken>
```

- Refresh token is handled via HttpOnly cookies

---

## ❌ Error Response Example

```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

---

**Next Steps:**
- Add Notice APIs
- Generate Postman collection
- Add profile/settings endpoints