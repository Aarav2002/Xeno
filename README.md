# 📬 Mini CRM Platform

A lightweight, AI-assisted CRM application that enables customer segmentation, personalized campaign delivery, and real-time performance tracking. Built with modern web technologies, this platform helps businesses create intelligent marketing campaigns with ease.

---
![Dashboard Preview](https://wp.sfdcdigital.com/en-us/wp-content/uploads/sites/4/2024/08/marquee-crm-software.jpg?resize=1024,576)

## 🚀 Features

- ✅ Google OAuth 2.0 authentication
- ✅ Customer and order data ingestion via APIs
- ✅ MongoDB data persistence for users, customers, segments, and campaigns
- ✅ Dynamic rule-based segment builder (with AND/OR logic)
- ✅ Real-time audience size preview
- ✅ AI integration (Google Gemini) to convert natural language into segmentation rules
- ✅ Campaign creation with delivery logging and simulated message delivery
- ✅ Campaign history dashboard with stats and status
- ✅ Modular and clean code structure for scalability

---

## 🛠 Tech Stack

| Layer         | Technology              |
|---------------|--------------------------|
| Frontend      | React.js + TypeScript   |
| Auth          | Google OAuth 2.0        |
| Backend       | Node.js (Express)       |
| Database      | MongoDB (Mongoose)      |
| AI Services   | Google Gemini API       |
| Styling       | CSS / Tailwind (optional) |
| State Mgmt    | React Context API       |

---

## 📁 Project Structure

```
src/
├── components/layout       # Reusable UI components (Navbar, Sidebar)
├── context/                # Auth context (Google OAuth)
├── controllers/            # Logic for customer and segment handling
├── data/                   # Mock data for testing
├── middleware/             # Express middlewares (auth, logging, etc.)
├── models/                 # Mongoose models (User, Customer, Segment)
├── pages/                 
│   ├── api/                # API logic for frontend/backend interaction
│   ├── Campaigns.tsx       # List of campaigns
│   ├── CampaignDetail.tsx  # Detailed view for a campaign
│   ├── Customers.tsx       # Customer data page
│   ├── Dashboard.tsx       # Entry point after login
│   ├── LoginPage.tsx       # Google OAuth login
│   ├── SegmentBuilder.tsx  # Rule builder UI
│   ├── Segments.tsx        # Segment listing and actions
├── routes/                 # Express routes for API endpoints
├── server/                 # Server logic (DB connection, models)
├── services/               # Utility services (e.g., API calls)
├── App.tsx                 # Main app entry point
└── index.tsx               # React DOM render root
```

---

## ⚙️ Local Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/mini-crm.git
   cd mini-crm
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

---

## 🧠 AI Integration (Gemini)

We use **Google Gemini** to enhance the segment creation process with natural language input.

### Example:
User types:  
> _"People who haven’t ordered in 3 months and spent over ₹5000"_  
Gemini converts it into:  
```json
{
  "lastOrderDate": "<= 90 days ago",
  "totalSpend": "> 5000"
}
```

---

## 🧱 Architecture Diagram

```
+-------------+           +---------------------+
|   Frontend  | <-------> |   Express Backend   |
|  (React.js) |           |   (Node.js + APIs)  |
+-------------+           +----------+----------+
                                   |
                      +------------+-----------+
                      |        MongoDB         |
                      |  (Users, Segments, etc)|
                      +------------------------+
                                   |
                            +--------------+
                            | Gemini API   |
                            | (AI Rule Gen)|
                            +--------------+
```

---

## ⚠️ Known Limitations / Assumptions

- ❗ Campaign delivery is simulated (not sent via SMS or email).
- ❗ No real-time delivery receipt handling yet (batch update pending).
- ❗ Order ingestion and time-based filtering is mocked or assumed in logic.
- ❗ Error handling is basic and can be improved.
- ❗ No drag-and-drop rule builder yet (only logical blocks with UI support).

---

## ✨ Future Enhancements

- [ ] Add pub-sub architecture using Kafka or Redis Streams
- [ ] Add real message vendors (SendGrid, Twilio)
- [ ] Campaign performance insights powered by AI
- [ ] Drag-and-drop rule builder for better UX
- [ ] Lookalike audience generation using AI

---

## 📬 Contact

For any queries, feedback, or contributions, feel free to reach out via [your-email@example.com] or open a GitHub issue.

---

> Built with ❤️ for learning, experimenting, and solving real customer engagement challenges.