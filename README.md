# Kodhra – Code Snippet Manager

Kodhra is a privately developed **Code Snippet Management platform** created to support structured, long-term code reuse for professional development workflows.

This repository is **informational** in nature and documents the technologies and architecture used to build the system.
It is **not intended as a starter template or cloneable project**.

---

## Purpose

Kodhra was built to solve a personal and professional problem:

* Code logic scattered across projects
* Difficulty reusing verified snippets
* Lack of structure in long-term code storage

The application focuses on **clarity, structure, and reliability**, following traditional web development principles.

---

## Technologies Used

### Frontend

* **HTML5**
* **EJS (Server-Side Rendering)**
* **SCSS (compiled using `sass`)**
* **Vanilla JavaScript**
* **CodeMirror** (syntax highlighting)

> No frontend frameworks or CSS utility libraries are used.

---

### Backend

* **Node.js**
* **Express.js**
* **MongoDB** with **Mongoose**
* **JWT Authentication**
* **Session & Cookie Management**
* **Redis** (session storage & caching)
* **Socket.IO** (real-time features)

---

### Infrastructure & Services

* **Cloudinary** – media storage
* **Nodemailer** – email services
* **Razorpay** – payment integration
* **Archiver** – data export
* **Electron** – desktop packaging
* **esbuild** – bundling & optimization
* **Jest + Supertest** – testing

---

## Development Approach

* Traditional MVC-style backend architecture
* Server-rendered views for SEO and stability
* Minimal client-side abstraction
* Custom SCSS instead of UI frameworks
* Explicit control over data flow and rendering
* Focus on maintainability over trends

---

## Usage Notice

This project is **not provided as an open-source boilerplate**.

* Cloning, redistributing, or using this project as a base template is **not intended**
* Code is shared **for reference and documentation purposes only**
* Business logic, structure, and implementation are proprietary

---

## Ownership

All design decisions, architecture, and implementation are original and part of an ongoing private product.

**Kodhra** is actively developed and maintained by
**Codewithajoydas**
