import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import PortfolioData from '../models/PortfolioData';

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Delete all existing users to avoid old credentials
    await User.deleteMany({});
    console.log('Cleared all existing users');

    const admin = new User({
      name: 'Abhinav Dixit',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      profile: {
        title: 'Frontend Specialist & Software Development Engineer',
        bio: 'Passionate about building scalable, performant web applications with React, Next.js, and modern frontend architecture. 3+ years of experience in frontend system design and full-stack development.',
        avatar: '',
        resume: '',
      },
    });
    await admin.save();
    console.log(`Admin user created: ${admin.email}`);

    // Upsert portfolio data from provided resume JSON (hardcoded for now - replace with external source if needed)
    const resume = {
      personal_details: {
        name: 'ABHINAV DIXIT',
        contact: { phone: '+91-8528723582', email: 'abhinavdixit2306@gmail.com', website: 'abhinavdixit.com' },
        profiles: {
          linkedin: 'linkedin.com/in/highonranking',
          github: 'github.com/highonranking',
          codeforces: 'codeforces.com/profile/abhinav230601',
          leetcode: 'leetcode.com/highonranking',
          geeksforgeeks: 'geeksforgeeks.org/user/abhinav230601',
          codechef: 'codechef.com/users/abhinav230601',
        },
      },
      professional_experience: [
        {
          title: 'Software Development Engineer',
          company: 'Yatra Online Limited',
          location: 'Gurugram, Haryana, IN',
          duration: 'June 2024 - Present',
          responsibilities: [
            'Architected and developed B2C flights booking UI using React and Next.js with focus on performance optimization.',
            'Led frontend system design for corporate travel products with modern React patterns and state management.',
            'Reduced API latency by 30% through strategic caching, code-splitting, and optimized frontend-backend integration.',
            'Worked with AngularJS migration to React, implementing component libraries and design systems.',
            'Built scalable frontend architecture integrating flight suppliers (LCCs, GDS, Amadeus) with Java Spring Boot backend.'
          ],
        },
        {
          title: 'Full Stack Developer',
          company: 'StampMy Visa',
          location: 'Bengaluru, Karnataka, IN',
          duration: 'July 2023 - May 2024',
          responsibilities: [
            'Led React-based frontend development for B2B product with emphasis on system design and scalability.',
            'Designed and implemented responsive React dashboard achieving 8x increase in user engagement.',
            'Improved user satisfaction by 25% through frontend performance optimization and UX enhancements.',
            'Built reusable component library and implemented frontend best practices.',
            'Increased mobile retention by 30% through progressive web app techniques and responsive design.'
          ],
        },
        {
          title: 'Solution Engineer',
          company: 'CRED',
          location: 'Bengaluru, Karnataka, IN',
          duration: 'Jul 2022 - Jul 2023',
          responsibilities: [
            'Developed internal onboarding app using React Native with clean architecture and state management.',
            'Achieved 45% increase in merchant adoption through intuitive UI/UX design and frontend optimization.',
            'Built frontend with React Native connecting to Spring Boot backend, AWS S3, and EC2.',
            'Improved E2E testing efficiency by 20% through component-driven development and testing strategies.',
            'Automated frontend workflows with Python scripts leading to 90x efficiency increase in onboarding.'
          ],
        },
      ],
      education: {
        degree: 'B.Tech (ECE)',
        institution: 'KIET Group Of Institutions, Ghaziabad',
        university: 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow, U.P.',
        graduationDate: 'July 2023',
        gpaCgpa: '8.37',
      },
      skills: {
        frontend: ['React.js','Next.js','TypeScript','JavaScript','AngularJS','Frontend System Design','Performance Optimization','UI/UX Design'],
        backend: ['Spring Boot','Node.js','Express','REST APIs'],
        technical_languages: ['JavaScript','TypeScript','Java','Python','C++/C'],
        cloud_and_databases: ['AWS (EC2, S3)','MongoDB','MySQL','DynamoDB','Docker','Kubernetes']
      },
      personal_projects: [
        {
          name: 'Restaurant Mobile app',
          technologies: ['React Native','React','Node.js','Frontend System Design'],
          description: 'Streamlined order management with optimized frontend architecture, 20% faster order processing.'
        },
        {
          name: 'Creating Trails',
          technologies: ['Next.js','React','TypeScript','Node.js','MongoDB'],
          description: 'Itinerary planning app with server-side rendering and advanced React patterns reducing user planning time by 40%.'
        },
        {
          name: 'SEO Platform',
          technologies: ['React','Next.js','Node.js','MongoDB','Frontend Performance'],
          description: 'MERN stack platform with SSR and SEO optimization helping 50+ developers achieve 30% performance boost.'
        },
        {
          name: 'Digitally Inclined Ecom',
          technologies: ['React','Next.js','Serverless','Frontend Architecture'],
          description: 'NFT marketplace with modern frontend architecture and serverless backend saving 30% cloud costs.'
        }
      ],
      achievements: [
        '5-star rating (1926*) on Codechef.',
        'Ranked 2nd in college on GFG; solved 700+ GFG and 600+ LeetCode problems.',
        '1st Position in E-Summit (Inmantec Ghaziabad), 2nd at DJSCE Mumbai.',
        'Winner Hackstack 22; Runner up Code Heist (YHills).'
      ],
      volunteer_experience: [
        { role: 'Web Development Mentor', organization: 'INNOGEEKS KIET', description: 'Mentored students in React, Spring, Java, Node, MySQL.' },
        { role: 'Member', organization: 'Innovation Center Club at IC KIET', description: 'Represented club at Business Plan Competitions.' }
      ]
    };

    const skillCategories = [
      { category: 'Frontend Development', items: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'AngularJS', 'Frontend System Design', 'UI/UX Optimization'] },
      { category: 'Backend Development', items: resume.skills.backend },
      { category: 'Technical Languages', items: resume.skills.technical_languages },
      { category: 'Cloud & Databases', items: resume.skills.cloud_and_databases },
    ];

    const experience = resume.professional_experience.map(exp => ({
      company: exp.company,
      position: exp.title,
      location: exp.location,
      duration: exp.duration,
      responsibilities: exp.responsibilities,
    }));

    const projects = resume.personal_projects.map(p => ({
      name: p.name,
      technologies: p.technologies,
      description: p.description,
    }));

    const volunteer = resume.volunteer_experience.map(v => ({
      role: v.role,
      organization: v.organization,
      description: v.description,
    }));

    const socialLinks = {
      github: resume.personal_details.profiles.github,
      linkedin: resume.personal_details.profiles.linkedin,
      website: resume.personal_details.contact.website,
      codeforces: resume.personal_details.profiles.codeforces,
      leetcode: resume.personal_details.profiles.leetcode,
      geeksforgeeks: resume.personal_details.profiles.geeksforgeeks,
      codechef: resume.personal_details.profiles.codechef,
    };

    const portfolioPayload = {
      adminId: admin._id,
      stats: {
        totalProjects: projects.length,
        totalBlogs: 0,
        yearsOfExperience: 3, // approximate; adjust as needed
      },
      experience,
      education: resume.education,
      projects,
      achievements: resume.achievements,
      volunteerExperience: volunteer,
      skills: skillCategories,
      socialLinks,
    };

    const existingPortfolio = await PortfolioData.findOne({ adminId: admin._id });
    if (existingPortfolio) {
      Object.assign(existingPortfolio, portfolioPayload, { updatedAt: new Date() });
      await existingPortfolio.save();
      console.log('Portfolio data updated');
    } else {
      await PortfolioData.create(portfolioPayload);
      console.log('Portfolio data created');
    }

  process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();
