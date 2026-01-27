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















# Frontend-Backend Integration Guide

## Overview
This guide explains the changes made to integrate your frontend with the existing backend API without modifying the backend code.

---

## Key Changes Made

### 1. NoticeBoard.jsx

#### API Integration
- **Fetches notices from:** `GET /api/v1/noticeboard/notices`
- **Fetches notice details from:** `GET /api/v1/noticeboard/notices/:id`

#### Backend Response Mapping
```javascript
// Backend returns:
{
  data: {
    items: [
      {
        id: number,
        title: string,
        created_at: timestamp,
        category: string  // from notice_categories table
      }
    ],
    pagination: {
      page: number,
      limit: number,
      totalItems: number,
      totalPages: number
    }
  }
}

// Full notice details:
{
  data: {
    id: number,
    title: string,
    content: string,
    is_public: boolean,
    created_at: timestamp,
    category: string,
    posted_by: string,  // professor email
    files: [
      {
        file_url: string,
        original_name: string
      }
    ]
  }
}
```

#### New Features
1. **Server-side filtering** - Search, date range, and category filters
2. **Pagination** - Navigate through pages of notices
3. **Click to view details** - Fetches full notice content with attachments
4. **Loading states** - Shows loading indicator while fetching
5. **Error handling** - Graceful error messages

#### Local Features Preserved
- Bookmarking (stored in localStorage)
- Bookmark filtering

---

### 2. PostNotice.jsx

#### API Integration
- **Posts to:** `POST /api/v1/noticeboard/notices`
- **Method:** multipart/form-data
- **Authentication:** Requires Professor role

#### Form Data Mapping
```javascript
// Frontend form -> Backend expected fields
{
  title: string,           // ✓ Maps directly
  categoryId: number,      // ✓ Maps to notice_category_id
  content: string,         // ✓ Maps directly
  is_public: boolean,      // ✓ Maps directly
  files: File[]            // ✓ Maps to files[] array (max 5)
}
```

#### New Features
1. **Validation** - Client-side validation before submission
2. **File upload validation** - Enforces 5-file limit
3. **Loading states** - Disables form during submission
4. **Error handling** - Shows specific error messages
5. **Cancel confirmation** - Prevents accidental data loss

---

## Important Notes

### Category ID Mapping
The backend expects `categoryId` (numeric ID), but your frontend uses category names. You have two options:

#### Option 1: Hardcode Category IDs (Current Implementation)
```javascript
const categoryOptions = [
  { id: 1, name: "Examination Cell" },
  { id: 2, name: "Training & Placement Cell" },
  // ... etc
];
```

**Important:** Make sure these IDs match your `notice_categories` table in the database!

#### Option 2: Fetch Categories from Backend (Recommended)
Add this endpoint to your backend:
```javascript
// In your routes
router.get("/categories", getCategories);

// In your controller
export const getCategories = asyncHandler(async (req, res) => {
  const [categories] = await pool.query(
    `SELECT id, name FROM notice_categories ORDER BY name`
  );
  return res.json(new ApiResponse(categories));
});
```

Then fetch in frontend:
```javascript
useEffect(() => {
  const fetchCategories = async () => {
    const response = await axios.get("/api/v1/noticeboard/categories");
    setCategories(response.data.data);
  };
  fetchCategories();
}, []);
```

---

## Authentication Requirements

### Protected Routes
These routes require authentication and Professor role:
- `POST /api/v1/noticeboard/notices` - Create notice
- `PATCH /api/v1/noticeboard/notices/:id` - Update notice
- `DELETE /api/v1/noticeboard/notices/:id` - Delete notice
- `GET /api/v1/noticeboard/my` - Get my notices

### Optional Auth Routes
These routes work for both authenticated and unauthenticated users:
- `GET /api/v1/noticeboard/notices` - List notices
- `GET /api/v1/noticeboard/notices/:id` - Get notice details

**Note:** Non-authenticated users can only see public notices (`is_public = TRUE`)

---

## Testing Checklist

### NoticeBoard.jsx
- [ ] Page loads and displays notices
- [ ] Search filters work (searches in title)
- [ ] Date filter works (filters by created_at)
- [ ] Category filter works
- [ ] Pagination works
- [ ] Clicking a notice shows full details
- [ ] Notice modal shows content and attachments
- [ ] Bookmark toggle works
- [ ] Bookmark filter shows only bookmarked notices
- [ ] Loading states display correctly
- [ ] Empty states display correctly

### PostNotice.jsx
- [ ] Form loads correctly
- [ ] All fields are editable
- [ ] Category dropdown shows all options
- [ ] File upload accepts multiple files
- [ ] File upload rejects more than 5 files
- [ ] Form validation works (required fields)
- [ ] Submit button shows loading state
- [ ] Success redirects to notice board
- [ ] Error messages display correctly
- [ ] Cancel button works with confirmation

---

## Common Issues & Solutions

### Issue: "Notice not found" or 404 errors
**Solution:** Check that:
1. Notice exists and is not deleted (`is_deleted = FALSE`)
2. User is authenticated if notice is private
3. Correct API base URL is configured in axios instance

### Issue: "You can only edit your own notices"
**Solution:** Ensure the logged-in user's ID matches `posted_by` in the notice

### Issue: File uploads not working
**Solution:** Check:
1. `upload.array("files", 5)` middleware is configured
2. Content-Type is `multipart/form-data`
3. File size limits in your server configuration
4. Files are appended correctly to FormData

### Issue: Categories not loading
**Solution:** 
1. Verify category IDs match your database
2. Or implement the category fetch endpoint (see above)

### Issue: Search/filters not working
**Solution:**
1. Check query parameters are being sent correctly
2. Verify backend SQL WHERE clause handles these params
3. Check for SQL injection protection (parameterized queries)

---

## Optional Enhancements

### 1. Add "My Notices" View
Show notices created by the logged-in professor:
```javascript
const fetchMyNotices = async () => {
  const response = await axios.get("/api/v1/noticeboard/my");
  setNotices(response.data.data);
};
```

### 2. Add Edit/Delete Functionality
For notice owners:
```javascript
const deleteNotice = async (id) => {
  if (!confirm("Delete this notice?")) return;
  
  await axios.delete(`/api/v1/noticeboard/notices/${id}`);
  fetchNotices(); // Refresh list
};

const editNotice = async (id, updates) => {
  await axios.patch(`/api/v1/noticeboard/notices/${id}`, updates);
  fetchNotices();
};
```

### 3. Add Advanced Filters
- Filter by date range (from/to)
- Filter by posted_by (professor)
- Filter by public/private status

### 4. Implement Infinite Scroll
Replace pagination buttons with infinite scroll:
```javascript
const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  if (bottom && !loading && pagination.page < pagination.totalPages) {
    fetchNotices(pagination.page + 1, true); // append=true
  }
};
```

---

## File Structure
```
src/
├── pages/
│   ├── NoticeBoard.jsx    (Updated - fetches from API)
│   └── PostNotice.jsx     (Updated - posts to API)
├── components/
│   ├── HomeNav.jsx        (No changes needed)
│   └── NoticeSidebar.jsx  (No changes needed)
└── redux/
    └── axios.js           (Make sure this has correct baseURL)
```

---

## Environment Setup

Ensure your axios instance is configured correctly:

```javascript
// src/redux/axios.js (or wherever your axios instance is)
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
```

---

## Security Considerations

1. **Authentication** - Always use `withCredentials: true` for cookies/sessions
2. **CORS** - Ensure backend allows your frontend origin
3. **File uploads** - Backend should validate file types and sizes
4. **SQL injection** - Backend uses parameterized queries (✓ already implemented)
5. **XSS protection** - React escapes HTML by default (✓)

---

## Next Steps

1. **Test the integration** - Use the testing checklist above
2. **Verify category IDs** - Match them with your database
3. **Add error boundaries** - For better error handling
4. **Implement edit/delete** - If needed for professors
5. **Add loading skeletons** - For better UX
6. **Optimize re-renders** - Use React.memo, useMemo, useCallback
7. **Add toast notifications** - Instead of alerts

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check network tab for API responses
3. Verify backend logs
4. Ensure database schema matches expectations
5. Test API endpoints directly (Postman/Insomnia)