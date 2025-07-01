# 🚀 JobSearch - Modern Job Portal Application

<div align="center">
  <img src="https://img.shields.io/badge/Angular-20.0.0-red?style=for-the-badge&logo=angular" alt="Angular">
  <img src="https://img.shields.io/badge/.NET-8.0-purple?style=for-the-badge&logo=dotnet" alt=".NET">
  <img src="https://img.shields.io/badge/SQLite-Database-blue?style=for-the-badge&logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/Material_UI-Components-blue?style=for-the-badge&logo=mui" alt="Material UI">
</div>

<div align="center">
  <h3>🎯 A full-stack job portal application built with Angular and .NET Core</h3>
  <p>Modern, responsive, and feature-rich platform for job seekers and employers</p>
</div>

---

## ✨ Features

### 👤 **User Features**
- 🔐 **Secure Authentication** - JWT-based login/registration system
- 🔍 **Job Search** - Browse and search available job postings
- 📝 **Easy Applications** - One-click job applications
- 📊 **Application Tracking** - Monitor application status in real-time
- 📱 **Responsive Design** - Works seamlessly on all devices

### 👨‍💼 **Admin Features**
- 🏢 **Job Management** - Create, edit, and delete job postings
- 📈 **Application Management** - Review and update application statuses
- 👥 **User Management** - Comprehensive admin dashboard
- 📊 **Analytics** - Track application metrics and job performance

### 🎨 **Design & UX**
- 🎨 **Modern Material Design** - Clean and professional interface
- 🌙 **Consistent Theme** - Blue accent colors with excellent contrast
- ⚡ **Fast Performance** - Optimized for speed and efficiency
- 🔄 **Real-time Updates** - Live status updates and notifications

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Angular 20.0.0
- **UI Library**: Angular Material
- **Styling**: CSS3 with Material Design
- **Icons**: Material Icons
- **Fonts**: Inter (Google Fonts)

### **Backend**
- **Framework**: .NET 8.0 (ASP.NET Core)
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: BCrypt
- **API Documentation**: Swagger/OpenAPI

### **Architecture**
- **Pattern**: Clean Architecture
- **Authentication**: Role-based access control (USER/ADMIN)
- **Security**: CORS enabled, JWT validation
- **Database**: Code-first approach with migrations

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **.NET 8.0 SDK**
- **Angular CLI** (`npm install -g @angular/cli`)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd jobsearch-app
```

### 2. Setup Backend API
```bash
cd API/JobSearchAPI
dotnet restore
dotnet run
```
The API will be available at `http://localhost:5000`

### 3. Setup Frontend
```bash
cd WEB
npm install
ng serve
```
The application will be available at `http://localhost:4200`

---

## 🔑 Demo Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full admin privileges

### Demo User
- Use the "Create Demo User" button on login page
- **Username**: `demo`
- **Password**: `demo123`
- **Access**: Standard user features

---

## 📱 Screenshots

### 🏠 Homepage & Job Listings
Clean, modern interface showcasing available job opportunities with intuitive navigation.

### 🔐 Authentication
Streamlined login and registration process with demo account options for easy testing.

### 👨‍💼 Admin Dashboard
Comprehensive admin panel for managing jobs and applications with real-time status updates.

### 📊 Application Tracking
User-friendly interface for tracking job application status and history.

---

## 🏗️ Project Structure

```
jobsearch-app/
├── 📁 API/JobSearchAPI/          # .NET Core Backend
│   ├── 📁 Controllers/           # API Controllers
│   ├── 📁 Services/              # Business Logic
│   ├── 📁 Models/                # Data Models
│   ├── 📁 DTOs/                  # Data Transfer Objects
│   └── 📁 Data/                  # Database Context
├── 📁 WEB/                       # Angular Frontend
│   ├── 📁 src/app/components/    # Angular Components
│   ├── 📁 src/app/services/      # Angular Services
│   ├── 📁 src/app/guards/        # Route Guards
│   └── 📁 src/styles/            # Global Styles
└── 📄 README.md                  # Project Documentation
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/{id}` - Get job by ID
- `POST /api/jobs` - Create job (Admin)
- `PUT /api/jobs/{id}` - Update job (Admin)
- `DELETE /api/jobs/{id}` - Delete job (Admin)

### Applications
- `GET /api/applications/my-applications` - Get user applications
- `POST /api/applications/apply/{jobId}` - Submit application
- `GET /api/applications` - Get all applications (Admin)
- `PUT /api/applications/{id}/status` - Update status (Admin)

---

## 🎨 Design System

### Color Palette
- **Primary**: `#2563eb` (Blue)
- **Secondary**: `#1d4ed8` (Dark Blue)
- **Success**: `#065f46` (Green)
- **Warning**: `#d97706` (Orange)
- **Error**: `#991b1b` (Red)
- **Background**: `#f8fafc` (Light Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Line Height**: 1.6 (body), 1.2 (headings)

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - BCrypt for secure password storage
- **Role-based Access** - USER and ADMIN role separation
- **CORS Protection** - Configured for secure cross-origin requests
- **Input Validation** - Comprehensive server-side validation

---

## 🚀 Deployment

### Backend Deployment
```bash
cd API/JobSearchAPI
dotnet publish -c Release
```

### Frontend Deployment
```bash
cd WEB
ng build --prod
```

The built files will be in the `dist/` folder ready for deployment.


---

## 👨‍💻 Author

**Your Name**
- GitHub: [@DKGeorgiev21](https://github.com/DKGeorgiev21)
- Email: DKGeorgiev21@codingburgas.bg

---

## 🙏 Acknowledgments

- **Angular Team** - For the amazing framework
- **Microsoft** - For .NET Core and Entity Framework
- **Material Design** - For the beautiful UI components
- **Community** - For inspiration and support

---

<div align="center">
  <h3>⭐ If you found this project helpful, please give it a star! ⭐</h3>
  <p>Made with ❤️ and lots of ☕</p>
</div>
