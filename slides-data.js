const slides = [
    {
        title: "AdaGrad: Adaptive Gradient Algorithm",
        content: `
            <div style="text-align: center;">
                <p style="font-size: 1.3rem; margin: 2rem 0;">
                    <strong>Understanding Adaptive Learning Through First Principles</strong>
                </p>
                <p style="font-size: 1.2rem; color: var(--color-text-light);">
                    Nhóm: Lê Phước Thành, Nguyễn Thành Đạt, Lê Đức Phương
                </p>
            </div>
        `
    },
    
    {
        title: "SECTION 1: INTRODUCTION & PROBLEM STATEMENT",
        content: `<div class="section-header">Introduction & Problem Statement</div>`
    },
    
    {
        title: "1.1 Introduction",
        content: `
            <p>Gradient‐based optimization algorithms play a central role in training machine learning models. However, standard methods such as vanilla Gradient Descent or SGD rely on a <strong>single global learning rate</strong>, causing difficulties when dealing with <strong>heterogeneous or sparse feature spaces</strong>.</p>
            
            <p>The <strong>Adagrad (Adaptive Gradient)</strong> algorithm was proposed to address this issue by adapting the learning rate for each parameter individually based on historical gradient information.</p>
            
            <p>Unlike fixed-rate optimizers, Adagrad automatically scales the learning rate according to how frequently a parameter is updated:</p>
            
            <ul>
                <li>Parameters with <strong>frequent updates</strong> receive progressively <strong>smaller learning rates</strong></li>
                <li>Parameters with <strong>infrequent updates</strong> retain <strong>larger learning rates</strong> and therefore continue learning effectively</li>
            </ul>
            
            <p>This adaptive behavior makes Adagrad particularly well-suited for problems involving <strong>sparse features</strong>, such as natural language processing or recommendation systems.</p>
            
            <p>The goal of this report is to examine the motivation behind Adagrad, describe its mathematical formulation, analyze its advantages and limitations, and discuss its impact on optimization in high-dimensional sparse settings.</p>
        `
    },
    
    {
        title: "1.2 Motivation: Sparse Features",
        content: `
            <p>In many tasks such as <strong>natural language processing</strong>, data are often <strong>sparse</strong>: most values are zero and only a small subset of features are active. Models like <em>bag-of-words</em> and <em>one-hot encoding</em> may have tens of thousands of features, but each sample only activates a few.</p>
            
            <div class="highlight-box">
                <strong>Example:</strong> A vocabulary of 10,000 words, but each document contains only ~50 words. That means <strong>99.5% of features = 0</strong> (sparse!)
            </div>
            
            <h3>1.2.1 Global learning rate decay is not suitable</h3>
            
            <p>If using a decaying learning rate globally:</p>
            
            <div class="math-block">
                $$\\eta_t = \\frac{\\eta_0}{\\sqrt{t}}$$
            </div>
            
            <p>then a parameter corresponding to a rare feature will only be updated when that feature appears. If it first appears at a large step $t$, the learning rate may already be too small.</p>
        `
    },
    
    {
        title: "1.2.2 Example of Global Decay Calculation",
        content: `
            <p><strong>Assume:</strong></p>
            <ul>
                <li>Initial learning rate: $\\eta_0 = 0.1$</li>
                <li>A rare feature appears for the first time at step $t = 1000$</li>
                <li>Gradient at that step: $g_{1000} = 0.5$</li>
            </ul>
            
            <p><strong>Calculate learning rate at $t = 1000$ using global decay:</strong></p>
            <div class="math-block">
                $$\\eta_{1000} = \\frac{\\eta_0}{\\sqrt{1000}} = \\frac{0.1}{31.6228} \\approx 0.00316$$
            </div>
            
            <p><strong>Update weight (initial weight $w_0 = 0$):</strong></p>
            <div class="math-block">
                $$w_{1000} = w_0 - \\eta_{1000}g_{1000} = 0 - 0.00316 \\times 0.5 \\approx -0.00158$$
            </div>
            
            <div class="highlight-box">
                <strong>Observation:</strong> The weight change is extremely small, even though the feature may be important. This illustrates the limitation of using a globally decaying learning rate for sparse features: rare features get almost no update when they first appear at large $t$.
            </div>
        `
    },
    
    {
        title: "1.3 Naive Solution and Its Limitations",
        content: `
            <p>A simple idea is to track how many times each feature appears.</p>
            
            <p>Let $s(i, t)$ be the number of times feature $i$ has been activated until time $t$. Then:</p>
            
            <div class="math-block">
                $$\\eta_{i,t} = \\frac{\\eta_0}{\\sqrt{s(i, t) + c}}$$
            </div>
            
            <p>where $c > 0$ to avoid division by zero.</p>
            
            <h3>1.3.1 Example of naive solution</h3>
            
            <p><strong>Assume:</strong></p>
            <ul>
                <li>Initial weight: $w_0 = 0$</li>
                <li>Initial learning rate: $\\eta_0 = 0.1$</li>
                <li>Small constant: $c = 10^{-8}$</li>
                <li>Gradient values: $g_1 = 0.5$, $g_2 = 0.1$, $g_3 = 0.3$</li>
            </ul>
            
            <div class="two-column">
                <div>
                    <p><strong>a. First appearance: $s(i, 1) = 1$</strong></p>
                    <div class="math-block">
                        $$\\eta_{i,1} = \\frac{0.1}{\\sqrt{1}} \\approx 0.1$$
                        $$w_1 = 0 - 0.1 \\times 0.5 = -0.05$$
                    </div>
                </div>
                <div>
                    <p><strong>b. Second appearance: $s(i, 2) = 2$</strong></p>
                    <div class="math-block">
                        $$\\eta_{i,2} = \\frac{0.1}{\\sqrt{2}} \\approx 0.0707$$
                        $$w_2 = -0.05 - 0.0707 \\times 0.1 \\approx -0.0571$$
                    </div>
                </div>
            </div>
            
            <p><strong>c. Third appearance: $s(i, 3) = 3$</strong></p>
            <div class="math-block">
                $$\\eta_{i,3} = \\frac{0.1}{\\sqrt{3}} \\approx 0.0577$$
                $$w_3 = -0.0571 - 0.0577 \\times 0.3 \\approx -0.0744$$
            </div>
        `
    },
    
    {
        title: "1.3.2 Limitations",
        content: `
            <p><strong>Why this naive approach fails:</strong></p>
            <ol>
                <li><strong>Ignores gradient magnitude:</strong> Two occurrences with gradients 0.001 and 10 are treated equally.</li>
                <li><strong>Cannot handle well:</strong> Cases where small gradient occurs often or large gradient occurs rarely.</li>
                <li><strong>Depends on the definition:</strong> What counts as "one occurrence"? Introduces extra hyperparameters.</li>
            </ol>
            
            <div class="highlight-box">
                <strong>Hence:</strong> A more sophisticated mechanism is needed: consider not only the number of appearances but also the gradient magnitude. This leads us to AdaGrad!
            </div>
        `
    },
    
    {
        title: "SECTION 2: ALGORITHM & MECHANISM",
        content: `<div class="section-header">Algorithm & Mechanism</div>`
    },
    
    {
        title: "2.1 AdaGrad Mechanism: Accumulated Squared Gradients",
        content: `
            <h3>2.1.1 From a Simple Counter to Squared Gradients</h3>
            
            <p>Consider training a model where each parameter corresponds to a feature. Some features appear very often, others are rare.</p>
            
            <p>A naive idea is to keep a counter of how many times each feature has appeared up to step $t$:</p>
            
            <div class="math-block">
                $$s(i, t) = \\text{number of times feature } i \\text{ has appeared up to step } t$$
            </div>
            
            <p>Then define a coordinate-wise learning rate:</p>
            <div class="math-block">
                $$\\eta_{i,t} = \\frac{\\eta}{\\sqrt{s(i, t)}}$$
            </div>
            
            <p>However, this has serious limitations: it is binary (appeared or not), does not distinguish between small and large gradient values, and requires an arbitrary threshold.</p>
            
            <p><strong>Adagrad improves on this</strong> by replacing this crude counter with a sum of squared gradients. For each coordinate $i$, Adagrad maintains:</p>
            
            <div class="math-block">
                $$s(i, t + 1) = s(i, t) + (\\partial_i f(x_t))^2$$
            </div>
            
            <div class="highlight-box">
                <strong>Core idea:</strong> Instead of counting appearances, Adagrad accumulates the squared size of gradients for each parameter.
            </div>
        `
    },
    
    {
        title: "2.1.2 Adaptive Learning Rate per Coordinate",
        content: `
            <p>Given the accumulated squared gradients $s(i, t)$, Adagrad defines a <strong>per-coordinate learning rate</strong>:</p>
            
            <div class="math-block">
                $$\\eta_{i,t} = \\frac{\\eta}{\\sqrt{s(i, t) + \\epsilon}}$$
            </div>
            
            <p><strong>Where:</strong></p>
            <ul>
                <li>$\\eta$: The base learning rate chosen by the user (hyperparameter)</li>
                <li>$\\epsilon$: A small constant (e.g., $10^{-8}$) added to avoid division by zero (numerical stability)</li>
            </ul>
            
            <p><strong>The parameter update rule becomes:</strong></p>
            
            <div class="math-block">
                $$x_i^{(t+1)} = x_i^{(t)} - \\eta_{i,t} \\partial_i f(x_t) = x_i^{(t)} - \\frac{\\eta}{\\sqrt{s(i, t) + \\epsilon}} \\partial_i f(x_t)$$
            </div>
            
            <div class="highlight-box">
                <strong>Conclusion:</strong> Each parameter $x_i$ has its own effective learning rate, which shrinks as the sum of its past squared gradients grows. Frequent features (large accumulated gradients) get small updates, while rare features (small accumulated gradients) get larger updates.
            </div>
        `
    },
    
    {
        title: "2.1.3 Analysis of the Update Rule",
        content: `
            <p><strong>1. No Need for Arbitrary Thresholds</strong></p>
            <p>With Adagrad, every gradient, no matter how small, contributes to $s(i, t)$. Larger gradients naturally contribute more (because they are squared). There is no binary decision ("count" vs "don't count") and no threshold hyperparameter to tune.</p>
            
            <p><strong>2. Automatic Scaling According to Gradient Magnitude</strong></p>
            <p>The accumulated sum $s(i, t) = \\sum_{\\tau=1}^t (\\partial_i f(x_\\tau))^2$ grows:</p>
            <ul>
                <li><strong>Fast</strong> if gradients for coordinate $i$ are large or frequent</li>
                <li><strong>Slow</strong> if gradients are small or rare</li>
            </ul>
            
            <p>Because the effective learning rate is $\\eta_{i,t} = \\frac{\\eta}{\\sqrt{s(i, t) + \\epsilon}}$, this means:</p>
            
            <div class="two-column">
                <div>
                    <p><strong>For "noisy" or frequently changing coordinates:</strong></p>
                    <p>$s(i, t)$ becomes large → $\\sqrt{s(i, t)}$ is large, so $\\eta_{i,t}$ becomes small. These coordinates are slowed down, avoiding overshooting.</p>
                </div>
                <div>
                    <p><strong>For "quiet" or rare coordinates:</strong></p>
                    <p>$s(i, t)$ stays small, so $\\eta_{i,t}$ remains relatively large. These coordinates keep larger steps, allowing them to learn even with sparse updates.</p>
                </div>
            </div>
            
            <div class="highlight-box">
                <strong>Summary:</strong> Adagrad's "accumulated squared gradient" mechanism replaces a rough frequency counter with a smooth, magnitude-sensitive history for each parameter, giving automatic, coordinate-wise learning rate adaptation.
            </div>
        `
    },
    
    {
        title: "2.2 Adagrad and the Concept of Preconditioning",
        content: `
            <h3>2.2.1 Quadratic Convex Optimization and Condition Number</h3>
            
            <p>Consider a quadratic convex function:</p>
            <div class="math-block">
                $$f(x) = \\frac{1}{2} x^\\top Q x + c^\\top x + b, \\quad Q \\succ 0$$
            </div>
            
            <p>The condition number of $Q$ is defined as:</p>
            <div class="math-block">
                $$\\kappa(Q) = \\frac{\\lambda_{\\max}(Q)}{\\lambda_{\\min}(Q)}$$
            </div>
            
            <p><strong>Intuitive Interpretation:</strong></p>
            <ul>
                <li>If $\\kappa(Q) \\approx 1$: All eigenvalues are similar. The level sets are close to circles. Gradient descent converges fast.</li>
                <li>If $\\kappa(Q)$ is large: The eigenvalues are very different. The level sets are very elongated ellipsoids. Gradient descent "zigzags" and converges slowly.</li>
            </ul>
            
            <p>Thus, $\\kappa(Q)$ measures how "difficult" the optimization problem is for standard gradient descent.</p>
        `
    },
    
    {
        title: "2.2.2 Preconditioning: Changing Coordinates",
        content: `
            <p><strong>Preconditioning</strong> means applying a linear transformation to the variables to improve the condition number and make the optimization landscape "rounder".</p>
            
            <p><strong>1. Change of Variables:</strong></p>
            <p>Define $y = P^{1/2}x$ where $P \succ 0$ is the preconditioning matrix.</p>
            
            <p><strong>2. The New Hessian:</strong> The Hessian matrix of the transformed function is $\\tilde{Q} = P^{-1/2}QP^{-1/2}$</p>
            
            <p><strong>3. The Strategy:</strong> If $P$ is chosen well, the condition number $\\kappa(\\tilde{Q})$ can be much smaller than the original $\\kappa(Q)$.</p>
            
            <ul>
                <li><strong>Ideal Choice:</strong> $P = Q$. Then $\\tilde{Q} = I$ and condition number becomes 1. However, computing and inverting the full matrix $Q$ is too expensive.</li>
                <li><strong>Practical Alternative (Diagonal Preconditioning):</strong> Use only the diagonal elements: $M = \\text{diag}(Q)$ and use $M^{-1/2}$ as the preconditioner.</li>
            </ul>
            
            <div class="highlight-box">
                <strong>Key Insight:</strong> This diagonal preconditioning works very well when the main anisotropy of the function is aligned with the coordinate axes. <strong>Adagrad approximates this diagonal preconditioning</strong> by using accumulated gradients to estimate the curvature along each axis.
            </div>
        `
    },
    
    {
        title: "2.2.3 Viewing Adagrad as Time-Varying Diagonal Preconditioning",
        content: `
            <p><strong>1. Vector Form of Adagrad</strong></p>
            
            <p>We can write the Adagrad accumulator in vector notation:</p>
            
            <p><strong>Accumulator:</strong></p>
            <div class="math-block">
                $$s_t = s_{t-1} + g_t \\odot g_t \\text{ where } g_t = \\nabla f(x_t)$$
            </div>
            
            <p><strong>Diagonal Matrix:</strong></p>
            <div class="math-block">
                $$D_t = \\text{diag}(s_t + \\epsilon)$$
            </div>
            
            <p><strong>Update Rule:</strong></p>
            <div class="math-block">
                $$x_{t+1} = x_t - \\eta D_t^{-1/2} g_t$$
            </div>
            
            <div class="highlight-box">
                <strong>Observation:</strong> This is exactly <strong>Gradient Descent with a diagonal preconditioner</strong> $D_t^{-1/2}$ that changes over time.
            </div>
            
            <p><strong>2. Connection to the Hessian</strong></p>
            
            <p>Near the optimum, the gradient behaves like $g_t \\approx Q(x_t - x^*)$. In coordinates where the problem is close to axis-aligned, directions with large curvature tend to produce larger gradients.</p>
            
            <p>Over time, the accumulated squared gradients $s_t$ approximate (up to scaling) the diagonal of $Q^2$. Therefore, taking $D_t^{-1/2}$ is similar to using $\\text{diag}(Q)^{-1/2}$ as a preconditioner.</p>
            
            <p><strong>3. Final Interpretation</strong></p>
            
            <p>Adagrad can be interpreted as <strong>Stochastic Gradient Descent + Diagonal Preconditioning</strong> where the preconditioner is learned online from the gradients instead of being computed from the Hessian explicitly.</p>
            
            <div class="highlight-box">
                This explains why Adagrad dramatically improves convergence on problems where the main stretching of the landscape is roughly axis-aligned: it is implicitly "rounding" the optimization landscape in each coordinate.
            </div>
        `
    },
    
    {
        title: "2.3 Gradient as a Proxy for the Hessian",
        content: `
            <h3>2.3.1 Computing the Hessian Is Not Feasible in Deep Learning</h3>
            
            <p>The Hessian of a function $f: \\mathbb{R}^d \\rightarrow \\mathbb{R}$ is a $d \\times d$ matrix. In deep learning, the number of parameters $d$ is often millions or billions.</p>
            
            <p>Storing a full $d \\times d$ matrix requires memory on the order of $O(d^2)$. For $d = 10^6$, this is $10^{12}$ entries—completely impractical.</p>
            
            <div class="highlight-box">
                So, in deep learning, one must use <strong>first-order information only</strong> (gradients), but still wants some of the benefits of second-order methods (which use the Hessian).
            </div>
            
            <h3>2.3.2 The Clever Idea: Using Gradient Statistics as a Proxy</h3>
            
            <p>For a quadratic function $f(x) = \\frac{1}{2} x^\\top Q x + c^\\top x + b$, the gradient is $g(x) = Qx + c$.</p>
            
            <p>Near the optimum, this is approximately $g(x) \\approx Q(x - x^*)$.</p>
            
            <p>Consider one coordinate $i$:</p>
            <ul>
                <li>If the curvature (roughly $Q_{ii}$) is large, then a small change in $x_i$ produces a large change in the gradient $g_i$</li>
                <li>Over training, a high-curvature coordinate tends to have larger gradients or higher variability</li>
            </ul>
            
            <p><strong>Adagrad's Approximation Strategy:</strong> Adagrad does not compute the Hessian. Instead, it only observes the gradients $g_t$ over time and accumulates:</p>
            
            <div class="math-block">
                $$s(i, t) = \\sum_{\\tau=1}^t (g_{\\tau, i})^2$$
            </div>
            
            <p>This quantity captures how large the gradients for coordinate $i$ are on average and how sensitive the loss is to changes in parameter $x_i$.</p>
            
            <div class="highlight-box">
                <strong>Key Insight:</strong> Adagrad uses the magnitude (variance) of gradients as a proxy for the diagonal of the Hessian.
            </div>
        `
    },
    
    {
        title: "2.4 The Adagrad Algorithm",
        content: `
            <h3>2.4.1 The Algorithm</h3>
            
            <p>We use the variable $\\mathbf{s}_t$ to accumulate the variance of past gradients:</p>
            
            <div class="math-block">
                $$\\mathbf{g}_t = \\partial_{\\mathbf{w}} l(y_t, f(\\mathbf{x}_t, \\mathbf{w}))$$
                $$\\mathbf{s}_t = \\mathbf{s}_{t-1} + \\mathbf{g}_t^2$$
                $$\\mathbf{w}_t = \\mathbf{w}_{t-1} - \\frac{\\eta}{\\sqrt{\\mathbf{s}_t + \\epsilon}} \\cdot \\mathbf{g}_t$$
            </div>
            
            <p><strong>Important note:</strong> All operations are performed <strong>element-wise</strong>:</p>
            <ul>
                <li>$\\mathbf{g}_t^2$ means $[g_{t,1}^2, g_{t,2}^2, \\ldots, g_{t,d}^2]$</li>
                <li>$\\sqrt{\\mathbf{s}_t + \\epsilon}$ means $[\\sqrt{s_{t,1} + \\epsilon}, \\sqrt{s_{t,2} + \\epsilon}, \\ldots, \\sqrt{s_{t,d} + \\epsilon}]$</li>
            </ul>
            
            <p><strong>Parameters:</strong></p>
            <ul>
                <li>$\\eta$ - learning rate</li>
                <li>$\\epsilon$ - small additive constant (typically $10^{-8}$)</li>
                <li><strong>Initialization:</strong> $\\mathbf{s}_0 = \\mathbf{0}$</li>
            </ul>
        `
    },
    
    {
        title: "2.4.2 Explanation of Each Step",
        content: `
            <p><strong>Step 1: Compute gradient</strong></p>
            <div class="math-block">
                $$\\mathbf{g}_t = \\partial_{\\mathbf{w}} l(y_t, f(\\mathbf{x}_t, \\mathbf{w}))$$
            </div>
            <p>The gradient at the current point indicates the direction of steepest change.</p>
            
            <p><strong>Step 2: Accumulate squared gradients</strong></p>
            <p>Each coordinate "remembers" its gradient history:</p>
            <ul>
                <li>If gradient is <strong>large</strong> many times → $\\mathbf{s}_t$ accumulates large values → effective lr becomes <strong>small</strong></li>
                <li>If gradient is <strong>small</strong> → $\\mathbf{s}_t$ accumulates slowly → effective lr remains relatively <strong>large</strong></li>
            </ul>
            
            <p><strong>Step 3: Update parameters</strong></p>
            <p>Update with learning rate adjusted per coordinate:</p>
            <ul>
                <li>Each coordinate has its own learning rate</li>
                <li>Learning rate decreases as $s_{t,i}$ increases</li>
            </ul>
            <div class="math-block">
                $$\\eta_{i,t} = \\frac{\\eta}{\\sqrt{s_{t,i} + \\epsilon}}$$
            </div>
        `
    },
    
    {
        title: "2.4.3 Design Principles",
        content: `
            <p><strong>1. Per-coordinate adaptation</strong></p>
            <p>In many problems, different coordinates have different "sensitivities". Coordinates that change strongly (large gradients) need small learning rates to avoid overshooting, while coordinates that change weakly (small gradients) need large learning rates to learn faster. Adagrad adjusts automatically without manual tuning for each parameter.</p>
            
            <p><strong>2. Connection to Preconditioning</strong></p>
            <p>This is an application of <strong>automatic preconditioning</strong> - Adagrad uses gradient magnitude as a proxy for the diagonal of the Hessian, helping to "flatten" the objective function without computing eigenvalues.</p>
            
            <p>Each step is equivalent to gradient descent with a diagonal scaling matrix:</p>
            <div class="math-block">
                $$D_t = \\text{diag}\\left(\\frac{1}{\\sqrt{s_t}}\\right)$$
            </div>
            
            <p><strong>3. Computational Cost</strong></p>
            <ul>
                <li>Memory: Track auxiliary variable $\\mathbf{s}_t$ with $O(d)$ storage</li>
                <li>Comparison: Negligible vs. full Hessian's $O(d^2)$ cost</li>
                <li>Learning rate decay: $O(1/\sqrt{t})$ - stable for convex problems</li>
                <li>Limitation: May decrease too quickly for non-convex/deep learning tasks</li>
                <li>Solution: Variants like RMSProp or Adam</li>
            </ul>
        `
    },
    
    {
        title: "2.5 Applications of Adagrad",
        content: `
            <p>Adagrad is particularly effective in domains with <strong>sparse data</strong> or features with <strong>varying frequencies</strong>.</p>
            
            <p><strong>1. Natural Language Processing (NLP)</strong></p>
            <p>Example: Text classification using bag-of-words. Rare words still learn meaningful weights thanks to Adagrad.</p>
            
            <p><strong>2. Computational Advertising</strong></p>
            <p>CTR prediction models use user IDs, ad IDs, and queries—mostly sparse features. Adagrad prevents rare ads from being "ignored."</p>
            
            <p><strong>3. Recommender Systems</strong></p>
            <p>Many users or products have few interactions. Adagrad ensures embeddings are sufficiently trained.</p>
        `
    },
    
    {
        title: "SECTION 3: COMPUTATION & IMPLEMENTATION",
        content: `<div class="section-header">Computation & Implementation</div>`
    },
    
    {
        title: "3.1 Step-by-Step Calculation: Axis-Aligned Function",
        content: `
            <p><strong>Objective Function:</strong> $f_1(\\mathbf{x}) = 0.1x_1^2 + 2x_2^2$</p>
            
            <p>This is an axis-aligned elliptic paraboloid where the variables $x_1$ and $x_2$ are independent. Minimum at $(0, 0)$.</p>
            
            <p><strong>Setup for Adagrad:</strong></p>
            <ul>
                <li>Starting point: $\\mathbf{x}^{(0)} = (5, 3)$</li>
                <li>Learning rate: $\\eta = 0.4$</li>
                <li>Epsilon: $\\varepsilon = 10^{-8}$</li>
                <li>Gradient formula: $\\nabla f_1 = [0.2x_1, 4x_2]$</li>
            </ul>
            
            <p><strong>Step 1 (t=1):</strong> Current: $(5.0, 3.0)$</p>
            <div class="two-column">
                <div>
                    <p>a. Gradient: $\\mathbf{g}_1 = [1.0, 12.0]$</p>
                    <p>b. Update $\\mathbf{s}$: $\\mathbf{s}_1 = [1.0, 144.0]$</p>
                </div>
                <div>
                    <p>c. Effective LR: $[0.4, 0.0333]$</p>
                    <p>d. New point: $(4.6, 2.6)$</p>
                    <p>Function value: $15.636$</p>
                </div>
            </div>
            
            <p><strong>Step 2 (t=2):</strong> Current: $(4.6, 2.6)$</p>
            <div class="two-column">
                <div>
                    <p>Gradient: $\\mathbf{g}_2 = [0.92, 10.4]$</p>
                    <p>Update $\\mathbf{s}$: $\\mathbf{s}_2 = [1.8464, 252.16]$</p>
                </div>
                <div>
                    <p>Effective LR: $[0.2944, 0.0252]$</p>
                    <p>New point: $(4.3291, 2.3379)$</p>
                    <p>Function value: $12.817$</p>
                </div>
            </div>
        `
    },
    
    {
        title: "3.1 Step-by-Step Calculation: Rotated Function",
        content: `
            <p><strong>Objective Function:</strong> $f_2(\\mathbf{x}) = 0.1(x_1 + x_2)^2 + 2(x_1 - x_2)^2$</p>
            
            <p>This is a rotated elliptic paraboloid where variables are strongly correlated. Expands to: $f_2(\\mathbf{x}) = 2.1x_1^2 - 3.8x_1x_2 + 2.1x_2^2$. Minimum at $(0, 0)$.</p>
            
            <p><strong>Setup:</strong> Same as Function 1. Gradient formula: $\\nabla f_2 = [4.2x_1 - 3.8x_2, -3.8x_1 + 4.2x_2]$</p>
            
            <p><strong>Step 1 (t=1):</strong> Current: $(5.0, 3.0)$</p>
            <div class="two-column">
                <div>
                    <p>a. Gradient: $\\mathbf{g}_1 = [9.6, -6.4]$</p>
                    <p>b. Update $\\mathbf{s}$: $\\mathbf{s}_1 = [92.16, 40.96]$</p>
                </div>
                <div>
                    <p>c. Effective LR: $[0.0417, 0.0625]$</p>
                    <p>d. New point: $(4.6, 3.4)$</p>
                    <p>Function value: $9.28$</p>
                </div>
            </div>
            
            <p><strong>Step 2 (t=2):</strong> Current: $(4.6, 3.4)$</p>
            <div class="two-column">
                <div>
                    <p>Gradient: $\\mathbf{g}_2 = [6.4, -3.2]$</p>
                    <p>Update $\\mathbf{s}$: $\\mathbf{s}_2 = [133.12, 51.2]$</p>
                </div>
                <div>
                    <p>Effective LR: $[0.0347, 0.0559]$</p>
                    <p>New point: $(4.378, 3.579)$</p>
                    <p>Function value: $6.706$</p>
                </div>
            </div>
            
            <div class="highlight-box">
                <strong>Observation:</strong> Convergence is slower for the rotated function because gradients are not axis-aligned. Adagrad scales coordinates independently but optimal direction is diagonal (45°). Adagrad cannot capture this cross-coordinate relationship.
            </div>
        `
    },
    
    {
        title: "Why is Function 2 More Difficult for Adagrad?",
        content: `
            <p><strong>1. The Root Cause: Coordinate System Mismatch</strong></p>
            
            <p>Function 2: $f_2(\\mathbf{x}) = 2.1x_1^2 - 3.8x_1x_2 + 2.1x_2^2$. The key issue is the cross term $-3.8x_1x_2$. This creates coupling between $x_1$ and $x_2$ - you cannot optimize one coordinate independently of the other.</p>
            
            <p><strong>2. Understanding Through the Hessian Matrix</strong></p>
            
            <div class="two-column">
                <div>
                    <p><strong>Function 1 (Axis-aligned):</strong></p>
                    <div class="math-block">
                        $$H_1 = \\begin{bmatrix} 0.2 & 0 \\\\ 0 & 4 \\end{bmatrix}$$
                    </div>
                    <p>Diagonal matrix → coordinates are independent.</p>
                    <p>Principal axes align with coordinate axes.</p>
                </div>
                <div>
                    <p><strong>Function 2 (Rotated):</strong></p>
                    <div class="math-block">
                        $$H_2 = \\begin{bmatrix} 4.2 & -3.8 \\\\ -3.8 & 4.2 \\end{bmatrix}$$
                    </div>
                    <p>Non-diagonal matrix → coordinates are coupled. Principal axes are rotated 45° from coordinate axes.</p>
                </div>
            </div>
            
            <p><strong>3. What Adagrad Actually Does</strong></p>
            
            <p>Adagrad adjusts the learning rate independently for each coordinate. This is equivalent to applying a diagonal scaling matrix. This works perfectly for Function 1's diagonal Hessian but fails for Function 2's non-diagonal Hessian.</p>
            
            <div class="highlight-box">
                <strong>Key Insight:</strong> Adagrad is a diagonal optimizer - it can only adapt learning rates along the coordinate axes independently. This is perfect when the problem's geometry aligns with coordinate axes (diagonal Hessian) but suboptimal when the problem has rotated/correlated structure (non-diagonal Hessian).
            </div>
        `
    },
    
    {
        title: "Summary",
        content: `
            <h3>Key Takeaways</h3>
            
            <ul>
                <li><strong>Problem:</strong> Global learning rate decay fails for sparse features where rare features appear late in training</li>
                <li><strong>Solution:</strong> AdaGrad adapts learning rate per parameter based on accumulated squared gradients</li>
                <li><strong>Mechanism:</strong> $s_t = s_{t-1} + g_t^2$ and $\\eta_{i,t} = \\frac{\\eta}{\\sqrt{s_{t,i} + \\epsilon}}$</li>
                <li><strong>Interpretation:</strong> Diagonal preconditioning that uses gradients as proxy for Hessian</li>
                <li><strong>Benefit:</strong> Rare features get larger updates, frequent features get smaller updates</li>
                <li><strong>Best for:</strong> Sparse data, NLP, recommendation systems, axis-aligned problems</li>
                <li><strong>Limitation:</strong> Learning rate may decay too quickly; suboptimal for non-axis-aligned problems</li>
                <li><strong>Evolution:</strong> Led to RMSProp and Adam optimizers</li>
            </ul>
            
            <div style="text-align: center; margin-top: 3rem; font-size: 1.5rem;">
                <strong>Thank you!</strong> 🙏
            </div>
        `
    }
];
