# BÁO CÁO CỦA T3: ADAGRAD OPTIMIZATION ALGORITHM - Script Thuyết Trình

## Giới thiệu phần trình bày của T3

Thưa thầy và các bạn, em xin được tiếp tục trình bày về thuật toán AdaGrad. Phần của em sẽ bao gồm:
- **Phần 1**: Thuật toán AdaGrad chính thức và giải thích chi tiết từng bước
- **Phần 2**: Section 3 - Tính toán và triển khai thực tế với hai hàm số cụ thể
- **Phần 3**: Thử nghiệm để quan sát tính robust và hạn chế của thuật toán

---

## PHẦN 1: THUẬT TOÁN ADAGRAD

### Slide: The Adagrad Algorithm

Thưa thầy và các bạn, sau khi đã hiểu về động lực và cơ chế preconditioning, bây giờ chúng ta sẽ xem xét **công thức thuật toán AdaGrad chính thức**.

AdaGrad sử dụng biến $\mathbf{s}_t$ để **tích lũy phương sai của gradient trong quá khứ**:

**Bước 1 - Tính gradient:**
$$\mathbf{g}_t = \partial_{\mathbf{w}} l(y_t, f(\mathbf{x}_t, \mathbf{w}))$$


**Bước 2 - Tích lũy bình phương gradient:**
$$\mathbf{s}_t = \mathbf{s}_{t-1} + \mathbf{g}_t^2$$

Đây là bước quan trọng nhất - mỗi tọa độ "ghi nhớ" lịch sử gradient của nó.

**Bước 3 - Cập nhật tham số:**
$$\mathbf{w}_t = \mathbf{w}_{t-1} - \frac{\eta}{\sqrt{\mathbf{s}_t + \epsilon}} \cdot \mathbf{g}_t$$

Learning rate được điều chỉnh độc lập cho từng tọa độ.

**Lưu ý quan trọng:** Tất cả các phép toán đều thực hiện **theo từng phần tử** (element-wise):
- $\mathbf{g}_t^2$ có nghĩa là $[g_{t,1}^2, g_{t,2}^2, \ldots, g_{t,d}^2]$
- $\sqrt{\mathbf{s}_t + \epsilon}$ có nghĩa là $[\sqrt{s_{t,1} + \epsilon}, \sqrt{s_{t,2} + \epsilon}, \ldots]$

**Tham số:**
- $\eta$ - learning rate
- $\epsilon$ - hằng số nhỏ (thường là $10^{-8}$) để tránh chia cho 0
- **Khởi tạo:** $\mathbf{s}_0 = \mathbf{0}$

---

### Slide: Explanation of Each Step

Bây giờ em xin giải thích chi tiết hơn về từng bước:

**Bước 1: Tính gradient**
$$\mathbf{g}_t = \partial_{\mathbf{w}} l(y_t, f(\mathbf{x}_t, \mathbf{w}))$$

Gradient tại điểm hiện tại cho biết **hướng thay đổi mạnh nhất** của hàm số.

**Bước 2: Tích lũy bình phương gradient**

Mỗi tọa độ "ghi nhớ" lịch sử gradient của nó:
- Nếu gradient **lớn** nhiều lần → $\mathbf{s}_t$ tích lũy giá trị lớn → learning rate hiệu dụng trở nên **nhỏ**
- Nếu gradient **nhỏ** → $\mathbf{s}_t$ tích lũy chậm → learning rate hiệu dụng vẫn tương đối **lớn**

Đây chính là cơ chế thích ứng tự động của AdaGrad.

**Bước 3: Cập nhật tham số**

Cập nhật với learning rate được điều chỉnh cho từng tọa độ:
- Mỗi tọa độ có learning rate riêng của nó
- Learning rate giảm khi $s_{t,i}$ tăng

$$\eta_{i,t} = \frac{\eta}{\sqrt{s_{t,i} + \epsilon}}$$

---

## PHẦN 2: SECTION 3 - COMPUTATION & IMPLEMENTATION

### Slide: SECTION 3: COMPUTATION & IMPLEMENTATION

Thưa thầy và các bạn, bây giờ chúng ta chuyển sang **Section 3** về việc tính toán và triển khai thực tế của thuật toán AdaGrad.

---

### Slide: Step-by-Step Calculation: Axis-Aligned Function

Để hiểu rõ cách AdaGrad hoạt động trong thực tế, em xin phân tích thuật toán trên **hai hàm số có cấu trúc khác nhau**.

Bắt đầu với hàm số thứ nhất:

**Hàm mục tiêu:** $f_1(\mathbf{x}) = 0.1x_1^2 + 2x_2^2$

Đây là một **paraboloid elliptic thẳng hàng trục** (axis-aligned) - các biến $x_1$ và $x_2$ **độc lập với nhau**. Hàm này có điểm cực tiểu tại $(0, 0)$.

**Thiết lập cho AdaGrad:**
- Điểm xuất phát: $\mathbf{x}^{(0)} = (5, 3)$
- Learning rate: $\eta = 0.4$
- Epsilon: $\varepsilon = 10^{-8}$ (để tránh chia cho 0)
- Công thức gradient: $\nabla f_1 = [0.2x_1, 4x_2]$

Bây giờ em xin phân tích chi tiết từng bước tính toán:

**Bước 1 (t=1):** Từ điểm hiện tại $\mathbf{x}^{(0)} = (5.0, 3.0)$

**a. Tính gradient:**
$$\mathbf{g}_1 = \nabla f_1(5.0, 3.0) = [0.2 \times 5.0, 4 \times 3.0] = [1.0, 12.0]$$

Các bạn chú ý là gradient theo hướng $x_2$ **lớn hơn rất nhiều** so với $x_1$ (12.0 so với 1.0).

**b. Cập nhật bộ tích lũy $\mathbf{s}$:**
$$\mathbf{s}_1 = \mathbf{s}_0 + \mathbf{g}_1^2 = [0, 0] + [1.0^2, 12.0^2] = [1.0, 144.0]$$

**c. Tính learning rate**
$$\eta_{1,1} = \frac{0.4}{\sqrt{1.0 + 10^{-8}}} \approx 0.4$$
$$\eta_{2,1} = \frac{0.4}{\sqrt{144.0 + 10^{-8}}} \approx 0.0333$$

Đây chính là **điểm mạnh của AdaGrad**: chiều $x_2$ có gradient lớn → learning rate tự động giảm 12 lần để tránh dao động!

**d. Cập nhật tham số:**
$$x_1^{(1)} = 5.0 - 0.4 \times 1.0 = 4.6$$
$$x_2^{(1)} = 3.0 - 0.0333 \times 12.0 = 2.6$$

Mặc dù gradient theo $x_2$ lớn hơn 12 lần, nhưng bước nhảy thực tế theo cả hai chiều là **bằng nhau** (0.4).

**e. Giá trị hàm số:**
$$f_1(4.6, 2.6) = 0.1(4.6)^2 + 2(2.6)^2 = 2.116 + 13.52 = 15.636$$

---

### Slide: (continued): Steps 2 and Beyond

**Bước 2 (t=2):** Từ điểm $(4.6, 2.6)$

- Gradient: $\mathbf{g}_2 = [0.92, 10.4]$
- Cập nhật $\mathbf{s}$: $\mathbf{s}_2 = [1.8464, 252.16]$
- Learning rate hiệu dụng: $[0.2944, 0.0252]$
- Điểm mới: $(4.3291, 2.3379)$
- Giá trị hàm số: $f_1 \approx 12.817$

**Quan sát quan trọng:**

Khi các vòng lặp tiến triển, bộ tích lũy bình phương gradient $\mathbf{s}_t$ ngày càng lớn, khiến learning rate giảm dần. Tọa độ $x_2$ có gradient lớn hơn nhiều, nên learning rate của nó giảm nhanh hơn $x_1$.

Vì hai biến độc lập, việc scale diagonal của AdaGrad là **lý tưởng**

**Khi nào dừng tính?** Trong thực tế, chúng ta dừng khi:
- Gradient đủ nhỏ: $\|\mathbf{g}_t\| < \text{threshold}$, hoặc
- Đạt số vòng lặp tối đa, hoặc  
- Hàm mục tiêu không giảm đáng kể giữa các bước

---

### Slide: Step-by-Step Calculation: Rotated Function

Bây giờ chúng ta xem xét hàm số thứ hai có cấu trúc phức tạp hơn như trên slide:

**Hàm mục tiêu:** $f_2(\mathbf{x}) = 0.1(x_1 + x_2)^2 + 2(x_1 - x_2)^2$

Khi khai triển ra được:
$$f_2(\mathbf{x}) = 2.1x_1^2 - 3.8x_1x_2 + 2.1x_2^2$$

Khác biệt quan trọng: có **hạng tử chéo $x_1x_2$**. Hàm này cũng có cực tiểu tại $(0, 0)$.

**Thiết lập:** Giống Hàm 1. Gradient: $\nabla f_2 = [4.2x_1 - 3.8x_2, -3.8x_1 + 4.2x_2]$

**Bước 1 (t=1):** Từ điểm $(5.0, 3.0)$

**a. Tính gradient:**
$$\mathbf{g}_1 = \nabla f_2(5.0, 3.0) = [4.2(5.0) - 3.8(3.0), -3.8(5.0) + 4.2(3.0)]$$
$$= [21.0 - 11.4, -19.0 + 12.6] = [9.6, -6.4]$$

**Điểm khác biệt quan trọng:** Gradient không thẳng hàng theo trục, mà có **cả hai thành phần** do hạng tử $x_1x_2$.

**b. Cập nhật bộ tích lũy:**
$$\mathbf{s}_1 = [0, 0] + [9.6^2, (-6.4)^2] = [92.16, 40.96]$$

**c. Learning rate**
$$\eta_{1,1} = \frac{0.4}{\sqrt{92.16 + 10^{-8}}} \approx 0.0417$$
$$\eta_{2,1} = \frac{0.4}{\sqrt{40.96 + 10^{-8}}} \approx 0.0625$$

**d. Cập nhật tham số:**
$$x_1^{(1)} = 5.0 - 0.0417 \times 9.6 = 5.0 - 0.4 = 4.6$$
$$x_2^{(1)} = 3.0 - 0.0625 \times (-6.4) = 3.0 + 0.4 = 3.4$$

**e. Giá trị hàm số:**
$$f_2(4.6, 3.4) = 2.1(4.6)^2 - 3.8(4.6)(3.4) + 2.1(3.4)^2 = 9.28$$

---

### Slide: (continued): Steps 2 and Beyond

**Bước 2 (t=2):** Từ điểm $(4.6, 3.4)$

- Gradient: $\mathbf{g}_2 = [6.4, -3.2]$
- Cập nhật $\mathbf{s}$: $\mathbf{s}_2 = [133.12, 51.2]$
- Learning rate hiệu dụng: $[0.0347, 0.0559]$
- Điểm mới: $(4.378, 3.579)$
- Giá trị hàm số: $f_2 \approx 6.706$

**Quan sát:**

Hội tụ **chậm hơn** so với Hàm 1 vì gradient không thẳng hàng trục. AdaGrad scale các tọa độ độc lập nhưng hướng tối ưu là đường chéo 45°. AdaGrad không thể nắm bắt mối quan hệ chéo này giữa các tọa độ.

---

### Slide: Why is Function 2 More Difficult for Adagrad?

Thưa thầy và các bạn, em xin giải thích sâu hơn tại sao AdaGrad gặp khó khăn với hàm xoay.

**1. Nguyên nhân gốc rễ: Không khớp hệ tọa độ**

Hàm 2: $f_2(\mathbf{x}) = 2.1x_1^2 - 3.8x_1x_2 + 2.1x_2^2$

Vấn đề chính là **hạng tử chéo $-3.8x_1x_2$**. Điều này tạo ra sự **liên kết** giữa $x_1$ và $x_2$ - không thể tối ưu một tọa độ độc lập với tọa độ kia.

**2. Nếu để dùng Ma trận Hessian để hiểu **

**Hàm 1 (Axis-aligned):**
$$H_1 = \begin{bmatrix} 0.2 & 0 \\ 0 & 4 \end{bmatrix}$$

Ma trận chéo → các tọa độ độc lập → trục chính thẳng hàng với trục tọa độ.

**Hàm 2 (Rotated):**
$$H_2 = \begin{bmatrix} 4.2 & -3.8 \\ -3.8 & 4.2 \end{bmatrix}$$

Ma trận không chéo → các tọa độ liên kết → trục chính xoay 45° so với trục tọa độ.

**3. AdaGrad thực sự làm gì?**

AdaGrad điều chỉnh learning rate độc lập cho từng tọa độ. Điều này tương đương với áp dụng một ma trận scale chéo:
$$D_t = \text{diag}\left(\frac{1}{\sqrt{s_1}}, \frac{1}{\sqrt{s_2}}\right)$$

- Với Hàm 1: Ma trận chéo khớp hoàn hảo với Hessian chéo
- Với Hàm 2: Không thể nắm bắt cấu trúc không chéo


---

### Slide: Visual Comparison: Trajectory Analysis

Để thấy rõ sự khác biệt, chúng ta hãy xem hình ảnh trực quan của quỹ đạo tối ưu hóa:

*[Chỉ vào hình ảnh so sánh]*

**Quan sát chính từ hình ảnh:**

- **Hàm 1 (Trái - Elip đơn giản):** Quỹ đạo sạch sẽ, trực tiếp từ điểm xuất phát $(5.0, 3.0)$ về gần điểm tối ưu. Các đường đồng mức là các elip thẳng hàng trục, khớp với diagonal scaling của AdaGrad.

- **Hàm 2 (Phải - Thung lũng hẹp):** Quỹ đạo phức tạp phải điều hướng qua "thung lũng hẹp" được tạo bởi hạng tử chéo. Các đường đồng mức dày đặc và xoay 45°, khiến việc tối ưu khó khăn hơn nhiều.

- **Khoảng cách từ gốc tọa độ:** f1 đạt ~1.93 đơn vị từ gốc, trong khi f2 chỉ đạt ~4.00 đơn vị - cho thấy khó khăn trong việc hội tụ trong không gian xoay.

- **Độ phức tạp đường đi:** Quỹ đạo của f2 cho thấy sự vật lộn để đi theo hướng chéo của thung lũng chỉ bằng cách điều chỉnh theo trục.

---

## PHẦN 3: THỬ NGHIỆM THỰC TẾ

### Slide: Experiment: Adagrad Trajectory for Function 1

Bây giờ chúng ta sẽ xem xét một số thử nghiệm để kiểm tra tính **robust** và **hạn chế** của AdaGrad.

Em xin trình bày thử nghiệm với hai learning rate **đối lập** trên hàm $f(\mathbf{x}) = 0.1x_1^2 + 2x_2^2$:

**Thử nghiệm 1: Learning rate thận trọng ($\eta = 0.2$)**
- Mục đích: Quan sát liệu thuật toán có bị "chết" sớm do tích lũy gradient không?

**Thử nghiệm 2: Learning rate cực kỳ lớn ($\eta = 3.0$)**  
- Mục đích: Kiểm tra cơ chế preconditioning có ổn định hóa được quỹ đạo không?

*[Chỉ vào các đồ thị trajectory]*

### Kết quả và Phân tích

**Với $\eta = 0.2$ (Learning rate nhỏ):**

Quỹ đạo di chuyển về phía minimum nhưng **"đóng băng" giữa chừng** - không đạt được điểm tối ưu.

**Nguyên nhân:** $s_t$ tăng đơn điệu theo thời gian → learning rate hiệu dụng $\frac{\eta}{\sqrt{s_t}}$ giảm xuống gần 0 quá sớm.

Đây chính là **vấn đề "Premature Stopping"** hay "Dying Learning Rate" của AdaGrad - một trong những hạn chế chính của thuật toán khi training dài.

**Với $\eta = 3.0$ (Learning rate rất lớn):**

Mặc dù learning rate cực kỳ lớn (gấp 15 lần thử nghiệm 1), thuật toán vẫn **hội tụ thành công**!

**Cơ chế:** 
- Ở chiều $x_2$ có gradient lớn → $s_{x_2}$ tăng rất nhanh
- Learning rate hiệu dụng được chia xuống → tự động "phanh"
- Thể hiện **tính robust** của AdaGrad với hyperparameter chưa được tune tốt

**Bài học quan trọng:**
1. AdaGrad có thể **ổn định với learning rate lớn** nhờ adaptive scaling
2. Nhưng cần **cẩn thận với dying learning rate** trong training dài
3. **Trade-off** giữa stability và convergence speed

---

## TỔNG KẾT BÁO CÁO CỦA T3

Thưa thầy và các bạn, qua phần trình bày của em, chúng ta đã cùng tìm hiểu:

### Phần 1: Thuật toán AdaGrad chính thức
- Công thức chi tiết với 3 bước: tính gradient, tích lũy bình phương gradient, và cập nhật tham số
- Nguyên lý thiết kế: per-coordinate adaptation, preconditioning, và chi phí tính toán

### Phần 2: Phân tích chi tiết qua ví dụ
- **Hàm Axis-aligned:** AdaGrad hoạt động hoàn hảo với diagonal scaling
- **Hàm Rotated:** Gặp khó khăn do không thể nắm bắt mối quan hệ chéo giữa các biến
- **Giải thích qua Hessian:** AdaGrad là diagonal optimizer, phù hợp với bài toán có Hessian chéo

### Phần 3: Thử nghiệm thực tế
- **Tính robust:** Ổn định với learning rate lớn nhờ adaptive scaling
- **Hạn chế:** "Dying learning rate" - learning rate giảm quá nhanh trong training dài

### Điểm mạnh của AdaGrad:
- Tự động điều chỉnh learning rate cho từng tham số
- Robust với hyperparameter
- Hiệu quả cho sparse features và NLP

### Hạn chế:
- Learning rate có thể "chết" do tích lũy vô hạn $s_t$
- Không hiệu quả cho bài toán có correlation giữa các biến
- Chỉ là diagonal optimizer - không nắm bắt được cấu trúc không chéo

### Hướng phát triển:
Đây chính là lý do các optimizer hiện đại như **RMSProp** và **Adam** cải tiến AdaGrad bằng cách sử dụng **exponential moving average** thay vì tích lũy toàn bộ, giúp khắc phục vấn đề dying learning rate.

Em xin cảm ơn thầy và các bạn đã lắng nghe!
