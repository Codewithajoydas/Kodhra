# Kodhra - Code Snippet Manager

Kodhra is a powerful and elegant **Code Snippet Manager** built for developers who value speed, structure, and simplicity. It allows you to organize, store, and retrieve code snippets from multiple languages in one unified place. Whether you are a front-end developer, backend engineer, or full-stack creator, Kodhra helps you maintain your code library in an efficient and visually organized way.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Kodhra provides a modern interface and backend to manage your personal or team-based code snippets. Developers can create, tag, search, and categorize snippets across multiple programming languages. It reduces repetitive coding, improves workflow, and serves as a long-term knowledge repository.

### Key Goals

- Simplify the process of storing and retrieving reusable code.
- Encourage structured snippet organization.
- Provide a clean, fast, and minimal UI for focused coding.
- Support authentication and multi-device access.

---

## Features

- **Snippet Creation:** Add, edit, and delete code snippets easily.
- **Categorization:** Organize snippets by tags, categories, and languages.
- **Search and Filter:** Quickly find snippets using powerful search filters.
- **Syntax Highlighting:** Code syntax is rendered cleanly using CodeMirror or Monaco Editor.
- **Authentication:** Secure user login and registration system using JWT.
- **Cloud Storage:** Snippets are stored persistently in MongoDB.
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile.
- **Draft Support:** Save snippets temporarily before publishing.
- **Profile System:** Manage your personal coding library and metadata.
- **Dark/Light Mode:** Switch between visual themes for comfort.
- **Clipboard Support:** Copy snippets instantly with one click.

---

## Tech Stack

**Frontend:**
- HTML, CSS, JavaScript (Vanilla)
- CodeMirror / Monaco Editor (for syntax highlighting)
- Tailwind CSS or SCSS for styling
- Fetch API / Axios for client-server communication

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

**Other Tools:**
- dotenv for environment configuration
- nodemon for local development
- cookie-parser for token management

---

## Installation

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or later)
- MongoDB (local or Atlas)
- Git

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kodhra.git

2. Navigate to the project directory:

   ```bash
   cd kodhra
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the required variables (see below).

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Visit the application in your browser:

   ```
   http://localhost:3000
   ```

---

## Usage

* Register or login to your account.
* Create new code snippets with title, description, tags, and code content.
* Categorize snippets using custom tags or predefined categories.
* Search snippets by keyword, language, or date created.
* Copy snippets directly to your clipboard for reuse in projects.

---

## Project Structure

```
kodhra/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── utils/
│   ├── app.js
│   └── server.js
|   ├──public/
│     ├── assets/
│     ├── css/
│     ├── js/
│     ├── components/
│     └── index.html
|  ├── views/*/
├── .env
├── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| POST   | `/auth/signup`     | Register a new user         |
| POST   | `/auth/login`      | Login user and return token |
| GET    | `/card`            | Get all snippets            |
| POST   | `/card       `     | Create a new snippet        |
| PUT    | `/card/:id`        | Update existing snippet     |
| DELETE | `/card/:id`        | Delete a snippet            |
| GET    | `/card/:id`        | Get a specific snippet      |

---

## Authentication

Kodhra uses **JWT (JSON Web Token)** for secure authentication. Tokens are stored in HTTP-only cookies to prevent client-side tampering.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key
```

Optional:

```
NODE_ENV=development
```

---

## Screenshots

*(Add screenshots once UI is ready)*

Example placeholders:

* Dashboard View
* Snippet Editor
* Search Results
* Profile Page

---

## Future Plans

* Add AI-powered snippet suggestions.
* Implement syntax-based search.
* Introduce user collaboration and sharing features.
* Support for multiple code editors (VSCode-like experience).
* Offline support with IndexedDB or LocalForage.

---

## Contributing

Contributions are always welcome.
To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your fork and open a Pull Request.

Follow standard commit message formats and coding conventions.

---

## License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for details.

---

## Author

**Developed by Codewithajoydas**
Passionate about clean, structured, and purposeful code.

```
