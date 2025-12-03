require('dotenv').config();
const mongoose = require('mongoose');
const ProjectModel = require('./models/Project');
const UserModel = require('./models/User');
const connectDB = require('./config/db');

const seedProjects = async () => {
    try {
        await connectDB();
        
        const users = await UserModel.find().limit(20);
        
        if (users.length === 0) {
            console.log('❌ No users found in database. Please run seedUsers.js first!');
            mongoose.connection.close();
            process.exit(1);
        }

        const projectTemplates = [
            {
                title: "E-Commerce Platform with AI Recommendations",
                description: "Building a modern e-commerce platform with AI-powered product recommendations, real-time inventory management, and seamless payment integration. Looking for passionate developers to create an innovative shopping experience.",
                tags: ["Web Development", "AI/ML", "E-Commerce", "React", "Node.js"],
                lookingFor: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
                location: "Bangalore",
                isRemote: false
            },
            {
                title: "Health & Fitness Mobile App",
                description: "A comprehensive fitness tracking app with workout plans, nutrition tracking, and social features. We're building this to help people achieve their fitness goals through technology.",
                tags: ["Mobile App", "React Native", "Health", "Firebase"],
                lookingFor: ["Mobile Developer", "Backend Developer", "UI/UX Designer"],
                location: "Mumbai",
                isRemote: true
            },
            {
                title: "Blockchain-Based Voting System",
                description: "Creating a transparent and secure voting system using blockchain technology. This project aims to revolutionize the voting process with immutability and transparency at its core.",
                tags: ["Blockchain", "Web3", "Solidity", "Security"],
                lookingFor: ["Blockchain Developer", "Smart Contract Developer", "Security Expert"],
                location: "Delhi",
                isRemote: true
            },
            {
                title: "Social Media Analytics Dashboard",
                description: "A powerful analytics dashboard for social media managers to track engagement, analyze trends, and optimize content strategy. Built with modern data visualization tools.",
                tags: ["Data Analytics", "React", "Python", "Data Visualization"],
                lookingFor: ["Frontend Developer", "Data Analyst", "Full Stack Developer"],
                location: "Hyderabad",
                isRemote: false
            },
            {
                title: "IoT Smart Home Automation",
                description: "Developing an IoT-based smart home system that allows users to control lights, temperature, security, and appliances remotely. Integration with voice assistants included.",
                tags: ["IoT", "Hardware", "Embedded Systems", "Python"],
                lookingFor: ["IoT Developer", "Hardware Engineer", "Backend Developer"],
                location: "Pune",
                isRemote: false
            },
            {
                title: "Online Learning Platform",
                description: "A comprehensive online learning platform with video courses, quizzes, certificates, and interactive coding environments. Making quality education accessible to everyone.",
                tags: ["EdTech", "Full Stack", "Video Streaming", "MongoDB"],
                lookingFor: ["Full Stack Developer", "Video Engineer", "UI/UX Designer"],
                location: "Chennai",
                isRemote: true
            },
            {
                title: "Food Delivery Aggregator App",
                description: "Building a food delivery platform that connects restaurants with customers. Features include real-time tracking, multiple payment options, and restaurant management dashboard.",
                tags: ["Mobile App", "Flutter", "Real-time", "Payment Gateway"],
                lookingFor: ["Mobile Developer", "Backend Developer", "DevOps Engineer"],
                location: "Kolkata",
                isRemote: true
            },
            {
                title: "AI-Powered Code Review Tool",
                description: "An intelligent code review assistant that uses machine learning to detect bugs, suggest improvements, and enforce coding standards. Helping developers write better code faster.",
                tags: ["AI/ML", "DevTools", "Python", "NLP"],
                lookingFor: ["ML Engineer", "Backend Developer", "DevOps Engineer"],
                location: "Bangalore",
                isRemote: true
            },
            {
                title: "Sustainable Energy Monitoring System",
                description: "A platform to monitor and optimize energy consumption in buildings using IoT sensors and machine learning. Contributing to a more sustainable future.",
                tags: ["IoT", "Sustainability", "Data Science", "Cloud"],
                lookingFor: ["IoT Developer", "Data Scientist", "Cloud Engineer"],
                location: "Ahmedabad",
                isRemote: false
            },
            {
                title: "Virtual Event Platform",
                description: "Creating an immersive virtual event platform with live streaming, networking features, virtual booths, and interactive sessions. Bringing events to the digital world.",
                tags: ["WebRTC", "Real-time", "React", "Node.js"],
                lookingFor: ["Full Stack Developer", "Video Engineer", "UI/UX Designer"],
                location: "Gurgaon",
                isRemote: true
            },
            {
                title: "Cryptocurrency Portfolio Tracker",
                description: "A comprehensive crypto portfolio management app with real-time price tracking, profit/loss analysis, and trading alerts. Built for crypto enthusiasts.",
                tags: ["FinTech", "React", "APIs", "Real-time"],
                lookingFor: ["Frontend Developer", "Backend Developer", "Mobile Developer"],
                location: "Mumbai",
                isRemote: true
            },
            {
                title: "AR/VR Shopping Experience",
                description: "Revolutionizing online shopping with AR/VR technology. Users can virtually try products before buying. A cutting-edge project in immersive commerce.",
                tags: ["AR/VR", "3D Graphics", "Unity", "Mobile"],
                lookingFor: ["AR/VR Developer", "3D Artist", "Mobile Developer"],
                location: "Bangalore",
                isRemote: false
            },
            {
                title: "Mental Health Support Chatbot",
                description: "An AI-powered chatbot providing mental health support, resources, and crisis intervention. Using NLP and sentiment analysis to help users in need.",
                tags: ["AI/ML", "NLP", "Healthcare", "Python"],
                lookingFor: ["ML Engineer", "NLP Specialist", "Backend Developer"],
                location: "Delhi",
                isRemote: true
            },
            {
                title: "Freelance Marketplace Platform",
                description: "A platform connecting freelancers with clients. Features include project management, secure payments, reviews, and skill-based matching.",
                tags: ["Marketplace", "Full Stack", "Payment Gateway", "MongoDB"],
                lookingFor: ["Full Stack Developer", "Backend Developer", "UI/UX Designer"],
                location: "Pune",
                isRemote: true
            },
            {
                title: "Smart City Traffic Management",
                description: "Using AI and IoT to optimize traffic flow in cities. Real-time data analysis and intelligent signal control to reduce congestion and improve commute times.",
                tags: ["AI/ML", "IoT", "Data Analytics", "Python"],
                lookingFor: ["ML Engineer", "IoT Developer", "Data Analyst"],
                location: "Hyderabad",
                isRemote: false
            },
            {
                title: "Music Collaboration Platform",
                description: "A platform for musicians to collaborate remotely, share tracks, and create music together. Features include real-time audio streaming and project management.",
                tags: ["Audio", "Real-time", "WebRTC", "React"],
                lookingFor: ["Audio Engineer", "Full Stack Developer", "UI/UX Designer"],
                location: "Mumbai",
                isRemote: true
            },
            {
                title: "Automated Testing Framework",
                description: "Building an open-source automated testing framework that supports multiple programming languages and testing paradigms. Making testing easier for developers.",
                tags: ["DevTools", "Testing", "Open Source", "Python"],
                lookingFor: ["QA Engineer", "Backend Developer", "DevOps Engineer"],
                location: "Bangalore",
                isRemote: true
            },
            {
                title: "Climate Change Data Visualization",
                description: "An interactive platform visualizing climate change data, trends, and predictions. Helping people understand the impact of climate change through compelling visualizations.",
                tags: ["Data Visualization", "Climate", "React", "Data Science"],
                lookingFor: ["Data Scientist", "Frontend Developer", "UI/UX Designer"],
                location: "Chennai",
                isRemote: true
            },
            {
                title: "Gaming Social Network",
                description: "A social network for gamers to connect, form teams, organize tournaments, and share gaming content. Building a community for gaming enthusiasts.",
                tags: ["Gaming", "Social Network", "React", "Node.js"],
                lookingFor: ["Full Stack Developer", "Game Developer", "UI/UX Designer"],
                location: "Delhi",
                isRemote: true
            },
            {
                title: "Supply Chain Management System",
                description: "A comprehensive supply chain management system with inventory tracking, logistics optimization, and real-time updates. Streamlining business operations.",
                tags: ["Enterprise", "Full Stack", "Logistics", "MongoDB"],
                lookingFor: ["Full Stack Developer", "Backend Developer", "DevOps Engineer"],
                location: "Gurgaon",
                isRemote: false
            },
            {
                title: "Personal Finance Management App",
                description: "An intelligent personal finance app that tracks expenses, creates budgets, provides insights, and helps users achieve their financial goals.",
                tags: ["FinTech", "Mobile App", "React Native", "Data Analytics"],
                lookingFor: ["Mobile Developer", "Backend Developer", "Data Analyst"],
                location: "Pune",
                isRemote: true
            },
            {
                title: "Language Learning Platform",
                description: "An interactive language learning platform with AI-powered pronunciation correction, gamified lessons, and native speaker interactions.",
                tags: ["EdTech", "AI/ML", "Mobile App", "NLP"],
                lookingFor: ["ML Engineer", "Mobile Developer", "UI/UX Designer"],
                location: "Bangalore",
                isRemote: true
            },
            {
                title: "Real Estate Property Finder",
                description: "A comprehensive property search platform with virtual tours, AI-powered recommendations, and mortgage calculators. Making property hunting easier.",
                tags: ["Real Estate", "React", "AI/ML", "3D"],
                lookingFor: ["Full Stack Developer", "3D Developer", "UI/UX Designer"],
                location: "Mumbai",
                isRemote: false
            },
            {
                title: "Cybersecurity Threat Detection",
                description: "Building an advanced threat detection system using machine learning to identify and prevent cyber attacks in real-time. Protecting digital assets.",
                tags: ["Cybersecurity", "AI/ML", "Security", "Python"],
                lookingFor: ["Security Engineer", "ML Engineer", "Backend Developer"],
                location: "Hyderabad",
                isRemote: true
            },
            {
                title: "Crowdfunding Platform",
                description: "A platform for creators to launch crowdfunding campaigns. Features include payment processing, campaign management, and social sharing.",
                tags: ["FinTech", "Full Stack", "Payment Gateway", "React"],
                lookingFor: ["Full Stack Developer", "Backend Developer", "UI/UX Designer"],
                location: "Delhi",
                isRemote: true
            }
        ];

        // Create projects with random user assignments
        let insertedCount = 0;
        let skippedCount = 0;

        for (const template of projectTemplates) {
            try {
                // Randomly assign a user as creator
                const randomUser = users[Math.floor(Math.random() * users.length)];
                
                const project = new ProjectModel({
                    ...template,
                    createdBy: randomUser._id,
                    status: 'active'
                });

                await project.save();
                insertedCount++;
            } catch (error) {
                skippedCount++;
                console.log(`Skipped project: ${template.title} - ${error.message}`);
            }
        }

        console.log(`\n✅ Project seeding completed!`);
        console.log(`   Inserted: ${insertedCount} projects`);
        console.log(`   Skipped: ${skippedCount} projects`);
        console.log(`   Total: ${projectTemplates.length} projects processed\n`);

        // Close connection
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding projects:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Run the seed function
seedProjects();

