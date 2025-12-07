# SLIDES_DATA - Hướng Dẫn Tạo Dữ Liệu Trình Chiếu

## 📚 Tổng Quan

`SLIDES_DATA` là một object JavaScript chứa toàn bộ dữ liệu cho presentation. Nó bao gồm thông tin chung về presentation và một mảng các slides với nhiều loại khác nhau.

---

## 🏗️ Cấu Trúc Chính

```javascript
const SLIDES_DATA = {
  "presentation": {
    // Thông tin chung về presentation
  },
  "slides": [
    // Mảng các slide objects
  ]
};
```

---

## 📋 1. PRESENTATION OBJECT

Object chứa metadata của presentation.

### Thuộc Tính

| Thuộc Tính | Kiểu | Bắt Buộc | Mô Tả |
|------------|------|----------|-------|
| `title` | String | ✅ | Tiêu đề của presentation |
| `totalSlides` | Number | ✅ | Tổng số slides trong presentation |

### Ví Dụ

```javascript
"presentation": {
  "title": "Decentralized Federated Learning for Bearing Anomaly Detection",
  "totalSlides": 20
}
```

---

## 🎯 2. SLIDES ARRAY

Mảng chứa các slide objects. Mỗi slide có thuộc tính chung và thuộc tính riêng tùy theo `type`.

---

## 🔧 3. THUỘC TÍNH CHUNG CỦA SLIDE

Các thuộc tính này có sẵn cho mọi loại slide:

| Thuộc Tính | Kiểu | Bắt Buộc | Mô Tả |
|------------|------|----------|-------|
| `id` | Number | ✅ | ID duy nhất của slide |
| `type` | String | ✅ | Loại slide: `"title"`, `"content"`, `"image"`, `"thank-you"` |
| `title` | String | ✅ | Tiêu đề chính của slide |
| `subtitle` | String | ❌ | Tiêu đề phụ (optional) |
| `badges` | Array | ❌ | Mảng các badge objects để hiển thị tags |

### Badge Object

```javascript
{
  "text": "Machine Learning",  // Nội dung badge
  "color": "green"           // Màu: blue, green, yellow, red, purple, orange
}
```

**Màu sắc hỗ trợ:** `blue`, `green`, `yellow`, `red`, `purple`, `orange`

---

## 📝 4. LOẠI SLIDE: `"title"`

Slide tiêu đề, thường dùng cho slide đầu tiên của presentation.

### Cấu Trúc

```javascript
{
  "id": 1,
  "type": "title",
  "title": "Tiêu Đề Chính",
  "subtitle": "Tiêu đề phụ",
  "badges": [...],
  "layout": "two-column",
  "columns": [...]
}
```

### Thuộc Tính Đặc Biệt

| Thuộc Tính | Kiểu | Bắt Buộc | Mô Tả |
|------------|------|----------|-------|
| `layout` | String | ❌ | Layout type: `"two-column"` |
| `columns` | Array | ❌ | Mảng các column objects (khi có layout) |

### Ví Dụ Đầy Đủ

```javascript
{
  "id": 1,
  "type": "title",
  "title": "Decentralized Federated Learning",
  "subtitle": "Ứng Dụng Phát Hiện Bất Thường Trong Dữ Liệu Vòng Bi",
  "badges": [
    { "text": "Machine Learning", "color": "green" },
    { "text": "IoT", "color": "yellow" },
    { "text": "Privacy-Preserving", "color": "red" }
  ],
  "layout": "two-column",
  "columns": [
    {
      "title": "Đội Ngũ Thực Hiện",
      "cards": [
        {
          "icon": "👥",
          "iconColor": "green",
          "title": "Nhóm TEAM6",
          "content": "Lê Đức Phương<br> Phạm Văn Thành"
        }
      ]
    },
    {
      "title": "Thông Tin Khóa Học",
      "cards": [...]
    }
  ]
}
```

---

## 📊 5. LOẠI SLIDE: `"content"`

Slide nội dung, dùng để hiển thị thông tin chi tiết với cards hoặc tables.

### Cấu Trúc

```javascript
{
  "id": 2,
  "type": "content",
  "title": "Tiêu Đề",
  "subtitle": "Tiêu đề phụ (optional)",
  "badges": [...],
  "layout": "two-column" hoặc "table",
  // Tùy layout:
  "columns": [...],           // Với layout: "two-column"
  "table": {...},             // Với layout: "table"
  "additionalCards": [...]    // Cards bổ sung (optional)
}
```

### Layout Options

#### A. Layout: `"two-column"`

Hiển thị nội dung theo 2 cột với cards.

```javascript
"layout": "two-column",
"columns": [
  {
    "title": "Cột Trái",
    "cards": [...]
  },
  {
    "title": "Cột Phải",
    "cards": [...]
  }
]
```

**Card Object:**

| Thuộc Tính | Kiểu | Bắt Buộc | Mô Tả |
|------------|------|----------|-------|
| `icon` | String | ❌ | Emoji hoặc icon Unicode |
| `iconColor` | String | ❌ | Màu icon: blue, green, red, yellow, purple, orange |
| `title` | String | ✅ | Tiêu đề card |
| `content` | String | ❌ | Nội dung chi tiết (hỗ trợ HTML tags: `<br>`, `<strong>`) |
| `dialogImage` | String | ❌ | Đường dẫn hình ảnh hiển thị khi click vào card |

**Ví dụ Card:**

```javascript
{
  "icon": "🔄",
  "iconColor": "blue",
  "title": "Peer-to-Peer",
  "content": "Peers giao tiếp trực tiếp, không có server",
  "dialogImage": "../reports_dfl/bearing.png"  // Optional: hiển thị ảnh khi click
}
```

**Ví dụ Card Đơn Giản (chỉ có title):**

```javascript
{
  "icon": "🏭",
  "iconColor": "blue",
  "title": "Predictive Maintenance"
}
```

#### B. Layout: `"table"`

Hiển thị dữ liệu dạng bảng.

```javascript
"layout": "table",
"table": {
  "headers": ["Cột 1", "Cột 2", "Cột 3"],
  "rows": [
    ["Dữ liệu 1", "Dữ liệu 2", "Dữ liệu 3"],
    ["Dữ liệu 4", "Dữ liệu 5", "Dữ liệu 6"]
  ]
}
```

**Table Object:**

| Thuộc Tính | Kiểu | Bắt Buộc | Mô Tả |
|------------|------|----------|-------|
| `headers` | Array[String] | ✅ | Mảng tên các cột |
| `rows` | Array[Array[String]] | ✅ | Mảng các hàng, mỗi hàng là mảng giá trị |

**Ví dụ Đầy Đủ với Table:**

```javascript
{
  "id": 10,
  "type": "content",
  "title": "Kết Quả",
  "badges": [
    { "text": "IID vs Non-IID", "color": "blue" }
  ],
  "layout": "table",
  "table": {
    "headers": ["Experiment", "Data Distribution", "Final Loss", "Convergence", "Stability"],
    "rows": [
      ["Exp 1", "IID (Balanced)", "0.002425", "Fast (Round 30-40)", "⭐⭐⭐⭐⭐"],
      ["Exp 2", "Non-IID (Power Law)", "0.002705", "Slower (Round 40-50)", "⭐⭐⭐⭐"]
    ]
  },
  "additionalCards": [
    {
      "icon": "✅",
      "iconColor": "green",
      "title": "Key Finding #1",
      "content": "IID đạt final eval loss 0.002425"
    }
  ]
}
```

### Additional Cards

Thuộc tính `additionalCards` cho phép thêm các card ở dưới bảng hoặc cột.

```javascript
"additionalCards": [
  {
    "icon": "💡",
    "iconColor": "purple",
    "title": "Insight",
    "content": "DFL P2P Ring hoạt động hiệu quả"
  }
]
```

---

## 🖼️ 6. LOẠI SLIDE: `"image"`

Slide hiển thị hình ảnh toàn màn hình.

### Cấu Trúc

```javascript
{
  "id": 3,
  "type": "image",
  "title": "Learning Types Comparison",
  "subtitle": "Centralized vs Federated vs Decentralized Learning",
  "badges": [...],
  "image": "../reports_dfl/learning_type.png",
  "imageStyle": "max-height: 550px; object-fit: contain;"
}
```

### Thuộc Tính Đặc Biệt

| Thuộc Tính | Kiểu | Bắt Buộc | Mô Tả |
|------------|------|----------|-------|
| `image` | String | ✅ | Đường dẫn tới file hình ảnh |
| `imageStyle` | String | ❌ | CSS inline style cho hình ảnh |

### Ví Dụ

```javascript
{
  "id": 7,
  "type": "image",
  "title": "Feature Extraction Process",
  "subtitle": "Raw Sensor Data → Statistical Features",
  "badges": [
    { "text": "8 Channels", "color": "blue" },
    { "text": "20,480 Points", "color": "purple" }
  ],
  "image": "../reports_dfl/sensor_data_visualization.png",
  "imageStyle": "max-height: 550px; object-fit: contain;"
}
```

**Image Style Options phổ biến:**
- `max-height: 550px; object-fit: contain;` - Giới hạn chiều cao, giữ tỷ lệ
- `max-height: 500px; object-fit: cover;` - Lấp đầy không gian
- `width: 100%; height: auto;` - Full width, tự động điều chỉnh chiều cao

---

## 🎊 7. LOẠI SLIDE: `"thank-you"`

Slide kết thúc presentation, thường dùng cho Q&A.

### Cấu Trúc

```javascript
{
  "id": 19,
  "type": "thank-you",
  "title": "Cảm ơn Quý Thầy Cô và Các Bạn Đã Lắng Nghe!",
  "subtitle": "Questions & Discussion",
  "badges": [
    { "text": "Thank You!", "color": "green" },
    { "text": "Q&A", "color": "blue" }
  ],
  "questions": [
    "Câu hỏi 1?",
    "Câu hỏi 2?",
    "Câu hỏi 3?"
  ]
}
```

### Thuộc Tính Đặc Biệt

| Thuộc Tính | Kiểu | Bắt Buộc | Mô Tả |
|------------|------|----------|-------|
| `questions` | Array[String] | ❌ | Mảng các câu hỏi thảo luận |

### Ví Dụ

```javascript
{
  "id": 19,
  "type": "thank-you",
  "title": "Cảm ơn Quý Thầy Cô và Các Bạn Đã Lắng Nghe!",
  "subtitle": "Questions & Discussion",
  "badges": [
    { "text": "Thank You!", "color": "green" },
    { "text": "Q&A", "color": "blue" }
  ],
  "questions": [
    "Nếu neighbor mất kết nối/không gửi model thì xử lý thế nào?",
    "Có timeout/retry khi chờ message từ neighbor không?",
    "Thiếu model từ neighbor thì aggregate dùng weights còn lại hay giữ model cũ?"
  ]
}
```

---

## 🎨 8. MÀU SẮC HỖ TRỢ

Tất cả các thuộc tính màu (`color`, `iconColor`) hỗ trợ các giá trị sau:

| Màu | Hex Code | Sử Dụng Cho |
|-----|----------|-------------|
| `blue` | #3b82f6 | Thông tin, công nghệ |
| `green` | #10b981 | Thành công, tích cực |
| `yellow` | #f59e0b | Cảnh báo, chú ý |
| `red` | #ef4444 | Lỗi, quan trọng |
| `purple` | #8b5cf6 | Sáng tạo, đặc biệt |
| `orange` | #f97316 | Nổi bật, năng lượng |

---

## 📐 9. LAYOUT OPTIONS

### Two-Column Layout

```javascript
"layout": "two-column",
"columns": [
  {
    "title": "Tiêu đề cột trái",
    "cards": [
      {
        "icon": "🎯",
        "iconColor": "blue",
        "title": "Card Title",
        "content": "Card content với <br> xuống dòng"
      }
    ]
  },
  {
    "title": "Tiêu đề cột phải",
    "cards": [...]
  }
]
```

### Table Layout

```javascript
"layout": "table",
"table": {
  "headers": ["Header 1", "Header 2", "Header 3"],
  "rows": [
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
  ]
}
```

---

## 🔍 10. TÍNH NĂNG NÂNG CAO

### A. Dialog Image trong Card

Thêm thuộc tính `dialogImage` vào card để hiển thị hình ảnh popup khi click:

```javascript
{
  "icon": "⚙️",
  "iconColor": "green",
  "title": "8 Sensor Channels",
  "content": "20,480 time-series points mỗi file",
  "dialogImage": "../reports_dfl/bearing.png"
}
```

### B. HTML trong Content

Card content hỗ trợ một số HTML tags:

```javascript
"content": "Dòng 1<br>Dòng 2<br><strong>In đậm</strong>"
```

**Tags hỗ trợ:**
- `<br>` - Xuống dòng
- `<strong>` - In đậm
- `<em>` - In nghiêng

### C. Additional Cards

Thêm cards bổ sung dưới table hoặc columns:

```javascript
"additionalCards": [
  {
    "icon": "✅",
    "iconColor": "green",
    "title": "Key Finding",
    "content": "Kết quả quan trọng"
  }
]
```

---

## 📖 11. VÍ DỤ HOÀN CHỈNH

### Slide Title

```javascript
{
  "id": 1,
  "type": "title",
  "title": "Presentation Title",
  "subtitle": "Subtitle Here",
  "badges": [
    { "text": "Tag 1", "color": "blue" },
    { "text": "Tag 2", "color": "green" }
  ],
  "layout": "two-column",
  "columns": [
    {
      "title": "Team",
      "cards": [
        {
          "icon": "👥",
          "iconColor": "green",
          "title": "Team Name",
          "content": "Member 1<br>Member 2"
        }
      ]
    },
    {
      "title": "Info",
      "cards": [
        {
          "icon": "🎓",
          "iconColor": "blue",
          "title": "Course",
          "content": "Course Name"
        }
      ]
    }
  ]
}
```

### Slide Content với Two-Column

```javascript
{
  "id": 2,
  "type": "content",
  "title": "Main Topic",
  "subtitle": "Detailed Explanation",
  "badges": [
    { "text": "Category", "color": "purple" }
  ],
  "layout": "two-column",
  "columns": [
    {
      "title": "Problems",
      "cards": [
        {
          "icon": "❌",
          "iconColor": "red",
          "title": "Problem 1"
        }
      ]
    },
    {
      "title": "Solutions",
      "cards": [
        {
          "icon": "✅",
          "iconColor": "green",
          "title": "Solution 1",
          "content": "Detailed explanation here"
        }
      ]
    }
  ]
}
```

### Slide Content với Table

```javascript
{
  "id": 3,
  "type": "content",
  "title": "Results",
  "badges": [
    { "text": "Data", "color": "blue" }
  ],
  "layout": "table",
  "table": {
    "headers": ["Metric", "Value", "Status"],
    "rows": [
      ["Accuracy", "95%", "✅"],
      ["Loss", "0.002", "⭐⭐⭐⭐⭐"]
    ]
  },
  "additionalCards": [
    {
      "icon": "💡",
      "iconColor": "purple",
      "title": "Insight",
      "content": "Key finding here"
    }
  ]
}
```

### Slide Image

```javascript
{
  "id": 4,
  "type": "image",
  "title": "Architecture Diagram",
  "subtitle": "System Overview",
  "badges": [
    { "text": "Diagram", "color": "blue" }
  ],
  "image": "../images/architecture.png",
  "imageStyle": "max-height: 550px; object-fit: contain;"
}
```

### Slide Thank You

```javascript
{
  "id": 5,
  "type": "thank-you",
  "title": "Thank You!",
  "subtitle": "Q&A Session",
  "badges": [
    { "text": "Thank You", "color": "green" },
    { "text": "Questions", "color": "blue" }
  ],
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}
```

---

## ✅ 12. CHECKLIST TẠO SLIDES_DATA

- [ ] Đặt `id` duy nhất cho mỗi slide (tăng dần)
- [ ] Chọn `type` phù hợp: `title`, `content`, `image`, `thank-you`
- [ ] Điền `title` cho mọi slide
- [ ] Thêm `subtitle` nếu cần (optional)
- [ ] Thêm `badges` để tạo tags phân loại (optional)
- [ ] Với type `content`: chọn `layout` (`two-column` hoặc `table`)
- [ ] Với type `image`: cung cấp đường dẫn `image`
- [ ] Kiểm tra màu sắc hợp lệ: blue, green, yellow, red, purple, orange
- [ ] Cập nhật `totalSlides` trong `presentation` object
- [ ] Test hiển thị trên trình duyệt

---

## 🚀 13. TIPS & BEST PRACTICES

### 1. Đặt Tên ID
- Sử dụng số tăng dần: 1, 2, 3, ...
- Không bỏ qua số hoặc trùng lặp

### 2. Sử Dụng Badges
- Tối đa 3-4 badges mỗi slide để không bị rối
- Chọn màu có ý nghĩa phù hợp với nội dung

### 3. Card Content
- Giữ content ngắn gọn, dễ đọc
- Sử dụng `<br>` để xuống dòng khi cần
- Tránh đoạn văn quá dài trong 1 card

### 4. Images
- Sử dụng đường dẫn tương đối từ file HTML
- Đặt `imageStyle` để kiểm soát kích thước hiển thị
- Đảm bảo file ảnh tồn tại trước khi reference

### 5. Table Layout
- Phù hợp với dữ liệu có cấu trúc rõ ràng
- Số cột không nên quá nhiều (tối đa 5-6)
- Sử dụng emoji trong cells để tăng tính trực quan

### 6. Dialog Images
- Chỉ thêm `dialogImage` cho cards quan trọng cần minh họa
- Hình ảnh nên có kích thước hợp lý (không quá lớn)

### 7. Questions trong Thank You Slide
- Chuẩn bị 5-12 câu hỏi thảo luận
- Câu hỏi nên mở, khuyến khích discussion

---

## 🐛 14. TROUBLESHOOTING

### Slide không hiển thị
- ✅ Kiểm tra syntax JSON (dấu phẩy, ngoặc)
- ✅ Verify `id` duy nhất
- ✅ Đảm bảo `type` hợp lệ

### Hình ảnh không load
- ✅ Kiểm tra đường dẫn file
- ✅ Verify file tồn tại
- ✅ Sử dụng đường dẫn tương đối chính xác

### Layout bị lỗi
- ✅ Với `two-column`: đảm bảo có 2 columns
- ✅ Với `table`: kiểm tra số cột trong rows khớp với headers

### Màu sắc không hiển thị
- ✅ Chỉ dùng màu hợp lệ: blue, green, yellow, red, purple, orange
- ✅ Viết thường, không có khoảng trắng

---

## 📞 15. HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Console của trình duyệt (F12) để xem lỗi JavaScript
2. Validate JSON syntax tại [jsonlint.com](https://jsonlint.com)
3. So sánh với các ví dụ trong guide này

---

**🎉 Chúc bạn tạo presentation thành công!**
