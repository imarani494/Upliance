📜 Description
This project is a React application integrated with Redux for efficient state management. It provides a scalable structure to handle global application state, making it easier to manage complex data flows between components.


## 📌 Features
- React for building UI components
- Redux for state management
- Redux Provider for passing the store to components
- Modular project structure

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

upliance-form-builder/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ public/
│  └─ index.html
└─ src/
   ├─ main.tsx
   ├─ index.css
   ├─ App.tsx
   ├─ models/
   │  └─ formModels.ts
   ├─ store/
   │  ├─ formSlice.ts
   │  └─ index.ts
   ├─ hooks/
   │  └─ useLocalStorage.ts
   └─ components/
      ├─ Shared/
      │  ├─ CustomTextField.tsx
      │  └─ FormField.tsx
      ├─ FormCreator/
      │  ├─ index.tsx            <- main form builder page (FormCreator)
      │  ├─ FieldList.tsx
      │  └─ FieldConfigurator.tsx
      ├─ FormRenderer/
      │  └─ index.tsx            <- preview / render form
      ├─ MyForms/
      │  └─ index.tsx
      └─ Preview/
         └─ index.tsx



🛠 Technologies Used
React – UI library

Redux – State management

React Redux – Official bindings for Redux with React

JavaScript (ES6+)
