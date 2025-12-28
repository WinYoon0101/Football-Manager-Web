# ⚽ Football Manager Web
Hệ thống quản lý Giải Bóng Đá Vô Địch Quốc Gia


---

## 📌 Giới thiệu
**Football Manager Web** là một ứng dụng web được xây dựng nhằm hỗ trợ quản lý và theo dõi toàn bộ hoạt động của giải bóng đá vô địch quốc gia.  
Hệ thống cho phép quản lý đội bóng, cầu thủ, mùa giải, lịch thi đấu, kết quả trận đấu và bảng xếp hạng một cách trực quan, chính xác và hiệu quả.

---

## 🎯 Mục tiêu
- Xây dựng hệ thống quản lý giải bóng đá trên nền tảng web
- Áp dụng kiến thức Frontend, Backend và Cơ sở dữ liệu
- Thiết kế giao diện thân thiện, dễ sử dụng
- Mô phỏng quy trình tổ chức và quản lý một giải đấu thực tế

---

## 🧩 Chức năng chính

### 👤 Quản lý người dùng
- Đăng nhập / đăng xuất
- Phân quyền người dùng:
  - **Admin**: quản lý toàn bộ hệ thống
  - **Quản lý đội bóng**: đăng ký tham gia mùa giải
  - **Người xem**: theo dõi thông tin giải đấu

---

### 🏆 Quản lý mùa giải
- Tạo mới và quản lý **mùa giải bóng đá**
- Thiết lập thông tin mùa giải:
  - Tên mùa giải
  - Thời gian bắt đầu – kết thúc
  - Trạng thái (Chuẩn bị / Đang diễn ra / Kết thúc)
- Mỗi mùa giải có:
  - Danh sách đội tham gia
  - Lịch thi đấu
  - Bảng xếp hạng riêng

---

### 📝 Tiếp nhận & duyệt đơn đăng ký đội bóng
- Đội bóng gửi **đơn đăng ký tham gia mùa giải**
- Admin xem xét và:
  - Duyệt đơn đăng ký
  - Từ chối đơn đăng ký
- Kiểm tra hồ sơ đăng ký theo quy định:
  - Số lượng cầu thủ hợp lệ
  - Độ tuổi cầu thủ
  - Số cầu thủ nước ngoài
- Chỉ đội được duyệt mới được tham gia mùa giải

---

### 🏟️ Quản lý đội bóng
- Thêm, sửa, xóa đội bóng
- Cập nhật thông tin đội bóng:
  - Tên đội
  - Logo
  - Sân nhà
- Quản lý danh sách cầu thủ của đội

---

### 🧑‍🤝‍🧑 Quản lý & tra cứu cầu thủ
- Quản lý danh sách cầu thủ theo đội
- Tra cứu cầu thủ theo:
  - Tên cầu thủ
  - Đội bóng
- Hiển thị thông tin:
  - Ngày sinh
  - Vị trí
  - Loại cầu thủ
  - Tổng số bàn thắng

---

### 📅 Quản lý lịch thi đấu
- Lập lịch thi đấu cho từng mùa giải
- Hỗ trợ **lượt đi – lượt về**
- Hiển thị:
  - Vòng đấu
  - Ngày – giờ
  - Sân thi đấu
- Cập nhật trạng thái trận đấu

---

### ⚽ Ghi nhận kết quả thi đấu
- Nhập kết quả trận đấu:
  - Tỷ số
  - Cầu thủ ghi bàn
  - Thời điểm ghi bàn
- Phân loại bàn thắng theo từng loại
- Tự động cập nhật:
  - Điểm số đội bóng
  - Thống kê cầu thủ

---

### 📊 Bảng xếp hạng & báo cáo
- Tự động lập bảng xếp hạng cho từng mùa giải
- Xếp hạng dựa trên:
  - Điểm số
  - Hiệu số bàn thắng
  - Thành tích đối kháng
- Báo cáo:
  - Danh sách cầu thủ ghi bàn
  - Thống kê thành tích đội bóng

---

### ⚙️ Cài đặt & thay đổi quy định giải đấu
- Admin có thể cấu hình các quy định:
  - Độ tuổi tối thiểu – tối đa của cầu thủ
  - Số lượng cầu thủ mỗi đội
  - Số cầu thủ nước ngoài tối đa
  - Số loại bàn thắng
  - Điểm thắng – hòa – thua
  - Thứ tự ưu tiên xếp hạng
- Hệ thống đảm bảo:
  - Điểm thắng > điểm hòa > điểm thua
- Quy định mới được áp dụng cho các mùa giải tiếp theo

---

## 🖥️ Công nghệ sử dụng

### Frontend
- React / Next.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js

### Cơ sở dữ liệu
- Neon (PostgreSQL)

### Công cụ hỗ trợ
- Git & GitHub
- Vercel (Deploy)
- Postman (Test API)

---

## 🏗️ Kiến trúc hệ thống
- Mô hình Client – Server
- RESTful API
- Tách biệt Frontend và Backend
- Dữ liệu được quản lý tập trung

---

## 🚀 Cài đặt & Chạy dự án (Local)



# Cài đặt frontend
cd frontend
npm install
npm run dev

# Cài đặt backend
cd backend
npm install
npm run dev
