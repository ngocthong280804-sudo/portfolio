# 📝 Hướng dẫn chỉnh sửa Portfolio

Toàn bộ nội dung nằm trong 3 file:
- `index.html` — **toàn bộ chữ nghĩa, nội dung** (sửa nhiều nhất ở đây)
- `css/style.css` — màu sắc, cỡ chữ, khoảng cách
- `js/main.js` — hiệu ứng chuyển động

Mở file bằng Notepad, VS Code hoặc bất kỳ trình soạn thảo nào. Sửa xong bấm **Ctrl+S** rồi refresh trình duyệt (**Ctrl+R**) là thấy thay đổi.

---

## 1. Sửa chữ nghĩa (index.html)

Tìm (Ctrl+F) đoạn cần sửa rồi thay chữ giữa các thẻ `>...<`:

| Muốn sửa | Tìm từ khóa |
|---|---|
| Tên trên menu | `nav__logo` |
| Dòng tên chạy chữ ở đầu trang | mở `js/main.js`, tìm `typeText` |
| Câu giới thiệu hero | `hero__intro` |
| Các từ xoay vòng (câu chuyện, doanh thu…) | mở `js/main.js`, tìm `const words` |
| Số liệu (8 năm, 47 chiến dịch…) | `data-count` |
| % kỹ năng | `data-pct` (sửa cả số trong `--pct:95%`) |
| Tên & mô tả dự án | `card__name`, `card__desc` |
| Lời nhận xét khách hàng | `<blockquote>` |
| Kinh nghiệm làm việc | `timeline__item` |
| Email liên hệ | `mailto:` (sửa cả 2 chỗ) |
| Link mạng xã hội | `contact__socials` — thay `href="#"` bằng link thật |

---

## 2. Thêm ảnh

**Bước 1:** tạo thư mục `images` trong `portfolio-marketing`, bỏ ảnh vào đó
(nên đặt tên không dấu: `du-an-1.jpg`, `chan-dung.jpg`…)

**Bước 2 — Ảnh cho dự án:** trong `index.html`, mỗi dự án có khối:

```html
<div class="card__visual card__visual--thuc">
  <span class="card__index">№1</span>
  <span class="card__badge">+214% nhận diện</span>
</div>
```

Thêm 1 dòng `<img>` vào ngay sau thẻ `<div ...>`:

```html
<div class="card__visual card__visual--thuc">
  <img src="images/du-an-1.jpg" alt="Chiến dịch Thức Coffee" class="card__img">
  <span class="card__badge">+214% nhận diện</span>
</div>
```

(bỏ dòng `card__index` nếu không muốn hiện số №1 đè lên ảnh)

**Bước 3 — Ảnh chân dung (phần Về tôi):** tìm `portrait-card`, thêm:

```html
<div class="portrait-card" data-tilt>
  <img src="images/chan-dung.jpg" alt="Trần Ngọc Thông" class="portrait-card__img">
  ...
</div>
```

CSS cho 2 loại ảnh này **đã có sẵn** trong `style.css` (mục ẢNH TÙY CHỌN ở cuối file) — chỉ cần thêm thẻ `<img>` là ảnh tự vừa khung, bo góc đẹp.

---

## 3. Đổi màu sắc

Mở `css/style.css`, tất cả màu nằm ở đầu file trong `:root`:

```css
--pearl:  #fbf8ff;   /* nền sáng */
--ink:    #241640;   /* màu chữ chính */
--violet: #2b1b5e;   /* nền các khối tối */
--pink:   #ff3e9a;   /* hồng neon (nút, điểm nhấn) */
--aqua:   #3ee6d8;   /* xanh ngọc */
--lilac:  #a78bfa;   /* tím lilac */
```

Đổi mã hex là toàn trang đổi theo.

---

## 4. Chạy web trên máy

Nháy đúp `index.html` là mở được ngay (cần mạng để tải font + hiệu ứng 3D lần đầu).
