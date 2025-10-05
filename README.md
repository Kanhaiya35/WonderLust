# 🌍 WonderLust

**WonderLust** is a full-stack travel destination web application built using **Node.js**, **Express**, **MongoDB**, and **EJS**.  
It allows users to explore, add, review, and manage beautiful travel destinations around the world — designed for travelers who love to discover new places and share their experiences.

---

## 🚀 Features

✅ **User Authentication** – Secure login & signup using Passport.js or JWT  
✅ **Add New Destinations** – Share your favorite places with others  
✅ **Edit / Delete Destinations** – Manage your posts easily  
✅ **Reviews & Ratings** – Add and view reviews for destinations  
✅ **Responsive UI** – Clean, modern design using Bootstrap / CSS  
✅ **Image Uploads** – Upload destination photos via Cloudinary / local storage  
✅ **Flash Messages** – For smooth user feedback (success/error)  
✅ **MVC Structure** – Organized models, routes, and views for maintainability  

---

## 🏗️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | EJS, HTML5, CSS3, Bootstrap |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | Passport.js / JWT |
| **Hosting** | Render / Vercel / Railway / Localhost |
| **Other Tools** | Cloudinary, dotenv, Express Session |

---

## ⚙️ Installation & Setup

Follow these steps to run WonderLust locally 👇

### 1️⃣ Clone the Repository
"""bash
git clone https://github.com/Kanhaiya35/WonderLust.git
cd WonderLust
npm install

Create a .env file in the root directory and add the following:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SESSION_SECRET=your_secret_key

Run the Application
npm start """

Then open http://localhost:3000/
 in your browser 🌐

Folder Structure
WonderLust/
│
├── models/           # MongoDB models (User, Review, Destination)
├── routes/           # Express route handlers
├── views/            # EJS templates
├── public/           # Static assets (CSS, JS, images)
├── utils/            # Helper functions / middlewares
├── app.js            # Main server file
├── package.json
└── .env.example

💡 Future Enhancements

Add Google Maps integration
Add user profile page
Improve search and filter options
Enable real-time chat between travelers
Add wishlist / favorite destinations feature

🧑‍💻 Author
Kanhaiya Dharmraj Parihar
B.Tech Student | Cloud & Java Developer | Aspiring DevOps Engineer
Pune, India

📜 License
This project is licensed under the MIT License — feel free to use and modify it.
