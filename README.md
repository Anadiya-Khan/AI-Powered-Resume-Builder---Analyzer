# Resume Builder pro

A full-stack MERN application that enables users to create, manage, and optimize resumes with AI-powered enhancements and ATS (Applicant Tracking System) scoring. Built with modern web technologies, this platform provides resume templates, PDF generation, and intelligent resume analysis.

---

## Short Description

Resume Builder Pro is a comprehensive web application designed to help job seekers create professional resumes with ease. The platform offers AI-powered suggestions to enhance resume content, ATS compatibility checking, multiple resume templates, and cloud-based PDF storage. Users can upload existing resumes, generate new ones, and receive AI-powered improvements to make their resumes more competitive.

---

## Key Features

- **User Authentication**: Secure registration, login, and password reset functionality with JWT-based authentication
- **Resume Management**: Create, read, update, and delete resumes with a rich data model
- **Multiple Templates**: Choose from pre-designed resume templates (Template One and Template Two)
- **AI-Powered Enhancement**: Generate improved professional summaries, experience descriptions, and project details using Google Generative AI
- **PDF Generation**: Convert resume data into downloadable PDF files with Puppeteer
- **Resume Upload**: Upload existing PDF resumes to extract and parse content
- **ATS Scoring**: Analyze resumes and receive ATS compatibility scores to optimize for applicant tracking systems
- **Cloudinary Integration**: Cloud-based storage for PDF uploads and downloads
- **Email Notifications**: Password reset and email verification via Nodemailer
- **Protected Routes**: Role-based access control for authenticated users
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS and Framer Motion animations

---

## Tech Stack

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), Bcrypt password hashing
- **AI Integration**: Google Generative AI
- **File Upload**: Multer with Cloudinary storage
- **PDF Processing**: 
  - Puppeteer (PDF generation from HTML)
  - PDF2JSON (PDF parsing)
  - PDF-Parse (PDF text extraction)
  - PDFJS-dist (PDF rendering)
- **Email**: Nodemailer
- **Security**: Helmet.js, CORS, Cookie Parser
- **Utilities**: Express Validator, Dotenv

### Frontend
- **Framework**: React 19.2.0 with Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.17 with Vite plugin
- **Routing**: React Router DOM 7.9.6
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **PDF Export**: jsPDF, html2canvas, react-to-print
- **Notifications**: React Hot Toast
- **Scroll Effects**: React Scroll
- **State Management**: React Context API

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Build Tool**: Vite
- **Linting**: ESLint

---

## Folder Structure

```
├── backend/                          # Express backend server
│   ├── Dockerfile                   # Docker configuration for backend
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Main server entry point
│   ├── README_DOCKER.md             # Docker setup documentation
│   ├── public/                      # Static files serving
│   │   ├── downloads/               # Generated PDF downloads
│   │   └── temp/                    # Temporary file storage
│   ├── scripts/
│   │   ├── cleanup-temp.js          # Clean temporary files
│   │   └── move-temp-to-downloads.js # Move PDFs to downloads
│   └── src/
│       ├── config/
│       │   ├── db.js                # MongoDB connection
│       │   └── cloudinary.js        # Cloudinary configuration
│       ├── controllers/
│       │   ├── user.controllers.js      # Auth & user management
│       │   ├── resume.controllers.js    # CRUD operations for resumes
│       │   ├── ai.controllers.js        # AI enhancement logic
│       │   ├── pdf.controllers.js       # PDF generation & download
│       │   ├── upload.controllers.js    # File upload handling
│       │   └── ats.controllers.js       # ATS analysis & scoring
│       ├── middleware/
│       │   ├── auth.middleware.js       # JWT authentication
│       │   └── upload.middleware.js     # Multer file upload config
│       ├── models/
│       │   ├── user.models.js           # User schema
│       │   └── resume.models.js         # Resume schema
│       ├── routes/
│       │   ├── user.routes.js           # Authentication endpoints
│       │   ├── resume.routes.js         # Resume CRUD endpoints
│       │   ├── ai.routes.js             # AI enhancement endpoints
│       │   ├── upload.routes.js         # File upload endpoints
│       │   └── ats.routes.js            # ATS analysis endpoints
│       └── services/
│           ├── aiService.js         # Google Generative AI service
│           └── sendEmail.js         # Nodemailer email service
│
├── frontend/                        # React frontend application
│   ├── package.json                # Frontend dependencies
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # ESLint rules
│   ├── public/                     # Public assets
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Main routing component
│       ├── index.css               # Global styles
│       ├── ProtectedRoute.jsx      # Route protection wrapper
│       ├── api/
│       │   ├── api.js              # Base API configuration
│       │   └── resume.api.js       # Resume API calls
│       ├── assets/
│       │   └── assets.js           # Asset imports and exports
│       ├── components/
│       │   ├── Login.jsx           # Login form component
│       │   ├── ForgotPass.jsx      # Forgot password component
│       │   ├── ResetPassword.jsx   # Password reset component
│       │   ├── Navbar.jsx          # Navigation bar
│       │   ├── Footer.jsx          # Footer component
│       │   ├── Hero.jsx            # Landing page hero section
│       │   ├── Features.jsx        # Features showcase
│       │   ├── Testimonials.jsx    # Testimonials section
│       │   ├── AiEnhanced.jsx      # AI enhancement interface
│       │   ├── CreateResume.jsx    # Resume creation component
│       │   ├── Backbutton.jsx      # Navigation back button
│       │   └── templates/
│       │       ├── Templatesone.jsx    # Resume template 1
│       │       └── Templatestwo.jsx    # Resume template 2
│       ├── context/
│       │   └── Context.jsx         # Global application context
│       ├── layout/
│       │   └── Layout.jsx          # Main layout wrapper
│       └── pages/
│           ├── Home.jsx            # Landing page
│           ├── Dashboard.jsx       # User dashboard
│           ├── CreateResumepage.jsx    # Resume creation page
│           ├── SelectTemplates.jsx # Template selection page
│           ├── UploadResume.jsx    # PDF upload page
│           └── ATSResult.jsx       # ATS analysis results page
│
└── docker-compose.yml              # Docker Compose configuration
```

---

## Installation Steps

### Prerequisites
- **Node.js**: v16.0.0 or higher
- **MongoDB**: Local or cloud instance (MongoDB Atlas)
- **NPM or Yarn**: Package manager
- **Docker & Docker Compose** (optional, for containerized deployment)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the required environment variables (see Environment Variables section)

4. Start the development server:
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

5. The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory with:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The frontend will run on `http://localhost:5173`

### Docker Deployment

Build and run using Docker Compose:
```bash
docker-compose up --build
```

Or build the backend image manually:
```bash
docker build -t resume-backend:latest -f backend/Dockerfile backend
```

Run with Docker:
```bash
docker run -p 5000:5000 --shm-size=1g \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e MONGODB_URI="your_mongo_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e CLOUDINARY_CLOUD_NAME=... \
  -e CLOUDINARY_API_KEY=... \
  -e CLOUDINARY_API_SECRET=... \
  resume-backend:latest
```

**Note**: Use `--shm-size=1gb` to avoid shared memory issues during PDF generation with Puppeteer.

---

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://username:password@host:port/database
# OR
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# AI Service
GOOGLE_GENERATIVE_AI_KEY=your_google_api_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

## Running the Project

### Development Mode

**Backend**:
```bash
cd backend
npm run dev
```
Starts with hot-reload using Nodemon.

**Frontend**:
```bash
cd frontend
npm run dev
```
Starts Vite development server with hot module replacement (HMR).

### Production Build

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```
Builds the frontend and starts a preview server.

### Cleanup Scripts

Clear temporary files:
```bash
cd backend
npm run clean:temp
```

---

## API Endpoints

### Authentication Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login user and receive JWT token | No |
| POST | `/forgot-password` | Initiate password reset | No |
| POST | `/reset-password/:token` | Reset password with token | No |
| POST | `/refresh-token` | Refresh JWT token | No |

### Resume Routes (`/api/resumes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/create` | Create a new resume | Yes |
| GET | `/` | Get all user resumes | Yes |
| PUT | `/update/:id` | Update existing resume | Yes |
| DELETE | `/delete/:id` | Delete a resume | Yes |
| POST | `/pdf` | Generate PDF from resume data | Yes |
| POST | `/pdf/stream` | Stream PDF directly to client | Yes |
| GET | `/download/:filename` | Download generated PDF file | Yes |

### AI Enhancement Routes (`/api/ai`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/generate` | Generate AI enhancements for resume fields (professionalSummary, experience, projects) | Yes |

### File Upload Routes (`/api/file`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/upload` | Upload and parse PDF resume | No |

### ATS Analysis Routes (`/api/ats`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/analyze` | Analyze resume and generate ATS score | No |

### AI Enhancement Request Body Example

```json
{
  "fullName": "John Doe",
  "role": "Senior Software Engineer",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [
    {
      "title": "Software Engineer",
      "company": "TechCorp",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "description": "Worked on web applications"
    }
  ],
  "projects": [
    {
      "name": "Project A",
      "description": "Built a web app"
    }
  ],
  "fields": ["professionalSummary", "experience", "projects"]
}
```

### Resume Schema

The resume model includes the following fields:
- `userId` (ObjectId) - Reference to user
- `fullName` (String)
- `role` (String) - Job title/role
- `email` (String)
- `phone` (String)
- `address` (String)
- `links` (Array) - Portfolio, LinkedIn, GitHub links
- `professionalSummary` (String)
- `education` (Array) - Education records with degree, institution, year, grade
- `skills` (Array) - Array of skill strings
- `experience` (Array) - Work experience with title, company, dates, description
- `projects` (Array) - Projects with name and description
- `certifications` (Array) - Professional certifications

---

## Screenshots Section

### Landing Page
[Screenshot placeholder: Hero section with features overview]

### Authentication
[Screenshot placeholder: Login and registration forms]

### Dashboard
[Screenshot placeholder: User resume list and management interface]

### Resume Creator
[Screenshot placeholder: Resume form with multiple template options]

### Template Selection
[Screenshot placeholder: Available resume templates display]

### AI Enhancement
[Screenshot placeholder: AI-powered enhancement suggestions interface]

### Resume Preview
[Screenshot placeholder: Resume preview with PDF export option]

### ATS Analysis Results
[Screenshot placeholder: ATS score and recommendations]

---

## Conclusion

Resume Builder Pro empowers job seekers to create, enhance, and optimize their resumes efficiently. By combining AI-powered improvements with ATS compatibility analysis, users can significantly improve their chances of securing interviews. The platform's intuitive interface, multiple templates, and cloud integration make resume management accessible to everyone.

### Future Enhancements
- Advanced analytics and resume viewing history
- Collaborative resume editing
- More AI-powered features (cover letter generation, interview prep)
- Integration with job boards and LinkedIn
- A/B testing of resume versions for optimal ATS scores
- Automated job application tracking
- Real-time collaboration features

### Support & Contribution
For issues, feature requests, or contributions, please open an issue or submit a pull request on the project repository.

---

**Happy Resume Building! 🚀**
