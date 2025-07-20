import { CaseStudy } from '@/lib/types/work'

// Comprehensive case studies data following unified structure
export const caseStudies: CaseStudy[] = [
  {
    id: "digital-transformation",
    title: "Digital Transformation for Enterprise Retail",
    category: "digital-automation",
    description: "How we helped a major retail chain transform their digital presence and operations through comprehensive automation and system integration.",
    thumbnail: "/images/case-studies/digital-transformation-thumb.jpg",
    images: [
      "/images/case-studies/digital-transformation-1.jpg",
      "/images/case-studies/digital-transformation-2.jpg",
      "/images/case-studies/digital-transformation-3.jpg",
      "/images/case-studies/digital-transformation-4.jpg"
    ],
    background: "A leading retail chain with 200+ stores was struggling with outdated legacy systems, disconnected data silos, and manual processes that were hindering their growth in the competitive retail market. Customer expectations for seamless omnichannel experiences were not being met.",
    challenge: "The client was struggling with outdated systems, siloed data, and inefficient processes that were hindering growth and customer experience. Their legacy infrastructure couldn't support modern retail demands.",
    objectives: [
      "Modernize legacy systems with cloud-based solutions",
      "Integrate disparate systems for unified data view",
      "Implement real-time inventory management",
      "Create seamless omnichannel customer experience",
      "Reduce operational costs while improving efficiency"
    ],
    approach: "We implemented a phased digital transformation strategy, starting with core system modernization, followed by data integration, and concluding with advanced automation and analytics implementation.",
    process: [
      {
        phase: "Assessment & Planning",
        description: "Comprehensive audit of existing systems, identification of pain points, and development of detailed transformation roadmap with clear milestones."
      },
      {
        phase: "Infrastructure Modernization",
        description: "Migration to cloud-based infrastructure, implementation of microservices architecture, and establishment of robust security frameworks."
      },
      {
        phase: "System Integration",
        description: "Integration of POS, inventory, CRM, and e-commerce systems through unified API layer and real-time data synchronization."
      },
      {
        phase: "Automation Implementation",
        description: "Deployment of automated workflows for inventory management, order processing, and customer communications."
      },
      {
        phase: "Analytics & Optimization",
        description: "Implementation of business intelligence tools, predictive analytics, and continuous optimization processes."
      }
    ],
    deliverables: [
      "Cloud-based e-commerce platform",
      "Integrated CRM system",
      "Automated inventory management",
      "Real-time analytics dashboard",
      "Mobile-responsive customer portal",
      "Staff training and documentation"
    ],
    results: [
      { metric: "Online Sales Increase", value: "35%" },
      { metric: "Customer Satisfaction", value: "42%" },
      { metric: "Operational Cost Reduction", value: "28%" },
      { metric: "System Uptime", value: "99.9%" }
    ],
    clientName: "RetailCorp Enterprise",
    clientLogo: "/images/clients/retailcorp-logo.png",
    imageId: "digital-transformation"
  },
  {
    id: "ecommerce-automation",
    title: "E-commerce Automation for Global Brand",
    category: "digital-automation",
    description: "Streamlining operations and enhancing customer experience through comprehensive automation solutions for a global e-commerce brand.",
    thumbnail: "/images/case-studies/ecommerce-automation-thumb.jpg",
    images: [
      "/images/case-studies/ecommerce-automation-1.jpg",
      "/images/case-studies/ecommerce-automation-2.jpg",
      "/images/case-studies/ecommerce-automation-3.jpg",
      "/images/case-studies/ecommerce-automation-4.jpg"
    ],
    background: "A rapidly growing global e-commerce brand was facing scalability challenges with their manual processes. As order volume increased 300% year-over-year, their existing workflows became bottlenecks that threatened customer satisfaction and business growth.",
    challenge: "The client's manual processes were causing delays, errors, and customer dissatisfaction as they scaled their global e-commerce operations. Order processing took 48+ hours with 8% error rates.",
    objectives: [
      "Automate order processing and fulfillment workflows",
      "Implement real-time inventory synchronization",
      "Establish 24/7 customer service automation",
      "Create predictive analytics for demand forecasting",
      "Achieve global scalability without proportional staffing increases"
    ],
    approach: "We developed a comprehensive automation ecosystem that connects all aspects of the e-commerce operation, from order receipt to customer delivery, with intelligent decision-making at each step.",
    process: [
      {
        phase: "Process Analysis",
        description: "Deep analysis of existing workflows, identification of automation opportunities, and mapping of optimal process flows."
      },
      {
        phase: "Core Automation Development",
        description: "Development of custom automation solutions for order processing, inventory management, and customer communications."
      },
      {
        phase: "Integration & Testing",
        description: "Integration with existing systems, comprehensive testing, and gradual rollout to ensure seamless operations."
      },
      {
        phase: "Advanced Features",
        description: "Implementation of AI-powered features including demand forecasting, dynamic pricing, and intelligent customer routing."
      },
      {
        phase: "Optimization & Scaling",
        description: "Continuous optimization based on performance data and scaling of automation to handle peak loads."
      }
    ],
    deliverables: [
      "Automated order processing system",
      "Real-time inventory management",
      "24/7 customer service chatbot",
      "Predictive analytics dashboard",
      "Global warehouse coordination system",
      "Performance monitoring and alerting"
    ],
    results: [
      { metric: "Processing Time Reduction", value: "60%" },
      { metric: "Order Accuracy Improvement", value: "99.8%" },
      { metric: "24/7 Operations Capability", value: "100%" },
      { metric: "Customer Response Time", value: "<2min" }
    ],
    clientName: "GlobalShop International",
    clientLogo: "/images/clients/globalshop-logo.png",
    imageId: "ecommerce-automation"
  },
  {
    id: "marketing-campaign",
    title: "Data-Driven Marketing Campaign",
    category: "marketing-strategy",
    description: "Leveraging advanced analytics and customer data to create highly targeted, personalized marketing campaigns with exceptional ROI.",
    thumbnail: "/images/case-studies/marketing-campaign-thumb.jpg",
    images: [
      "/images/case-studies/marketing-campaign-1.jpg",
      "/images/case-studies/marketing-campaign-2.jpg",
      "/images/case-studies/marketing-campaign-3.jpg",
      "/images/case-studies/marketing-campaign-4.jpg"
    ],
    background: "A mid-sized technology company was investing heavily in marketing across multiple channels but struggling with attribution, targeting accuracy, and campaign optimization. They needed a data-driven approach to maximize their marketing investment.",
    challenge: "The client was spending significant budget on marketing with limited visibility into ROI, poor customer targeting, and inability to optimize campaigns in real-time based on performance data.",
    objectives: [
      "Implement comprehensive marketing analytics",
      "Create advanced customer segmentation",
      "Develop personalized content delivery system",
      "Establish real-time campaign optimization",
      "Achieve measurable improvement in marketing ROI"
    ],
    approach: "We implemented a comprehensive data-driven marketing platform that integrates customer data, behavioral analytics, and real-time optimization to deliver highly targeted, personalized campaigns across all channels.",
    process: [
      {
        phase: "Data Integration",
        description: "Consolidation of customer data from all touchpoints into a unified customer data platform with real-time synchronization."
      },
      {
        phase: "Analytics Implementation",
        description: "Deployment of advanced analytics tools for customer behavior analysis, attribution modeling, and predictive insights."
      },
      {
        phase: "Segmentation & Targeting",
        description: "Development of sophisticated customer segmentation models and targeted campaign strategies based on behavioral data."
      },
      {
        phase: "Personalization Engine",
        description: "Implementation of AI-powered personalization engine for dynamic content delivery across all marketing channels."
      },
      {
        phase: "Optimization & Scaling",
        description: "Continuous campaign optimization using machine learning algorithms and scaling successful strategies across channels."
      }
    ],
    deliverables: [
      "Unified customer data platform",
      "Advanced analytics dashboard",
      "Automated segmentation system",
      "Personalized content delivery engine",
      "Real-time campaign optimization",
      "Comprehensive attribution modeling"
    ],
    results: [
      { metric: "Campaign ROI Increase", value: "320%" },
      { metric: "Engagement Rate Improvement", value: "47%" },
      { metric: "Customer Acquisition Cost Reduction", value: "28%" },
      { metric: "Attribution Accuracy", value: "95%" }
    ],
    clientName: "TechFlow Solutions",
    clientLogo: "/images/clients/techflow-logo.png",
    imageId: "marketing-campaign"
  }
]

// Helper function to get case study by ID
export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find(study => study.id === id)
}

// Helper function to get case studies by category
export const getCaseStudiesByCategory = (category: string): CaseStudy[] => {
  return caseStudies.filter(study => study.category === category)
}

// Helper function to get all case study IDs for static generation
export const getAllCaseStudyIds = (): string[] => {
  return caseStudies.map(study => study.id)
}

// Legacy automation case studies for backward compatibility
export const automationCaseStudies = [
  {
    id: "case-1",
    title: "Invoice Processing Automation",
    description: "Streamlining financial operations for a manufacturing company",
    company: "MetalWorks Inc.",
    industry: "Manufacturing",
    challenge: "Manual invoice processing took over 15 hours per week, with frequent errors and delays in payment processing that affected vendor relationships.",
    solution: "We implemented an AI-powered document processing system that automatically captures invoice data, validates against purchase orders, and routes for approval.",
    results: [
      { label: "Processing Time", before: "4-5 days", after: "Same day" },
      { label: "Error Rate", before: "12%", after: "< 1%" },
      { label: "Staff Hours", before: "15 hrs/week", after: "2 hrs/week" }
    ]
  },
  {
    id: "case-2",
    title: "Customer Onboarding Automation",
    description: "Enhancing customer experience for a financial services firm",
    company: "Capital Finance",
    industry: "Financial Services",
    challenge: "Complex customer onboarding process involved 7 different departments and took an average of 2 weeks to complete, leading to customer frustration and drop-offs.",
    solution: "We deployed a centralized workflow automation platform that coordinates tasks across departments and provides real-time status updates to customers.",
    results: [
      { label: "Onboarding Time", before: "14 days", after: "3 days" },
      { label: "Customer Satisfaction", before: "65%", after: "94%" },
      { label: "Conversion Rate", before: "48%", after: "83%" }
    ]
  },
  {
    id: "case-3",
    title: "Supply Chain Process Automation",
    description: "Optimizing inventory and order management",
    company: "Global Retail Corp",
    industry: "Retail",
    challenge: "Fragmented supply chain processes across 12 warehouses led to inventory discrepancies, stockouts, and excessive manual reconciliation work.",
    solution: "We implemented an end-to-end supply chain automation system with real-time inventory tracking, predictive ordering, and exception-based alerts.",
    results: [
      { label: "Inventory Accuracy", before: "83%", after: "99.5%" },
      { label: "Stockout Rate", before: "7.2%", after: "1.8%" },
      { label: "Labor Cost", before: "$240K/yr", after: "$80K/yr" }
    ]
  }
]
