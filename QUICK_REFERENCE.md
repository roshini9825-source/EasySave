# EasySave Frontend - Quick Reference Guide

## Overview
This guide provides quick access to essential information for maintaining the EasySave frontend application.

## 📁 Project Structure

```
EasySaveFrontend/
├── README.md              # Main documentation - START HERE
├── DOCUMENTATION.md       # Detailed code documentation
├── API.md                # API endpoint reference
├── QUICK_REFERENCE.md    # This file
│
├── login.html            # Login page
├── login.js              # Login logic (142 lines)
├── login.css             # Login styling (103 lines)
│
├── register.html         # Registration page
├── register.js           # Registration logic (120 lines)
├── register.css          # Registration styling (100 lines)
│
├── main.html             # Main application page
├── main.js               # Database management logic (462 lines)
└── main.css              # Main page styling (209 lines)
```

## 🔑 Key Concepts

### Authentication Flow
1. User logs in → Credentials sent to API
2. API returns access key
3. Access key + username stored in cookies (7 days)
4. All data requests include credentials in headers

### Data Block Structure
- **Full Identifier**: `system.username.user_defined_name`
- **Display Identifier**: `user_defined_name` (trimmed for UI)
- **Value**: Any text content (can be multiline)

## 🛠️ Common Maintenance Tasks

### Changing the API Endpoint

**Location**: `main.js`, `login.js`, `register.js`

```javascript
// Current
var fullUrl = "http://63.179.18.244/api/" + endpoint;

// To change
var fullUrl = "https://your-new-api.com/api/" + endpoint;
```

### Modifying Cookie Expiration

**Location**: `login.js` (lines ~97-108)

```javascript
// Current: 7 days
"Max-Age=" + (60 * 60 * 24 * 7)

// Example: 30 days
"Max-Age=" + (60 * 60 * 24 * 30)
```

### Adding New Form Fields

1. Add HTML input in the corresponding `.html` file
2. Update form data collection in the `.js` file
3. Add API parameter in the request
4. Update CSS for consistent styling

### Adjusting Animation Speed

**Location**: `login.js` or `register.js`

```javascript
// Current smooth factor (lower = smoother/slower)
state.tx = lerp(state.tx, state.targetX, 0.15);

// Faster animation
state.tx = lerp(state.tx, state.targetX, 0.25);

// Slower animation
state.tx = lerp(state.tx, state.targetX, 0.05);
```

## 📋 Key Functions Reference

### main.js Functions

| Function | Purpose | Parameters |
|----------|---------|------------|
| `getCookie(cname)` | Retrieve cookie value | Cookie name |
| `sendRequest(method, endpoint, data, callback)` | Make API request | Method, endpoint, data object, callback |
| `refreshTable()` | Fetch and render all data blocks | None |
| `saveValue(target, identifier, value)` | Update existing block | Icon element, identifier, new value |
| `deleteBlock(target, identifier)` | Delete block from server | Icon element, identifier |
| `createNewValue(target, identifier, value, e)` | Create new block | Icon element, identifier, value, event handler |
| `sleep(ms)` | Async delay | Milliseconds |

### login.js & register.js Functions

| Function | Purpose | Parameters |
|----------|---------|------------|
| `getCookie(cname)` | Retrieve cookie value | Cookie name |
| `lerp(a, b, t)` | Linear interpolation | Start value, end value, factor |
| `updateTarget()` | Calculate box target position | None |
| `animate()` | Animation loop (60fps) | None |

## 🎨 CSS Class Reference

### Important Classes

| Class | Purpose | File |
|-------|---------|------|
| `.login-box` | Login form container | login.css |
| `.register-box` | Registration form container | register.css |
| `.main` | Main application container | main.css |
| `.header` | Top bar with username/icons | main.css |
| `.main-table` | Data blocks table | main.css |
| `.backdrop` | Blurred background image | All CSS files |
| `.spin` | Rotation animation | main.css |
| `.pulse` | Scale pulsing animation | main.css |

## 🔍 Debugging Tips

### Check Authentication
```javascript
// In browser console
console.log(document.cookie);
// Should show: username=...; auth=...
```

### Test API Manually
```bash
# Login
curl -X GET "http://63.179.18.244/api/login?username=test&password=test"

# Get blocks
curl -X GET "http://63.179.18.244/api/get_blocks?extendedIdentifier=" \
  -H "RequesterUsername: test" \
  -H "RequesterAccessKey: your_key"
```

### Common Console Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'value' of undefined` | Element not found in DOM | Check element IDs match HTML |
| `Request failed: 401` | Invalid credentials | Check cookies are set correctly |
| `Request failed: 0` | Network/CORS error | Check API server is running |

## 📊 Data Flow Diagrams

### Login Flow
```
User Input → Form Submit → API Request → Store Cookies → Redirect to /main
                                ↓
                          Error → Alert User
```

### Data Creation Flow
```
Click "+" → Create Empty Row → Fill Fields → Click Save
                                               ↓
                                    Validate Identifier
                                               ↓
                                         API Request
                                               ↓
                                  Success: Convert to Permanent Row
                                  Error: Show Red Feedback
```

### Data Update Flow
```
Edit Value → Click Save → API Request → Success: Green Icon
                                      → Error: Red Icon
```

## 🔒 Security Checklist

- [ ] Use HTTPS for production
- [ ] Enable HttpOnly flag on cookies
- [ ] Enable Secure flag on cookies
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Validate all inputs server-side
- [ ] Sanitize user-generated content
- [ ] Use POST for login (not GET)
- [ ] Implement session timeout
- [ ] Add logging for security events

## 🐛 Known Issues & Workarounds

### Issue: Login box hover effect conflicts with animation
**File**: `login.css`, `register.css`
**Line**: `.login-box:hover { transform: rotateY(180deg); }`
**Workaround**: Remove or modify hover effect
**Permanent Fix**: Use different animation or disable one of them

### Issue: Empty identifier validation timing
**File**: `main.js` - `createNewValue()`
**Description**: Red border shows for 1 second even if user starts typing
**Workaround**: None currently
**Permanent Fix**: Add input listener to immediately clear red border

### Issue: Email validation missing
**File**: `register.html`
**Line**: `<input type="text" id="email" ...>`
**Workaround**: Change to `type="email"`
**Permanent Fix**: Add client-side validation function

## 📦 Dependencies

### External Resources
- **Font Awesome 6.x**: https://kit.fontawesome.com/da43a858c5.js
- **Background Image**: https://static.vecteezy.com/system/resources/thumbnails/059/607/113/small_2x/yellow-spheres-composition-on-black-backdrop-cut-out-transparent-png.png

### Browser APIs Used
- XMLHttpRequest (for API calls)
- Document Cookies (for authentication)
- requestAnimationFrame (for animations)
- localStorage (not used currently, but available)

## 🚀 Performance Tips

### Optimize Animation
```javascript
// Add this to stop animation when tab is inactive
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animation
    } else {
        // Resume animation
    }
});
```

### Reduce Table Redraws
- Current: Clears entire table on refresh
- Optimization: Compare existing vs new data, only update differences
- Implementation: Store blocks array and diff against new data

### Lazy Load Background Image
```css
.backdrop {
    background-image: url("...");
    /* Add */
    loading: lazy;
}
```

## 📞 Getting Help

1. **Check this guide** for common tasks
2. **Read README.md** for overview and setup
3. **Read DOCUMENTATION.md** for detailed code explanations
4. **Read API.md** for API endpoint details
5. **Check browser console** for JavaScript errors
6. **Check network tab** for API request/response details
7. **Open GitHub issue** for bugs or questions

## 🔗 Quick Links

- [Main Documentation](README.md)
- [Code Documentation](DOCUMENTATION.md)
- [API Documentation](API.md)
- [GitHub Repository](https://github.com/DavComo/EasySaveFrontend)

## 📝 Change Log Location

Track changes in git history:
```bash
git log --oneline --graph --all
git log -- <filename>  # Changes to specific file
```

## 🎯 Quick Commands

```bash
# Start local server
python -m http.server 8000

# View file in browser
http://localhost:8000/login.html

# Check git status
git status

# View recent changes
git diff

# Search for text in files
grep -r "searchterm" *.js
```

## 📋 File Size Reference

- **Total JS**: ~29KB (main.js: 18KB, login.js: 5.5KB, register.js: 4.9KB)
- **Total CSS**: ~8KB (main.css: 3.5KB, login.css: 2.2KB, register.css: 2.2KB)
- **Total HTML**: ~3KB (main.html: 1.2KB, login.html: 0.8KB, register.html: 1KB)
- **Total Docs**: ~67KB (README: 11.5KB, DOCUMENTATION: 36.5KB, API: 19KB)

---

**Last Updated**: 2025-10-14  
**Version**: 1.0  
**Maintainer**: See repository contributors
