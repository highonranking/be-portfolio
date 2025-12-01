import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import ExternalContent from '../models/ExternalContent';

dotenv.config();

// Sample LinkedIn posts data - Replace URLs with actual post URLs from your LinkedIn profile
// To get real URLs: Go to linkedin.com/in/highonranking, click each post, copy the URL
const linkedInPosts = [
  {
    title: 'Excited to share my journey in Frontend Development',
    description: 'Over the past 3 years, I\'ve had the privilege of working with amazing teams at Yatra, StampMy Visa, and CRED. Building scalable React applications and optimizing performance has been an incredible learning experience. Key takeaways: Focus on user experience, optimize for performance, and never stop learning. #Frontend #React #WebDevelopment',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-11-15'),
  },
  {
    title: 'Key learnings from building a flight booking platform',
    description: 'Working on Yatra\'s B2C flights booking UI taught me the importance of performance optimization, state management, and handling complex integrations with multiple flight suppliers (LCCs, GDS, Amadeus). Reduced API latency by 30% through strategic caching and optimized frontend-backend integration. #PerformanceOptimization #React #NextJS',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-10-20'),
  },
  {
    title: 'The power of System Design in Frontend Development',
    description: 'Frontend system design is often overlooked, but it\'s crucial for building scalable applications. At StampMy Visa, we architected a B2B dashboard that achieved 8x increase in user engagement through thoughtful component design, state management patterns, and performance optimizations. #SystemDesign #Architecture #Frontend',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-09-10'),
  },
  {
    title: 'React Native at CRED: Building for Merchants',
    description: 'Developed an internal onboarding app for CRED pay merchants using React Native. The challenge was creating an intuitive UI/UX that resulted in 45% increase in merchant adoption. Clean architecture and proper state management were key to success. #ReactNative #MobileFirst #CRED',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-08-05'),
  },
  {
    title: 'Competitive Programming and Software Engineering',
    description: 'Achieved 5-star rating (1926*) on CodeChef and solved 600+ problems on LeetCode. How does competitive programming help in real-world development? Problem-solving skills, algorithm optimization, and the ability to think through complex scenarios - all directly applicable to frontend performance optimization. #CompetitiveProgramming #CodeChef #LeetCode',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-07-18'),
  },
  {
    title: 'TypeScript in Production: Lessons Learned',
    description: 'Migrating large-scale applications to TypeScript at Yatra taught me valuable lessons about type safety, developer experience, and catching bugs early. TypeScript isn\'t just about types - it\'s about building more maintainable and reliable systems. #TypeScript #JavaScript #WebDevelopment',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-06-22'),
  },
  {
    title: 'Performance Optimization: From 5s to 1.5s Load Time',
    description: 'Through code splitting, lazy loading, and strategic caching, we reduced our main application load time by 70%. Users notice the difference, and it shows in engagement metrics. Performance is a feature! #WebPerformance #Optimization #React',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-05-14'),
  },
  {
    title: 'Building Component Libraries at Scale',
    description: 'Creating reusable component libraries improved our development velocity by 40% at StampMy Visa. Key principles: consistency, documentation, and accessibility. A good component library is an investment that pays dividends. #ComponentLibrary #DesignSystem #React',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-04-08'),
  },
  {
    title: 'State Management: Redux vs Context vs Zustand',
    description: 'After using Redux, Context API, and Zustand in production applications, here\'s my take: Choose based on your needs. Redux for complex state, Context for simple shared state, Zustand for a lightweight alternative. There\'s no one-size-fits-all solution. #StateManagement #React #Redux',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-03-25'),
  },
  {
    title: 'From AngularJS to React: Migration Journey',
    description: 'Led the migration of legacy AngularJS code to modern React at Yatra. Challenges included maintaining feature parity while improving performance. Incremental migration and proper testing were crucial for success. #React #AngularJS #Migration',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-02-17'),
  },
  {
    title: 'Accessibility in Modern Web Applications',
    description: 'Building accessible web applications isn\'t optional - it\'s essential. Semantic HTML, ARIA labels, keyboard navigation, and screen reader support should be part of every developer\'s toolkit. Better accessibility means better UX for everyone. #A11y #WebAccessibility #InclusiveDesign',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2024-01-29'),
  },
  {
    title: 'AWS and Serverless Architecture for Frontend',
    description: 'Leveraging AWS services (EC2, S3, Lambda) and serverless architecture reduced our cloud hosting costs by 30% while improving scalability. The future of web development is serverless-first. #AWS #Serverless #CloudComputing',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2023-12-20'),
  },
  {
    title: 'Mentoring at INNOGEEKS KIET',
    description: 'Proud to mentor students in React, Spring Boot, Node.js, and MySQL at INNOGEEKS KIET. Sharing knowledge and helping the next generation of developers is incredibly rewarding. The best way to learn is to teach! #Mentorship #WebDevelopment #Teaching',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2023-11-11'),
  },
  {
    title: 'Winning Hackstack 22 - The Power of Team Collaboration',
    description: 'Thrilled to have won Hackstack 22! The experience taught me that great products come from great teamwork, clear communication, and rapid iteration. Thanks to my amazing team! #Hackathon #Teamwork #Innovation',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2023-10-05'),
  },
  {
    title: 'Next.js: The Future of React Applications',
    description: 'Next.js has transformed how we build React applications. Server-side rendering, static generation, and API routes out of the box make it the perfect framework for modern web apps. Currently using it for multiple production applications at Yatra. #NextJS #React #SSR',
    url: 'https://www.linkedin.com/in/highonranking/recent-activity/all/',
    publishedAt: new Date('2023-09-18'),
  },
  // Add more posts here as needed
];

const run = async () => {
  try {
    await connectDB();

    console.log('Clearing existing LinkedIn posts...');
    const deleteResult = await ExternalContent.deleteMany({ type: 'linkedin' });
    console.log(`Deleted ${deleteResult.deletedCount} existing LinkedIn posts\n`);

    console.log('Adding LinkedIn posts...');

    for (const post of linkedInPosts) {
      await ExternalContent.create({
        type: 'linkedin',
        sourceId: `manual-${Date.now()}-${Math.random()}`,
        title: post.title,
        description: post.description,
        url: post.url,
        publishedAt: post.publishedAt,
        lastSyncedAt: new Date(),
      });
      console.log(`✅ Added: ${post.title}`);
    }

    console.log(`\n✅ Successfully added ${linkedInPosts.length} LinkedIn posts!`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to add LinkedIn posts:', err);
    process.exit(1);
  }
};

run();
