# Jiya_Gudhaka_VenueBooking
# Mini Venue Booking Dashboard

A full-stack MERN application for venue booking management, built for venue owners and customers.

##  Features

### Core Features
- **Venue Management**: Add, view, update, and delete venues
- **Booking System**: Users can browse and book available venues
- **Availability Management**: Venue owners can block/unblock specific dates
- **Admin Dashboard**: Comprehensive management interface for venue owners
- **Real-time Availability**: Automatic updates when venues are booked
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Roles
- **Customers**: Browse venues, view details, make bookings
- **Admin/Venue Owners**: Manage venues, view bookings, control availability

##  Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **RESTful API** architecture
- **CORS** enabled for cross-origin requests

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **CSS3** with responsive design
- **Fetch API** for HTTP requests

### Database Schema
- **Venues**: Store venue information, amenities, pricing, and availability
- **Bookings**: Track customer bookings with status management
- **Availability**: Date-based blocking system for venue management

##  Project Structure

\`\`\`
venue-booking-dashboard/
├── backend/
│   ├── models/
│   │   ├── Venue.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── venues.js
│   │   └── bookings.js
│   ├── config/
│   │   └── database.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── VenueList.js
    │   │   ├── VenueDetails.js
    │   │   ├── BookingForm.js
    │   │   ├── AdminDashboard.js
    │   │   ├── VenueForm.js
    │   │   ├── VenueManagement.js
    │   │   └── BookingsList.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
\`\`\`

##  Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a \`.env\` file in the backend directory:
   \`\`\`env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/venue-booking
   \`\`\`

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Seed the database (optional)**
   \`\`\`bash
   npm run seed
   \`\`\`

6. **Start the backend server**
   \`\`\`bash
   npm run dev
   \`\`\`

   The backend will run on \`http://localhost:5000\`

### Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the frontend development server**
   \`\`\`bash
   npm start
   \`\`\`

   The frontend will run on \`http://localhost:3000\`

## API Documentation

### Venues API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/venues\` | Get all venues |
| GET | \`/api/venues/:id\` | Get venue by ID |
| POST | \`/api/venues\` | Create new venue |
| PUT | \`/api/venues/:id\` | Update venue |
| DELETE | \`/api/venues/:id\` | Delete venue |
| POST | \`/api/venues/:id/block-dates\` | Block dates for venue |
| DELETE | \`/api/venues/:id/unblock-dates\` | Unblock dates for venue |
| GET | \`/api/venues/:id/availability\` | Check venue availability |

### Bookings API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/bookings\` | Get all bookings |
| GET | \`/api/bookings/:id\` | Get booking by ID |
| POST | \`/api/bookings\` | Create new booking |
| PUT | \`/api/bookings/:id\` | Update booking |
| DELETE | \`/api/bookings/:id\` | Cancel booking |

##  Usage

### For Customers
1. **Browse Venues**: View all available venues with filtering options
2. **View Details**: Click on any venue to see detailed information
3. **Make Booking**: Fill out the booking form with event details
4. **Confirmation**: Receive booking confirmation with details

### For Admin/Venue Owners
1. **Switch to Admin Mode**: Click the role toggle in the navigation
2. **Dashboard Overview**: View statistics and recent bookings
3. **Manage Venues**: Add new venues or edit existing ones
4. **Control Availability**: Block/unblock specific dates
5. **View Bookings**: Monitor all bookings with status management

## Advanced Features - Future Enhancements

### 1. Capturing User Search Activity

**Approach**: Implement comprehensive analytics to track user behavior and search patterns.

**Technical Implementation**:
- **Event Tracking**: Use analytics libraries (Google Analytics, Mixpanel) to track search queries, filters used, and venue views
- **Database Logging**: Store search queries with timestamps, user sessions, and result interactions
- **Search Analytics Schema**:
 javascript
  {
    sessionId: String,
    searchQuery: String,
    filters: Object,
    resultsCount: Number,
    clickedVenues: [ObjectId],
    timestamp: Date,
    userAgent: String,
    location: Object
  }
  \`\`\`

**Benefits**:
- Understand popular search terms and venue preferences
- Optimize venue listings based on user behavior
- Improve search algorithm and recommendations
- Identify market trends and demand patterns

### 2. Admin Analytics Dashboard

**Approach**: Create a comprehensive analytics dashboard for business intelligence.

**Key Metrics to Track**:
- **Revenue Analytics**: Daily/monthly/yearly revenue trends
- **Booking Patterns**: Peak booking times, seasonal trends
- **Venue Performance**: Most popular venues, occupancy rates
- **Customer Insights**: Repeat customers, booking lead times
- **Geographic Data**: Booking locations, venue popularity by area

Technical Implementation:
- Data Aggregation: MongoDB aggregation pipelines for complex queries
- Visualization: Chart.js or D3.js for interactive charts
- Real-time Updates: WebSocket connections for live data
- Export Features: PDF/Excel reports for stakeholders

Dashboard Components:
- Revenue charts with time-based filtering
- Venue performance comparison tables
- Customer behavior heatmaps
- Booking conversion funnel analysis
- Predictive analytics for demand forecasting

 3. Calendar View for Venue Availability

Approach: Implement an interactive calendar interface for better availability management.

Technical Implementation:
- Calendar Library: FullCalendar.js or React Big Calendar
- Color Coding: 
  - Green: Available dates
  - Red: Booked dates
  - Orange: Blocked by admin
  - Blue: Pending bookings
- Interactive Features:
  - Click to book available dates
  - Drag and drop for multi-day events
  - Bulk date selection for blocking
  - Tooltip information on hover

Advanced Features:
- **Recurring Bookings**: Support for weekly/monthly recurring events
- **Availability Rules**: Set different pricing for peak/off-peak periods
- **Conflict Resolution**: Automatic handling of booking conflicts
- **Integration**: Sync with external calendar systems (Google Calendar, Outlook)

4. Basic Authentication for Admin and Venue Owners

Approach: Implement secure authentication with role-based access control.

Technical Implementation:

Authentication Strategy:
- JWT Tokens: Secure token-based authentication
- Password Hashing: bcrypt for secure password storage
- Session Management: Refresh token rotation for security

User Schema Enhancement:
javascript
{
  email: String,
  password: String, // hashed
  role: ['customer', 'venue_owner', 'admin'],
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    company: String
  },
  venues: [ObjectId], // for venue owners
  permissions: [String],
  lastLogin: Date,
  isActive: Boolean
}


Security Features:
- Multi-factor Authentication: SMS/Email verification
- Rate Limiting: Prevent brute force attacks
- Password Policies: Enforce strong password requirements
- Audit Logging: Track all admin actions
- Session Timeout**: Automatic logout for security

Role-Based Access:
- **Customers**: Book venues, view booking history
- **Venue Owners**: Manage their venues, view their bookings
- **Super Admin**: Full system access, user management

Frontend Implementation:
- Protected Routes: Route guards based on authentication status
- Context API: Global authentication state management
- Persistent Login: Remember user sessions across browser sessions
- Permission-based UI: Show/hide features based on user role

 Security Considerations

- Input Validation: Comprehensive validation on both client and server
- SQL Injection Prevention: Mongoose ODM provides built-in protection
- XSS Protection: Sanitize user inputs and use Content Security Policy
- CORS Configuration: Properly configured for production environment
- Environment Variables: Sensitive data stored securely
-Rate Limitin*: Implement API rate limiting for production

🚀 Deployment
Backend Deployment
- Platform: Heroku, AWS, or DigitalOcean
- Database: MongoDB Atlas for cloud database
- Environment: Production environment variables
- Monitoring: Error tracking and performance monitoring

 Frontend Deployment
- latform: Netlify, Vercel, or AWS S3
- Build Optimization**: Production build with minification
- : Content delivery network for better performance
- Environment: Production API endpoints

 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request



 Author

Jiya Gudhaka
- GitHub: [@yjiya-gudhaka](https://www.linkedin.com/in/jiya-gudhaka/)
- LinkedIn: (www.linkedin.com/in/jiya-gudhaka)
- Email: your.email@example.com

 Acknowledgments

- MongoDB for the excellent database solution
- React team for the amazing frontend framework
- Express.js for the robust backend framework
- All open-source contributors who made this project possible
\`\`\`

This README provides a comprehensive overview of the project and demonstrates thoughtful planning for future enhancements, showing both technical depth and business understanding.
