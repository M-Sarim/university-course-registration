# University Course Registration System

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
  - [Student Features](#student-features)
  - [Admin Features](#admin-features)
- [Technologies Used](#technologies-used)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Project Overview

The **University Course Registration System** is a modern, interactive single-page application prototype designed to address the common challenges faced by students and administrative staff during course registration. This project was developed as part of the Web Engineering course at the National University of Computer & Emerging Sciences. It demonstrates real-world functionality using **HTML, CSS, JavaScript** for the frontend, **Node.js with Express** for the backend, and **MongoDB** for database management.

## Features

### Student Features:

- **Secure Login**: Students log in using their assigned roll numbers (registration is not required as roll numbers are pre-populated in the database).
- **Interactive Weekly Calendar**: Provides a dynamic view that updates as courses are added or removed, highlighting scheduling conflicts in real time.
- **Real-Time Seat Availability**: Displays up-to-date information on course capacity without needing page refreshes.
- **Advanced Course Filtering**: Enables students to search for courses based on department, course level, time of day, days of the week, and open seats.
- **Persistent Session State**: Maintains the state of a student’s schedule throughout their session, even if they navigate away or adjust their selections.
- **Prerequisite Information**: Clearly displays course prerequisites and relationships to help students plan effectively.

### Admin Features:

- **Admin Login**: Secure login using a username and password.
- **Course Management**: Add, update, or delete courses and set or modify course prerequisites.
- **Student Management**: View and manage student registrations with the ability to override course enrollment in special cases.
- **Seat Management**: Adjust seat availability for each course in real time.
- **Reporting Tools**:
  - Generate a list of students registered for a specific course.
  - Display courses with available seats.
  - Identify students who have not met prerequisite requirements.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB

## Installation & Setup

### 1. Clone the Repository  
Open your terminal and run:
```bash
git clone https://github.com/M-Sarim/university-course-registration.git
```

### 2. Navigate to the Project Directory
```bash
cd university-course-registration
```

### 3. Install Dependencies  
Ensure you have Node.js and npm installed, then run:
```bash
npm install
```

### 4. Configure the Database  
- Install MongoDB and ensure it is running.
- Update the MongoDB connection string in your server configuration (e.g., in a `.env` file or directly in your code).

### 5. Start the Server
```bash
npm start
```
Your application should now be running at `http://localhost:3000`.

## Project Structure

A typical structure for this project is as follows:
```
22F-3688_Web_Assignment_2/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── apiController.js
│   ├── authController.js
│   └── studentController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Course.js
│   └── User.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   └── logo.png
│   └── js/
│       ├── admin/
│       │   └── admin.js
│       ├── student/
│       │   └── student.js
│       ├── auth.js
│       └── common.js
├── routes/
│   ├── adminRoutes.js
│   ├── apiRoutes.js
│   ├── authRoutes.js
│   └── studentRoutes.js
├── views/
│   ├── admin/
│   │   ├── courseManagement.ejs
│   │   ├── dashboard.ejs
│   │   ├── reports.ejs
│   │   ├── seatManagement.ejs
│   │   └── studentManagement.ejs
│   ├── auth/
│   │   └── login.ejs
│   └── student/
│       ├── dashboard.ejs
│       ├── registerCourse.ejs
│       └── schedule.ejs
├── .env
├── package.json
├── README.md
├── server.js
```

## Usage

### Student Workflow
1. **Login**: Enter your roll number to access the student dashboard.
2. **Course Selection**: Use the interactive weekly calendar to add or remove courses. The system highlights any scheduling conflicts automatically.
3. **Course Filtering**: Filter courses by department, level, and availability.
4. **Real-Time Updates**: Monitor seat availability in real time and save schedule progress during the session.

### Admin Workflow
1. **Login**: Admins log in using their username and password.
2. **Course Management**: Add, update, or delete courses and set prerequisites.
3. **Student Management**: View registered students and manage enrollments, including overriding course registration in special cases.
4. **Reports**: Generate various reports on course registrations and prerequisites.

## Future Enhancements

- **Notification System**: Implement a push notification system to alert students when a seat becomes available for a desired course.
- **Enhanced UI/UX**: Further improve the user interface with modern frameworks and responsive design.
- **Analytics Dashboard**: Provide more detailed analytics for admin users, including trends and historical data on course enrollments.
- **Mobile Compatibility**: Optimize the application for mobile devices to ensure accessibility on all platforms.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

Special thanks to the **National University of Computer & Emerging Sciences** for providing the academic framework and project guidelines. Inspiration was drawn from real-world course registration systems and industry best practices in web engineering.


