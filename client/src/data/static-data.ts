import { Category, Term } from "@shared/schema";

export const STATIC_CATEGORIES: Category[] = [
  { id: 1, name: "AI Fundamentals", description: "Core concepts and principles that form the foundation of artificial intelligence, including basic definitions, history, and key terminology." },
  { id: 2, name: "Machine Learning", description: "Algorithms and techniques that enable computers to learn and improve from experience without being explicitly programmed for every task." },
  { id: 3, name: "Deep Learning Architectures", description: "Neural network-based models with multiple layers, designed to process complex patterns in high-dimensional data like images, audio, and text." },
  { id: 4, name: "Prompt Engineering", description: "Techniques for designing and optimizing input prompts to guide large language models (LLMs) and other generative AI systems in producing desired outputs." },
  { id: 5, name: "Natural Language Processing (NLP)", description: "Techniques and models focused on understanding, processing, and generating human language — including tasks like tokenization, summarization, and translation." },
  { id: 6, name: "Computer Vision", description: "AI techniques that enable machines to interpret and understand visual information from images and videos, including object detection and image classification." },
  { id: 7, name: "Generative AI", description: "AI systems designed to create new content, including text, images, code, and other media, often using techniques like GANs and transformer models." },
  { id: 8, name: "AI Ethics & Safety", description: "Principles, guidelines, and practices for developing and deploying AI systems responsibly, addressing bias, fairness, and potential societal impacts." },
  { id: 9, name: "AI Model Training", description: "Processes, techniques, and best practices for training AI models, including data preparation, optimization methods, and evaluation metrics." },
  { id: 10, name: "AI Infrastructure", description: "Hardware, software, and cloud platforms that support AI development and deployment, including specialized chips, frameworks, and scalable architectures." },
  { id: 11, name: "AI Applications", description: "Real-world use cases and implementations of AI technology across various industries, from healthcare and finance to entertainment and transportation." },
  { id: 12, name: "AI Research & Development", description: "Cutting-edge research areas, emerging trends, and experimental techniques that are shaping the future of artificial intelligence." }
];

export const STATIC_TERMS: Term[] = [
  {
    id: 1,
    term: "Artificial Intelligence",
    category: "AI Fundamentals",
    definition: "A branch of computer science focused on creating systems that can perform tasks typically requiring human intelligence, such as learning, reasoning, and perception.",
    aliases: ["AI"],
    related: ["Machine Learning", "Neural Networks"],
    tags: ["foundational", "computer science"],
    references: ["https://www.britannica.com/technology/artificial-intelligence"]
  },
  {
    id: 2,
    term: "Machine Learning",
    category: "Machine Learning",
    definition: "A subset of AI that enables computers to learn and improve from experience without being explicitly programmed for every specific task.",
    aliases: ["ML"],
    related: ["Artificial Intelligence", "Deep Learning"],
    tags: ["algorithms", "learning"],
    references: ["https://www.ibm.com/topics/machine-learning"]
  },
  {
    id: 3,
    term: "Neural Networks",
    category: "Deep Learning Architectures",
    definition: "Computing systems inspired by biological neural networks, consisting of interconnected nodes (neurons) that process information through weighted connections.",
    aliases: ["Neural Nets", "ANN"],
    related: ["Deep Learning", "Artificial Intelligence"],
    tags: ["architecture", "neurons"],
    references: ["https://www.ibm.com/topics/neural-networks"]
  },
  {
    id: 4,
    term: "Large Language Model",
    category: "Natural Language Processing (NLP)",
    definition: "A type of AI model trained on vast amounts of text data to understand and generate human-like text, capable of various language tasks.",
    aliases: ["LLM"],
    related: ["Transformer", "GPT", "Natural Language Processing"],
    tags: ["language", "text generation"],
    references: ["https://www.anthropic.com/news/claude-2"]
  },
  {
    id: 5,
    term: "Transformer",
    category: "Deep Learning Architectures",
    definition: "A neural network architecture that uses self-attention mechanisms to process sequential data, forming the foundation of modern LLMs.",
    aliases: ["Transformer Architecture"],
    related: ["Attention Mechanism", "Large Language Model"],
    tags: ["architecture", "attention"],
    references: ["https://arxiv.org/abs/1706.03762"]
  },
  {
    id: 6,
    term: "Prompt Engineering",
    category: "Prompt Engineering",
    definition: "The practice of designing and optimizing input prompts to effectively guide AI models, especially LLMs, to produce desired outputs.",
    aliases: ["Prompt Design"],
    related: ["Large Language Model", "Few-shot Learning"],
    tags: ["optimization", "input design"],
    references: ["https://www.promptingguide.ai/"]
  },
  {
    id: 7,
    term: "Computer Vision",
    category: "Computer Vision",
    definition: "A field of AI that enables machines to interpret and understand visual information from images and videos.",
    aliases: ["CV"],
    related: ["Image Recognition", "Object Detection"],
    tags: ["visual", "perception"],
    references: ["https://www.ibm.com/topics/computer-vision"]
  },
  {
    id: 8,
    term: "Generative Adversarial Network",
    category: "Generative AI",
    definition: "A machine learning architecture consisting of two neural networks competing against each other to generate new, synthetic data.",
    aliases: ["GAN"],
    related: ["Generative AI", "Neural Networks"],
    tags: ["generative", "adversarial"],
    references: ["https://arxiv.org/abs/1406.2661"]
  },
  {
    id: 9,
    term: "Bias in AI",
    category: "AI Ethics & Safety",
    definition: "Systematic errors or unfair preferences in AI systems that can lead to discriminatory outcomes against certain groups or individuals.",
    aliases: ["AI Bias", "Algorithmic Bias"],
    related: ["AI Ethics", "Fairness"],
    tags: ["ethics", "fairness"],
    references: ["https://www.brookings.edu/research/algorithmic-bias-detection-and-mitigation/"]
  },
  {
    id: 10,
    term: "Training Data",
    category: "AI Model Training",
    definition: "The dataset used to teach machine learning models how to make predictions or decisions by providing examples of inputs and expected outputs.",
    aliases: ["Training Set"],
    related: ["Machine Learning", "Data Preprocessing"],
    tags: ["data", "training"],
    references: ["https://developers.google.com/machine-learning/crash-course/training-and-test-sets/splitting-data"]
  }
];