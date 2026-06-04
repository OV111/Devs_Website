// Universal sideLeft/sideRight injector for all roadmap JSON files
const fs = require("fs");
const path = require("path");

const roadmapsDir = path.join(__dirname, "../src/data/roadmaps");
const files = fs.readdirSync(roadmapsDir).filter(f => f.endsWith(".json"));

// ─── Rich side panels keyed by trackId ───────────────────────────────────────
// Tracks with hand-crafted deep-dive content. All others get contextual placeholders.
const richSides = {
  // ── AI/ML ─────────────────────────────────────────────────────────────────
  "ml-engineer": {
    1: {
      sideLeft: [
        { title: "Linear Algebra Foundations", children: [
          { title: "Vectors and matrix multiplication", description: "Neural networks are chains of matrix multiplications. A fluent grasp of dot products, transposes, and broadcasting is non-negotiable for reading paper implementations.", resources: [{ label: "3Blue1Brown Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "video" }, { label: "MIT 18.06 Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", type: "course" }] },
          { title: "Eigenvalues and PCA", description: "PCA decomposes a covariance matrix into eigenvectors — understanding this makes dimensionality reduction intuitive rather than a black box.", resources: [{ label: "StatQuest PCA Explained", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ", type: "video" }, { label: "Scikit-learn PCA Docs", url: "https://scikit-learn.org/stable/modules/decomposition.html#pca", type: "docs" }] }
        ]},
        { title: "Statistics for ML", children: [
          { title: "Probability distributions", description: "Gaussian, Bernoulli, Categorical, and Dirichlet distributions appear throughout ML. Knowing their PMF/PDF, mean, and variance is prerequisite to reading any probabilistic model.", resources: [{ label: "Probability for ML (fast.ai)", url: "https://course.fast.ai/Resources/book.html", type: "book" }, { label: "Seeing Theory – Visual Stats", url: "https://seeing-theory.brown.edu/", type: "article" }] },
          { title: "Bayes theorem and MLE", description: "Maximum Likelihood Estimation finds parameters that maximize the probability of observed data — the objective function behind linear regression, logistic regression, and many neural networks.", resources: [{ label: "MLE Explained Visually", url: "https://medium.com/towards-data-science/maximum-likelihood-estimation-explained-visual-guide-with-examples-78adeef51248", type: "article" }, { label: "StatQuest MLE", url: "https://www.youtube.com/watch?v=XepXtl9YKwc", type: "video" }] }
        ]}
      ],
      sideRight: [
        { title: "Python ML Ecosystem", children: [
          { title: "NumPy vs Pandas vs PyTorch tensors", description: "NumPy arrays are the universal substrate; Pandas DataFrames add column labels; PyTorch tensors add autograd and GPU support. Knowing when to use which avoids expensive conversions.", resources: [{ label: "NumPy vs PyTorch tensors", url: "https://pytorch.org/tutorials/beginner/blitz/tensor_tutorial.html", type: "docs" }, { label: "Pandas vs NumPy Guide", url: "https://medium.com/towards-data-science/pandas-vs-numpy-for-data-science-c5f6e5e6b4b4", type: "article" }] },
          { title: "Virtual environments for ML", description: "ML projects have notoriously fragile dependency trees. Use conda environments with pinned CUDA versions to prevent the 'works on my machine' problem.", resources: [{ label: "Conda Environment Guide", url: "https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html", type: "docs" }, { label: "ML Dev Environment Setup", url: "https://www.youtube.com/watch?v=OIooB5QFH7A", type: "video" }] }
        ]},
        { title: "Career in ML Engineering", children: [
          { title: "ML engineer vs data scientist", description: "ML engineers productionize models; data scientists explore data and build prototypes. The boundary is blurry but knowing both sides makes you invaluable on any team.", resources: [{ label: "ML Engineer vs Data Scientist", url: "https://medium.com/towards-data-science/ml-engineer-vs-data-scientist-what-is-the-difference-47d9aaf24e6b", type: "article" }, { label: "Google ML Engineer Guide", url: "https://developers.google.com/machine-learning/guides", type: "docs" }] },
          { title: "Kaggle for skill building", description: "Kaggle competitions provide labeled datasets, leaderboards, and notebooks. Consistent top-25% finishes are a concrete portfolio item for ML engineering roles.", resources: [{ label: "Kaggle Documentation", url: "https://www.kaggle.com/docs", type: "docs" }, { label: "Winning Kaggle Strategies", url: "https://www.youtube.com/watch?v=VC6Z0gJtbxU", type: "video" }] }
        ]}
      ]
    }
  },
  // ── DevOps ────────────────────────────────────────────────────────────────
  "cloud": {
    1: {
      sideLeft: [
        { title: "Cloud Fundamentals", children: [
          { title: "Shared responsibility model", description: "AWS/Azure/GCP secure the infrastructure; you secure your data, IAM policies, and application. Misunderstanding this boundary causes most cloud breaches.", resources: [{ label: "AWS Shared Responsibility", url: "https://aws.amazon.com/compliance/shared-responsibility-model/", type: "docs" }, { label: "Cloud Security Fundamentals", url: "https://www.cloudflare.com/learning/cloud/what-is-cloud-security/", type: "article" }] },
          { title: "Regions and availability zones", description: "Regions are geographic areas; AZs are physically separated data centers within a region. Multi-AZ deployments survive a data center failure; multi-region survives a regional disaster.", resources: [{ label: "AWS Regions and AZs", url: "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/", type: "docs" }, { label: "Multi-AZ vs Multi-Region", url: "https://medium.com/aws-tip/aws-multi-az-vs-multi-region-7b89cf0b8c3e", type: "article" }] }
        ]},
        { title: "IaC Foundations", children: [
          { title: "Declarative vs imperative IaC", description: "Terraform (declarative) describes desired state; scripts (imperative) describe steps. Declarative IaC is idempotent — applying it twice has no effect.", resources: [{ label: "Terraform Getting Started", url: "https://developer.hashicorp.com/terraform/tutorials/aws-get-started", type: "docs" }, { label: "IaC Explained", url: "https://www.hashicorp.com/resources/what-is-infrastructure-as-code", type: "article" }] },
          { title: "State management in Terraform", description: "Terraform state maps your config to real infrastructure. Remote state (S3 + DynamoDB lock) is mandatory for teams — local state files cause split-brain disasters.", resources: [{ label: "Terraform Remote State", url: "https://developer.hashicorp.com/terraform/language/state/remote", type: "docs" }, { label: "Terraform State Best Practices", url: "https://medium.com/aws-tip/terraform-state-management-best-practices-d9e4d7b7b3a3", type: "article" }] }
        ]}
      ],
      sideRight: [
        { title: "Networking in the Cloud", children: [
          { title: "VPC, subnets, and routing", description: "A VPC is your private network slice. Public subnets route to an Internet Gateway; private subnets route through a NAT Gateway. Getting this wrong exposes databases to the internet.", resources: [{ label: "AWS VPC Docs", url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html", type: "docs" }, { label: "VPC Deep Dive", url: "https://www.youtube.com/watch?v=fpxDGU2KdkA", type: "video" }] },
          { title: "Security groups vs NACLs", description: "Security groups are stateful firewall rules attached to resources; NACLs are stateless rules on subnets. Use security groups for instance-level control, NACLs as an extra subnet boundary.", resources: [{ label: "Security Groups vs NACLs", url: "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html", type: "docs" }, { label: "AWS Networking Explained", url: "https://medium.com/aws-tip/security-groups-vs-nacls-explained-4b7b2a3b2c3b", type: "article" }] }
        ]},
        { title: "Cost Management", children: [
          { title: "Right-sizing instances", description: "Over-provisioned instances are the biggest cloud cost waste. Use CloudWatch metrics to find p95 CPU utilization — if it's under 20%, you can downsize.", resources: [{ label: "AWS Cost Explorer", url: "https://aws.amazon.com/aws-cost-management/aws-cost-explorer/", type: "docs" }, { label: "Cloud Cost Optimization Guide", url: "https://www.wellarchitectedlabs.com/cost/", type: "docs" }] },
          { title: "Reserved vs Spot vs On-Demand", description: "On-Demand: max flexibility, max cost. Reserved (1–3yr commit): 40–60% savings. Spot: 90% off but interruptible — perfect for batch ML training and CI jobs.", resources: [{ label: "AWS Pricing Models", url: "https://aws.amazon.com/ec2/pricing/", type: "docs" }, { label: "Spot Instance Best Practices", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html", type: "docs" }] }
        ]}
      ]
    }
  },
  // ── Cybersecurity ──────────────────────────────────────────────────────────
  "pentester": {
    1: {
      sideLeft: [
        { title: "Penetration Testing Methodology", children: [
          { title: "PTES and OWASP Testing Guide", description: "The Penetration Testing Execution Standard (PTES) defines phases: pre-engagement, recon, threat modeling, exploitation, post-exploitation, reporting. Following it ensures nothing is missed.", resources: [{ label: "PTES Standard", url: "http://www.pentest-standard.org/", type: "docs" }, { label: "OWASP Testing Guide", url: "https://owasp.org/www-project-web-security-testing-guide/", type: "docs" }] },
          { title: "Rules of engagement", description: "Always get written authorization before testing. Define scope (IP ranges, domains), testing windows, and emergency contacts. Testing without authorization is a federal crime.", resources: [{ label: "Pentest Authorization Templates", url: "https://www.sans.org/white-papers/penetration-testing-scoping-rules-of-engagement/", type: "docs" }, { label: "Legal Aspects of Pentesting", url: "https://medium.com/bugbountywriteup/the-legality-of-penetration-testing-38d3b7d14e8e", type: "article" }] }
        ]},
        { title: "Reconnaissance Techniques", children: [
          { title: "OSINT with Shodan and Maltego", description: "Shodan indexes internet-exposed devices and services; Maltego visualizes entity relationships. Together they map a target's attack surface before touching a single packet.", resources: [{ label: "Shodan Documentation", url: "https://www.shodan.io/about/products", type: "docs" }, { label: "OSINT Framework", url: "https://osintframework.com/", type: "docs" }] },
          { title: "DNS enumeration and subdomains", description: "Subdomain enumeration often reveals forgotten dev/staging servers with weaker security. Tools: amass, subfinder, dnsx, and certificate transparency logs.", resources: [{ label: "Amass Documentation", url: "https://github.com/owasp-amass/amass", type: "docs" }, { label: "Subdomain Enumeration Guide", url: "https://medium.com/bugbountywriteup/subdomain-enumeration-techniques-2022-bd9b4b7c3a4b", type: "article" }] }
        ]}
      ],
      sideRight: [
        { title: "Kali Linux Toolset", children: [
          { title: "Nmap scan types explained", description: "SYN scan (-sS) is stealthy; service detection (-sV) reveals versions; OS detection (-O) fingerprints the target. Knowing which scan to use prevents detection and reduces noise.", resources: [{ label: "Nmap Reference Guide", url: "https://nmap.org/book/man.html", type: "docs" }, { label: "Nmap Scan Types Tutorial", url: "https://www.youtube.com/watch?v=4t4kBkMsDbQ", type: "video" }] },
          { title: "Burp Suite proxy workflow", description: "Burp intercepts HTTP/S between browser and server. Use the proxy to capture requests, the repeater to replay modified requests, and the scanner for automated vuln detection.", resources: [{ label: "Burp Suite Documentation", url: "https://portswigger.net/burp/documentation", type: "docs" }, { label: "Burp Suite Beginner Guide", url: "https://www.youtube.com/watch?v=G3hpAeoZ4ek", type: "video" }] }
        ]},
        { title: "Career Path", children: [
          { title: "Certifications: OSCP, CEH, GPEN", description: "OSCP (Offensive Security) is the gold standard — hands-on 24-hour exam. CEH is more theory-based. GPEN (GIAC) is respected for enterprise pentesting roles.", resources: [{ label: "OSCP Certification", url: "https://www.offensive-security.com/pwk-oscp/", type: "docs" }, { label: "OSCP vs CEH vs GPEN", url: "https://medium.com/@cybersec/oscp-vs-ceh-vs-gpen-which-certification-is-right-for-you-b7d6c4c8e7b4", type: "article" }] },
          { title: "Practice labs: HackTheBox and TryHackMe", description: "HackTheBox (intermediate–advanced) and TryHackMe (beginner–intermediate) provide guided labs for realistic exploitation practice without legal risk.", resources: [{ label: "HackTheBox", url: "https://www.hackthebox.com/", type: "docs" }, { label: "TryHackMe", url: "https://tryhackme.com/", type: "docs" }] }
        ]}
      ]
    }
  }
};

// ─── Contextual placeholder generator ─────────────────────────────────────────
const topicMeta = {
  // file-level context hints for better placeholder copy
  "aiml": { domain: "AI/ML", community: "Hugging Face, Papers With Code, Arxiv", practice: "Kaggle competitions and open datasets" },
  "backend": { domain: "backend engineering", community: "GitHub, Stack Overflow, system design forums", practice: "building side projects and contributing to open source" },
  "cloud": { domain: "cloud infrastructure", community: "AWS re:Post, CNCF Slack, HashiCorp Discuss", practice: "AWS/GCP free tier projects and certification labs" },
  "cybersecurity": { domain: "cybersecurity", community: "HackTheBox, TryHackMe, r/netsec", practice: "CTF competitions and bug bounty programs" },
  "database": { domain: "database engineering", community: "DBA Stack Exchange, PostgreSQL mailing lists", practice: "optimizing queries on real datasets" },
  "datascience": { domain: "data science", community: "Kaggle, Towards Data Science, DataTalks.Club", practice: "end-to-end projects on public datasets" },
  "devops": { domain: "DevOps and platform engineering", community: "CNCF Slack, DevOps subreddit, HashiCorp forums", practice: "building home lab infrastructure and CI pipelines" },
  "fullstack": { domain: "full-stack development", community: "GitHub, Dev.to, Hacker News", practice: "shipping small SaaS products and open source contributions" },
  "gamedev": { domain: "game development", community: "Unity forums, Godot Discord, r/gamedev", practice: "game jams (Ludum Dare, Global Game Jam)" },
  "languages": { domain: "programming languages", community: "language-specific Discord servers and subreddits", practice: "solving Advent of Code and exercism.io challenges" },
  "mobile": { domain: "mobile development", community: "Android Developers, Swift Forums, Flutter Discord", practice: "shipping apps to the App Store and Play Store" },
  "qa": { domain: "quality assurance and testing", community: "Ministry of Testing, QA Stack Exchange", practice: "contributing test suites to open source projects" },
  "quantum": { domain: "quantum computing", community: "Qiskit Slack, Quantum Computing Stack Exchange", practice: "running circuits on IBM Quantum hardware via free tier" },
  "web3": { domain: "Web3 development", community: "Ethereum Discord, Buildspace, Developer DAO", practice: "hackathons like ETHGlobal and Devfolio" },
};

function makeSides(fileName, trackId, layer) {
  // Check for hand-crafted sides first
  if (richSides[trackId] && richSides[trackId][layer.order]) {
    return richSides[trackId][layer.order];
  }

  const meta = topicMeta[fileName] || { domain: "software engineering", community: "GitHub, Stack Overflow, Discord", practice: "side projects and open source contributions" };
  const title = layer.title;

  return {
    sideLeft: [
      {
        title: `${title} – Theory`,
        children: [
          {
            title: "Mental models and first principles",
            description: `Strong ${meta.domain} practitioners build mental models before touching a keyboard. Understanding the why behind ${title.toLowerCase()} lets you adapt when tools change.`,
            resources: [
              { label: `${title} Concepts Overview`, url: "https://roadmap.sh/", type: "docs" },
              { label: "First Principles Thinking", url: "https://fs.blog/first-principles/", type: "article" }
            ]
          },
          {
            title: "Key abstractions and trade-offs",
            description: `Every technology in ${meta.domain} makes specific trade-offs. Knowing what was sacrificed for what helps you choose the right tool and avoid footguns.`,
            resources: [
              { label: "Software Design Principles", url: "https://medium.com/towards-data-engineering", type: "article" },
              { label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "docs" }
            ]
          }
        ]
      },
      {
        title: `${title} – Tooling`,
        children: [
          {
            title: "Ecosystem toolchain",
            description: `The ${meta.domain} ecosystem has converged on specific toolchains for this layer. Mastering them removes friction so you can focus on solving problems rather than fighting infrastructure.`,
            resources: [
              { label: "Awesome List for this Domain", url: "https://github.com/topics/awesome", type: "docs" },
              { label: "Developer Tooling Guide", url: "https://roadmap.sh/", type: "docs" }
            ]
          },
          {
            title: "Debugging and observability",
            description: "Production issues are inevitable. Instrumenting your system before things break — logs, metrics, traces — determines how fast you can diagnose and recover.",
            resources: [
              { label: "OpenTelemetry Documentation", url: "https://opentelemetry.io/docs/", type: "docs" },
              { label: "Observability Engineering", url: "https://www.honeycomb.io/resources/o11y-guide", type: "book" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: `${title} – Security`,
        children: [
          {
            title: "Security considerations",
            description: `Security in ${meta.domain} is not a feature to add later — it must be designed in. Understanding the threat model for this layer prevents the most common breaches.`,
            resources: [
              { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", type: "docs" },
              { label: "Security Engineering (Ross Anderson)", url: "https://www.cl.cam.ac.uk/~rja14/book.html", type: "book" }
            ]
          },
          {
            title: "Principle of least privilege",
            description: "Every component should have exactly the permissions it needs — no more. Scoping permissions tightly limits the blast radius when any component is compromised.",
            resources: [
              { label: "Least Privilege Explained", url: "https://csrc.nist.gov/glossary/term/least_privilege", type: "docs" },
              { label: "IAM Best Practices", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html", type: "docs" }
            ]
          }
        ]
      },
      {
        title: `${title} – Community and Growth`,
        children: [
          {
            title: "Where the community lives",
            description: `The ${meta.domain} community is active in ${meta.community}. Engaging with it — asking questions, reviewing PRs, sharing knowledge — accelerates growth faster than solo study.`,
            resources: [
              { label: "GitHub Explore", url: "https://github.com/explore", type: "docs" },
              { label: "Stack Overflow", url: "https://stackoverflow.com/", type: "docs" }
            ]
          },
          {
            title: "Portfolio and practice",
            description: `The fastest path to proficiency in ${meta.domain} is ${meta.practice}. Real feedback from users and reviewers surfaces gaps that no tutorial can.`,
            resources: [
              { label: "GitHub Portfolio Guide", url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile", type: "docs" },
              { label: "Building in Public", url: "https://medium.com/building-in-public", type: "article" }
            ]
          }
        ]
      }
    ]
  };
}

// ─── Process all files ─────────────────────────────────────────────────────────
let totalUpdated = 0;

for (const file of files) {
  const filePath = path.join(roadmapsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const fileName = path.basename(file, ".json");
  let fileUpdated = 0;

  for (const trackId of Object.keys(data)) {
    for (const layer of data[trackId]) {
      if (!layer.sideLeft) {
        const sides = makeSides(fileName, trackId, layer);
        layer.sideLeft = sides.sideLeft;
        layer.sideRight = sides.sideRight;
        fileUpdated++;
      }
    }
  }

  if (fileUpdated > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log(`✓ ${file}: +${fileUpdated} layers`);
    totalUpdated += fileUpdated;
  } else {
    console.log(`✓ ${file}: already complete`);
  }
}

console.log(`\nTotal layers updated: ${totalUpdated}`);
