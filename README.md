# CyberShield — Cybersecurity Incident Management System

**CyberShield** is a full-stack, responsive Cybersecurity Incident Management & Response Operations Center built for a university web development assignment. It features three interconnected CRUD modules powered by **React 19**, **TypeScript**, **Tailwind CSS**, and **Google Cloud Firestore** for real-time online persistence.

---

## 🛡️ Key Modules & CRUD Capabilities

### 1. Security Incident Management
- **Create**: Report new threats with validation for Title, Type (`Phishing`, `Malware`, `Unauthorized Access`, `Suspicious Login`, `Data Breach`, `Other`), Severity (`Low`, `Medium`, `High`, `Critical`), Status (`Open`, `Investigating`, `Resolved`), Description, and Date Reported.
- **Read**: Live data table with dynamic search, filter by severity, and filter by status. Detail inspection modal with full technical timeline and unique Firestore document ID.
- **Update**: Edit incident metadata, severity level, and status upon investigation progress.
- **Delete**: Safe deletion protected by a confirmation dialog with immediate UI sync.

### 2. IT Asset Management
- **Create**: Register IT infrastructure assets: Asset Name, Asset Type (`Computer`, `Server`, `Network Device`, `Other`), IPv4 network address (with strict regex validation), Owner Department, Criticality (`Low`, `Medium`, `High`), and Registration Date.
- **Read**: Live inventory table searchable by asset name, IP address, or department, with criticality badges.
- **Update**: Modify assigned department, IP address, or criticality.
- **Delete**: Removal with safety confirmation.

### 3. Incident Response Task Management
- **Create**: Dispatch response action items with Task Title, linked Incident selector, Assigned Analyst, Priority (`Low`, `Medium`, `High`), Status (`Pending`, `In Progress`, `Completed`), and Due Date.
- **Read**: Task tracker linking back to the parent incident with priority badges and assignee indicators.
- **Update**: Advance task workflow status and reassign investigators.
- **Delete**: Remove completed or cancelled response tasks after confirmation.

---

## 📊 Security Operations Dashboard
- **Real-Time Database Statistics**:
  - Total Security Incidents
  - Open Incidents
  - Critical Priority Incidents
  - Registered IT Assets
  - Pending Response Tasks
- **Severity Chart**: Interactive Recharts visualization showing live threat distribution across Low, Medium, High, and Critical severities.
- **Recent Incidents**: Quick-inspection mini-table with direct access to incident inspection.
- **One-Click Demo Seeder**: "Load Demo Data" button safely populates realistic sample records into Firestore if the database is empty, preventing accidental duplicates.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Database**: Google Firebase Cloud Firestore (NoSQL document collections: `incidents`, `assets`, `responseTasks`)
- **Authentication**: Firebase Authentication (Google OAuth provider + Guest Analyst mode)
- **Tooling**: Vite 8, ESNext, Drizzle/Firebase Blueprint IR

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18 or newer)
- npm or bun

### Installation
1. Clone the repository or extract the project archive:
   ```bash
   git clone <your-repository-url>
   cd cybershield
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server on port 3000:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Firebase & Firestore Configuration

The application includes `firebase-applet-config.json` configured for Cloud Firestore.

### Firestore Security Rules
The rules (`firestore.rules`) enforce schema validation, field types, and size constraints:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isValidIncident(data) {
      return data.keys().hasAll(['title', 'incidentType', 'severity', 'status', 'description', 'dateReported']) &&
             data.title is string && data.title.size() > 0 && data.title.size() <= 200 &&
             data.incidentType in ['Phishing', 'Malware', 'Unauthorized Access', 'Suspicious Login', 'Data Breach', 'Other'] &&
             data.severity in ['Low', 'Medium', 'High', 'Critical'] &&
             data.status in ['Open', 'Investigating', 'Resolved'] &&
             data.description is string && data.description.size() > 0 && data.description.size() <= 2000 &&
             data.dateReported is string && data.dateReported.size() <= 30;
    }

    match /incidents/{incidentId} {
      allow read: if true;
      allow create, update: if isValidIncident(request.resource.data);
      allow delete: if true;
    }

    // Similar schema validation helpers protect /assets/{assetId} and /responseTasks/{taskId}
  }
}
```

---

## 🧪 Testing and Persistence Verification

To verify full CRUD functionality and Firestore database persistence:
1. **Create an Incident**:
   - Click **"+ Incident"** on the top navigation bar or dashboard.
   - Enter `Ransomware Canary Alert`, select `Malware`, `Critical`, `Open`.
   - Click **"Create Incident"** and observe the success toast.
2. **Verify Persistence**:
   - Press `F5` / reload the browser.
   - Verify that the incident remains stored and the Dashboard counters immediately reflect the new numbers.
3. **Update an Incident**:
   - In the **Security Incidents** table, click the **Edit** icon (pencil).
   - Change Status to `Investigating` and click **"Update Incident"**.
   - Check that the badge updates from `Open` to `Investigating`.
4. **Delete an Incident**:
   - Click the **Delete** icon (trash).
   - Review the confirmation dialog specifying the exact incident title.
   - Click **"Delete Incident"** and verify immediate removal from the table and chart.
5. **Repeat for IT Assets and Response Tasks**:
   - Test IPv4 format validation (e.g., inputting `999.999.1` correctly blocks saving and flags an inline error).

---

## 📸 Recommended Screenshots for University Report
1. **SOC Dashboard Overview**: Showing summary stat cards, incidents-by-severity Recharts bar chart, and recent incidents table.
2. **Security Incidents Table with Active Filter**: Displaying incidents filtered by "Critical" severity.
3. **Incident Creation Modal with Validation**: Demonstrating required fields and description length counters.
4. **IT Asset Inventory Table**: Demonstrating registered servers and IPv4 address tags.
5. **Incident Response Tasks Table**: Demonstrating relationship link connecting a response task to its parent incident.
6. **Delete Confirmation Dialog**: Demonstrating safety modal protecting against accidental data loss.

---

## 🎤 3-Minute Presentation & Demonstration Script
1. **Introduction (30s)**:
   - "Good morning. CyberShield is a Cybersecurity Incident Management platform built to handle rapid incident logging, asset tracking, and mitigation task workflows."
2. **Dashboard & Architecture (45s)**:
   - "Our dashboard calculates real-time metrics directly from Google Cloud Firestore collections. Notice the live severity distribution chart and instant alert counters."
3. **Live Incident CRUD (45s)**:
   - "Let's demonstrate CRUD module 1: Creating a high-severity Phishing incident. The form validates all required fields before writing to Firestore. We can inspect the record's unique document ID, update its lifecycle state to 'Investigating', and see the dashboard immediately synchronize."
4. **Assets & Response Tasks (45s)**:
   - "Module 2 tracks IT assets with IPv4 network validation. Module 3 assigns containment tasks directly linked to the incident we created, assigning responsible security analysts and deadlines. Deletion is safeguarded by confirmation modals across all three modules."
5. **Conclusion (15s)**:
   - "All 12 CRUD operations are fully functional, responsive across mobile and desktop, and backed by Firestore persistent storage."
