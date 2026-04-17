const userModel = require("../../models/User")

/**
 * Smart Matches Controller
 * 
 * Fetches all users except the current one, sends their profiles
 * to the Python AI recommendation engine for real TF-IDF + cosine
 * similarity scoring, and returns ranked results.
 * 
 * Falls back to a lightweight JS-based scoring if the Python
 * service is unavailable.
 */
async function allUsers(req, res) {
    try {
        console.log("userid all Users", req.userId)

        // 1) Fetch the current user's profile (skills + interests)
        const currentUser = await userModel.findById(req.userId)
            .select('skills interests')
            .lean()

        if (!currentUser) {
            return res.status(404).json({
                message: "Current user not found",
                error: true,
                success: false
            })
        }

        // 2) Fetch all other users
        const allUsers = await userModel.find({ _id: { $ne: req.userId } })
            .select('-password -refreshToken')
            .lean()

        if (!allUsers.length) {
            return res.json({
                message: "No users found for matching",
                data: [],
                success: true,
                error: false
            })
        }

        // 3) Try calling the Python AI recommender service
        let rankedUsers;
        try {
            rankedUsers = await getAIRecommendations(currentUser, allUsers);
        } catch (aiError) {
            console.log("⚠️  AI service unavailable, using JS fallback:", aiError.message);
            rankedUsers = getJSFallbackScores(currentUser, allUsers);
        }

        res.json({
            message: "AI-powered smart matches",
            data: rankedUsers,
            success: true,
            error: false
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}


/**
 * Calls the Python Flask AI recommendation service.
 */
async function getAIRecommendations(currentUser, candidates) {
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

    const response = await fetch(`${ML_SERVICE_URL}/recommend/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currentUser: {
                skills: currentUser.skills || [],
                interests: currentUser.interests || []
            },
            candidates: candidates.map(u => ({
                _id: u._id.toString(),
                name: u.name,
                email: u.email,
                role: u.role,
                skills: u.skills || [],
                interests: u.interests || [],
                bio: u.bio || '',
                expertise: u.expertise || [],
                orgName: u.orgName || '',
                orgDescription: u.orgDescription || ''
            }))
        }),
        signal: AbortSignal.timeout(5000)  // 5s timeout
    });

    if (!response.ok) {
        throw new Error(`AI service returned ${response.status}`);
    }

    const result = await response.json();

    // Merge the AI scores back onto the full Mongo documents
    const scoreMap = new Map();
    (result.ranked || []).forEach(r => {
        scoreMap.set(r._id, {
            matchScore: r.matchScore,
            matchBreakdown: r.matchBreakdown || {}
        });
    });

    const merged = candidates.map(user => {
        const ai = scoreMap.get(user._id.toString()) || { matchScore: 0, matchBreakdown: {} };
        return {
            ...user,
            matchScore: ai.matchScore,
            matchBreakdown: ai.matchBreakdown,
            skills: user.skills || [],
            interests: user.interests || []
        };
    });

    // Sort by match score descending
    merged.sort((a, b) => b.matchScore - a.matchScore);

    return merged;
}


/**
 * JS-based fallback scoring when the Python service is down.
 * Uses Jaccard similarity — lighter but still meaningful.
 */
function getJSFallbackScores(currentUser, candidates) {
    const curSkills = new Set((currentUser.skills || []).map(s => s.toLowerCase().trim()));
    const curInterests = new Set((currentUser.interests || []).map(s => s.toLowerCase().trim()));

    const scored = candidates.map(user => {
        const userSkills = new Set((user.skills || []).map(s => s.toLowerCase().trim()));
        const userInterests = new Set((user.interests || []).map(s => s.toLowerCase().trim()));

        // Jaccard similarity for skills
        const skillUnion = new Set([...curSkills, ...userSkills]);
        const skillIntersection = [...curSkills].filter(s => userSkills.has(s));
        const skillScore = skillUnion.size > 0
            ? skillIntersection.length / skillUnion.size
            : 0;

        // Jaccard similarity for interests
        const interestUnion = new Set([...curInterests, ...userInterests]);
        const interestIntersection = [...curInterests].filter(s => userInterests.has(s));
        const interestScore = interestUnion.size > 0
            ? interestIntersection.length / interestUnion.size
            : 0;

        // Weighted composite (same weights as Python engine)
        const matchScore = Math.round(
            Math.min(Math.max((skillScore * 0.60 + interestScore * 0.40) * 100, 0), 100)
        );

        return {
            ...user,
            matchScore,
            matchBreakdown: {
                skillSimilarity: Math.round(skillScore * 100),
                interestSimilarity: Math.round(interestScore * 100),
                note: "Computed via JS fallback (Jaccard)"
            },
            skills: user.skills || [],
            interests: user.interests || []
        };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
}


module.exports = allUsers