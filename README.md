# 🛡️ CyberShield — Cybersecurity Incident Management System

CyberShield is a responsive, full-stack cybersecurity incident management application developed for a university web development assignment. It provides a centralized dashboard for managing security incidents, IT assets, and incident response tasks.

Built with **React 19, TypeScript, Tailwind CSS, and Firebase Cloud Firestore**, CyberShield demonstrates complete Create, Read, Update, and Delete (CRUD) functionality across three interconnected modules, with persistent online data storage.

## ✨ Key Features

- **Three complete CRUD modules** for security incidents, IT assets, and response tasks.
- **Interactive dashboard** with incident statistics, severity charts, and recent records.
- **Responsive interface** for desktop, tablet, and mobile devices.
- **Input validation** with helpful error messages.
- **Search and filtering** for finding records quickly.
- **Delete confirmation dialogs** to help prevent accidental data loss.
- **Persistent database storage** using Cloud Firestore.
- **Incident-task relationships** connecting response tasks to their associated incidents.
- **Demo data support** for demonstrating the application.

## 🛡️ Core Modules

### 1. Security Incident Management

Manage and track cybersecurity incidents throughout their lifecycle.

**Data fields**
- Incident title
- Incident type: Phishing, Malware, Unauthorized Access, Suspicious Login, Data Breach, or Other
- Severity: Low, Medium, High, or Critical
- Status: Open, Investigating, or Resolved
- Description
- Date reported

**CRUD capabilities**
- **Create:** Report new security incidents.
- **Read:** View, search, and filter incident records.
- **Update:** Edit incident details, severity, and status.
- **Delete:** Remove incidents after confirmation.

### 2. IT Asset Management

Maintain an inventory of devices and infrastructure requiring security oversight.

**Data fields**
- Asset name
- Asset type: Computer, Server, Network Device, or Other
- IPv4 address
- Owner or department
- Criticality: Low, Medium, or High
- Registration date

**CRUD capabilities**
- **Create:** Register new IT assets.
- **Read:** View and search the asset inventory.
- **Update:** Modify asset details, ownership, IP address, and criticality.
- **Delete:** Remove assets after confirmation.

The application validates IPv4 addresses when provided.

### 3. Incident Response Task Management

Organize investigation and remediation tasks associated with security incidents.

**Data fields**
- Task title
- Related incident
- Assigned analyst
- Priority: Low, Medium, or High
- Status: Pending, In Progress, or Completed
- Due date

**CRUD capabilities**
- **Create:** Assign new response tasks.
- **Read:** View tasks and their related incidents.
- **Update:** Change task assignments, priority, and status.
- **Delete:** Remove tasks after confirmation.

## 📊 Security Operations Dashboard

The dashboard provides an overview of the application's stored data.

- Total security incidents
- Open incidents
- Critical incidents
- Registered IT assets
- Pending response tasks
- Incident severity distribution chart
- Recent incidents table
- Quick actions for adding records

Dashboard figures should reflect the underlying database records rather than hardcoded statistics.

## 🧰 Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 19 |
| Programming language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Charts | Recharts |
| Database | Firebase Cloud Firestore |
| Authentication | Firebase Authentication, if enabled in the project |
| Build tool | Vite |
| Source control | Git and GitHub |

## 🗂️ Database Design

CyberShield uses three Firestore collections:

| Collection | Purpose |
|---|---|
| `incidents` | Stores security incident records |
| `assets` | Stores IT asset information |
| `responseTasks` | Stores incident response tasks |

Each document has a unique Firestore document ID. Response tasks can reference incidents through an incident ID, allowing related records to be connected.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or newer, compatible with the project's dependencies
- npm
- A Firebase project with Cloud Firestore configured

### Installation

Clone the repository:

```bash
git clone https://github.com/Sardar-Shah/CyberShield.git
cd CyberShield
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal. With the default Vite configuration, it is commonly:

`http://localhost:5173`

The actual port depends on the project's configuration.

### Firebase Configuration

1. Create or select a Firebase project.
2. Enable Cloud Firestore.
3. Configure the Firebase application settings required by the source code.
4. Add the required environment variables to the appropriate local environment file.
5. Configure and publish Firestore security rules.
6. Test database reads and writes before deploying the application.

**Security note:** Never commit private service-account credentials, passwords, or other secrets to GitHub. Firebase client configuration and database security rules must be handled according to the application's actual authentication and access model.

## 🧪 Testing Checklist

Test all four CRUD operations in each module.

| Test | Expected result |
|---|---|
| Create an incident | A valid incident is saved and displayed |
| Read incidents | Stored incidents appear in the table |
| Update an incident | Changes persist and appear in the interface |
| Delete an incident | Confirmation is required before removal |
| Create an IT asset | A valid asset is saved |
| Read IT assets | Stored assets appear in the inventory |
| Update an IT asset | Updated information persists |
| Delete an IT asset | The selected asset is removed after confirmation |
| Create a response task | A valid task is saved |
| Read response tasks | Tasks and related incidents are displayed |
| Update a response task | Changes persist |
| Delete a response task | The selected task is removed after confirmation |
| Refresh the application | Previously saved records remain available |
| Validate form inputs | Invalid or missing values are rejected |
| Test responsive layouts | The interface works across desktop, tablet, and mobile |

These are expected results for testing; mark a test as passed only after verifying it in the running application.

## 📸 Suggested Screenshots for the Project Report

1. CyberShield dashboard overview.
2. Security incidents table with search and severity filters.
3. Incident creation form showing validation.
4. IT asset inventory.
5. Response task table showing linked incidents.
6. Edit form with existing record details.
7. Delete confirmation dialog.
8. Website displayed on a mobile-sized screen.

## 🎤 Presentation Outline

**1. Introduction**

Introduce CyberShield and explain its purpose: organizing security incidents, managing IT assets, and tracking response tasks.

**2. Dashboard**

Explain the summary cards, severity chart, and recent incidents.

**3. Incident Management**

Demonstrate creating, viewing, updating, and deleting an incident.

**4. Asset and Task Management**

Demonstrate CRUD operations in the remaining modules and explain how response tasks reference incidents.

**5. Validation and Database**

Show input validation, deletion confirmation, and persistence after refreshing the website.

**6. Conclusion**

Summarize the three modules, responsive design, database integration, and the project's fulfillment of the CRUD assignment requirements.

## 🔗 Project Links

- **GitHub Repository:** https://github.com/Sardar-Shah/CyberShield
- **Live Website:** (https://cybershield-sfcv.onrender.com/)
- **Presentation Video:** Add your Google Drive sharing link after uploading the recording.

## 🎓 Academic Project

CyberShield was developed as an individual university project to demonstrate responsive web development, database integration, CRUD operations, input validation, and basic cybersecurity incident management concepts.
