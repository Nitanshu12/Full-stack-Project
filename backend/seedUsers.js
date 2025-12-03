require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require('./models/User');
const connectDB = require('./config/db');

const seedUsers = async () => {
    try {
        // Connect to database
        await connectDB();
        
        // Sample skills and interests for variety
        const skillSets = [
            ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            ['Python', 'Django', 'PostgreSQL', 'Machine Learning'],
            ['Java', 'Spring Boot', 'MySQL', 'Microservices'],
            ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
            ['Python', 'Flask', 'SQLite', 'Data Science'],
            ['JavaScript', 'Vue.js', 'Express', 'Firebase'],
            ['C++', 'Data Structures', 'Algorithms', 'Competitive Programming'],
            ['React Native', 'Mobile Development', 'Redux', 'API Integration'],
            ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
            ['DevOps', 'Docker', 'Kubernetes', 'AWS'],
            ['Blockchain', 'Solidity', 'Web3', 'Smart Contracts'],
            ['Full Stack', 'MERN Stack', 'REST APIs', 'GraphQL'],
            ['Data Analytics', 'Python', 'Pandas', 'Tableau'],
            ['Cybersecurity', 'Penetration Testing', 'Network Security', 'Ethical Hacking'],
            ['Game Development', 'Unity', 'C#', '3D Modeling'],
            ['Mobile App', 'Flutter', 'Dart', 'Firebase'],
            ['Backend Development', 'Node.js', 'Express', 'Redis'],
            ['Frontend Development', 'React', 'CSS', 'Webpack'],
            ['Cloud Computing', 'Azure', 'Google Cloud', 'Serverless'],
            ['AI/ML', 'TensorFlow', 'PyTorch', 'Neural Networks']
        ];

        const interestSets = [
            ['Web Development', 'Open Source', 'Tech Blogging'],
            ['Data Science', 'Research', 'Academic Projects'],
            ['Startups', 'Entrepreneurship', 'Product Management'],
            ['Mobile Apps', 'iOS Development', 'App Store Optimization'],
            ['Machine Learning', 'AI Research', 'Kaggle Competitions'],
            ['UI/UX', 'Design Systems', 'User Research'],
            ['Competitive Programming', 'Hackathons', 'Algorithm Contests'],
            ['Blockchain', 'Cryptocurrency', 'DeFi'],
            ['DevOps', 'CI/CD', 'Infrastructure'],
            ['Game Development', 'Indie Games', 'Game Design'],
            ['Cybersecurity', 'Bug Bounty', 'Security Research'],
            ['Full Stack Projects', 'SaaS Products', 'Side Projects'],
            ['Data Visualization', 'Business Intelligence', 'Analytics'],
            ['Cloud Architecture', 'Scalable Systems', 'Microservices'],
            ['AR/VR', 'Metaverse', '3D Graphics'],
            ['IoT', 'Hardware Projects', 'Embedded Systems'],
            ['Backend Systems', 'Database Design', 'API Development'],
            ['Frontend Frameworks', 'Component Libraries', 'Design Tools'],
            ['Serverless', 'Edge Computing', 'Cloud Functions'],
            ['Deep Learning', 'Computer Vision', 'NLP']
        ];

        const users = [
            { 
                name: "Aarav Sharma", 
                email: "aarav@example.com", 
                password: "123456",
                skills: skillSets[0],
                interests: interestSets[0]
            },
            { 
                name: "Riya Verma", 
                email: "riya@example.com", 
                password: "123456",
                skills: skillSets[1],
                interests: interestSets[1]
            },
            { 
                name: "Kabir Singh", 
                email: "kabir@example.com", 
                password: "123456",
                skills: skillSets[2],
                interests: interestSets[2]
            },
            { 
                name: "Ananya Mehta", 
                email: "ananya@example.com", 
                password: "123456",
                skills: skillSets[3],
                interests: interestSets[3]
            },
            { 
                name: "Ishaan Kapoor", 
                email: "ishaan@example.com", 
                password: "123456",
                skills: skillSets[4],
                interests: interestSets[4]
            },
            { 
                name: "Saanvi Desai", 
                email: "saanvi@example.com", 
                password: "123456",
                skills: skillSets[5],
                interests: interestSets[5]
            },
            { 
                name: "Vihaan Gupta", 
                email: "vihaan@example.com", 
                password: "123456",
                skills: skillSets[6],
                interests: interestSets[6]
            },
            { 
                name: "Meera Raghav", 
                email: "meera@example.com", 
                password: "123456",
                skills: skillSets[7],
                interests: interestSets[7]
            },
            { 
                name: "Dev Malhotra", 
                email: "dev@example.com", 
                password: "123456",
                skills: skillSets[8],
                interests: interestSets[8]
            },
            { 
                name: "Zara Khan", 
                email: "zara@example.com", 
                password: "123456",
                skills: skillSets[9],
                interests: interestSets[9]
            },
            { 
                name: "Arjun Patel", 
                email: "arjun@example.com", 
                password: "123456",
                skills: skillSets[10],
                interests: interestSets[10]
            },
            { 
                name: "Kiara Joshi", 
                email: "kiara@example.com", 
                password: "123456",
                skills: skillSets[11],
                interests: interestSets[11]
            },
            { 
                name: "Yuvraj Chauhan", 
                email: "yuvraj@example.com", 
                password: "123456",
                skills: skillSets[12],
                interests: interestSets[12]
            },
            { 
                name: "Tara Singh", 
                email: "tara@example.com", 
                password: "123456",
                skills: skillSets[13],
                interests: interestSets[13]
            },
            { 
                name: "Reyansh Nair", 
                email: "reyansh@example.com", 
                password: "123456",
                skills: skillSets[14],
                interests: interestSets[14]
            },
            { 
                name: "Aisha D'Souza", 
                email: "aisha@example.com", 
                password: "123456",
                skills: skillSets[15],
                interests: interestSets[15]
            },
            { 
                name: "Nikhil Rao", 
                email: "nikhil@example.com", 
                password: "123456",
                skills: skillSets[16],
                interests: interestSets[16]
            },
            { 
                name: "Sara Hussain", 
                email: "sara@example.com", 
                password: "123456",
                skills: skillSets[17],
                interests: interestSets[17]
            },
            { 
                name: "Manav Bhatia", 
                email: "manav@example.com", 
                password: "123456",
                skills: skillSets[18],
                interests: interestSets[18]
            },
            { 
                name: "Alia Fernandes", 
                email: "alia@example.com", 
                password: "123456",
                skills: skillSets[19],
                interests: interestSets[19]
            }
          ];

        // Hash passwords before inserting
        const hashedUsers = await Promise.all(
            users.map(async (user) => {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                return {
                    ...user,
                    password: hashedPassword
                };
            })
        );

        // Clear existing seed users (optional - comment out if you want to keep existing users)
        // await UserModel.deleteMany({ email: { $in: users.map(u => u.email) } });

        // Insert users, skip duplicates
        let insertedCount = 0;
        let skippedCount = 0;

        for (const user of hashedUsers) {
            try {
                await UserModel.create(user);
                insertedCount++;
            } catch (error) {
                if (error.code === 11000) {
                    // Duplicate email - skip
                    skippedCount++;
                    console.log(`Skipped duplicate: ${user.email}`);
                } else {
                    throw error;
                }
            }
        }

        console.log(`\n✅ Seeding completed!`);
        console.log(`   Inserted: ${insertedCount} users`);
        console.log(`   Skipped (duplicates): ${skippedCount} users`);
        console.log(`   Total: ${hashedUsers.length} users processed\n`);

        // Close connection
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Run the seed function
seedUsers();
