const slides = [
    {
        title: "REPORT: ADAGRAD OPTIMIZATION ALGORITHM",
        content: `
            <div style="text-align: center; padding-top: 3rem;">
                <h3 style="font-size: 1.5rem; margin: 2rem 0;">
                    <strong>Group 20</strong>
                </h3>
                <br>
                <p style="font-size: 1.2rem; line-height: 2; color: var(--color-text-light);">
                    <strong>Student Members:</strong><br>
                    Lê Đức Phương - 2570480<br>
                    Nguyễn Thành Đạt - 2570163<br>
                    Lê Phước Thành - 2570322<br>
                    Hồ Bảo An - 2570164
                </p>
                <br><br>
                <p style="font-size: 1.2rem; color: var(--color-text-light);">
                    <strong>Instructor:</strong><br>
                    Dr. Nguyen An Khuong
                </p>
            </div>
        `
    },
    
    {
        title: "OUTLINE",
        content: `
            <div style="padding: 2rem 4rem;">
                <div style="display: grid; gap: 2rem; margin-top: 2rem;">
                    <div class="highlight-box" style="padding: 1.5rem; border-left: 5px solid var(--color-primary);">
                        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">
                            <strong>SECTION 1:</strong> INTRODUCTION & PROBLEM STATEMENT
                        </h3>
                    </div>
                    
                    <div class="highlight-box" style="padding: 1.5rem; border-left: 5px solid var(--color-primary);">
                        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">
                            <strong>SECTION 2:</strong> ALGORITHM & MECHANISM
                        </h3>
                    </div>
                    
                    <div class="highlight-box" style="padding: 1.5rem; border-left: 5px solid var(--color-primary);">
                        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">
                            <strong>SECTION 3:</strong> COMPUTATION & IMPLEMENTATION
                        </h3>
                    </div>
                </div>
            </div>
        `
    },
    
    {
        title: "SECTION 1: INTRODUCTION & PROBLEM STATEMENT",
        presenter: "T1",
        content: `
            <div class="section-header" style="font-size: 2.5rem; font-weight: bold;">Introduction & Problem Statement</div>
            
            <h3 style="margin-top: 1.5rem; font-size: 1.8rem;">1.1 Introduction</h3>
            
            <p style="font-size: 1.3rem;">Gradient‐based optimization algorithms play a central role in training machine learning models. However, standard methods such as vanilla Gradient Descent rely on a <strong>single global learning rate</strong>, causing difficulties when dealing with <strong>heterogeneous or sparse feature spaces</strong>.</p>
            
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
        title: "Motivation: Sparse Features",
        presenter: "T1",
        content: `
            <p>In many tasks such as <strong>natural language processing</strong>, data are often <strong>sparse</strong>: most values are zero and only a small subset of features are active. Models like <em>bag-of-words</em> and <em>one-hot encoding</em> may have tens of thousands of features, but each sample only activates a few.</p>
            
            <div class="highlight-box">
                <strong>Example:</strong> A vocabulary of 10,000 words, but each document contains only ~50 words. That means <strong>99.5% of features = 0</strong> (sparse!)
            </div>
            
            <h3>Global learning rate decay is not suitable</h3>
            
            <p>If using a decaying learning rate globally:</p>
            
            <div class="math-block">
                $$\\eta_t = \\frac{\\eta_0}{\\sqrt{t}}$$
            </div>
            
            <p>then a parameter corresponding to a rare feature will only be updated when that feature appears. If it first appears at a large step $t$, the learning rate may already be too small.</p>
        `
    },
    
    {
        title: "Example of Global Decay Calculation",
        presenter: "T1",
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
        title: "Naive Solution and Its Limitations",
        presenter: "T1",
        content: `
            <p>A simple idea is to track how many times each feature appears.</p>
            
            <p>Let $s(i, t)$ be the number of times feature $i$ has been activated until time $t$. Then:</p>
            
            <div class="math-block">
                $$\\eta_{i,t} = \\frac{\\eta_0}{\\sqrt{s(i, t) + c}}$$
            </div>
            
            <p>where $c > 0$ to avoid division by zero.</p>
            
            <h3>Example of naive solution</h3>
            
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
        title: "Limitations",
        presenter: "T1",
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
        presenter: "T2",
        content: `<div class="section-header">Algorithm & Mechanism</div>`
    },
    
    {
        title: "AdaGrad Mechanism: Accumulated Squared Gradients",
        presenter: "T2",
        content: `
            <h3>From a Simple Counter to Squared Gradients</h3>
            
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
        title: "Adaptive Learning Rate per Coordinate",
        presenter: "T2",
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
        title: "Analysis of the Update Rule",
        presenter: "T2",
        content: `
            <p><strong>1. No Need for Arbitrary Thresholds</strong></p>
            <p>With Adagrad, every gradient, no matter how small, contributes to $s(i, t)$. Larger gradients naturally contribute more (because they are squared). There is no binary decision ("count" vs "don't count") and no threshold hyperparameter to tune.</p>
            
            <p><strong>2. The algorithm automatically weighs gradients according to their size</strong></p>
            
            <p><strong>3. Automatic Scaling According to Gradient Magnitude</strong></p>
            <p>The accumulated sum $s(i, t) = \\sum_{\\tau=1}^t (\\partial_i f(x_\\tau))^2$ grows:</p>
            <ul>
                <li><strong>Fast</strong> if gradients for coordinate $i$ are large or frequent</li>
                <li><strong>Slow</strong> if gradients are small or rare</li>
            </ul>
            
            <p><strong>4. Because the effective learning rate is $\\eta_{i,t} = \\frac{\\eta}{\\sqrt{s(i, t) + \\epsilon}}$, this means:</strong></p>
            
            <div class="two-column">
                <div>
                    <p><strong>For "noisy" or frequently changing coordinates (large or frequent gradients):</strong></p>
                    <p>$s(i, t)$ becomes large → $\\sqrt{s(i, t)}$ is large, so $\\eta_{i,t}$ becomes small. These coordinates are slowed down, avoiding overshooting.</p>
                </div>
                <div>
                    <p><strong>For "quiet" or rare coordinates (small or infrequent gradients):</strong></p>
                    <p>$s(i, t)$ stays small, so $\\eta_{i,t}$ remains relatively large. These coordinates keep larger steps, allowing them to learn even with sparse updates.</p>
                </div>
            </div>
            
            <div class="highlight-box">
                <strong>Summary:</strong> Adagrad's "accumulated squared gradient" mechanism replaces a rough frequency counter with a smooth, magnitude-sensitive history for each parameter, giving automatic, coordinate-wise learning rate adaptation.
            </div>
        `
    },
    
    {
        title: "Adagrad and the Concept of Preconditioning",
        presenter: "T2",
        content: `
            <h3>Quadratic Convex Optimization and Condition Number</h3>
            
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
        title: "Preconditioning: Changing Coordinates",
        presenter: "T2",
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
        title: "Viewing Adagrad as Time-Varying Diagonal Preconditioning",
        presenter: "T2",
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
            
            <p>Over time, the accumulated squared gradients $s_t$ approximate (up to scaling) the <strong>diagonal of</strong> $Q^2$. Therefore, taking $D_t^{-1/2}$ is similar to using $\\text{diag}(Q)^{-1/2}$ as a preconditioner.</p>
            
            <p><strong>3. Final Interpretation</strong></p>
            
            <p>Adagrad can be interpreted as <strong>Stochastic Gradient Descent + Diagonal Preconditioning</strong> where the preconditioner is learned online from the gradients instead of being computed from the Hessian explicitly.</p>
            
            <div class="highlight-box">
                This explains why Adagrad dramatically improves convergence on problems where the main stretching of the landscape is roughly axis-aligned: it is implicitly "rounding" the optimization landscape in each coordinate.
            </div>
        `
    },
    
    {
        title: "Gradient as a Proxy for the Hessian",
        presenter: "T4",
        content: `
            <h3>Computing the Hessian Is Not Feasible in Deep Learning</h3>
            
            <p>The Hessian of a function $f: \\mathbb{R}^d \\rightarrow \\mathbb{R}$ is a $d \\times d$ matrix. In deep learning, the number of parameters $d$ is often millions or billions.</p>
            
            <p>Storing a full $d \\times d$ matrix requires memory on the order of $O(d^2)$. For $d = 10^6$, this is $10^{12}$ entries—completely impractical.</p>
            
            <div class="highlight-box">
                So, in deep learning, one must use <strong>first-order information only</strong> (gradients), but still wants some of the benefits of second-order methods (which use the Hessian).
            </div>
            
            <h3>The Clever Idea: Using Gradient Statistics as a Proxy</h3>
            
            <p>For a quadratic function $f(x) = \\frac{1}{2} x^\\top Q x + c^\\top x + b$, the gradient is $g(x) = Qx + c$.</p>
            
            <p>Near the optimum, this is approximately $g(x) \\approx Q(x - x^*)$.</p>
            
            <p>Consider one coordinate $i$:</p>
            <ul>
                <li>If the <strong>curvature (roughly $Q_{ii}$)</strong> is <strong>large</strong>, then a small change in $x_i$ produces a large change in the gradient $g_i$</li>
                <li>Over training, a high-curvature coordinate tends to have <strong>larger gradients</strong> (in magnitude) or <strong>higher variability</strong></li>
            </ul>
            
            <p><strong>Adagrad's Approximation Strategy:</strong> Adagrad does not compute the Hessian. Instead, it only observes the gradients $g_t$ over time and accumulates:</p>
            
            <div class="math-block">
                $$s(i, t) = \\sum_{\\tau=1}^t (g_{\\tau, i})^2$$
            </div>
            
            <p>This quantity captures how large the gradients for coordinate $i$ are on average and how sensitive the loss is to changes in parameter $x_i$.</p>
            
            <div class="highlight-box">
                <strong>Key Insight:</strong> Adagrad uses the <strong>magnitude (variance) of gradients</strong> as a <strong>proxy for the diagonal of the Hessian</strong>.
            </div>
        `
    },
    
    {
        title: "Adagrad in Deep Learning",
        presenter: "T4",
        content: `
            <p>In deep learning contexts:</p>
            <ul>
                <li>Optimization uses <strong>stochastic gradients</strong> from mini-batches</li>
                <li>Exact second-order information is noisy and expensive</li>
                <li>However, <strong>gradients are already being computed</strong> at each step</li>
            </ul>
            
            <p><strong>Adagrad leverages this by:</strong></p>
            <ol>
                <li><strong>Re-using gradients</strong> to build a running estimate $s(i, t)$ of how "active" each parameter is</li>
                <li>Interpreting this as rough curvature information per coordinate</li>
                <li>Scaling learning rates accordingly</li>
            </ol>
            
            <p><strong>So, instead of:</strong></p>
            <ul>
                <li><strong>Computing a full Hessian:</strong> Costly $O(d^2)$ memory and $O(d^3)$ time to invert/factorize</li>
                <li><strong>Adagrad:</strong>
                    <ul>
                        <li>Stores only a vector $s_t \\in \\mathbb{R}^d$ (linear cost $O(d)$)</li>
                        <li>Updates it with simple element-wise operations (very cheap)</li>
                        <li>Achieves some of the benefits of <strong>Hessian-based preconditioning</strong> by using gradient history as an <strong>implicit, approximate curvature signal</strong></li>
                    </ul>
                </li>
            </ul>
        `
    },
    
    {
        title: "The Adagrad Algorithm",
        presenter: "T3",
        content: `
            <h3>The Algorithm</h3>
            
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
        title: "Explanation of Each Step",
        presenter: "T3",
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
        title: "Applications of Adagrad",
        presenter: "T3",
        content: `
            <p>Adagrad is particularly effective in domains with <strong>sparse data</strong> or features with <strong>varying frequencies</strong>.</p>
            
            <p><strong>1. Natural Language Processing (NLP)</strong></p>
            <p><em>Example:</em> Text classification using <em>bag-of-words</em>. Rare words still learn meaningful weights thanks to Adagrad.</p>
            
            <p><strong>2. Computational Advertising</strong></p>
            <p>CTR prediction models use user IDs, ad IDs, and queries—mostly sparse features. Adagrad prevents rare ads from being "ignored."</p>
            
            <p><strong>3. Recommender Systems</strong></p>
            <p>Many users or products have few interactions. Adagrad ensures embeddings are sufficiently trained.</p>
        `
    },
    
    {
        title: "SECTION 3: COMPUTATION & IMPLEMENTATION",
        presenter: "T3",
        content: `<div class="section-header">Computation & Implementation</div>`
    },
    
    {
        title: "Step-by-Step Calculation: Axis-Aligned Function",
        presenter: "T3",
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
            
            <p><strong>Step 1 (t=1):</strong> Current point: $(5.0, 3.0)$</p>
            
            <p><strong>a. Compute Gradient:</strong></p>
            <div class="math-block">
                $$\\mathbf{g}_1 = \\nabla f_1(5.0, 3.0) = [0.2 \\times 5.0, 4 \\times 3.0] = [1.0, 12.0]$$
            </div>
            
            <p><strong>b. Update Accumulator $\\mathbf{s}$:</strong></p>
            <div class="math-block">
                $$\\mathbf{s}_1 = \\mathbf{s}_0 + \\mathbf{g}_1^2 = [0, 0] + [1.0^2, 12.0^2] = [1.0, 144.0]$$
            </div>
            
            <p><strong>c. Calculate Effective Learning Rate:</strong></p>
            <div class="math-block">
                $$\\eta_{1,1} = \\frac{0.4}{\\sqrt{1.0 + 10^{-8}}} \\approx 0.4$$
                $$\\eta_{2,1} = \\frac{0.4}{\\sqrt{144.0 + 10^{-8}}} \\approx 0.0333$$
            </div>
            
            <p><strong>d. Update Parameters:</strong></p>
            <div class="math-block">
                $$x_1^{(1)} = 5.0 - 0.4 \\times 1.0 = 4.6$$
                $$x_2^{(1)} = 3.0 - 0.0333 \\times 12.0 = 2.6$$
            </div>
            
            <p><strong>e. Function Value:</strong></p>
            <div class="math-block">
                $$f_1(4.6, 2.6) = 0.1(4.6)^2 + 2(2.6)^2 = 2.116 + 13.52 = 15.636$$
            </div>
        `
    },
    
    {
        title: "(continued): Steps 2 and Beyond",
        presenter: "T3",
        content: `
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
            
            <div class="highlight-box">
                <strong>Observation:</strong> As iterations progress, the accumulated squared gradients $\\mathbf{s}_t$ grow larger, causing the effective learning rates to decrease. Coordinate $x_2$ has much larger gradients, so its learning rate decreases faster than $x_1$'s.
            </div>
        `
    },
    
    {
        title: "Step-by-Step Calculation: Rotated Function",
        presenter: "T3",
        content: `
            <p><strong>Objective Function:</strong> $f_2(\\mathbf{x}) = 0.1(x_1 + x_2)^2 + 2(x_1 - x_2)^2$</p>
            
            <p>This is a rotated elliptic paraboloid where variables are strongly correlated. Expands to: $f_2(\\mathbf{x}) = 2.1x_1^2 - 3.8x_1x_2 + 2.1x_2^2$. Minimum at $(0, 0)$.</p>
            
            <p><strong>Setup:</strong> Same as Function 1. Gradient formula: $\\nabla f_2 = [4.2x_1 - 3.8x_2, -3.8x_1 + 4.2x_2]$</p>
            
            <p><strong>Step 1 (t=1):</strong> Current point: $(5.0, 3.0)$</p>
            
            <p><strong>a. Compute Gradient:</strong></p>
            <div class="math-block">
                $$\\mathbf{g}_1 = \\nabla f_2(5.0, 3.0) = [4.2(5.0) - 3.8(3.0), -3.8(5.0) + 4.2(3.0)]$$
                $$= [21.0 - 11.4, -19.0 + 12.6] = [9.6, -6.4]$$
            </div>
            
            <p><strong>b. Update Accumulator $\\mathbf{s}$:</strong></p>
            <div class="math-block">
                $$\\mathbf{s}_1 = \\mathbf{s}_0 + \\mathbf{g}_1^2 = [0, 0] + [9.6^2, (-6.4)^2] = [92.16, 40.96]$$
            </div>
            
            <p><strong>c. Calculate Effective Learning Rate:</strong></p>
            <div class="math-block">
                $$\\eta_{1,1} = \\frac{0.4}{\\sqrt{92.16 + 10^{-8}}} \\approx 0.0417$$
                $$\\eta_{2,1} = \\frac{0.4}{\\sqrt{40.96 + 10^{-8}}} \\approx 0.0625$$
            </div>
            
            <p><strong>d. Update Parameters:</strong></p>
            <div class="math-block">
                $$x_1^{(1)} = 5.0 - 0.0417 \\times 9.6 = 5.0 - 0.4 = 4.6$$
                $$x_2^{(1)} = 3.0 - 0.0625 \\times (-6.4) = 3.0 + 0.4 = 3.4$$
            </div>
            
            <p><strong>e. Function Value:</strong></p>
            <div class="math-block">
                $$f_2(4.6, 3.4) = 2.1(4.6)^2 - 3.8(4.6)(3.4) + 2.1(3.4)^2 = 9.28$$
            </div>
        `
    },
    
    {
        title: "(continued): Steps 2 and Beyond",
        presenter: "T3",
        content: `
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
        presenter: "T3",
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
        title: "Visual Comparison: Trajectory Analysis",
        presenter: "T3",
        content: `
            <div style="text-align: center;">
                <img src="image/compare2f.png" alt="Comparison of Function 1 and Function 2 Trajectories" style="max-width: 95%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 1rem 0;">
            </div>
            
            <div class="highlight-box" style="margin-top: 1.5rem;">
                <p><strong>Key Observations from the Visualization:</strong></p>
                <ul>
                    <li><strong>Function 1 (Left - Simple Ellipse):</strong> Clean, direct trajectory from start (5.0, 3.0) to near-optimal point. The contour lines are axis-aligned ellipses, matching Adagrad's diagonal scaling.</li>
                    <li><strong>Function 2 (Right - Narrow Valley):</strong> Complex trajectory must navigate the rotated "narrow valley" created by the cross-term. The contour lines are densely packed and rotated 45°, making optimization much harder.</li>
                    <li><strong>Distance from Origin:</strong> f1 reaches ~1.93 units from origin, while f2 only reaches ~4.00 units - demonstrating the difficulty of converging in the rotated space.</li>
                    <li><strong>Path Complexity:</strong> f2's trajectory shows the struggle to follow the valley's diagonal direction using only axis-aligned adjustments.</li>
                </ul>
            </div>
        `
    },
    
    {
        title: "Experiment: Adagrad Trajectory for Function 1",
        presenter: "T4",
        content: `
            <p><strong>Comparing optimization paths for Function 1 with different learning rates:</strong></p>
            
            <div class="two-column">
                <div style="text-align: center;">
                    <img src="image/Adagrad-Trajectory-lr=0.2.png" alt="Adagrad Trajectory lr=0.2" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <p style="margin-top: 0.5rem; font-weight: 600;">Learning Rate = 0.2</p>
                </div>
                <div style="text-align: center;">
                    <img src="image/Adagrad-Trajectory-r=3.0.png" alt="Adagrad Trajectory r=3.0" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <p style="margin-top: 0.5rem; font-weight: 600;">Learning Rate = 3.0</p>
                </div>
            </div>
            
            <div class="highlight-box" style="margin-top: 1rem;">
                <strong>Observation:</strong> For the axis-aligned Function 1, Adagrad adapts the step size per coordinate, resulting in smoother convergence paths compared to standard gradient descent.
            </div>
        `
    },
    {
        title: "Concise Implementation",
        presenter: "T4",
        content: `
            <h3>Using PyTorch's Built-in Adagrad Optimizer</h3>
            
            <p>In practice, we use the optimized implementations provided by deep learning frameworks. Below is how to invoke Adagrad using PyTorch's <code>optim</code> module.</p>
            
            <p><strong>Basic Setup:</strong></p>
            <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 0.9rem;">
import torch.nn as nn

# 1. Define a simple model and loss function
net = nn.Sequential(nn.Linear(2, 1))
loss = nn.MSELoss()

# 2. Initialize Adagrad Optimizer
# We pass the model parameters and the learning rate
optimizer = torch.optim.Adagrad(net.parameters(), lr=0.1)

print(f"Optimizer initialized: {optimizer}")</pre>
            
            <div class="highlight-box">
                <strong>Key Parameters:</strong>
                <ul>
                    <li><code>lr</code>: Learning rate (default: 0.01)</li>
                    <li><code>lr_decay</code>: Learning rate decay (default: 0)</li>
                    <li><code>weight_decay</code>: Weight decay (L2 penalty) (default: 0)</li>
                    <li><code>eps</code>: Term added to denominator for numerical stability (default: 1e-10)</li>
                </ul>
            </div>
        `
    },
    
    {
        title: "(continued): Usage Example",
        presenter: "T4",
        content: `
            <p><strong>Training Loop Pattern:</strong></p>
            
            <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 0.9rem;">
# Training loop (pseudo-code)
for X, y in data_iter:
    # Forward pass
    l = loss(net(X), y)
    
    # Clear previous gradients
    optimizer.zero_grad()
    
    # Compute new gradients
    l.backward()
    
    # Update parameters using Adagrad logic
    optimizer.step()</pre>
            
            <p><strong>What happens inside <code>optimizer.step()</code>:</strong></p>
            <ol>
                <li>For each parameter, accumulate squared gradients: $s_t = s_{t-1} + g_t^2$</li>
                <li>Calculate adaptive learning rate: $\\eta_{eff} = \\frac{\\eta}{\\sqrt{s_t + \\epsilon}}$</li>
                <li>Update parameters: $\\theta_t = \\theta_{t-1} - \\eta_{eff} \\cdot g_t$</li>
            </ol>
            
            <div class="highlight-box">
                <strong>Advantages of Built-in Implementation:</strong>
                <ul>
                    <li>Optimized performance with vectorized operations</li>
                    <li>Automatic handling of different parameter groups</li>
                    <li>Support for additional features like weight decay</li>
                    <li>Well-tested and numerically stable</li>
                </ul>
            </div>
        `
    },
    
    
    
    {
        title: "SECTION 4: EXERCISES IN DETAIL",
        presenter: "T4",
        content: `<div class="section-header">Exercises in Detail</div>`
    },
    {
        title: "Exercise 2: Axis-aligned vs Rotated Function",
        presenter: "T4",
        content: `
            <h3>Problem Statement</h3>
            <p><strong>Try out Adagrad for the following objective functions:</strong></p>
            
            <p><strong>1. Axis-aligned function:</strong></p>
            <div class="math-block">
                $$f(\\mathbf{x}) = 0.1x_1^2 + 2x_2^2$$
            </div>
            
            <p><strong>2. Rotated function (by 45 degrees):</strong></p>
            <div class="math-block">
                $$f(\\mathbf{x}) = 0.1(x_1 + x_2)^2 + 2(x_1 - x_2)^2$$
            </div>
            
            <p><strong>Question:</strong> Does it behave differently?</p>
            
            <div class="highlight-box">
                <strong>Answer:</strong> Yes! This content has been presented in detail in <strong>Section 3.1</strong>. The axis-aligned function converges smoothly because Adagrad's diagonal preconditioning matches the problem geometry. The rotated function converges slower because the optimal direction is diagonal (45°), but Adagrad can only scale coordinates independently.
            </div>
        `
    },
    {
        title: "Exercise 5: Adagrad on LeNet (Fashion-MNIST)",
        presenter: "T4",
        content: `
            <h3>Problem Statement</h3>
            <p>Train the improved LeNet-5 architecture using the Adagrad optimizer on the Fashion-MNIST dataset.</p>
            
            <p><strong>Setup:</strong></p>
            <ul>
                <li><strong>Model:</strong> Improved LeNet-5 (ReLU activation + MaxPool instead of Sigmoid + AvgPool)</li>
                <li><strong>Optimizer:</strong> Adagrad with learning rate = 0.01</li>
                <li><strong>Loss Function:</strong> Cross Entropy Loss</li>
                <li><strong>Dataset:</strong> Fashion-MNIST (60,000 training images, 10,000 test images)</li>
                <li><strong>Batch Size:</strong> 256</li>
                <li><strong>Epochs:</strong> 10</li>
            </ul>
            
            <h3 style="margin-top: 1.5rem;">Architecture Details</h3>
            <p>The improved LeNet uses ReLU and MaxPool to mitigate vanishing gradient issues:</p>
            <ul>
                <li>Conv2d(1→6, kernel=5, padding=2) + ReLU + MaxPool(2×2)</li>
                <li>Conv2d(6→16, kernel=5) + ReLU + MaxPool(2×2)</li>
                <li>Flatten + Linear(400→120) + ReLU</li>
                <li>Linear(120→84) + ReLU</li>
                <li>Linear(84→10) [Output layer]</li>
            </ul>
        `
    },
    
    {
        title: "Exercise 5: Implementation Code",
        presenter: "T4",
        content: `
            <p><strong>Key Implementation Steps:</strong></p>
            
            <p><strong>1. Define the Improved LeNet Model:</strong></p>
            <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto;">
def get_net():
    return nn.Sequential(
        nn.Conv2d(1, 6, kernel_size=5, padding=2), nn.ReLU(),
        nn.MaxPool2d(kernel_size=2, stride=2),
        nn.Conv2d(6, 16, kernel_size=5), nn.ReLU(),
        nn.MaxPool2d(kernel_size=2, stride=2),
        nn.Flatten(),
        nn.Linear(16 * 5 * 5, 120), nn.ReLU(),
        nn.Linear(120, 84), nn.ReLU(),
        nn.Linear(84, 10)
    ).to(device)</pre>
            
            <p><strong>2. Initialize Adagrad Optimizer:</strong></p>
            <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto;">
net = get_net()
optimizer = torch.optim.Adagrad(net.parameters(), lr=0.01)</pre>
            
            <p><strong>3. Training Loop:</strong> Standard PyTorch training loop with forward pass, loss computation, backward pass, and optimizer step.</p>
        `
    },
    
    {
        title: "Exercise 5: Results",
        presenter: "T4",
        content: `
            <p><strong>Training Performance:</strong></p>
            
            <div class="two-column">
                <div style="text-align: center;">
                    <img src="image/Training-Loss.png" alt="Training Loss" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <p style="margin-top: 0.5rem; font-weight: 600;">Training Loss Over Epochs</p>
                </div>
                <div style="text-align: center;">
                    <img src="image/Test-Accuracy.png" alt="Test Accuracy" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <p style="margin-top: 0.5rem; font-weight: 600;">Test Accuracy Over Epochs</p>
                </div>
            </div>
            
            <div class="highlight-box" style="margin-top: 1rem;">
                <strong>Observations:</strong>
                <ul>
                    <li>Training loss decreases steadily across epochs</li>
                    <li>Test accuracy improves consistently, reaching ~85-88%</li>
                    <li>Adagrad's adaptive learning rates help different layers learn at appropriate speeds</li>
                    <li>No manual learning rate scheduling required</li>
                </ul>
            </div>
        `
    },
    
    {
        title: "Exercise 6: Modifying Adagrad for Less Aggressive Decay",
        presenter: "T4",
        content: `
            <h3>Problem Identification</h3>
            <p>As observed in the quadratic experiment (Section 3.3), Adagrad's state variable $s_t$ accumulates squared gradients indefinitely:</p>
            <div class="math-block">
                $$s_t = s_{t-1} + g_t^2$$
            </div>
            
            <p>Because $g_t^2$ is always non-negative, $s_t$ keeps growing. Consequently, the learning rate $\\eta / \\sqrt{s_t}$ eventually decreases to zero. If this happens too early (before reaching the optimum), the model stops learning.</p>
            
            <h3 style="margin-top: 1.5rem;">Proposed Modification</h3>
            <p>To prevent $s_t$ from growing indefinitely, replace the full sum with an <strong>exponential moving average (EMA)</strong>. This allows the algorithm to "forget" old gradients and focus on recent curvature.</p>
            
            <p><strong>The Modified Update Rule:</strong></p>
            <p>Instead of $s_t = s_{t-1} + g_t^2$, use:</p>
            <div class="math-block">
                $$s_t \\leftarrow \\gamma s_{t-1} + (1 - \\gamma) g_t^2$$
            </div>
            <p>Where $\\gamma$ (typically 0.9) is a decay factor.</p>
            
            <div class="highlight-box">
                <strong>Note:</strong> This specific modification effectively transforms <strong>Adagrad</strong> into the <strong>RMSProp</strong> algorithm. This mechanism is also a foundational component of the <strong>Adam</strong> optimizer.
            </div>
        `
    },
    
    {
        title: "Exercise 6: Comparison Results",
        presenter: "T4",
        content: `
            <p><strong>Comparing Adagrad vs. RMSProp (Modified Adagrad):</strong></p>
            
            <div class="two-column">
                <div style="text-align: center;">
                    <img src="image/Training-Loss-Comparison.png" alt="Training Loss Comparison" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <p style="margin-top: 0.5rem; font-weight: 600;">Training Loss Comparison</p>
                </div>
                <div style="text-align: center;">
                    <img src="image/Test-Accuracy-Comparison.png" alt="Test Accuracy Comparison" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <p style="margin-top: 0.5rem; font-weight: 600;">Test Accuracy Comparison</p>
                </div>
            </div>
            
            <div class="highlight-box" style="margin-top: 1rem;">
                <strong>Key Findings:</strong>
                <ul>
                    <li><strong>Adagrad:</strong> Fast initial convergence but may plateau due to vanishing learning rate</li>
                    <li><strong>RMSProp:</strong> Maintains learning capability throughout training by using exponential moving average</li>
                    <li><strong>Practical Impact:</strong> RMSProp often achieves better final performance on deep learning tasks</li>
                    <li><strong>Evolution:</strong> This insight led to development of Adam optimizer (RMSProp + momentum)</li>
                </ul>
            </div>
        `
    },
    
    {
        title: "Summary & Key Takeaways",
        presenter: "T4",
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
        `
    },
    
    {
        title: "References",
        presenter: "T4",
        content: `
            <h3 style="margin-bottom: 2rem;">References</h3>
            
            <div style="font-size: 1rem; line-height: 2;">
                <p style="margin-bottom: 1.5rem;">
                    [1] A. Zhang, Z. C. Lipton, M. Li, and A. J. Smola, <em>Dive into Deep Learning</em>. Cambridge University Press, 2023. [Online]. Available: <a href="https://D2L.ai" target="_blank" style="color: #3498db; text-decoration: underline;">https://D2L.ai</a>
                </p>
                
                <p style="margin-bottom: 1.5rem;">
                    [2] J. Duchi, E. Hazan, and Y. Singer, "Adaptive subgradient methods for online learning and stochastic optimization," <em>J. Mach. Learn. Res.</em>, vol. 12, no. 61, pp. 2121–2159, 2011.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 4rem; font-size: 1.8rem; color: #2c3e50;">
                <strong>Thank you!</strong> 🙏
            </div>
            
            <div style="text-align: center; margin-top: 2rem; font-size: 1rem; color: var(--color-text-light);">
                <p><strong>Group 20</strong></p>
                <p>Mathematical Foundations for Computer Science</p>
            </div>
        `
    }
];
