# 🖥️ Lab Management System — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![MUI](https://img.shields.io/badge/Material_UI-7.0-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Nginx-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Giao diện người dùng hiện đại** cho hệ thống quản lý phòng thực hành (Lab Management System) — được xây dựng bằng React 18 + TypeScript, với trải nghiệm người dùng mượt mà, real-time notifications qua WebSocket, đa ngôn ngữ (i18n) và dashboard thống kê trực quan.

[🔗 Backend Repo](https://github.com/NgSang0127/lab_management_be) · [🐛 Báo lỗi](https://github.com/NgSang0127/lab_management_ui/issues)

</div>

---

## 📋 Mục lục

- [Tổng quan dự án](#-tổng-quan-dự-án)
- [Tính năng chính](#-tính-năng-chính)
- [Tech Stack](#-tech-stack)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt & chạy](#-hướng-dẫn-cài-đặt--chạy)
- [Biến môi trường](#-biến-môi-trường)
- [Scripts](#-scripts)
- [Kiến trúc State Management](#-kiến-trúc-state-management)
- [Kết nối Backend & WebSocket](#-kết-nối-backend--websocket)
- [Docker & Triển khai](#-docker--triển-khai)
- [Đóng góp](#-đóng-góp)
- [Tác giả](#-tác-giả)

---

## 🎯 Tổng quan dự án

**Lab Management UI** là phần giao diện người dùng (frontend) của hệ thống quản lý phòng thực hành — đồ án luận văn tốt nghiệp tại **Trường Đại học Quốc tế (HCMIU)**. Ứng dụng cho phép ba nhóm người dùng tương tác với hệ thống qua giao diện trực quan, đáp ứng và đa ngôn ngữ:

- **Admin / Giáo vụ**: Quản lý toàn bộ hệ thống — người dùng, phòng lab, thiết bị, thời khoá biểu, báo cáo thống kê.
- **Giảng viên**: Xem & đặt lịch sử dụng phòng, quản lý lớp học, nhận thông báo real-time.
- **Sinh viên**: Tra cứu lịch học, tình trạng phòng và thiết bị.

Dự án áp dụng kiến trúc **Component-based** với **TypeScript** toàn phần, state management tập trung bằng **Redux Toolkit**, và giao tiếp real-time qua **STOMP over WebSocket**.

---

## ✨ Tính năng chính

### 🔐 Xác thực & Bảo mật
- Đăng nhập / Đăng ký với validation đầy đủ phía client
- **JWT Token** — tự động attach vào mọi request qua Axios interceptor
- **Refresh Token** — tự động làm mới phiên khi token hết hạn (silent refresh)
- **Two-Factor Authentication (2FA)** — tích hợp Google Authenticator TOTP
- Xác thực email qua OTP (nhập mã từ email)
- **Route Guard** — bảo vệ trang theo role (`ADMIN`, `TEACHER`, `STUDENT`)
- Logout xử lý sạch token phía client và redirect

### 📅 Quản lý Lịch & Đặt Phòng
- Xem lịch sử dụng phòng theo tuần / tháng (calendar view)
- Đặt lịch / huỷ đặt phòng với kiểm tra conflict real-time
- Quản lý thời khoá biểu theo học kỳ
- Hiển thị trạng thái phòng: Trống / Đang sử dụng / Bảo trì

### 🏛️ Quản lý Phòng & Thiết bị
- Danh sách phòng lab với filter, sort, phân trang (MUI DataGrid)
- Chi tiết từng phòng: sức chứa, thiết bị, trạng thái, lịch sử đặt
- Quản lý thiết bị: CRUD, theo dõi tình trạng hoạt động
- Import dữ liệu hàng loạt từ Excel

### 📊 Dashboard & Thống kê
- Tổng quan hệ thống với các số liệu quan trọng
- **Biểu đồ thống kê** tỷ lệ sử dụng phòng, thiết bị (Chart.js + react-chartjs-2)
- Báo cáo theo khoảng thời gian (date range picker)
- Xuất báo cáo Excel trực tiếp từ trình duyệt

### 📡 Real-time Notifications
- **WebSocket (STOMP)** — nhận thông báo tức thì khi:
  - Lịch đặt phòng được duyệt / từ chối
  - Trạng thái phòng / thiết bị thay đổi
  - Có lịch học mới được tạo
- Notification center với badge đếm số thông báo chưa đọc

### 🌐 Đa ngôn ngữ (i18n)
- Hỗ trợ **Tiếng Việt** và **Tiếng Anh**
- Tự động phát hiện ngôn ngữ trình duyệt (`i18next-browser-languagedetector`)
- Tải file ngôn ngữ theo yêu cầu từ backend (`i18next-http-backend`)
- Chuyển đổi ngôn ngữ mượt mà, không cần reload trang

### 🎨 UI/UX & Thiết kế
- **Material UI v7** — component library chuyên nghiệp
- **Tailwind CSS v3** — utility-first styling linh hoạt
- **Framer Motion** — animation mượt mà cho transitions và interactions
- **React Slick** — carousel / slider cho nội dung trực quan
- **Responsive Design** — tương thích desktop và mobile
- Dark / Light mode toggle
- Loading skeleton, error boundary, toast notifications

### 🗺️ Bản đồ
- Tích hợp **Google Maps API** (`@react-google-maps/api`) hiển thị vị trí phòng lab trong khuôn viên trường

---

## 🛠️ Tech Stack

### Core Framework
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | 5.5.3 | Type safety toàn phần |
| Vite | 6.0.9 | Build tool & Dev server cực nhanh |

### State Management & Data Fetching
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Redux Toolkit | 2.2.7 | Global state management |
| React Redux | 9.1.2 | React bindings cho Redux |
| Redux Thunk | 3.1.0 | Async action middleware |
| TanStack React Query | 5.62.8 | Server state, caching, refetching |
| Axios | 1.7.5 | HTTP client với interceptors |

### UI Components & Styling
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Material UI (MUI) | 7.0.2 | Component library chính |
| MUI Icons Material | 7.0.0 | Icon set Material Design |
| MUI X DataGrid | 7.28.2 | Bảng dữ liệu nâng cao (sort, filter, paginate) |
| MUI X Date Pickers | 8.0.0 | Date/Time picker components |
| Emotion React + Styled | 11.x | CSS-in-JS (MUI dependency) |
| Tailwind CSS | 3.4.10 | Utility-first CSS framework |
| Framer Motion | 12.6.5 | Animation & transition |
| React Slick | 0.30.2 | Carousel/slider |

### Routing & Navigation
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| React Router DOM | 6.26.1 | Client-side routing |
| React Scroll | 1.9.3 | Smooth scroll navigation |

### Real-time Communication
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| @stomp/stompjs | 7.0.0 | STOMP protocol client |
| sockjs-client | 1.5.2 | WebSocket fallback transport |
| stompjs | 2.3.3 | STOMP legacy support |

### Charts & Visualization
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Chart.js | 4.4.6 | Charting library |
| react-chartjs-2 | 5.2.0 | React wrapper cho Chart.js |

### Internationalization (i18n)
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| i18next | 24.2.2 | i18n framework |
| react-i18next | 15.4.0 | React bindings |
| i18next-browser-languagedetector | 8.0.2 | Tự phát hiện ngôn ngữ |
| i18next-http-backend | 3.0.2 | Load file ngôn ngữ từ server |

### Utilities
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| date-fns | 4.1.0 | Xử lý và format ngày giờ |
| lodash.debounce | 4.0.8 | Debounce cho search input |
| react-helmet-async | 2.0.5 | Dynamic `<head>` tags (SEO) |
| @react-google-maps/api | 2.20.6 | Google Maps integration |

### Build & Dev Tools
| Công nghệ | Mục đích |
|---|---|
| Vite + @vitejs/plugin-react | HMR, bundling, dev server |
| TypeScript + tsc | Type checking |
| ESLint + typescript-eslint | Code linting |
| PostCSS + Autoprefixer | CSS processing |
| Docker + Nginx | Production containerization |

---

## 📁 Cấu trúc dự án

```
lab_management_ui/
├── public/                      # Static assets (favicon, images tĩnh)
├── src/
│   ├── assets/
│   │   └── images/              # Hình ảnh (alias: @images)
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared: Button, Modal, Table, Loading...
│   │   ├── layout/              # Header, Sidebar, Footer, Layout wrapper
│   │   └── feature/             # Feature-specific components
│   ├── pages/                   # Page-level components (route destinations)
│   │   ├── auth/                # Login, Register, ForgotPassword, 2FA
│   │   ├── admin/               # Trang quản trị (Users, Labs, Devices...)
│   │   ├── teacher/             # Trang giảng viên (Booking, Schedule)
│   │   ├── student/             # Trang sinh viên (View schedule, Labs)
│   │   └── dashboard/           # Dashboard & Analytics
│   ├── store/                   # Redux store
│   │   ├── index.ts             # Store configuration
│   │   └── slices/              # Redux Toolkit slices (auth, lab, booking...)
│   ├── services/                # API calls (Axios instances & endpoints)
│   │   ├── api.ts               # Axios instance với interceptors
│   │   └── *.service.ts         # Service files theo domain
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useWebSocket.ts
│   │   └── useDebounce.ts
│   ├── routes/                  # Route config & ProtectedRoute guards
│   ├── types/                   # TypeScript type definitions & interfaces
│   ├── utils/                   # Helper functions, constants, formatters
│   ├── i18n/                    # i18next config & locale files
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── vi/              # Tiếng Việt translations
│   │       └── en/              # English translations
│   ├── App.tsx                  # Root component, Router setup
│   └── main.tsx                 # Entry point, Redux Provider, i18n init
├── Dockerfile                   # Multi-stage build: Node (build) → Nginx (serve)
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite config (proxy, alias, plugins)
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
├── eslint.config.js             # ESLint rules
└── package.json                 # Dependencies & scripts
```

---

## 💻 Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Node.js | 18.x LTS trở lên |
| npm | 9.x trở lên |
| Docker | 20.10+ (nếu dùng container) |
| Git | 2.x+ |

> **Lưu ý**: Backend Spring Boot phải đang chạy tại `http://localhost:8080` trước khi khởi động frontend dev server (để WebSocket proxy hoạt động).

---

## 🚀 Hướng dẫn cài đặt & chạy

### 1. Clone repository

```bash
git clone https://github.com/NgSang0127/lab_management_ui.git
cd lab_management_ui
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Chạy môi trường Development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

Dev server có cấu hình **WebSocket proxy** tự động:
- Request tới `/ws` sẽ được forward sang `http://localhost:8080` (Backend)
- Hot Module Replacement (HMR) hoạt động tức thì khi sửa code

### 4. Build cho Production

```bash
npm run build
```

Output sẽ được tạo trong thư mục `dist/`. Có thể preview bản build:

```bash
npm run preview
```

---

## 🐳 Docker & Triển khai

### Build Docker image

```bash
docker build -t lab/lab-ui:0.0.1-SNAPSHOT .
```

### Quy trình build trong Dockerfile (Multi-stage)

```
Stage 1 — Build (node:18)
  └── npm install → npm run build → /app/dist

Stage 2 — Serve (nginx:alpine)
  └── Copy /app/dist → /usr/share/nginx/html
  └── Expose port 80
```

Ứng dụng được phục vụ bởi **Nginx** — nhẹ, nhanh và phù hợp production.

### Chạy với Docker Compose (cùng backend)

Khi dùng kết hợp với [lab_management_be](https://github.com/NgSang0127/lab_management_be), container frontend được cấu hình trong `docker-compose.yml` của backend:

```yaml
vite-typescript-app:
  container_name: lab_management_ui
  image: lab/lab-ui:0.0.1-SNAPSHOT
  ports:
    - "5173:80"
  networks:
    - lab-management-network
  depends_on:
    - springboot-app
```

Truy cập UI tại: **http://localhost:5173**

---

## 🌍 Biến môi trường

Tạo file `.env` hoặc `.env.local` tại thư mục gốc:

```env
# URL của Backend API
VITE_API_BASE_URL=http://localhost:8080

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

> Tất cả biến môi trường trong Vite phải có tiền tố `VITE_` để được expose ra phía client.

Trong code TypeScript:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 📜 Scripts

| Script | Lệnh | Mô tả |
|---|---|---|
| `dev` | `npm run dev` | Khởi động dev server với HMR |
| `build` | `npm run build` | Type-check + build production bundle |
| `preview` | `npm run preview` | Preview bản build production local |
| `lint` | `npm run lint` | Chạy ESLint kiểm tra code style |

---

## 🏗️ Kiến trúc State Management

Dự án sử dụng **Redux Toolkit** cho global state kết hợp với **TanStack React Query** cho server state:

```
┌─────────────────────────────────────────────────┐
│                   React Components               │
├────────────────┬────────────────────────────────┤
│  Redux Store   │      React Query Cache          │
│  (Client UI    │  (Server data: lists, details,  │
│   state: auth, │   paginated results, mutations) │
│   theme, notif)│                                 │
├────────────────┴────────────────────────────────┤
│              Axios API Service Layer             │
│    (Base URL, JWT interceptor, error handler)    │
└─────────────────────────────────────────────────┘
```

**Redux Toolkit Slices:**
- `authSlice` — thông tin user đăng nhập, tokens, trạng thái auth
- `notificationSlice` — danh sách thông báo, số badge chưa đọc
- `uiSlice` — theme (dark/light), ngôn ngữ, sidebar state

**React Query** xử lý:
- Fetching danh sách phòng, thiết bị, lịch đặt
- Caching và background refetch tự động
- Optimistic updates khi thực hiện mutations

---

## 🔌 Kết nối Backend & WebSocket

### HTTP API (Axios)

```typescript
// services/api.ts
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor: tự động gắn JWT token vào header
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: xử lý 401 → tự động refresh token
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken();
      return axiosInstance(error.config);
    }
  }
);
```

### WebSocket (STOMP)

```typescript
// hooks/useWebSocket.ts
const client = new Client({
  webSocketFactory: () => new SockJS('/ws'),
  onConnect: () => {
    // Subscribe kênh thông báo cá nhân
    client.subscribe(`/user/${userId}/notifications`, (message) => {
      dispatch(addNotification(JSON.parse(message.body)));
    });
  },
});
```

Vite dev server proxy WebSocket:
```typescript
// vite.config.ts
server: {
  proxy: {
    "/ws": {
      target: "http://localhost:8080",
      ws: true,         // ← Bật WebSocket proxy
      changeOrigin: true,
    },
  },
},
```

---

## 🤝 Đóng góp

Dự án hiện là đề tài luận văn cá nhân. Nếu bạn muốn đóng góp ý kiến hoặc báo lỗi:

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m 'feat: thêm tính năng X'`
4. Push branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## 👨‍💻 Tác giả

**NgSang0127**

- GitHub: [@NgSang0127](https://github.com/NgSang0127)
- Trường: International University — HCMIU (Vietnam National University, HCM City)

---

## 🔗 Liên kết liên quan

| Repo | Mô tả |
|---|---|
| [lab_management_be](https://github.com/NgSang0127/lab_management_be) | Backend API — Spring Boot 3 + MySQL + Redis + ELK |
| [lab_management_ui](https://github.com/NgSang0127/lab_management_ui) | Frontend — React 18 + TypeScript + Vite (repo này) |

---

<div align="center">

Made with ❤️ as a Thesis Project at HCMIU

⭐ Nếu dự án này hữu ích, hãy cho một star để ủng hộ!

</div>
