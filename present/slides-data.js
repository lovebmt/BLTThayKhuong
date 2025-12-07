// Slides Data - AdaGrad Algorithm Presentation
const SLIDES_DATA = {
  "presentation": {
    "title": "AdaGrad: Adaptive Gradient Algorithm",
    "totalSlides": 25
  },
  "slides": [
    {
      "id": 1,
      "type": "title",
      "title": "AdaGrad Algorithm",
      "subtitle": "Adaptive Gradient Method for Machine Learning Optimization",
      "badges": [
        { "text": "Optimization", "color": "blue" },
        { "text": "Adaptive Learning Rate", "color": "green" },
        { "text": "Sparse Features", "color": "purple" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Course Information",
          "cards": [
            {
              "icon": "🎓",
              "iconColor": "blue",
              "title": "Math for Computer Science",
              "content": "Optimization Algorithms"
            },
            {
              "icon": "📅",
              "iconColor": "purple",
              "title": "Date",
              "content": "December 2025"
            }
          ]
        },
        {
          "title": "Topics Covered",
          "cards": [
            {
              "icon": "📊",
              "iconColor": "green",
              "title": "Core Concepts",
              "content": "Adaptive learning rates, preconditioning, sparse optimization"
            },
            {
              "icon": "💻",
              "iconColor": "orange",
              "title": "Implementation",
              "content": "From scratch & PyTorch examples"
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "type": "content",
      "title": "Motivation: The Problem with Sparse Features",
      "subtitle": "Why Standard Gradient Descent Struggles",
      "badges": [
        { "text": "Sparse Data", "color": "blue" },
        { "text": "NLP", "color": "green" },
        { "text": "Global LR Problem", "color": "red" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "The Challenge",
          "cards": [
            {
              "icon": "📝",
              "iconColor": "blue",
              "title": "Sparse Features in NLP",
              "content": "Bag-of-words, one-hot encoding → Most features are zero, only a few are active per sample"
            },
            {
              "icon": "⚠️",
              "iconColor": "red",
              "title": "Global Learning Rate Problem",
              "content": "Formula: η<sub>t</sub> = η<sub>0</sub>/√t<br><br>Rare features appearing at large t get tiny updates"
            }
          ]
        },
        {
          "title": "Example Calculation",
          "cards": [
            {
              "icon": "🔢",
              "iconColor": "purple",
              "title": "Scenario",
              "content": "η<sub>0</sub> = 0.1, rare feature appears at t=1000<br>gradient g<sub>1000</sub> = 0.5"
            },
            {
              "icon": "📉",
              "iconColor": "orange",
              "title": "Result",
              "content": "η<sub>1000</sub> = 0.1/√1000 ≈ 0.00316<br>Weight update: -0.00158 (too small!)"
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "type": "content",
      "title": "Naive Solution & Its Limitations",
      "subtitle": "Counting Feature Appearances",
      "badges": [
        { "text": "Simple Idea", "color": "blue" },
        { "text": "Flawed Approach", "color": "orange" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Naive Approach",
          "cards": [
            {
              "icon": "📊",
              "iconColor": "blue",
              "title": "Counter-Based LR",
              "content": "Track s(i,t) = # times feature i appeared<br><br>η<sub>i,t</sub> = η<sub>0</sub>/√(s(i,t) + c)"
            },
            {
              "icon": "✅",
              "iconColor": "green",
              "title": "Small Improvement",
              "content": "Rare features get larger LR when they appear"
            }
          ]
        },
        {
          "title": "Critical Limitations",
          "cards": [
            {
              "icon": "❌",
              "iconColor": "red",
              "title": "Ignores Gradient Magnitude",
              "content": "Treats gradients 0.001 and 10 equally - just counts occurrences"
            },
            {
              "icon": "⚠️",
              "iconColor": "orange",
              "title": "Binary Decision",
              "content": "Needs arbitrary threshold: when does a feature 'appear'? Introduces extra hyperparameter"
            }
          ]
        }
      ]
    },
    {
      "id": 4,
      "type": "content",
      "title": "AdaGrad Solution: Accumulated Squared Gradients",
      "subtitle": "From Counting to Magnitude-Aware Accumulation",
      "badges": [
        { "text": "Core Innovation", "color": "green" },
        { "text": "Automatic Weighting", "color": "blue" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Key Idea",
          "cards": [
            {
              "icon": "💡",
              "iconColor": "green",
              "title": "Accumulate Squared Gradients",
              "content": "s(i, t+1) = s(i, t) + (∂<sub>i</sub>f(x<sub>t</sub>))<sup>2</sup><br><br>Not just 'how many times' but 'how large' gradients have been"
            },
            {
              "icon": "📐",
              "iconColor": "blue",
              "title": "Per-Coordinate Learning Rate",
              "content": "η<sub>i,t</sub> = η / √(s(i,t) + ε)<br><br>Each parameter gets its own adaptive rate"
            }
          ]
        },
        {
          "title": "Advantages",
          "cards": [
            {
              "icon": "✨",
              "iconColor": "purple",
              "title": "No Arbitrary Thresholds",
              "content": "Every gradient contributes proportional to its square - automatic weighting"
            },
            {
              "icon": "⚖️",
              "iconColor": "green",
              "title": "Automatic Scaling",
              "content": "Large/frequent gradients → fast growth of s → small effective LR (brake)<br>Small/rare gradients → slow growth of s → large effective LR (accelerate)"
            }
          ]
        }
      ]
    },
    {
      "id": 5,
      "type": "content",
      "title": "The AdaGrad Algorithm",
      "subtitle": "Mathematical Formulation",
      "badges": [
        { "text": "Update Rule", "color": "blue" },
        { "text": "Element-wise Operations", "color": "green" }
      ],
      "layout": "single-column",
      "content": [
        {
          "icon": "🧮",
          "iconColor": "blue",
          "title": "AdaGrad Update Steps",
          "content": "<div style='font-size: 1em; line-height: 1.6;'><strong>Step 1 - Compute gradient:</strong><br>g<sub>t</sub> = ∂<sub>w</sub> l(y<sub>t</sub>, f(x<sub>t</sub>, w)) <span style='opacity:0.7;'>← derivative of loss w.r.t. parameters</span><br><br><strong>Step 2 - Accumulate squared gradients:</strong><br>s<sub>t</sub> = s<sub>t-1</sub> + g<sub>t</sub><sup>2</sup> <span style='opacity:0.7;'>← element-wise, monotonically increasing</span><br><br><strong>Step 3 - Update parameters with adaptive learning rate:</strong><br>w<sub>t</sub> = w<sub>t-1</sub> - <span style='color:#4CAF50;font-weight:bold;'>η / √(s<sub>t</sub> + ε)</span> ⊙ g<sub>t</sub><br>where effective LR = <span style='color:#4CAF50;font-weight:bold;'>η / √(s<sub>t</sub> + ε)</span> adapts per parameter</div>"
        },
        {
          "icon": "⚙️",
          "iconColor": "green",
          "title": "Hyperparameters",
          "content": "<strong>η</strong> (learning rate): typically 0.01 - 0.1<br><strong>ε</strong> (epsilon): 10<sup>-8</sup> for numerical stability<br><strong>s<sub>0</sub></strong> (initial): 0 (zero vector)"
        },
        {
          "icon": "💭",
          "iconColor": "purple",
          "title": "Key Behavior",
          "content": "Coordinates with <strong>large/frequent gradients</strong> → s<sub>t</sub> grows fast → <span style='color:#f44336;'>small effective LR</span> (automatic brake)<br>Coordinates with <strong>small/rare gradients</strong> → s<sub>t</sub> grows slowly → <span style='color:#4CAF50;'>large effective LR</span> (accelerate learning)"
        }
      ]
    },
    {
      "id": 6,
      "type": "content",
      "title": "Preconditioning Perspective",
      "subtitle": "AdaGrad as Diagonal Preconditioning",
      "badges": [
        { "text": "Condition Number", "color": "blue" },
        { "text": "Geometry", "color": "purple" },
        { "text": "Hessian Approximation", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "The Problem: Ill-Conditioned Landscapes",
          "cards": [
            {
              "icon": "📊",
              "iconColor": "red",
              "title": "Elongated Contours",
              "content": "Quadratic function f(x) = ½x<sup>T</sup>Qx<br><br>Condition number κ(Q) = λ<sub>max</sub>/λ<sub>min</sub><br>Large κ → slow zigzag convergence"
            },
            {
              "icon": "🔄",
              "iconColor": "orange",
              "title": "Preconditioning Goal",
              "content": "Transform variables y = P<sup>1/2</sup>x<br>New Hessian: Q̃ = P<sup>-1/2</sup>QP<sup>-1/2</sup><br>Ideal: P=Q → κ(Q̃)=1 (sphere)"
            }
          ]
        },
        {
          "title": "AdaGrad's Solution",
          "cards": [
            {
              "icon": "📐",
              "iconColor": "blue",
              "title": "Diagonal Approximation",
              "content": "Use only diagonal: P = diag(Q)<br>Cheap to compute O(d) vs O(d<sup>2</sup>)<br>Works well when problem is axis-aligned"
            },
            {
              "icon": "🎯",
              "iconColor": "green",
              "title": "AdaGrad = Time-Varying Preconditioner",
              "content": "x<sub>t+1</sub> = x<sub>t</sub> - η D<sub>t</sub><sup>-1/2</sup> g<sub>t</sub><br>D<sub>t</sub> = diag(s<sub>t</sub> + ε)<br>'Rounds' the landscape automatically"
            }
          ]
        }
      ]
    },
    {
      "id": 7,
      "type": "content",
      "title": "Gradient as Hessian Proxy",
      "subtitle": "Why We Don't Need Second-Order Information",
      "badges": [
        { "text": "First-Order Only", "color": "blue" },
        { "text": "Cheap Approximation", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "The Challenge in Deep Learning",
          "cards": [
            {
              "icon": "💾",
              "iconColor": "red",
              "title": "Hessian is Infeasible",
              "content": "For d parameters: Hessian is d×d matrix<br>d=10<sup>6</sup> → 10<sup>12</sup> entries!<br>Storage: O(d<sup>2</sup>), Inversion: O(d<sup>3</sup>)"
            },
            {
              "icon": "🚫",
              "iconColor": "orange",
              "title": "Newton's Method Impractical",
              "content": "Would need full Hessian computation and inversion every step"
            }
          ]
        },
        {
          "title": "AdaGrad's Clever Approximation",
          "cards": [
            {
              "icon": "💡",
              "iconColor": "green",
              "title": "Observation",
              "content": "Near optimum: g(x) ≈ Q(x - x*)<br>High curvature Q<sub>ii</sub> → large/variable gradients<br>Accumulated g<sup>2</sup> approximates diagonal of Q"
            },
            {
              "icon": "✅",
              "iconColor": "blue",
              "title": "Result",
              "content": "Storage: O(d) vector s<sub>t</sub><br>Update: element-wise ops (cheap)<br>Gets curvature benefits without computing Hessian!"
            }
          ]
        }
      ]
    },
    {
      "id": 8,
      "type": "content",
      "title": "Case Study: Axis-Aligned Function",
      "subtitle": "f(x) = 0.1x₁² + 2x₂² — Step-by-Step Calculation",
      "badges": [
        { "text": "Independent Variables", "color": "green" },
        { "text": "Detailed Example", "color": "blue" }
      ],
      "layout": "single-column",
      "content": [
        {
          "icon": "🎯",
          "iconColor": "blue",
          "title": "Setup: f(x) = 0.1x₁² + 2x₂²",
          "content": "<strong>Gradient:</strong> ∇f = [0.2x₁, 4x₂]<br><strong>Hessian:</strong> H = diag(0.2, 4) — diagonal (axis-aligned)!<br><strong>Initial:</strong> x<sup>(0)</sup> = (5, 3), η = 0.4, ε = 10<sup>-8</sup>, s<sup>(0)</sup> = (0, 0)"
        },
        {
          "icon": "1️⃣",
          "iconColor": "green",
          "title": "Step 1: From (5, 3)",
          "content": "<strong>Gradient:</strong> g₁ = [0.2×5, 4×3] = [1.0, 12.0]<br><strong>Accumulate:</strong> s₁ = [0, 0] + [1², 12²] = [1.0, 144.0]<br><strong>Effective LR:</strong> η<sub>eff</sub> = [0.4/√1.0, 0.4/√144.0] = [0.4, 0.0333]<br><strong>Update:</strong> x<sup>(1)</sup> = [5, 3] - [0.4×1.0, 0.0333×12.0] = <span style='color:#4CAF50;font-weight:bold;'>[4.6, 2.6]</span>, f ≈ 15.6"
        },
        {
          "icon": "2️⃣",
          "iconColor": "orange",
          "title": "Step 2: From (4.6, 2.6)",
          "content": "<strong>Gradient:</strong> g₂ = [0.92, 10.4]<br><strong>Accumulate:</strong> s₂ = [1.0, 144.0] + [0.85, 108.2] = [1.85, 252.2]<br><strong>Effective LR:</strong> [0.294, 0.025]<br><strong>Update:</strong> x<sup>(2)</sup> = <span style='color:#4CAF50;font-weight:bold;'>[4.33, 2.34]</span>, f ≈ 12.8"
        },
        {
          "icon": "✨",
          "iconColor": "purple",
          "title": "Key Observation",
          "content": "x₂ has <strong>20× larger gradient</strong> (4 vs 0.2) → s₂ grows much faster → automatically gets smaller LR<br>Result: <span style='color:#4CAF50;'>Balanced convergence</span> despite different curvatures!"
        }
      ]
    },
    {
      "id": 9,
      "type": "content",
      "title": "Case Study: Rotated Function",
      "subtitle": "f(x) = 0.1(x₁+x₂)² + 2(x₁-x₂)² — AdaGrad Struggles",
      "badges": [
        { "text": "Coupled Variables", "color": "orange" },
        { "text": "Suboptimal Case", "color": "red" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Setup & Properties",
          "cards": [
            {
              "icon": "🎯",
              "iconColor": "blue",
              "title": "Function Properties",
              "content": "Same minimum at (0,0)<br>Gradient: ∇f = [4.2x₁-3.8x₂, -3.8x₁+4.2x₂]<br>Hessian: H = [[4.2, -3.8], [-3.8, 4.2]]<br>Non-diagonal! 45° rotation"
            },
            {
              "icon": "⚙️",
              "iconColor": "green",
              "title": "Same Parameters",
              "content": "Start: (5, 3), η = 0.4<br>Same eigenvalues as Function 1, but rotated eigenvectors"
            }
          ]
        },
        {
          "title": "Results & Why It's Harder",
          "cards": [
            {
              "icon": "📊",
              "iconColor": "orange",
              "title": "Slower Convergence",
              "content": "Step 1: (5,3) → (4.6, 3.4), f ≈ 9.3<br>Step 2: (4.6,3.4) → (4.4, 3.6), f ≈ 6.7<br>Step 3: (4.4,3.6) → (4.2, 3.7), f ≈ 6.6<br>Zigzag pattern, uneven progress"
            },
            {
              "icon": "❌",
              "iconColor": "red",
              "title": "Root Cause",
              "content": "Optimal direction is diagonal (45°)<br>AdaGrad can only scale x₁, x₂ independently<br>Cross-term -3.8x₁x₂ creates coupling<br>Diagonal preconditioner cannot capture off-diagonal structure!"
            }
          ]
        }
      ]
    },
    {
      "id": 10,
      "type": "content",
      "title": "Why Rotation Matters",
      "subtitle": "Diagonal Optimizer Meets Non-Diagonal Problem",
      "badges": [
        { "text": "Geometry", "color": "purple" },
        { "text": "Limitations", "color": "red" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Mathematical Explanation",
          "cards": [
            {
              "icon": "📐",
              "iconColor": "blue",
              "title": "Hessian Structure",
              "content": "<strong>Function 1 (easy):</strong> H = diag(0.2, 4)<br>Eigenvectors: [1,0] and [0,1] (axes)<br><br><strong>Function 2 (hard):</strong> H = [[4.2, -3.8], [-3.8, 4.2]]<br>Eigenvectors: [1,1]/√2 and [1,-1]/√2 (diagonals)"
            },
            {
              "icon": "🔍",
              "iconColor": "purple",
              "title": "Same Difficulty, Different Coordinates",
              "content": "Both have same eigenvalues (0.4, 8)<br>Same intrinsic difficulty!<br>But Function 2's principal axes don't align with x₁, x₂"
            }
          ]
        },
        {
          "title": "AdaGrad's Limitation",
          "cards": [
            {
              "icon": "⚠️",
              "iconColor": "orange",
              "title": "Diagonal Scaling Only",
              "content": "AdaGrad: x<sub>t+1</sub> = x<sub>t</sub> - D<sub>t</sub><sup>-1/2</sup> g<sub>t</sub><br>D<sub>t</sub> = diag(1/√s₁, 1/√s₂)<br><br>Can only adjust x₁ and x₂ independently"
            },
            {
              "icon": "💡",
              "iconColor": "green",
              "title": "When It Works",
              "content": "✅ Perfect when Hessian is diagonal (axis-aligned)<br>❌ Suboptimal when Hessian has off-diagonal terms (rotated/coupled)<br><br>Solutions: Momentum (Adam), Newton, or rotate coordinates first"
            }
          ]
        }
      ]
    },
    {
      "id": 11,
      "type": "content",
      "title": "Implementation Example",
      "subtitle": "PyTorch Code Walkthrough",
      "badges": [
        { "text": "Python", "color": "blue" },
        { "text": "PyTorch", "color": "orange" }
      ],
      "layout": "single-column",
      "content": [
        {
          "icon": "💻",
          "iconColor": "blue",
          "title": "From Scratch Implementation",
          "content": "<pre style='background: #2d2d2d; padding: 12px; border-radius: 6px; color: #f8f8f2; font-size: 0.85em; margin: 0.5rem 0; line-height: 1.4;'>def adagrad(params, states, hyperparams):\n    eps = 1e-6\n    for p, s in zip(params, states):\n        with torch.no_grad():\n            <span style='color:#4CAF50;'># Step 2: Accumulate squared gradients</span>\n            s[:] += torch.square(p.grad)\n            \n            <span style='color:#4CAF50;'># Step 3: Update with adaptive LR = η/√(s+ε)</span>\n            p[:] -= hyperparams['lr'] * p.grad / torch.sqrt(s + eps)\n            \n            p.grad.data.zero_()</pre>"
        },
        {
          "icon": "🔧",
          "iconColor": "green",
          "title": "Using PyTorch Built-in Optimizer",
          "content": "<pre style='background: #2d2d2d; padding: 12px; border-radius: 6px; color: #f8f8f2; font-size: 0.85em; margin: 0.5rem 0; line-height: 1.4;'>import torch.optim as optim\n\nmodel = nn.Sequential(nn.Linear(2, 1))\noptimizer = optim.Adagrad(model.parameters(), lr=0.01)\n\nfor X, y in data_loader:\n    loss = loss_fn(model(X), y)\n    optimizer.zero_grad()  <span style='color:#4CAF50;'># Clear gradients</span>\n    loss.backward()        <span style='color:#4CAF50;'># Compute gradients</span>\n    optimizer.step()       <span style='color:#4CAF50;'># AdaGrad update</span></pre>"
        }
      ]
    },
    {
      "id": 12,
      "type": "content",
      "title": "Experimental Results: Quadratic Function",
      "subtitle": "Robustness to Learning Rate Choice",
      "badges": [
        { "text": "Conservative LR", "color": "blue" },
        { "text": "Extreme LR", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Experiment Setup",
          "cards": [
            {
              "icon": "🎯",
              "iconColor": "blue",
              "title": "Objective",
              "content": "f(x) = 0.1x₁² + 2x₂²<br>Start: (-5, -2)<br>20 iterations"
            },
            {
              "icon": "⚙️",
              "iconColor": "green",
              "title": "Two Scenarios",
              "content": "<strong>Conservative:</strong> η = 0.2<br><strong>Extreme:</strong> η = 3.0<br><br>Test automatic stabilization"
            }
          ]
        },
        {
          "title": "Key Observations",
          "cards": [
            {
              "icon": "⚠️",
              "iconColor": "orange",
              "title": "η = 0.2: Premature Stopping",
              "content": "Effective LR = η/√s<sub>t</sub><br>s<sub>t</sub> grows monotonically → LR shrinks to ~0<br>Algorithm 'freezes' before reaching optimum"
            },
            {
              "icon": "✅",
              "iconColor": "green",
              "title": "η = 3.0: Automatic Brake",
              "content": "Despite huge LR, converges successfully!<br>Steep direction (x₂): large gradient → s explodes → effective LR becomes small<br>Demonstrates robustness to hyperparameter choice"
            }
          ]
        }
      ]
    },
    {
      "id": 13,
      "type": "image",
      "title": "Experimental Results: Conservative Learning Rate",
      "subtitle": "AdaGrad Trajectory with η=0.2 on Quadratic Function",
      "badges": [
        { "text": "Conservative η=0.2", "color": "blue" },
        { "text": "Smooth Convergence", "color": "green" }
      ],
      "image": "../image/Adagrad-Trajectory-lr=0.2.png",
      "imageStyle": "max-height: 480px; object-fit: contain;"
    },
    {
      "id": 14,
      "type": "image",
      "title": "Experimental Results: Extreme Learning Rate",
      "subtitle": "AdaGrad Trajectory with η=3.0 on Quadratic Function",
      "badges": [
        { "text": "Extreme η=3.0", "color": "red" },
        { "text": "Aggressive Updates", "color": "orange" }
      ],
      "image": "../image/Adagrad-Trajectory-r=3.0.png",
      "imageStyle": "max-height: 480px; object-fit: contain;"
    },
    {
      "id": 15,
      "type": "content",
      "title": "Real-World Application: Fashion-MNIST",
      "subtitle": "Training LeNet with AdaGrad",
      "badges": [
        { "text": "CNN", "color": "blue" },
        { "text": "Fashion-MNIST", "color": "purple" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Model & Setup",
          "cards": [
            {
              "icon": "🧠",
              "iconColor": "blue",
              "title": "Improved LeNet-5",
              "content": "Conv(6)→ReLU→MaxPool→Conv(16)→ReLU→MaxPool→FC(120)→ReLU→FC(84)→ReLU→FC(10)<br><br>Replaced Sigmoid with ReLU to avoid vanishing gradients"
            },
            {
              "icon": "📊",
              "iconColor": "green",
              "title": "Training Details",
              "content": "Optimizer: AdaGrad(lr=0.01)<br>Batch size: 256<br>10 epochs<br>Loss: Cross Entropy"
            }
          ]
        },
        {
          "title": "Results",
          "cards": [
            {
              "icon": "📈",
              "iconColor": "purple",
              "title": "Performance",
              "content": "Training loss decreases steadily<br>Test accuracy converges<br>Demonstrates effectiveness on real neural networks"
            },
            {
              "icon": "💡",
              "iconColor": "orange",
              "title": "Note",
              "content": "For deeper networks/longer training, may suffer from vanishing LR<br>Consider RMSProp or Adam for such cases"
            }
          ]
        }
      ]
    },
    {
      "id": 16,
      "type": "image",
      "title": "Fashion-MNIST Training Results",
      "subtitle": "Training Loss & Test Accuracy over 10 Epochs",
      "badges": [
        { "text": "LeNet-5", "color": "blue" },
        { "text": "AdaGrad lr=0.01", "color": "green" }
      ],
      "image": "../image/Training-Loss.png",
      "imageStyle": "max-height: 450px; object-fit: contain;"
    },
    {
      "id": 17,
      "type": "image",
      "title": "Test Accuracy Performance",
      "subtitle": "AdaGrad Convergence on Fashion-MNIST",
      "badges": [
        { "text": "10 Epochs", "color": "purple" },
        { "text": "Batch Size 256", "color": "blue" }
      ],
      "image": "../image/Test-Accuracy.png",
      "imageStyle": "max-height: 450px; object-fit: contain;"
    },
    {
      "id": 18,
      "type": "content",
      "title": "AdaGrad Advantages",
      "subtitle": "When and Why to Use AdaGrad",
      "badges": [
        { "text": "Sparse Features", "color": "green" },
        { "text": "NLP", "color": "blue" },
        { "text": "Recommender Systems", "color": "purple" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Key Strengths",
          "cards": [
            {
              "icon": "🎯",
              "iconColor": "green",
              "title": "Automatic LR Adaptation",
              "content": "No need to tune learning rate for each parameter<br>Frequent features get small LR<br>Rare features get large LR"
            },
            {
              "icon": "💪",
              "iconColor": "blue",
              "title": "Robust to Large LR",
              "content": "Automatic 'brake' mechanism<br>Steep directions self-regulate<br>Less sensitive to initial LR choice"
            },
            {
              "icon": "⚡",
              "iconColor": "purple",
              "title": "Efficient for Sparse Data",
              "content": "Only active features accumulate history<br>O(d) memory overhead<br>Simple element-wise operations"
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
              "content": "Bag-of-words, TF-IDF<br>Word embeddings with rare words<br>Text classification"
            },
            {
              "icon": "🎬",
              "iconColor": "green",
              "title": "Recommender Systems",
              "content": "User/item embeddings<br>Many users/items have few interactions<br>Sparse interaction matrices"
            },
            {
              "icon": "📱",
              "iconColor": "purple",
              "title": "Computational Advertising",
              "content": "CTR prediction<br>Sparse features: user IDs, ad IDs, queries<br>Rare ads need effective learning"
            }
          ]
        }
      ]
    },
    {
      "id": 19,
      "type": "content",
      "title": "AdaGrad Limitations",
      "subtitle": "When AdaGrad Struggles",
      "badges": [
        { "text": "Vanishing LR", "color": "red" },
        { "text": "Non-convex", "color": "orange" },
        { "text": "Deep Learning", "color": "purple" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Main Weaknesses",
          "cards": [
            {
              "icon": "📉",
              "iconColor": "red",
              "title": "Monotonic LR Decay",
              "content": "s<sub>t</sub> = s<sub>t-1</sub> + g<sub>t</sub><sup>2</sup> always grows<br>Effective LR: η/√s<sub>t</sub> → 0<br>Can stop learning prematurely"
            },
            {
              "icon": "🔄",
              "iconColor": "orange",
              "title": "Poor for Non-Convex",
              "content": "Deep neural networks have many plateaus/saddle points<br>Need ability to 'forget' old gradients and adapt to new landscape<br>AdaGrad accumulates forever"
            },
            {
              "icon": "📐",
              "iconColor": "purple",
              "title": "Diagonal Limitation",
              "content": "Only handles axis-aligned problems well<br>Struggles with coupled/rotated features<br>Cannot capture off-diagonal Hessian structure"
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
              "content": "Long training → LR vanishes<br>Use RMSProp or Adam instead"
            },
            {
              "icon": "🔀",
              "iconColor": "orange",
              "title": "Non-Stationary Problems",
              "content": "When data distribution changes over time<br>Online learning with concept drift"
            },
            {
              "icon": "🎲",
              "iconColor": "purple",
              "title": "Highly Non-Convex",
              "content": "Reinforcement learning<br>GANs<br>Need adaptive but not monotonic decay"
            }
          ]
        }
      ]
    },
    {
      "id": 20,
      "type": "content",
      "title": "Evolution: From AdaGrad to Modern Optimizers",
      "subtitle": "RMSProp and Adam",
      "badges": [
        { "text": "RMSProp", "color": "blue" },
        { "text": "Adam", "color": "green" },
        { "text": "Modern Variants", "color": "purple" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "RMSProp: Fixing the Vanishing LR",
          "cards": [
            {
              "icon": "🔧",
              "iconColor": "blue",
              "title": "Key Modification",
              "content": "Replace full sum with exponential moving average:<br><br>s<sub>t</sub> = γs<sub>t-1</sub> + (1-γ)g<sub>t</sub><sup>2</sup><br><br>γ ≈ 0.9: 'forgets' old gradients"
            },
            {
              "icon": "✅",
              "iconColor": "green",
              "title": "Result",
              "content": "s<sub>t</sub> doesn't grow unbounded<br>LR stabilizes instead of vanishing<br>Better for deep learning"
            }
          ]
        },
        {
          "title": "Adam: Best of Both Worlds",
          "cards": [
            {
              "icon": "🚀",
              "iconColor": "green",
              "title": "Adam = Momentum + RMSProp",
              "content": "Two moving averages:<br><strong>m<sub>t</sub>:</strong> momentum (1st moment)<br><strong>v<sub>t</sub>:</strong> RMSProp (2nd moment)<br><br>Combines direction + adaptive scaling"
            },
            {
              "icon": "🏆",
              "iconColor": "purple",
              "title": "Current Standard",
              "content": "Most popular optimizer in deep learning<br>Works well out-of-the-box<br>Default choice for most neural networks"
            }
          ]
        }
      ]
    },
    {
      "id": 21,
      "type": "content",
      "title": "Exercise: Improving AdaGrad",
      "subtitle": "Implementing RMSProp Modification",
      "badges": [
        { "text": "Hands-on", "color": "blue" },
        { "text": "Comparison", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "The Problem",
          "cards": [
            {
              "icon": "⚠️",
              "iconColor": "red",
              "title": "AdaGrad's Issue",
              "content": "s<sub>t</sub> accumulates indefinitely<br>Learning rate → 0 too early<br>Model stops learning before convergence"
            },
            {
              "icon": "💡",
              "iconColor": "blue",
              "title": "Proposed Fix",
              "content": "Modified accumulation:<br>s<sub>t</sub> = γs<sub>t-1</sub> + (1-γ)g<sub>t</sub><sup>2</sup><br><br>γ = 0.9 typical"
            }
          ]
        },
        {
          "title": "Experimental Results",
          "cards": [
            {
              "icon": "📊",
              "iconColor": "green",
              "title": "Fashion-MNIST Comparison",
              "content": "<strong>AdaGrad:</strong> Training loss plateaus early<br><strong>RMSProp:</strong> Continues learning longer<br><br>Test accuracy improves significantly"
            },
            {
              "icon": "✨",
              "iconColor": "purple",
              "title": "Conclusion",
              "content": "Exponential moving average prevents LR vanishing<br>Foundation for Adam optimizer<br>Critical for deep neural networks"
            }
          ]
        }
      ]
    },
    {
      "id": 22,
      "type": "image",
      "title": "AdaGrad vs RMSProp: Training Loss",
      "subtitle": "Comparing Vanilla AdaGrad with Modified (RMSProp)",
      "badges": [
        { "text": "AdaGrad", "color": "blue" },
        { "text": "RMSProp", "color": "green" }
      ],
      "image": "../image/Training-Loss-Comparison.png",
      "imageStyle": "max-height: 450px; object-fit: contain;"
    },
    {
      "id": 23,
      "type": "image",
      "title": "AdaGrad vs RMSProp: Test Accuracy",
      "subtitle": "Impact of Exponential Moving Average on Performance",
      "badges": [
        { "text": "Fashion-MNIST", "color": "purple" },
        { "text": "10 Epochs", "color": "blue" }
      ],
      "image": "../image/Test-Accuracy-Comparison.png",
      "imageStyle": "max-height: 450px; object-fit: contain;"
    },
    {
      "id": 24,
      "type": "content",
      "title": "Summary: Key Takeaways",
      "subtitle": "AdaGrad in Context",
      "badges": [
        { "text": "Summary", "color": "blue" },
        { "text": "Best Practices", "color": "green" }
      ],
      "layout": "two-column",
      "columns": [
        {
          "title": "Core Concepts",
          "cards": [
            {
              "icon": "🎯",
              "iconColor": "blue",
              "title": "Innovation",
              "content": "Per-parameter adaptive learning rates<br>Accumulated squared gradients as Hessian proxy<br>Diagonal preconditioning interpretation"
            },
            {
              "icon": "✅",
              "iconColor": "green",
              "title": "When to Use",
              "content": "Sparse features (NLP, RecSys)<br>Convex problems<br>Axis-aligned landscapes"
            },
            {
              "icon": "❌",
              "iconColor": "red",
              "title": "When to Avoid",
              "content": "Deep neural networks (long training)<br>Non-stationary problems<br>Need non-monotonic LR decay"
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
              "content": "Simple: O(d) memory, element-wise ops<br>PyTorch: torch.optim.Adagrad<br>Typical LR: 0.01 (more robust than SGD)"
            },
            {
              "icon": "🚀",
              "iconColor": "orange",
              "title": "Modern Alternatives",
              "content": "RMSProp: for non-convex/deep learning<br>Adam: combines momentum + adaptive LR<br>AdamW: Adam with proper weight decay"
            },
            {
              "icon": "📚",
              "iconColor": "blue",
              "title": "Historical Impact",
              "content": "Pioneered adaptive methods (2011)<br>Inspired RMSProp, Adam, and many others<br>Still effective for specific domains (sparse data)"
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
      "questions": [
        "Why does AdaGrad use squared gradients instead of absolute values?",
        "Can AdaGrad be combined with momentum or other techniques?",
        "How does AdaGrad compare to learning rate schedules (e.g., cosine annealing)?",
        "What happens if we initialize s₀ to a non-zero value?",
        "Are there variants of AdaGrad that work better for non-sparse features?",
        "How does AdaGrad perform with batch normalization?",
        "Can the per-coordinate LR adaptation cause instability in some cases?",
        "What is the relationship between AdaGrad and natural gradient descent?",
        "How would you implement AdaGrad for distributed/parallel training?",
        "Why is ε typically set to 10⁻⁸ rather than other values?"
      ]
    }
  ]
};
