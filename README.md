# EasySave 

## Overview

EasySave is a web-based key-value database management application that provides a user-friendly interface for managing data blocks. The frontend is built with vanilla JavaScript, HTML, and CSS, offering authentication, user registration, and a dynamic database management interface.

## Project Structure

```
EasySaveFrontend/
├── login.html          # Login page
├── login.js            # Login page logic and animations
├── login.css           # Login page styling
├── register.html       # User registration page
├── register.js         # Registration page logic and animations
├── register.css        # Registration page styling
├── main.html           # Main database management interface
├── main.js             # Database management logic
├── main.css            # Main page styling
└── .gitignore          # Git ignore file
```

## Features

### Authentication System
- **User Login**: Secure authentication with username and password
- **User Registration**: New user account creation with email verification
- **Session Management**: Cookie-based authentication with 7-day expiration
- **Auto-redirect**: Automatic navigation based on authentication state

### Database Management
- **View Data Blocks**: Display all key-value pairs in a tabular format
- **Create Blocks**: Add new data blocks with custom identifiers and values
- **Update Blocks**: Edit existing block values with real-time feedback
- **Delete Blocks**: Remove data blocks with visual confirmation
- **Auto-resize Text Areas**: Dynamic height adjustment for long values
- **Refresh Data**: Manual refresh functionality with visual feedback

### UI/UX Features
- **Interactive Animations**: Mouse-tracking login/register boxes with smooth transforms
- **Pulsing Effects**: Visual feedback on hover and action states
- **Loading Indicators**: Spinner animations during API requests
- **Success/Error Feedback**: Color-coded visual feedback for operations
- **Responsive Design**: Viewport-based units for different screen sizes

## Setup and Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for serving static files)
- Backend API server running at `http://63.179.18.244/api/`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DavComo/EasySaveFrontend.git
cd EasySaveFrontend
```

2. Serve the files using any static file server:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000/login.html
```

## Usage

### First Time User

1. Navigate to the registration page (`register.html`)
2. Enter username, email, and password
3. Submit the form to create an account
4. You'll be redirected to the login page

### Logging In

1. Navigate to the login page (`login.html`)
2. Enter your username and password
3. Upon successful authentication, you'll be redirected to the main interface
4. Your session will remain active for 7 days

### Managing Data

**Viewing Data:**
- All your data blocks are displayed in a table format
- The identifier column shows the block name
- The value column shows the block content

**Creating New Blocks:**
1. Click the "+" icon at the bottom of the table
2. Enter an identifier in the first field
3. Enter a value in the second field
4. Click the save icon to create the block

**Updating Blocks:**
1. Edit the value in any existing row
2. Click the save icon (floppy disk) to save changes
3. Visual feedback will indicate success (green) or failure (red)

**Deleting Blocks:**
1. Click the trash icon next to any block
2. The block will be removed after confirmation from the server

**Refreshing Data:**
- Click the refresh icon in the header to reload all data from the server

**Logging Out:**
- Click the logout icon in the header to clear your session and return to the login page

## API Integration

The frontend communicates with a backend API hosted at `http://63.179.18.244/api/`. The following endpoints are used:

### Authentication Endpoints

**Login**
- **Method**: GET
- **Endpoint**: `/api/login`
- **Parameters**: `username`, `password`
- **Response**: `{ accessKey: string }`

**Create User**
- **Method**: POST
- **Endpoint**: `/api/create_user`
- **Parameters**: `username`, `password`, `email`
- **Response**: Success/error status

### Data Management Endpoints

**Get Blocks**
- **Method**: GET
- **Endpoint**: `/api/get_blocks`
- **Parameters**: `extendedIdentifier` (empty string for all blocks)
- **Headers**: `RequesterUsername`, `RequesterAccessKey`
- **Response**: `{ blockList: [{ identifier: string, value: string }] }`

**Create Block**
- **Method**: POST
- **Endpoint**: `/api/create_block`
- **Parameters**: `extendedIdentifier`, `value`
- **Headers**: `RequesterUsername`, `RequesterAccessKey`
- **Response**: Success/error status

**Update Block**
- **Method**: PATCH
- **Endpoint**: `/api/update_block`
- **Parameters**: `extendedIdentifier`, `value`
- **Headers**: `RequesterUsername`, `RequesterAccessKey`
- **Response**: Success/error status

**Delete Block**
- **Method**: POST
- **Endpoint**: `/api/delete_block`
- **Parameters**: `extendedIdentifier`
- **Headers**: `RequesterUsername`, `RequesterAccessKey`
- **Response**: Success/error status

## Architecture

### Authentication Flow

```
User → Login Page → API Authentication → Store Cookies → Redirect to Main Page
                           ↓
                     Invalid Credentials
                           ↓
                    Show Error Message
```

### Data Management Flow

```
Main Page Load → Check Authentication → Fetch Data Blocks → Render Table
     ↓                    ↓
   Valid            Invalid → Redirect to Login
     ↓
User Action (Create/Update/Delete) → API Request → Update UI
```

### Cookie Management

The application uses browser cookies for session management:
- **username**: Stores the authenticated username
- **auth**: Stores the access key token
- **Expiration**: 7 days from login
- **Path**: Root (/)
- **SameSite**: Lax


![Uploading 2026-01-07.png…]()




## File Documentation

### HTML Files

#### login.html
Login page markup with form inputs for username and password. Includes animated background and responsive design.

#### register.html
Registration page markup with form inputs for username, email, and password. Similar visual design to login page.

#### main.html
Main application interface with header (username display, refresh, logout buttons) and dynamic table for data block management. Includes HTML templates for new rows and table headers.

### JavaScript Files

#### login.js
Handles login form submission, cookie management, and interactive box animation that follows mouse movement. Implements smooth transitions and visual effects.

#### register.js
Manages user registration form submission and provides the same interactive animation effects as the login page.

#### main.js
Core application logic including:
- Authentication verification
- Data fetching and rendering
- CRUD operations for data blocks
- Dynamic UI updates
- Event handling for user interactions
- API communication layer

### CSS Files

#### login.css
Styles for the login page including:
- Centered login box with coral background
- Pulsing animation effects
- Blurred backdrop with yellow sphere image
- Responsive design with viewport units
- Custom input styling

#### register.css
Identical styling to login.css but applied to the registration box. Maintains consistent visual identity across authentication pages.

#### main.css
Styles for the main application interface including:
- Full-viewport layout with coral-colored container
- Header with username display and action icons
- Table styling with custom borders and spacing
- Auto-resizing text areas
- Icon animations (spin, pulse)
- Responsive design

## Browser Compatibility

Tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### External Resources
- **Font Awesome 6.x**: Icon library for UI elements (loaded from CDN)
  - Used for: save icons, delete icons, refresh icons, logout icons, plus icons

### No Build Tools Required
This project uses vanilla JavaScript with no build process or package managers required.

## Development

### Code Style
- ES6+ JavaScript syntax
- Functional and event-driven programming patterns
- Inline event handlers and dynamic DOM manipulation
- CSS with custom animations and transforms

### Best Practices
- Separation of concerns (HTML structure, CSS styling, JS logic)
- Reusable functions for common operations
- Visual feedback for all user actions
- Error handling for API requests
- Secure cookie management

## Maintenance Guide

### Adding New Features

**To add a new data block operation:**
1. Create a new function in `main.js` following the pattern of `saveValue()` or `deleteBlock()`
2. Add UI elements in `main.html` for triggering the operation
3. Add corresponding styles in `main.css` for visual consistency
4. Ensure proper error handling and user feedback

**To modify the API endpoint:**
1. Update the base URL in the `sendRequest()` function in `main.js`
2. Update the corresponding endpoint in `login.js` and `register.js` if needed

### Troubleshooting

**Issue: User not redirected after login**
- Check browser console for cookie errors
- Verify API returns accessKey in response
- Ensure cookies are not blocked by browser settings

**Issue: Data blocks not loading**
- Verify authentication cookies are present
- Check network tab for API request/response
- Ensure backend server is running and accessible

**Issue: Animations not working**
- Verify Font Awesome is loading correctly
- Check browser console for JavaScript errors
- Clear browser cache and reload

## Security Considerations

### Current Implementation
- Authentication via access key tokens
- Session timeout after 7 days
- Username and access key sent in request headers

### Recommendations for Production
- Implement HTTPS for all communications
- Add CSRF token protection
- Implement rate limiting on login attempts
- Use HttpOnly and Secure flags for cookies
- Add input validation and sanitization
- Implement proper error messages (avoid revealing system details)
- Consider implementing refresh tokens for extended sessions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the EasySave application suite. Please refer to the main project repository for licensing information.

## Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

## Version History

- **Current**: Initial documentation release
- Features: Login, Registration, CRUD operations for data blocks
- UI: Interactive animations, responsive design, visual feedback

## Future Enhancements

- Search and filter functionality for data blocks
- Bulk operations (export, import, mass delete)
- Dark mode toggle
- Advanced text editor for values (syntax highlighting, markdown support)
- Real-time collaboration features
- Mobile-optimized responsive design
- Accessibility improvements (ARIA labels, keyboard navigation)
- Offline mode with local storage

