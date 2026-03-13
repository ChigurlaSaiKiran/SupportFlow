# SupportFlow — IT Helpdesk Ticketing System

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)
![MUI](https://img.shields.io/badge/MUI-v5-007FFF?style=for-the-badge&logo=mui)

A full-stack IT support ticketing system built with **ASP.NET Core 8 Web API** following **Clean Architecture** principles and a **React.js** frontend. Designed to streamline internal support operations with real-time presence tracking, role-based access control, and a modern UI inspired by Microsoft Teams.

---

## 📸 Screenshots

> Dashboard | Tickets | Profile with Presence Status

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login with role-based claims
- 👥 **Role-Based Access Control** — Admin, Agent, User roles
- 🎫 **Ticket Management** — Create, assign, update, and track support tickets
- 🟢 **Presence Status** — Real-time availability status like Microsoft Teams (Available, Busy, Away, Offline)
- ⚡ **Auto Away Detection** — Automatically sets status to Away after inactivity
- 🔔 **Notifications** — In-app notification bell for ticket updates
- 📊 **Dashboard** — Visual stats with charts (Recharts)
- 🏢 **Department & Category Management**
- 🎯 **Priority Management** — Low, Medium, High, Critical
- 📎 **Ticket Attachments**
- 👤 **User Profile Management**

---

## 🏗️ Architecture

This project follows **Clean Architecture** with strict separation of concerns:

```
SupportFlow/
├── SupportFlow.API/              # Controllers, Middleware, Auth
├── SupportFlow.Application/      # DTOs, Interfaces, AutoMapper
├── SupportFlow.Domain/           # Entities (pure C# classes)
├── SupportFlow.Infrastructure/   # EF Core, Repositories, Services
└── supportflow-frontend/         # React.js frontend
```

### Design Patterns Used
- ✅ Repository Pattern
- ✅ Unit of Work Pattern
- ✅ Dependency Injection
- ✅ DTO Pattern with AutoMapper
- ✅ Generic Repository

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| ASP.NET Core 8 Web API | REST API |
| Entity Framework Core | ORM |
| SQL Server | Database |
| JWT Bearer Tokens | Authentication |
| AutoMapper | Object mapping |
| BCrypt.Net | Password hashing |
| Clean Architecture | Project structure |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js 18 | UI Framework |
| Material UI (MUI) v5 | Component library |
| Axios | HTTP client |
| React Router v6 | Navigation |
| Recharts | Dashboard charts |
| Context API | State management |

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server)
- [Node.js 18+](https://nodejs.org/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or VS Code

---

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/ChigurlaSaiKiran/SupportFlow.git
cd SupportFlow
```

**2. Update `appsettings.json` in `SupportFlow.API`**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=SupportFlowDb;Trusted_Connection=True;"
  },
  "Jwt": {
    "Secret": "YOUR_JWT_SECRET_KEY",
    "Issuer": "SupportFlow",
    "Audience": "SupportFlowUsers",
    "ExpiryMinutes": 60
  }
}
```

**3. Apply database migrations**
```bash
cd SupportFlow.API
dotnet ef database update
```

**4. Run the API**
```bash
dotnet run
```
> API runs at `https://localhost:7xxx`

---

### Frontend Setup

```bash
cd supportflow-frontend
npm install
npm start
```
> Frontend runs at `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| GET | `/api/tickets` | Get all tickets |
| POST | `/api/tickets` | Create ticket |
| PUT | `/api/tickets/{id}` | Update ticket |
| DELETE | `/api/tickets/{id}` | Delete ticket |
| GET | `/api/presence/status` | Get user status |
| PUT | `/api/presence/status` | Update user status |
| GET | `/api/users` | Get all users |
| GET | `/api/notifications` | Get notifications |

---

## 🔐 Security Features

- Passwords hashed with **BCrypt**
- JWT tokens with **role claims**
- **MapInboundClaims** disabled for clean claim parsing
- Global **Exception Middleware** for consistent error responses
- Email uniqueness validation on registration
- User existence not leaked on forgot password

---

## 👨‍💻 Author

**Chigurla Sai Kiran**  
.NET Full Stack Developer  
📧 saikiranrgrs195013@gmail.com  
🔗 [GitHub](https://github.com/ChigurlaSaiKiran)

---

## 📄 License

This project is licensed under the MIT License.
