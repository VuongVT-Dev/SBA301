# SBA301 - Lab 05

Cấu trúc dự án:

```text
SBA301-Lab05/
├── chapter15api/                 # Spring Boot backend
│   ├── pom.xml
│   └── src/main/
│       ├── java/fu/se/chapter15api/
│       │   ├── Chapter15apiApplication.java
│       │   ├── configs/CorsConfig.java
│       │   ├── controllers/OrchidController.java
│       │   ├── pojos/Orchid.java
│       │   ├── repositories/IOrchidRepository.java
│       │   └── services/
│       │       ├── IOrchidService.java
│       │       └── OrchidService.java
│       └── resources/application.properties
└── chapter15reactjs/             # React/Vite frontend
    ├── .env
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── services/orchidApi.js
        └── components/
            ├── NavBar.jsx
            ├── ListOfOrchids.jsx
            └── EditOrchid.jsx
```

## Chạy dự án

### Backend (Spring Boot):
```bash
cd chapter15api
./mvnw spring-boot:run # hoặc mvn spring-boot:run
```

### Frontend (React/Vite):
```bash
cd chapter15reactjs
npm install
npm run dev
```
