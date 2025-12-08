# Ghi chú về Adagrad và các khái niệm liên quan

## 1. Vì sao Adagrad chỉ scale theo từng trục riêng

* Cập nhật của Adagrad theo dạng:
  [ x_i^{(t+1)} = x_i^{(t)} - \frac{\eta}{\sqrt{s_i^{(t)} + \epsilon}} g_i^{(t)} ]
* Mỗi chiều (coordinate) có learning rate riêng.
* Không có tương quan giữa các chiều (không có cross-term như (g_1 g_2)).
* Không thể "xoay" không gian tối ưu như Newton/quasi-Newton.

## 2. Dt trong Adagrad là gì

* ( D_t = \text{diag}(1/\sqrt{s_t}) )
* Là ma trận đường chéo (diagonal matrix) chứa scale cho từng chiều.
* Khi nhân với gradient → tương đương preconditioning.

## 3. Diagonal Matrix (diag)

* Ma trận chỉ có phần tử trên đường chéo chính, các phần khác bằng 0.
* Ví dụ:
  [ \text{diag}(a, b) = \begin{bmatrix} a & 0 \ 0 & b \end{bmatrix} ]
* Trong Adagrad: thể hiện "scale riêng từng chiều".

## 4. Giải thích Automatic Preconditioning

* Adagrad dùng tích lũy bình phương gradient (s_t) để ước lượng đường chéo của Hessian.
* Điều này giúp làm phẳng (flatten) landscape mà không cần tính eigenvalues.

## 5. Giải thích Geometric Interpretation

* Chiều có gradient lớn → bước đi nhỏ.
* Chiều có gradient nhỏ → bước đi lớn.
* Tương đương biến đổi hệ trục bởi (D_t).

## 6. Adagrad update và liên quan giữa Step 4–5

* Từ công thức gốc:

  * Tính gradient (g_t)
  * Cập nhật (s_t = s_{t-1} + g_t^2)
  * Tính effective learning rate từng chiều
  * Tính (\Delta x_t = \eta/\sqrt{s_t} * g_t)
  * Cập nhật (x_t = x_{t-1} - \Delta x_t)

## 7. Vì sao learning rate giảm theo (O(1/\sqrt{t}))

* Vì (s_t = \sum g_t^2 \propto t) nếu gradient không biến mất.
* Nên learning rate hiệu dụng: (\eta/\sqrt{s_t} \sim \eta/\sqrt{t}).

## 8. Gradient Norm là gì

* Độ lớn của vector gradient:
  [ ||g|| = \sqrt{\sum_i g_i^2} ]
* Dùng để kiểm tra hội tụ: nếu gradient gần 0 → đã gần minimum.

## 9. Vì sao gradient norm < 1e-4 được xem là hội tụ

* Khi gradient rất nhỏ → hàm phẳng → ta đang ở valley hoặc xoay quanh cực tiểu.
* Phương pháp tối ưu thường dừng khi gradient đủ nhỏ để coi như không còn tiến triển ý nghĩa.
