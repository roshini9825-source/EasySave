# EasySave 

![ImageAlt](https://github.com/roshini9825-source/EasySave/blob/c98602cb96e229390618cf49c1272ce6eb72a784/screenshot.png)



## Overview

EasySave is a web-based key-value database management application that provides a user-friendly interface for managing data blocks. The frontend is built with vanilla JavaScript, HTML, and CSS, offering authentication, user registration, and a dynamic database management interface.

## Project Structure

```
EasySave/
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







