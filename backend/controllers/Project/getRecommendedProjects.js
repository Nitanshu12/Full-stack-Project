const userModel = require("../../models/User");
const projectModel = require("../../models/Project");

/**
 * AI-Powered Project Recommendations
 * 
 * Uses the Python ML service to rank projects by how well they
 * match the current user's skills and interests.
 */
async function getRecommendedProjects(req, res) {
    try {
        // 1) Get current user profile
        const currentUser = await userModel.findById(req.userId)
            .select('skills interests')
            .lean();

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // 2) Get all active projects (not created by current user)
        const projects = await projectModel.find({
            status: 'active',
            createdBy: { $ne: req.userId }
        })
            .populate('createdBy', 'name email')
            .lean();

        if (!projects.length) {
            return res.json({
                message: "No projects available for recommendations",
                data: [],
                success: true,
                error: false
            });
        }

        // 3) Try AI service, fallback to JS scoring
        let rankedProjects;
        try {
            rankedProjects = await getAIProjectRecommendations(currentUser, projects);
        } catch (aiError) {
            console.log("⚠️  AI service unavailable for projects, using JS fallback:", aiError.message);
            rankedProjects = getJSProjectFallback(currentUser, projects);
        }

        res.json({
            message: "AI-powered project recommendations",
            data: rankedProjects,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error getting recommended projects:", err);
        res.status(500).json({
            message: err.message || "Error getting recommendations",
            error: true,
            success: false
        });
    }
}


async function getAIProjectRecommendations(currentUser, projects) {
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

    const response = await fetch(`${ML_SERVICE_URL}/recommend/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currentUser: {
                skills: currentUser.skills || [],
                interests: currentUser.interests || []
            },
            projects: projects.map(p => ({
                _id: p._id.toString(),
                title: p.title,
                description: p.description || '',
                tags: p.tags || [],
                lookingFor: p.lookingFor || [],
                location: p.location || '',
                isRemote: p.isRemote || false
            }))
        }),
        signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
        throw new Error(`AI service returned ${response.status}`);
    }

    const result = await response.json();

    // Merge AI scores back onto the full Mongo documents
    const scoreMap = new Map();
    (result.ranked || []).forEach(r => {
        scoreMap.set(r._id, {
            matchScore: r.matchScore,
            matchBreakdown: r.matchBreakdown || {}
        });
    });

    const merged = projects.map(proj => {
        const ai = scoreMap.get(proj._id.toString()) || { matchScore: 0, matchBreakdown: {} };
        return {
            ...proj,
            matchScore: ai.matchScore,
            matchBreakdown: ai.matchBreakdown
        };
    });

    merged.sort((a, b) => b.matchScore - a.matchScore);
    return merged;
}


function getJSProjectFallback(currentUser, projects) {
    const curSkills = new Set((currentUser.skills || []).map(s => s.toLowerCase().trim()));
    const curInterests = new Set((currentUser.interests || []).map(s => s.toLowerCase().trim()));

    const scored = projects.map(proj => {
        const tags = new Set((proj.tags || []).map(t => t.toLowerCase().trim()));
        const lookingFor = new Set((proj.lookingFor || []).map(l => l.toLowerCase().trim()));

        // How many of user's skills match project tags
        const skillTagOverlap = [...curSkills].filter(s => tags.has(s)).length;
        const skillTagScore = tags.size > 0 ? skillTagOverlap / tags.size : 0;

        // How many of user's interests match project tags
        const interestTagOverlap = [...curInterests].filter(i => tags.has(i)).length;
        const interestTagScore = tags.size > 0 ? interestTagOverlap / tags.size : 0;

        // Partial match: check if any skill is a substring of a tag or vice versa
        let fuzzyBonus = 0;
        curSkills.forEach(skill => {
            tags.forEach(tag => {
                if (tag.includes(skill) || skill.includes(tag)) {
                    fuzzyBonus += 0.05;
                }
            });
        });

        const matchScore = Math.round(
            Math.min(Math.max(
                (skillTagScore * 0.40 + interestTagScore * 0.30 + Math.min(fuzzyBonus, 0.30) * 1.0) * 100,
                0
            ), 100)
        );

        return {
            ...proj,
            matchScore,
            matchBreakdown: {
                skillTagMatch: Math.round(skillTagScore * 100),
                interestTagMatch: Math.round(interestTagScore * 100),
                note: "Computed via JS fallback"
            }
        };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
}


module.exports = getRecommendedProjects;
