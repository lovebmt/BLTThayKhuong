# Thứ tự Present - AdaGrad Algorithm

## 🎯 Flow Present Liền Mạch

### **👤 T1 - Mở đầu** (3 slides: 1, 2, 3)
**Thời gian: ~8 phút**

1. **Slide 1**: Title & Giới thiệu nhóm
2. **Slide 2**: Tại sao cần Adaptive Learning Rate? (Section 1.1)
3. **Slide 3**: Naive Solution - Tại sao đếm không đủ? (Section 1.2)

---

### **👤 T2 - Core Mechanism** (3 slides: 4, 6, 7)
**Thời gian: ~8 phút**

4. **Slide 4**: Đột phá - Accumulated Squared Gradients (Section 2.1)
7. **Slide 5**: Deep Dive: Preconditioning (Section 2.2) 
6. **Slide 6**: Gradient as Hessian Proxy (Section 2.3)

---

### **👤 T3 - Algorithm & Examples** (4 slides: 5, 8, 9, 10)
**Thời gian: ~10 phút**

7. **Slide 7**: AdaGrad Algorithm - 3 bước đơn giản (Section 2.4)
8. **Slide 8**: Case 1 - Axis-Aligned Function (Section 3.1)
9. **Slide 9**: Case 2 - Rotated Function (Bài tập 4.2)
10. **Slide 10**: Tại sao rotation lại quan trọng? (Bài tập 4.2)

---

### **👤 T4 - Implementation & Evolution** (11 slides: 11-16, 19-22)
**Thời gian: ~15 phút**

11. **Slide 11**: Experimental Insights - Robustness Test (Section 3.3)
12. **Slide 12**: Visualize - Conservative LR (η=0.2)
13. **Slide 13**: Visualize - Extreme LR (η=3.0)
14. **Slide 14**: Fashion-MNIST - Real-world Test (Section 3.4 & 4.4)
15. **Slide 15**: Fashion-MNIST - Training Loss
16. **Slide 16**: Fashion-MNIST - Test Accuracy
17. **Slide 19**: Evolution - Từ AdaGrad đến Adam (Bài tập 4.4)
18. **Slide 20**: Exercise - Fixing AdaGrad → RMSProp
19. **Slide 21**: Comparison - Training Loss (AdaGrad vs RMSProp)
20. **Slide 22**: Comparison - Test Accuracy (AdaGrad vs RMSProp)

---

### **👤 T1 - Tổng kết & Kết thúc** (4 slides: 17, 18, 23, 24, 25)
**Thời gian: ~9 phút**

21. **Slide 17**: AdaGrad Advantages - Khi nào nên dùng? (Section 1.3)
22. **Slide 18**: AdaGrad Limitations - Khi nào tránh dùng? (Section 5.1)
23. **Slide 23**: Summary - Key Takeaways (Section 5.1)
24. **Slide 24**: Nhóm học được gì từ AdaGrad?
25. **Slide 25**: Thank You! - Q&A

---

## 📊 Tổng kết

| Người | Số slides | Thời gian ước tính | Nội dung chính |
|-------|-----------|-------------------|----------------|
| **T1** | 7 slides | ~17 phút | Mở đầu (problem) + Kết thúc (summary) |
| **T2** | 3 slides | ~8 phút | Core mechanism & theory |
| **T3** | 4 slides | ~10 phút | Algorithm & manual calculations |
| **T4** | 11 slides | ~15 phút | Experiments & evolution |
| **Tổng** | **25 slides** | **~50 phút** | Full presentation |

---

## 🎬 Gợi ý Chuyển tiếp (Transitions)

### T1 → T2
> "Vậy giải pháp là gì? Làm thế nào để tự động cân nhắc magnitude của gradient? Để **[Tên T2]** giải thích cơ chế đột phá của AdaGrad..."

### T2 → T3
> "Đó là lý thuyết đằng sau AdaGrad. Vậy thuật toán hoạt động cụ thể như thế nào? **[Tên T3]** sẽ trình bày công thức và tính toán từng bước..."

### T3 → T4
> "Chúng ta đã thấy AdaGrad hoạt động trên giấy. Vậy trong thực tế thì sao? **[Tên T4]** sẽ demo code và experiments..."

### T4 → T1
> "Qua các experiments, chúng ta thấy AdaGrad có cả ưu và nhược điểm. **[Tên T1]** sẽ tổng kết lại toàn bộ những gì chúng ta đã học..."

---

## ⚠️ Lưu ý khi Present

1. **T1 mở đầu**: Tạo động lực - tại sao topic này quan trọng
2. **T2**: Giải thích sâu lý thuyết - cần rõ ràng, dễ hiểu
3. **T3**: Show calculations - viết từng bước trên bảng nếu có
4. **T4**: Demo code/results - có thể chạy live nếu được
5. **T1 kết thúc**: Liên kết lại toàn bộ, nhấn mạnh key takeaways
