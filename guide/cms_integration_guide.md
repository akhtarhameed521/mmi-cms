# MMI CMS Frontend Integration Guide

This document provides a comprehensive specification, developer guidelines, and a pre-formatted AI prompt to integrate the Backend CMS module into your frontend application. It also showcases a modern, premium design mockup for the administrative UI.

---

## 🎨 CMS Admin Dashboard Mockup

Below is a design mockup of the frontend CMS Admin Panel. It demonstrates how to display the pages list and manage the navbar hierarchy visually.

![CMS Admin Dashboard Mockup](C:/Users/Akhtar Hameed/.gemini/antigravity-ide/brain/5f84dccb-fff7-4179-bd70-963c2274522f/cms_dashboard_mockup_1783317992746.png)

---

## 🔌 API Architecture & Endpoints Reference

All requests must target `http://localhost:5000/api/cms`. Routes under the Admin section require an `Authorization` header containing `Bearer <ACCESS_TOKEN>`.

### 1. Public Routes (No Auth Required)

| Method | Endpoint | Description | Query/Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/pages/public/:slug` | Retrieves layout details for a page using its URL slug. | `:slug` (string) | `{ success: true, page: PageObject }` |
| **GET** | `/navbar/tree` | Fetches the hierarchical tree structure of the navbar. | None | `{ success: true, tree: NavbarNode[] }` |

---

### 2. Admin Routes (Authentication Required)

For all requests below, include the header:
`Authorization: Bearer <YOUR_JWT_TOKEN>`

#### A. Pages Management (CRUD)

*   **Create Page (`POST /pages`)**
    *   **Body (JSON)**:
        ```json
        {
          "title": "About Our Team",
          "slug": "about-team",
          "content": "<h1>Our Team</h1><p>Welcome to our team page.</p>",
          "metaTitle": "About Our Team",
          "metaDescription": "Learn more about the team members."
        }
        ```
    *   **Validation**: `slug` must be lowercase alphanumeric and hyphens only (`/^[a-z0-9-]+$/`).
*   **Get All Pages (`GET /pages`)**
    *   **Response**: `{ success: true, pages: Page[] }`
*   **Get Page by ID (`GET /pages/:id`)**
    *   **Response**: `{ success: true, page: PageObject }`
*   **Update Page (`PUT /pages/:id`)**
    *   **Body (JSON)**: Partial update containing any of: `title`, `slug`, `content`, `metaTitle`, `metaDescription`.
*   **Delete Page (`DELETE /pages/:id`)**
    *   **Response**: `{ success: true, message: "Page deleted successfully" }`

---

#### B. Navbar Management (CRUD & Reorder)

*   **Create Navbar Item (`POST /navbar`)**
    *   **Body (JSON)**:
        ```json
        {
          "label": "About Us",
          "url": "/about-team", 
          "pageId": 1, 
          "parentId": null, 
          "order": 1,
          "isOpenNewTab": false
        }
        ```
    *   *Note: Either `url` or `pageId` can be linked.*
*   **Get All Navbar Items (`GET /navbar`)**
    *   **Response**: `{ success: true, items: NavbarItem[] }`
*   **Get Navbar Item by ID (`GET /navbar/:id`)**
    *   **Response**: `{ success: true, item: NavbarItemObject }`
*   **Update Navbar Item (`PUT /navbar/:id`)**
    *   **Body (JSON)**: Partial update of any navbar fields.
*   **Reorder Navbar Items (`PUT /navbar/reorder`)**
    *   **Body (JSON)**:
        ```json
        {
          "items": [
            { "id": 1, "order": 0, "parentId": null },
            { "id": 2, "order": 1, "parentId": 1 }
          ]
        }
        ```
*   **Delete Navbar Item (`DELETE /navbar/:id`)**
    *   **Response**: `{ success: true }`

---

## 🛠️ Frontend Integration Plan

We recommend setting up your CMS frontend module with the following components and state management structure:

```mermaid
graph TD
    subgraph State Manager (React Query / Pinia)
        PagesQuery[usePagesQuery]
        NavbarQuery[useNavbarQuery]
        Mutations[Create/Update/Delete Mutations]
    end

    subgraph Pages Component
        PageList[Pages Table / List Component] --> PageEditor[Rich Text Editor / Block Layout Editor]
    end

    subgraph Navbar Component
        NavbarTree[Drag-and-Drop Tree Organizer] --> ReorderAction[Reorder API Trigger]
    end

    PagesQuery --> PageList
    NavbarQuery --> NavbarTree
    Mutations --> PageEditor
    Mutations --> ReorderAction
```

---

## 📝 Copy-Pasteable Prompt for Frontend Integration

You can copy and paste the prompt below into an AI agent (or hand it to a developer) to automatically generate the React / Next.js / Vue code for your frontend:

````markdown
Please build a premium, fully-functional Headless CMS Frontend admin dashboard in TailwindCSS and TypeScript/React. The UI should have a modern, sleek glassmorphic dark-mode theme with clean typography and neon accent colors.

### Backend Endpoints:
The backend server runs at `http://localhost:5000`. All admin routes require an `Authorization: Bearer <TOKEN>` header.
1. `GET /api/cms/pages` - Lists all pages.
2. `POST /api/cms/pages` - Create page: requires `title`, `slug` (lowercase & hyphens only), `content` (HTML string), optional `metaTitle`, `metaDescription`.
3. `PUT /api/cms/pages/:id` - Update page: partial fields.
4. `DELETE /api/cms/pages/:id` - Delete page.
5. `GET /api/cms/navbar` - Get all navbar items.
6. `POST /api/cms/navbar` - Create item: requires `label`, optional `url`, `pageId` (number), `parentId` (number), `order` (number), `isOpenNewTab` (boolean).
7. `PUT /api/cms/navbar/reorder` - Reorder items: accepts `{"items": [{"id": 1, "order": 0, "parentId": null}]}`.
8. `PUT /api/cms/navbar/:id` - Update item: partial fields.
9. `DELETE /api/cms/navbar/:id` - Delete item.

### UI Requirements:
1. **Layout**: A left-sidebar navigation split into two tabs: "Pages" and "Navigation Menu".
2. **Pages Tab**:
   - A list/table of pages showing fields (Title, Slug, Meta Title).
   - An "Add Page" dialog button.
   - A rich page editor using a basic HTML rich text area or block elements with inputs for metadata.
   - Fully validate the Slug field using the regex `/^[a-z0-9-]+$/`.
3. **Navigation Menu Tab**:
   - A drag-and-drop hierarchy visualizer or simple buttons (e.g., Up, Down, Nest under node) to rearrange the navbar items.
   - Add/edit drawer for navbar items containing inputs for Label, Path/URL, Page association, Parent selection, and target ("Open in new tab").
   - A "Save Changes" button that fires `PUT /navbar/reorder` when positions or parents are updated.

### Tech Stack:
- TailwindCSS for layout, using absolute positioning, backdrops, and glassmorphism.
- TypeScript for type-safety.
- React/Next.js or React Router for state management (TanStack Query/Fetch preferred).
- Keep component structures modular and reusable.
````
