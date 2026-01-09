# CoopTrack - Co-op Application Tracker + Resume Versioning

A modern, full-stack application tracker built specifically for students managing co-op and internship applications. Features include Kanban-style application tracking, resume version control with visual diff comparison, comprehensive analytics, and a complete REST API backend.

![CoopTrack](https://via.placeholder.com/800x400?text=CoopTrack+Screenshot)

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js        │────▶│  Express.js     │────▶│  MongoDB        │
│  Frontend       │     │  REST API       │     │  Database       │
│  (Port 3000)    │     │  (Port 5000)    │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## ✨ Features

### 📋 Application Tracking
- **Kanban Board**: Visual pipeline with columns for Saved, Applied, Interview, Offer, and Rejected
- **Detailed Application Cards**: Track company, position, location, salary, deadline, and notes
- **Search & Filter**: Quickly find applications by company, position, or status
- **Resume Linking**: Associate specific resume versions with each application

### 📄 Resume Versioning
- **Multiple Versions**: Create and manage different resume versions for different roles
- **Markdown Editor**: Write resumes in markdown with live preview
- **Version History**: Track when each version was created and updated
- **Copy & Download**: Export your resumes as markdown files

### 🔄 Resume Comparison (Secret Sauce!)
- **Visual Diff**: See exactly what changed between two resume versions
- **Side-by-Side View**: Compare versions with highlighted additions and deletions
- **Change Statistics**: Quick overview of additions, deletions, and unchanged lines

### 📊 Analytics Dashboard
- **Response Rate**: Track how many applications result in responses
- **Interview Rate**: See your interview success rate
- **Pipeline Overview**: Visual breakdown of applications by status
- **Recent Activity**: Quick access to recently updated applications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/coop-tracker.git
cd coop-tracker
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

4. Set up environment variables:
```bash
# In /server directory
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the backend server:
```bash
cd server
npm run dev
```

7. Start the frontend (in a new terminal):
```bash
# From root directory
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile |
| PUT | `/api/auth/password` | Change password |

### Applications (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List all applications |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| GET | `/api/applications/stats` | Get statistics |
| PUT | `/api/applications/bulk-status` | Bulk update status |

### Resumes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | List all versions |
| POST | `/api/resumes` | Create version |
| GET | `/api/resumes/:id` | Get single version |
| PUT | `/api/resumes/:id` | Update version |
| DELETE | `/api/resumes/:id` | Delete version |
| GET | `/api/resumes/compare/:id1/:id2` | Compare two versions |
| POST | `/api/resumes/:id/duplicate` | Duplicate version |

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Icons**: Lucide React

## 📁 Project Structure

```
coop-tracker/
├── src/                        # Frontend (Next.js)
│   ├── app/                    # Next.js app router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── applications/       # Application tracking
│   │   └── resumes/            # Resume management
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAppStore.ts      # Zustand store
│   │   └── useAnalytics.ts
│   ├── lib/
│   │   ├── api/                # API client
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── types/                  # TypeScript types
│   └── data/                   # Sample data
│
├── server/                     # Backend (Express.js)
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── applicationController.js
│   │   └── resumeController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Application.js
│   │   └── ResumeVersion.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── applications.js
│   │   └── resumes.js
│   ├── index.js               # Server entry point
│   ├── package.json
│   └── .env.example
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Design Philosophy

CoopTrack uses a dark, modern aesthetic with:
- **Color Scheme**: Deep dark background (#0a0a0f) with indigo/purple accents
- **Typography**: JetBrains Mono for code, Space Grotesk for headings
- **Animations**: Subtle fade-in and slide animations
- **Gradient Borders**: Distinctive card styling with gradient borders

## 📝 Usage Tips

### Writing Resumes in Markdown
```markdown
# Your Name
email@example.com | linkedin.com/in/yourname

## Education
**University Name** — Degree
Expected Graduation: Year | GPA: X.X/4.0

## Experience
**Job Title** — Company Name
Date - Date
- Accomplishment with metrics
- Another achievement

## Skills
Languages: Python, JavaScript, ...
```

### Comparing Versions
1. Go to the "Compare" tab
2. Select your base version (the original)
3. Select the version you want to compare against
4. View the diff with additions (green) and deletions (red)

## 🔮 Future Enhancements

- [ ] Email reminders for deadlines
- [ ] Job description keyword extraction
- [ ] Export to PDF
- [ ] Google Drive integration
- [ ] Collaborative features

## 📄 License

MIT License - feel free to use this for your own job search!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
