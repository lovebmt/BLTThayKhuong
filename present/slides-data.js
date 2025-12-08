// Slides Data - AdaGrad Algorithm Presentation
// Presentation Flow: T1 (Intro) → T2 (Core Mechanism) → T3 (Algorithm & Examples) → T4 (Experiments & Evolution) → T1 (Summary & Close)
const SLIDES_DATA = {
  "presentation": {
    "title": "AdaGrad: Adaptive Gradient Algorithm",
    "totalSlides": 25
  },
  "slides": [
    // ========== T1: Mở đầu (3 slides) ==========
    {
      "id": 1,
      "type": "title",
      "title": "AdaGrad Algorithm",
      "subtitle": "Understanding Adaptive Learning Through First Principles",
      "badges": [
        { "text": "Adaptive Optimization", "color": "blue" },
        { "text": "Sparse Features", "color": "green" },
        { "text": "Step-by-Step Learning", "color": "purple" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Nhóm Báo Cáo",
          "cards": [
            {
              "icon": "👥",
              "iconColor": "purple",
              "title": "Thành viên",
              "content": "Lê Phước Thành<br>Lê Phước Thành <br>Nguyễn Thành Đạt<br>Lê Đức Phương"
            }
          ]
        },
        {
          "title": "Mục tiêu học tập",
          "cards": [
            {
              "icon": "💡",
              "iconColor": "green",
              "title": "Hiểu sâu cơ chế",
              "content": "Tại sao cần adaptive LR?<br>Squared gradients là gì?<br>Preconditioning nghĩa là gì?"
            },
            {
              "icon": "🔍",
              "iconColor": "orange",
              "title": "Tính toán từng bước",
              "content": "Manual calculations<br>Geometric interpretation<br>Khi nào dùng, khi nào tránh"
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "type": "algorithm",
      "title": "Câu hỏi khởi đầu: Tại sao cần Adaptive Learning Rate?",
      "subtitle": "Hiểu vấn đề từ sparse features",
      "badges": [
        { "text": "Problem Definition", "color": "red" },
        { "text": "Real-world Example", "color": "blue" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Bối cảnh & Vấn đề",
          "cards": [
            {
              "icon": "📚",
              "iconColor": "blue",
              "title": "Text Classification với Bag-of-Words",
              "content": "Dictionary: 10,000 từ<br>Mỗi document chỉ có ~50 từ active<br>99.5% features = 0 (sparse!)"
            },
            {
              "icon": "❌",
              "iconColor": "red",
              "title": "Vấn đề với Global Learning Rate Decay",
              "content": "η<sub>t</sub> = η<sub>0</sub>/√t giảm theo thời gian<br><br>Từ hiếm xuất hiện lần đầu ở step t=1000:<br>→ η<sub>1000</sub> = 0.1/√1000 ≈ 0.003<br>→ Update siêu nhỏ dù gradient có thể lớn!"
            }
          ]
        },
        {
          "title": "Câu hỏi quan trọng",
          "cards": [
            {
              "icon": "🤔",
              "iconColor": "orange",
              "title": "Làm sao để từ hiếm vẫn học được hiệu quả?",
              "content": "<strong style='color:#ff5722;'>Cần cơ chế điều chỉnh learning rate <em>riêng cho từng parameter</em> dựa trên lịch sử gradient của nó!</strong><br><br>Global LR decay không phân biệt được parameter nào cần học nhiều/ít"
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "type": "algorithm",
      "title": "Naive Solution: Đếm số lần xuất hiện",
      "subtitle": "Ý tưởng đơn giản nhưng sai lầm",
      "badges": [
        { "text": "Simple Idea", "color": "blue" },
        { "text": "Why It Fails", "color": "red" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Ý tưởng đơn giản",
          "cards": [
            {
              "icon": "💭",
              "iconColor": "blue",
              "title": "Đếm số lần feature xuất hiện",
              "content": "s(i,t) = số lần feature i xuất hiện đến step t<br>η<sub>i,t</sub> = η<sub>0</sub>/√(s(i,t) + c)<br><br>Feature hiếm: s nhỏ → η lớn ✓<br>Feature thường xuyên: s lớn → η nhỏ ✓"
            },
            {
              "icon": "💡",
              "iconColor": "green",
              "title": "algorithm quan trọng",
              "content": "<strong style='color:#4CAF50;'>Cần cơ chế tự động cân nhắc magnitude!</strong><br><br>→ Không đếm, mà <em>tích lũy squared gradients</em><br>→ Gradient lớn đóng góp nhiều hơn (²)"
            }
          ]
        },
        {
          "title": "3 vấn đề nghiêm trọng",
          "cards": [
            {
              "icon": "❌",
              "iconColor": "red",
              "title": "Tại sao counting không đủ?",
              "content": "<strong>1. Binary decision:</strong> Gradient 0.001 = gradient 10?<br><br><strong>2. Bỏ qua magnitude:</strong> Không phân biệt gradient lớn/nhỏ<br><br><strong>3. Threshold arbitrary:</strong> Bao giờ coi là 'xuất hiện'?<br><br>Cần phương pháp continuous, automatic!"
            }
          ]
        }
      ]
    },
    {
      "id": 4,
      "type": "algorithm",
      "title": "Đột phá: Accumulated Squared Gradients",
      "subtitle": "Core innovation của AdaGrad",
      "badges": [
        { "text": "Key algorithm", "color": "green" },
        { "text": "Automatic Weighting", "color": "blue" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Cơ chế tích lũy mới",
          "cards": [
            {
              "icon": "💡",
              "iconColor": "blue",
              "title": "1. Thay đổi cách tích lũy",
              "content": "<strong>Thay vì:</strong> s(i,t) = count xuất hiện<br><br><strong>Dùng:</strong> s(i,t+1) = s(i,t) + (∂<sub>i</sub>f)<sup>2</sup><br><br><span style='color:#4CAF50;'>→ Gradient càng lớn, đóng góp càng nhiều!</span>"
            },
            {
              "icon": "🎯",
              "iconColor": "green",
              "title": "2. Per-coordinate learning rate",
              "content": "η<sub>i,t</sub> = η / √(s(i,t) + ε)<br><br>Mỗi parameter có <em>learning rate riêng</em><br>tự động điều chỉnh theo lịch sử gradient"
            }
          ]
        },
        {
          "title": "Tự động cân bằng",
          "cards": [
            {
              "icon": "⚖️",
              "iconColor": "purple",
              "title": "3. Cơ chế tự điều chỉnh",
              "content": "<strong>Gradient lớn/thường xuyên:</strong><br>s tăng nhanh → η hiệu dụng nhỏ (phanh!)<br><br><strong>Gradient nhỏ/hiếm:</strong><br>s tăng chậm → η hiệu dụng lớn (tăng tốc!)<br><br><span style='color:#2196F3;'>Tự động cân nhắc magnitude!</span>"
            }
          ]
        }
      ]
    },
    {
      "id": 5,
      "type": "algorithm",
      "title": "Deep Dive: Preconditioning - Tại sao 'làm tròn' landscape?",
      "subtitle": "Hiểu geometric meaning của AdaGrad",
      "badges": [
        { "text": "Advanced Concept", "color": "purple" },
        { "text": "Geometric Intuition", "color": "blue" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Vấn đề & Mục tiêu",
          "cards": [
            {
              "icon": "🏔️",
              "iconColor": "red",
              "title": "Landscape bị kéo dài (elongated)",
              "content": "Quadratic f(x) = ½x<sup>T</sup>Qx<br><br><strong>Condition number:</strong> κ(Q) = λ<sub>max</sub>/λ<sub>min</sub><br><br>κ lớn → contour thành ellipse dài<br>→ GD zigzag, hội tụ chậm"
            },
            {
              "icon": "🎯",
              "iconColor": "blue",
              "title": "Mục tiêu: Biến ellipse thành sphere",
              "content": "<strong>Preconditioning:</strong> Đổi biến y = P<sup>1/2</sup>x<br>Hessian mới: Q̃ = P<sup>-1/2</sup>QP<sup>-1/2</sup><br><br>Lý tưởng: P=Q → Q̃=I → κ=1 (hình tròn!)<br><br><span style='color:#f44336;'>Nhưng:</span> Tính P=Q cần O(d²) memory - không khả thi!"
            }
          ]
        },
        {
          "title": "AdaGrad's Solution",
          "cards": [
            {
              "icon": "💡",
              "iconColor": "green",
              "title": "Diagonal approximation - Mẹo thông minh!",
              "content": "<strong>Chỉ dùng diagonal:</strong> D<sub>t</sub> = diag(s<sub>t</sub>)<br><br>x<sub>t+1</sub> = x<sub>t</sub> - η D<sub>t</sub><sup>-1/2</sup> g<sub>t</sub><br><br><span style='color:#4CAF50;'>→ O(d) memory, cheap updates</span><br>→ Hoạt động tốt khi Q gần diagonal (axis-aligned)<br>→ 'Làm tròn' landscape tự động!<br>→ Mỗi direction có scaling riêng"
            }
          ]
        }
      ]
    },
    {
      "id": 6,
      "type": "algorithm",
      "title": "Gradient as Hessian Proxy - Mẹo thông minh!",
      "subtitle": "Tại sao không cần tính Hessian?",
      "badges": [
        { "text": "First-Order Only", "color": "blue" },
        { "text": "Cheap Trick", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Vấn đề với Hessian",
          "cards": [
            {
              "icon": "🚫",
              "iconColor": "red",
              "title": "Không khả thi trong Deep Learning",
              "content": "d = 10<sup>6</sup> parameters<br>Hessian: d×d matrix = 10<sup>12</sup> entries!<br><br>Memory: O(d²) - không thể lưu<br>Inversion: O(d³) - quá chậm<br><br>Cần approximation thông minh!"
            },
            {
              "icon": "🤔",
              "iconColor": "blue",
              "title": "Quan sát quan trọng",
              "content": "Gần optimal x*: g(x) ≈ Q(x - x*)<br><br><strong>Curvature cao (Q<sub>ii</sub> lớn):</strong><br>→ Gradient thay đổi nhiều<br>→ |g<sub>i</sub>| lớn hoặc variance cao<br><br><strong>Curvature thấp (Q<sub>ii</sub> nhỏ):</strong><br>→ Gradient thay đổi ít → |g<sub>i</sub>| nhỏ"
            }
          ]
        },
        {
          "title": "AdaGrad's Approximation",
          "cards": [
            {
              "icon": "✨",
              "iconColor": "green",
              "title": "Use gradients as proxy!",
              "content": "<strong>Thay vì:</strong> Tính diagonal của Hessian Q<br><br><strong>Dùng:</strong> Accumulated squared gradients<br>s<sub>i</sub> = Σg<sub>i</sub>² ≈ rough proxy cho Q<sub>ii</sub><br><br><span style='color:#4CAF50;'>→ O(d) storage, already computed!</span><br>→ Gets curvature info 'for free' từ gradients<br>→ First-order method với second-order algorithm!"
            }
          ]
        }
      ]
    },
    {
      "id": 7,
      "type": "algorithm",
      "title": "AdaGrad Algorithm: 3 bước đơn giản",
      "subtitle": "Implementation steps",
      "badges": [
        { "text": "Algorithm Steps", "color": "green" },
        { "text": "Section 2.4", "color": "blue" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "3 bước chính",
          "cards": [
            {
              "icon": "1️⃣",
              "iconColor": "blue",
              "title": "Compute Gradient",
              "content": "g<sub>t</sub> = ∂<sub>w</sub> L(w<sub>t</sub>)<br><br>Tính đạo hàm loss theo parameters<br>Vector có cùng dimension với w"
            },
            {
              "icon": "2️⃣",
              "iconColor": "orange",
              "title": "Accumulate Squared Gradients",
              "content": "s<sub>t</sub> = s<sub>t-1</sub> + g<sub>t</sub> ⊙ g<sub>t</sub><br><br><strong style='color:#f44336;'>Element-wise square!</strong><br>s<sub>t</sub>[i] = s<sub>t-1</sub>[i] + g<sub>t</sub>[i]²<br><br>Mỗi coordinate 'nhớ' lịch sử gradient"
            },
            {
              "icon": "3️⃣",
              "iconColor": "green",
              "title": "Update with Adaptive LR",
              "content": "w<sub>t+1</sub> = w<sub>t</sub> - <span style='color:#4CAF50;font-weight:bold;'>η / √(s<sub>t</sub> + ε)</span> ⊙ g<sub>t</sub><br><br>Mỗi parameter có LR riêng:<br>η<sub>eff</sub>[i] = η / √(s<sub>t</sub>[i] + ε)<br><br><strong>s lớn → η nhỏ | s nhỏ → η lớn</strong>"
            }
          ]
        },
        {
          "title": "Hyperparameters",
          "cards": [
            {
              "icon": "⚙️",
              "iconColor": "purple",
              "title": "Cài đặt điển hình",
              "content": "<strong>η:</strong> 0.01 (robust hơn SGD)<br><strong>ε:</strong> 10⁻⁸ (tránh chia 0)<br><strong>s₀:</strong> vector 0<br><br><span style='color:#2196F3;'>Element-wise operations → O(d) memory!</span>"
            }
          ]
        }
      ]
    },
    {
      "id": 8,
      "type": "algorithm",
      "title": "Case 1: Axis-Aligned Function - Tính toán từng bước",
      "subtitle": "f(x) = 0.1x₁² + 2x₂² - AdaGrad hoạt động hoàn hảo!",
      "badges": [
        { "text": "Manual Calculation", "color": "blue" },
        { "text": "Step-by-Step", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Setup & Step 1",
          "cards": [
            {
              "icon": "📋",
              "iconColor": "blue",
              "title": "Setup",
              "content": "<strong>Function:</strong> f(x) = 0.1x₁² + 2x₂²<br><strong>Gradient:</strong> ∇f = [0.2x₁, 4x₂]<br><strong>Hessian:</strong> H = diag(0.2, 4) - DIAGONAL!<br><strong>Initial:</strong> x⁽⁰⁾ = (5, 3), η = 0.4, ε = 10⁻⁸, s⁽⁰⁾ = (0, 0)"
            },
            {
              "icon": "1️⃣",
              "iconColor": "green",
              "title": "Step 1: Từ (5, 3)",
              "content": "<code style='display:block; padding:0.8rem; background:rgba(255,255,255,0.05); margin:0.5rem 0;'>g₁ = [0.2×5, 4×3] = [1.0, 12.0]<br>s₁ = [0, 0] + [1², 12²] = [1.0, 144.0]<br>ηₑff = [0.4/√1, 0.4/√144] = [0.4, 0.0333]<br>x⁽¹⁾ = [5, 3] - [0.4×1, 0.0333×12] = [4.6, 2.6]</code><br><span style='color:#FFC107;'>💡 x₂ có gradient 12× lớn hơn → s₂ tăng nhanh → η tự động nhỏ hơn!</span>"
            }
          ]
        },
        {
          "title": "Step 2 & algorithm",
          "cards": [
            {
              "icon": "2️⃣",
              "iconColor": "orange",
              "title": "Step 2: Từ (4.6, 2.6)",
              "content": "<code style='display:block; padding:0.8rem; background:rgba(255,255,255,0.05); margin:0.5rem 0;'>g₂ = [0.92, 10.4]<br>s₂ = [1.0, 144] + [0.85, 108.2] = [1.85, 252.2]<br>ηₑff = [0.294, 0.025]<br>x⁽²⁾ = [4.33, 2.34], f ≈ 12.8</code><br><span style='color:#FFC107;'>💡 Cả 2 coordinates tiến về 0 cân bằng</span>"
            },
            {
              "icon": "✨",
              "iconColor": "purple",
              "title": "Tại sao hoạt động hoàn hảo?",
              "content": "H diagonal → variables độc lập<br>AdaGrad's diagonal scaling = perfect match!<br>Mỗi coordinate tự điều chỉnh theo curvature riêng"
            }
          ]
        }
      ]
    },
    {
      "id": 9,
      "type": "algorithm",
      "title": "Case 2: Rotated Function - AdaGrad gặp khó khăn",
      "subtitle": "f(x) = 0.1(x₁+x₂)² + 2(x₁-x₂)² - Variables bị couple!",
      "badges": [
        { "text": "Coupled Variables", "color": "orange" },
        { "text": "Suboptimal", "color": "red" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Setup & Step 1",
          "cards": [
            {
              "icon": "📋",
              "iconColor": "orange",
              "title": "Setup",
              "content": "<strong>Function:</strong> f(x) = 0.1(x₁+x₂)² + 2(x₁-x₂)²<br><strong>Expanded:</strong> = 2.1x₁² - 3.8x₁x₂ + 2.1x₂²<br><strong>Gradient:</strong> ∇f = [4.2x₁-3.8x₂, -3.8x₁+4.2x₂]<br><strong>Hessian:</strong> H = [[4.2, -3.8], [-3.8, 4.2]] - OFF-DIAGONAL!<br><span style='color:#FFC107;'>⚠️ Cùng eigenvalues với Function 1, nhưng rotate 45°</span>"
            },
            {
              "icon": "1️⃣",
              "iconColor": "red",
              "title": "Step 1: Từ (5, 3)",
              "content": "<code style='display:block; padding:0.8rem; background:rgba(255,255,255,0.05); margin:0.5rem 0;'>g₁ = [21-11.4, -19+12.6] = [9.6, -6.4]<br>s₁ = [92.16, 40.96]<br>ηₑff = [0.0417, 0.0625]<br>x⁽¹⁾ = [4.6, 3.4], f ≈ 9.3</code><br><span style='color:#f44336;'>💡 x₂ tăng lên! Không tiến thẳng về (0,0)</span>"
            }
          ]
        },
        {
          "title": "Step 2 & algorithm",
          "cards": [
            {
              "icon": "2️⃣",
              "iconColor": "orange",
              "title": "Step 2: Từ (4.6, 3.4)",
              "content": "<code style='display:block; padding:0.8rem; background:rgba(255,255,255,0.05); margin:0.5rem 0;'>g₂ = [6.4, -3.2]<br>s₂ = [133.12, 51.2]<br>x⁽²⁾ = [4.38, 3.58], f ≈ 6.7</code><br><span style='color:#f44336;'>💡 Zigzag pattern - không hiệu quả như Function 1</span>"
            },
            {
              "icon": "❌",
              "iconColor": "red",
              "title": "Tại sao kém hiệu quả?",
              "content": "Optimal direction: diagonal 45°<br>AdaGrad chỉ scale x₁, x₂ độc lập<br>Cross-term -3.8x₁x₂ tạo coupling<br><br><strong>Diagonal optimizer ≠ non-diagonal problem!</strong>"
            }
          ]
        }
      ]
    },
    {
      "id": 10,
      "type": "algorithm",
      "title": "Tại sao rotation lại quan trọng?",
      "subtitle": "Geometric explanation of AdaGrad's limitation",
      "badges": [
        { "text": "Geometry", "color": "purple" },
        { "text": "Key algorithm", "color": "blue" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Cùng độ khó, khác coordinate system",
          "cards": [
            {
              "icon": "📐",
              "iconColor": "green",
              "title": "Eigenvalues giống nhau",
              "content": "<strong>Function 1:</strong> H = diag(0.2, 4)<br>Eigenvectors: [1,0] và [0,1] (trục tọa độ)<br><br><strong>Function 2:</strong> H = [[4.2,-3.8],[-3.8,4.2]]<br>Eigenvectors: [1,1]/√2 và [1,-1]/√2 (đường chéo 45°)<br><br><span style='color:#4CAF50;'>Cùng eigenvalues (0.4, 8) - cùng độ khó!</span>"
            },
            {
              "icon": "🎯",
              "iconColor": "blue",
              "title": "AdaGrad = Diagonal optimizer",
              "content": "x<sub>t+1</sub> = x<sub>t</sub> - D<sub>t</sub><sup>-1/2</sup> g<sub>t</sub><br>D<sub>t</sub> = diag(1/√s₁, 1/√s₂)<br><br><strong>Chỉ scale từng coordinate độc lập!</strong><br><br>Function 1: Perfect match ✓<br>Function 2: Misalignment ✗"
            }
          ]
        },
        {
          "title": "Bài học quan trọng",
          "cards": [
            {
              "icon": "💡",
              "iconColor": "purple",
              "title": "Khi nào AdaGrad hoạt động tốt?",
              "content": "<strong>AdaGrad works best when:</strong><br>✓ Hessian diagonal (axis-aligned)<br>✓ Features độc lập<br>✓ Variables không coupled<br><br><strong>Struggles when:</strong><br>✗ Hessian có off-diagonal terms<br>✗ Features coupled/correlated<br>✗ Rotated coordinate system<br><br><span style='color:#2196F3;'>Solutions: Momentum (Adam), full Newton, or rotate coordinates!</span>"
            }
          ]
        }
      ]
    },
    {
      "id": 11,
      "type": "algorithm",
      "title": "Experimental algorithms: Robustness Test",
      "subtitle": "AdaGrad với conservative vs extreme learning rates",
      "badges": [
        { "text": "η=0.2", "color": "blue" },
        { "text": "η=3.0", "color": "red" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Scenario 1: Conservative η=0.2",
          "cards": [
            {
              "icon": "⚠️",
              "iconColor": "orange",
              "title": "Vấn đề: Premature Stopping",
              "content": "s<sub>t</sub> tăng đơn điệu → η<sub>eff</sub> = η/√s<sub>t</sub> → 0<br><br>Algorithm 'đóng băng' trước khi đạt optimum<br><br><strong>Bài học:</strong> LR quá nhỏ + accumulation → vanishing LR"
            },
            {
              "icon": "📊",
              "iconColor": "blue",
              "title": "Observation",
              "content": "Trajectory bắt đầu tốt nhưng dừng giữa chừng<br>Cannot reach (0,0) trong 20 steps"
            }
          ]
        },
        {
          "title": "Scenario 2: Extreme η=3.0",
          "cards": [
            {
              "icon": "✅",
              "iconColor": "green",
              "title": "Kết quả: Tự động ổn định!",
              "content": "Dù η cực lớn, vẫn converge thành công!<br><br><strong>Cơ chế:</strong><br>Direction dốc (x₂) → gradient lớn<br>→ s₂ explode → η<sub>eff</sub> tự động nhỏ<br><br><span style='color:#4CAF50;'>Automatic brake mechanism!</span>"
            },
            {
              "icon": "💡",
              "iconColor": "purple",
              "title": "Robustness",
              "content": "Demonstrates AdaGrad's self-regulation<br>Less sensitive to initial LR choice<br>Steep directions get automatic damping"
            }
          ]
        }
      ]
    },
    {
      "id": 12,
      "type": "image",
      "title": "Visualize: Conservative LR (η=0.2)",
      "subtitle": "Smooth nhưng dừng sớm",
      "badges": [
        { "text": "Experiment", "color": "blue" }
      ],
      "image": "../image/Adagrad-Trajectory-lr=0.2.png",
      "imageStyle": "max-height: 480px; object-fit: contain;",
      "algorithm": "Trajectory moves toward optimum but freezes midway - vanishing LR problem!"
    },
    {
      "id": 13,
      "type": "image",
      "title": "Visualize: Extreme LR (η=3.0)",
      "subtitle": "Aggressive nhưng tự điều chỉnh",
      "badges": [
        { "text": "Robustness", "color": "green" }
      ],
      "image": "../image/Adagrad-Trajectory-r=3.0.png",
      "imageStyle": "max-height: 480px; object-fit: contain;",
      "algorithm": "Despite huge LR, converges successfully - automatic brake in steep directions!"
    },
    {
      "id": 14,
      "type": "algorithm",
      "title": "Fashion-MNIST: Real-world Test",
      "subtitle": "LeNet with AdaGrad - Does it work on neural networks?",
      "badges": [
        { "text": "CNN", "color": "blue" },
        { "text": "10 epochs", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Setup & Results",
          "cards": [
            {
              "icon": "🧠",
              "iconColor": "blue",
              "title": "Model: Improved LeNet",
              "content": "Conv → ReLU → MaxPool → Conv → ReLU → MaxPool → FC(120) → FC(84) → FC(10)<br><br>Replaced Sigmoid with ReLU to avoid vanishing gradients"
            },
            {
              "icon": "📈",
              "iconColor": "green",
              "title": "Training Performance",
              "content": "Optimizer: AdaGrad(lr=0.01)<br>Batch size: 256<br><br>✓ Loss giảm đều<br>✓ Accuracy tăng ổn định<br>✓ Demonstrates effectiveness on CNNs"
            }
          ]
        },
        {
          "title": "Observations",
          "cards": [
            {
              "icon": "⚠️",
              "iconColor": "orange",
              "title": "Note về Deep Networks",
              "content": "10 epochs: AdaGrad works fine<br><br>Longer training (50+ epochs):<br>→ May suffer from vanishing LR<br>→ Consider RMSProp/Adam instead"
            },
            {
              "icon": "💡",
              "iconColor": "purple",
              "title": "When to use AdaGrad",
              "content": "✓ Short training (few epochs)<br>✓ Sparse features dominant<br>✓ Convex or near-convex problems<br><br>✗ Very deep networks<br>✗ Long training sessions"
            }
          ]
        }
      ]
    },
    {
      "id": 15,
      "type": "image",
      "title": "Fashion-MNIST: Training Loss",
      "subtitle": "Steady decrease over 10 epochs",
      "badges": [
        { "text": "Results", "color": "green" }
      ],
      "image": "../image/Training-Loss.png",
      "imageStyle": "max-height: 450px; object-fit: contain;"
    },
    {
      "id": 16,
      "type": "image",
      "title": "Fashion-MNIST: Test Accuracy",
      "subtitle": "Convergence pattern",
      "badges": [
        { "text": "Performance", "color": "blue" }
      ],
      "image": "../image/Test-Accuracy.png",
      "imageStyle": "max-height: 450px; object-fit: contain;"
    },
    {
      "id": 17,
      "type": "algorithm",
      "title": "AdaGrad Advantages - Khi nào nên dùng?",
      "subtitle": "Strengths và best use cases",
      "badges": [
        { "text": "Sparse Data", "color": "green" },
        { "text": "NLP", "color": "blue" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Core Strengths",
          "cards": [
            {
              "icon": "🎯",
              "iconColor": "green",
              "title": "1. Automatic Per-Parameter Adaptation",
              "content": "<strong>Không cần tune LR cho từng parameter!</strong><br><br>Frequent features → tự động giảm LR<br>Rare features → tự động tăng LR<br><br>Tiết kiệm effort tuning hyperparameters"
            },
            {
              "icon": "💪",
              "iconColor": "blue",
              "title": "2. Robust to Large Initial LR",
              "content": "<strong>Automatic brake mechanism</strong><br><br>Steep directions self-regulate<br>s explodes → η<sub>eff</sub> shrinks<br><br>Less sensitive to η<sub>0</sub> choice"
            },
            {
              "icon": "⚡",
              "iconColor": "purple",
              "title": "3. Efficient for Sparse Features",
              "content": "<strong>O(d) memory overhead</strong><br><br>Only active features accumulate<br>Simple element-wise operations<br>No matrix operations needed"
            }
          ]
        },
        {
          "title": "Best Applications",
          "cards": [
            {
              "icon": "📝",
              "iconColor": "blue",
              "title": "Natural Language Processing",
              "content": "✓ Bag-of-words, TF-IDF<br>✓ Word embeddings (rare words!)<br>✓ Text classification<br>✓ Language modeling"
            },
            {
              "icon": "🎬",
              "iconColor": "green",
              "title": "Recommender Systems",
              "content": "✓ User/item embeddings<br>✓ Many users have few interactions<br>✓ Sparse interaction matrices<br>✓ Cold-start items"
            },
            {
              "icon": "📱",
              "iconColor": "orange",
              "title": "Computational Advertising",
              "content": "✓ CTR prediction<br>✓ Sparse features: user IDs, ads<br>✓ Rare ads need effective learning<br>✓ Feature engineering heavy"
            }
          ]
        }
      ]
    },
    {
      "id": 18,
      "type": "warning",
      "title": "AdaGrad Limitations - Khi nào tránh dùng?",
      "subtitle": "Critical weaknesses và failure modes",
      "badges": [
        { "text": "Vanishing LR", "color": "red" },
        { "text": "Deep Learning", "color": "orange" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Main Weaknesses",
          "cards": [
            {
              "icon": "📉",
              "iconColor": "red",
              "title": "1. Monotonic LR Decay (FATAL!)",
              "content": "<strong>s<sub>t</sub> = s<sub>t-1</sub> + g<sub>t</sub>² luôn tăng</strong><br><br>η<sub>eff</sub> = η/√s<sub>t</sub> → 0 inevitably<br><br><span style='color:#f44336;'>Can stop learning before convergence!</span><br>Especially problematic in deep NNs"
            },
            {
              "icon": "🔄",
              "iconColor": "orange",
              "title": "2. Poor for Non-Convex Landscapes",
              "content": "<strong>Deep NNs: plateaus, saddle points</strong><br><br>Need ability to 'forget' old gradients<br>AdaGrad accumulates forever<br><br>Cannot adapt to changing landscape"
            },
            {
              "icon": "📐",
              "iconColor": "purple",
              "title": "3. Diagonal Limitation",
              "content": "<strong>Only axis-aligned problems</strong><br><br>Struggles with coupled features<br>Cannot capture off-diagonal Hessian<br><br>Rotated problems → suboptimal"
            }
          ]
        },
        {
          "title": "When to Avoid",
          "cards": [
            {
              "icon": "🧠",
              "iconColor": "red",
              "title": "Deep Neural Networks",
              "content": "❌ Long training (50+ epochs)<br>❌ Very deep architectures<br>❌ Need sustained learning<br><br><strong>Use instead:</strong> RMSProp, Adam"
            },
            {
              "icon": "🔀",
              "iconColor": "orange",
              "title": "Non-Stationary Problems",
              "content": "❌ Data distribution shifts<br>❌ Online learning with drift<br>❌ Transfer learning scenarios<br><br>Need adaptive but not monotonic"
            },
            {
              "icon": "🎲",
              "iconColor": "purple",
              "title": "Highly Non-Convex",
              "content": "❌ Reinforcement learning<br>❌ GANs (generative models)<br>❌ Complex multi-modal landscapes<br><br>Need exploration capability"
            }
          ]
        }
      ]
    },
    {
      "id": 19,
      "type": "algorithm",
      "title": "Evolution: Từ AdaGrad đến Adam",
      "subtitle": "Fixing vanishing LR problem",
      "badges": [
        { "text": "RMSProp", "color": "blue" },
        { "text": "Adam", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "AdaGrad → RMSProp",
          "cards": [
            {
              "icon": "🔵",
              "iconColor": "blue",
              "title": "AdaGrad (2011): Innovation",
              "content": "<strong>s<sub>t</sub> = s<sub>t-1</sub> + g<sub>t</sub>²</strong><br><br>✓ Per-parameter adaptive LR<br>✓ Great for sparse features<br>✗ Monotonic accumulation → vanishing LR"
            },
            {
              "icon": "🟢",
              "iconColor": "green",
              "title": "RMSProp (2012): Fix vanishing LR",
              "content": "<strong>s<sub>t</sub> = γs<sub>t-1</sub> + (1-γ)g<sub>t</sub>²</strong><br><br>Exponential moving average (γ≈0.9)<br>'Forgets' old gradients<br>s<sub>t</sub> không grow unbounded<br><br><span style='color:#4CAF50;'>→ LR stabilizes!</span>"
            }
          ]
        },
        {
          "title": "Modern Standard",
          "cards": [
            {
              "icon": "🟣",
              "iconColor": "purple",
              "title": "Adam (2015): Best of both worlds",
              "content": "<strong>Momentum + RMSProp</strong><br><br>m<sub>t</sub>: 1st moment (momentum)<br>v<sub>t</sub>: 2nd moment (RMSProp)<br><br>Combines direction smoothing + adaptive scaling<br><br><span style='color:#2196F3;'>→ Current standard in deep learning!</span>"
            }
          ]
        }
      ]
    },
    {
      "id": 20,
      "type": "algorithm",
      "title": "Exercise: Fixing AdaGrad → RMSProp",
      "subtitle": "Implementing exponential moving average",
      "badges": [
        { "text": "Hands-on", "color": "blue" },
        { "text": "Comparison", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Problem & Solution",
          "cards": [
            {
              "icon": "⚠️",
              "iconColor": "red",
              "title": "Problem identified",
              "content": "<strong>AdaGrad:</strong> s<sub>t</sub> accumulates indefinitely<br>→ Learning rate vanishes too early<br>→ Model stops learning before optimal<br><br>Visible in Fashion-MNIST: loss plateaus early"
            },
            {
              "icon": "💡",
              "iconColor": "green",
              "title": "Proposed fix: Exponential Moving Average",
              "content": "<strong>Modified accumulation:</strong><br>s<sub>t</sub> = γs<sub>t-1</sub> + (1-γ)g<sub>t</sub>²<br><br>γ = 0.9 typical (90% old, 10% new)<br><br>This is exactly <strong>RMSProp</strong>!<br>Allows 'forgetting' old gradients"
            }
          ]
        },
        {
          "title": "Experimental Results",
          "cards": [
            {
              "icon": "📊",
              "iconColor": "blue",
              "title": "Comparison on Fashion-MNIST",
              "content": "<strong>AdaGrad:</strong> Training loss plateaus ~epoch 5<br><strong>RMSProp:</strong> Continues learning longer<br><br>Test accuracy improves significantly<br><br><span style='color:#4CAF50;'>EMA prevents LR vanishing - critical for deep NNs!</span><br><br>Simple 1-line change → huge impact"
            }
          ]
        }
      ]
    },
    {
      "id": 21,
      "type": "image",
      "title": "Comparison: AdaGrad vs RMSProp Training Loss",
      "subtitle": "Impact of exponential moving average",
      "badges": [
        { "text": "Experiment", "color": "blue" }
      ],
      "image": "../image/Training-Loss-Comparison.png",
      "imageStyle": "max-height: 450px; object-fit: contain;",
      "algorithm": "RMSProp continues learning while AdaGrad plateaus - demonstrates vanishing LR problem"
    },
    {
      "id": 22,
      "type": "image",
      "title": "Comparison: AdaGrad vs RMSProp Test Accuracy",
      "subtitle": "Better long-term performance",
      "badges": [
        { "text": "Results", "color": "green" }
      ],
      "image": "../image/Test-Accuracy-Comparison.png",
      "imageStyle": "max-height: 450px; object-fit: contain;",
      "algorithm": "Simple modification (EMA) makes huge difference - foundation for Adam optimizer"
    },
    {
      "id": 23,
      "type": "algorithm",
      "title": "Summary: Key Takeaways",
      "subtitle": "Những điều quan trọng nhất về AdaGrad",
      "badges": [
        { "text": "Core Concepts", "color": "blue" },
        { "text": "Practical Wisdom", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Core Understanding",
          "cards": [
            {
              "icon": "🎯",
              "iconColor": "blue",
              "title": "Innovation: Per-parameter adaptive LR",
              "content": "<strong>s<sub>t</sub> = s<sub>t-1</sub> + g<sub>t</sub>²</strong><br>η<sub>eff</sub> = η/√(s<sub>t</sub> + ε)<br><br>Squared gradients as Hessian proxy<br>Diagonal preconditioning interpretation"
            },
            {
              "icon": "✅",
              "iconColor": "green",
              "title": "When it shines",
              "content": "<strong>Best for:</strong><br>✓ Sparse features (NLP, RecSys)<br>✓ Axis-aligned problems<br>✓ Convex or near-convex<br>✓ Short training sessions"
            },
            {
              "icon": "❌",
              "iconColor": "red",
              "title": "When to avoid",
              "content": "<strong>Struggles with:</strong><br>✗ Deep neural networks<br>✗ Long training (50+ epochs)<br>✗ Non-stationary landscapes<br>✗ Coupled/rotated features"
            }
          ]
        },
        {
          "title": "Practical Guidance",
          "cards": [
            {
              "icon": "🔧",
              "iconColor": "purple",
              "title": "Implementation",
              "content": "Simple: O(d) memory<br>Element-wise operations only<br><br><strong>PyTorch:</strong><br>torch.optim.Adagrad(params, lr=0.01)<br><br>More robust to LR choice than SGD"
            },
            {
              "icon": "🚀",
              "iconColor": "orange",
              "title": "Modern alternatives",
              "content": "<strong>RMSProp:</strong> Fix vanishing LR (EMA)<br><strong>Adam:</strong> Add momentum<br><strong>AdamW:</strong> Proper weight decay<br><br>For deep learning: use Adam as default"
            },
            {
              "icon": "📚",
              "iconColor": "green",
              "title": "Historical impact",
              "content": "Pioneered adaptive methods (2011)<br>Inspired entire family of optimizers<br>Still effective for specific domains<br><br>Foundation for understanding modern optimizers"
            }
          ]
        }
      ]
    },
    {
      "id": 24,
      "type": "algorithm",
      "title": "Nhóm học được gì từ AdaGrad?",
      "subtitle": "Beyond the algorithm - deeper algorithms",
      "badges": [
        { "text": "Reflection", "color": "purple" },
        { "text": "Learning", "color": "blue" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Hiểu sâu, không học vẹt",
          "cards": [
            {
              "icon": "🧠",
              "iconColor": "blue",
              "title": "1. Hiểu tại sao, không chỉ biết làm sao",
              "content": "<strong>Không chỉ áp dụng công thức</strong><br><br>✓ Tại sao squared gradients?<br>✓ Tại sao chia √s thay vì s?<br>✓ Preconditioning có nghĩa gì?<br>✓ Khi nào diagonal approximation đủ tốt?<br><br><em>Understanding > memorizing</em>"
            },
            {
              "icon": "🔢",
              "iconColor": "green",
              "title": "2. Tính toán từng bước = verification",
              "content": "<strong>Manual calculations build intuition</strong><br><br>✓ Axis-aligned: perfect convergence<br>✓ Rotated: struggles visibly<br>✓ Conservative LR: premature stopping<br>✓ Extreme LR: automatic stabilization<br><br><em>Numbers tell the story</em>"
            }
          ]
        },
        {
          "title": "Limitations & Trade-offs",
          "cards": [
            {
              "icon": "💡",
              "iconColor": "purple",
              "title": "3. Limitations = opportunities",
              "content": "<strong>Vanishing LR problem</strong><br>→ RMSProp (exponential MA)<br>→ Adam (add momentum)<br>→ Entire family of optimizers<br><br><em>Every weakness teaches something</em>"
            },
            {
              "icon": "⚖️",
              "iconColor": "orange",
              "title": "4. Trade-offs everywhere",
              "content": "<strong>No perfect optimizer</strong><br><br>AdaGrad: Great for sparse, fails for deep<br>Adam: General-purpose, not always best<br>SGD+momentum: Simple, requires tuning<br><br><em>Tool selection = understanding context</em>"
            }
          ]
        }
      ]
    },
    {
      "id": 25,
      "type": "thank-you",
      "title": "Thank You!",
      "subtitle": "Questions & Discussion",
      "badges": [
        { "text": "Q&A", "color": "blue" },
        { "text": "AdaGrad", "color": "green" }
      ],
      "closing": {
        "message": "Cảm ơn thầy và các bạn đã lắng nghe!",
        "reflection": "AdaGrad không chỉ là công thức - đó là cách tư duy về optimization"
      }
    }
  ]
};
