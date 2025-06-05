import { Category, Term } from "@shared/schema";

// For GitHub Pages deployment, we'll embed the data directly
// This will be updated by the build process to include actual data
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
    definition: "Artificial Intelligence is the branch of computer science focused on building systems that can perform tasks typically requiring human intelligence, such as reasoning, learning, and decision-making.",
    aliases: ["AI"],
    related: ["Artificial General Intelligence", "Machine Learning"],
    tags: ["core-concept", "ai"],
    references: ["https://en.wikipedia.org/wiki/Artificial_intelligence", "https://plato.stanford.edu/entries/artificial-intelligence/"]
  },
  {
    id: 2,
    term: "Artificial General Intelligence",
    category: "AI Fundamentals",
    definition: "AGI refers to a form of AI that has the ability to understand, learn, and apply knowledge across a wide range of tasks at human or superhuman levels.",
    aliases: ["AGI", "Strong AI"],
    related: ["Narrow AI", "Artificial Intelligence"],
    tags: ["agi", "theoretical-ai"],
    references: ["https://en.wikipedia.org/wiki/Artificial_general_intelligence", "https://www.ibm.com/cloud/blog/artificial-general-intelligence"]
  }
];