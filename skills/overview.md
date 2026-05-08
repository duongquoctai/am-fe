#This # 01. Project Overview - AM

**Tên dự án:** AM Frontend (Internal Name: AM)  
**Phiên bản hiện tại:** 3.2.0  
**Ngày cập nhật:** 20/04/2026  
**Owner:** AM Team

## Giới thiệu về AM

### AM là gì?

AM là 1 nền tảng về marketing chuyên về affiliate marketing. Workflow sẽ tập trung vào việc crawl các video sản phẩm trên social media, sau đó tích hợp gắn link shopee để thúc đẩy doanh thu, nhận tiền hoa hồng.

### Đối tượng của AM là ai?

Người dùng muốn thúc đẩy doanh số bán hàng từ các sản phẩm.

### Nhiệm vụ của AM là gì?

Chuyên về Affiliate Marketing. Nhưng ở phase đầu tiên có thể tập trung vào việc crawl các video sản phẩm trên social media ( instagram, facebook, xiaohongshu, douyin, tiktok ...), sau đó tích hợp gắn link shopee để thúc đẩy doanh thu, nhận tiền hoa hồng.

## 1. Mục tiêu kinh doanh (Business Objectives)

Tất cả các video được crawl về sẽ được gắn link shopee để thúc đẩy doanh thu, nhận tiền hoa hồng.

## 2. Stakeholders & User Persona

## 3. Phạm vi hiện tại (In-Scope / Out-of-Scope)

## 4. High-level Architecture (Tóm tắt)

Sourcecode này sử dụng App Router của NextJS technical stack chính cho AM.

- Có thể dùng làm fullstack project thông qua Server Action và Supabase, cho việc đọc ghi dữ liệu.
- Có thể dùng làm frontend project, tức là chỉ xây dựng giao diện và API.
- Trong thư mục database/db-schema.sql có chứa đoạn SQL để tạo database cho AM, hãy kiểm tra kỹ schema trước khi thực hiện bất kỳ tác vụ nào liên quan đến database.
- Đối với các component front-end, cần phân tích kỹ các component nào có khả năng reuse để tách thành component riêng biệt, dùng lại ở các trang khác.
- Không được viết code dài ngoằng thiếu tối ưu, cần split code để đảm bảo dễ đọc, dễ bảo trì.
- Không sử dụng icon svg trực tiếp, dùng thư viện iconify để lấy icon.
- Không sử dụng state lung tung để tránh rerender, có thể tối ưu bằng useCallback, useMemo, useRef.
- Các việc liên quan đến css luôn phải cân nhắc về light/dark mode và tham khảo file design.md để đảm bảo tính thẩm mỹ.

# PHASE 1

# Project Overview: Affiliate Marketing System - Frontend & Backend (am-fe)

## 1. AI Persona & Role

- **Role:** Senior Fullstack Engineer (Next.js, React).
- **Task:** Xây dựng hệ thống quản lý, giao diện người dùng và API Gateway cho dự án Auto Affiliate Marketing.
- **Mindset:** Code clean, component tái sử dụng, handle error triệt để, tối ưu UX/UI và đảm bảo an toàn API.

## 2. Project Context & Workflow

Đây là Phase 1 của dự án. Workflow tổng thể:

1. User nhập `keyword` trên UI.
2. `am-fe` lưu log và trigger gọi API sang hệ thống Data Engineering (`am-de`) để bắt đầu crawl video từ Instagram.
3. `am-fe` nhận kết quả trả về từ `am-de` (hoặc query từ Database chung) để hiển thị danh sách Video đã crawl thành công (Kèm link play video, metadata).

## 3. Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI/Styling:** Tailwind CSS, Shadcn UI (hoặc Ant Design tùy chọn)
- **Database ORM:** Prisma hoặc Drizzle (kết nối Supabase PostgreSQL)
- **State Management:** Zustand hoặc React Query (để polling trạng thái job)

## 4. Phase 1 - Core Features (To-Do)

- **Feature 1: Dashboard UI.** Giao diện có một input form để nhập "Keyword" và chọn "Platform" (hiện tại fix là Instagram).
- **Feature 2: Job Triggering.** Backend API route nhận keyword từ frontend, sau đó forward request (POST) sang server `am-de` (chạy Python/FastAPI) để khởi tạo job crawl.
- **Feature 3: Job Status Tracking.** Hiển thị trạng thái các job đang chạy (Pending, Processing, Success, Failed). Có thể dùng polling call API hoặc Webhook.
- **Feature 4: Video Gallery.** Grid view hiển thị các video đã crawl thành công về từ database (bao gồm Video Player, Nguồn IG, Thời gian lấy, Trạng thái sẵn sàng post).

## 5. System Architecture Note

- Hệ thống này (`am-fe`) KHÔNG trực tiếp đi crawl data. Trách nhiệm crawl thuộc về `am-de`.
- Video media URLs sẽ được lưu trên Cloudinary, `am-fe` chỉ lưu link URL trong database để render.
