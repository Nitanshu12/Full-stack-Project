"""
CollabSphere AI Recommendation Engine
======================================
Uses TF-IDF vectorization + cosine similarity to compute real match scores
between users based on skills, interests, and project tags.

Exposed as a lightweight Flask API that the Node.js backend calls.
"""

import sys
import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# ─────────────────────────────────────────────
#  Core Recommendation Logic
# ─────────────────────────────────────────────

class CollabRecommender:
    """
    AI-powered recommendation engine that computes match scores
    between a target user and a list of candidate users/projects.

    Matching dimensions:
      1. Skills similarity   (TF-IDF cosine)
      2. Interests similarity (TF-IDF cosine)
      3. Project-tag complementarity
    """

    def __init__(self):
        self.tfidf = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),       # unigrams + bigrams for better matching
            max_features=5000,
            lowercase=True
        )

    # ── helpers ──────────────────────────────

    @staticmethod
    def _list_to_text(items):
        """Convert a list of skills/interests into a single text string."""
        if not items:
            return ""
        return " ".join([str(item).strip().lower() for item in items])

    @staticmethod
    def _jaccard_similarity(set_a, set_b):
        """Jaccard index between two sets (fallback for very small lists)."""
        if not set_a and not set_b:
            return 0.0
        a = set(str(x).strip().lower() for x in set_a)
        b = set(str(x).strip().lower() for x in set_b)
        if not a and not b:
            return 0.0
        intersection = a & b
        union = a | b
        return len(intersection) / len(union) if union else 0.0

    def _tfidf_similarity(self, text_a, text_b):
        """Compute cosine similarity between two text blobs via TF-IDF."""
        if not text_a.strip() or not text_b.strip():
            return 0.0
        try:
            matrix = self.tfidf.fit_transform([text_a, text_b])
            sim = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
            return float(sim)
        except Exception:
            return 0.0

    # ── public API ───────────────────────────

    def compute_user_match(self, current_user, candidate):
        """
        Compute a match score (0-100) between two users.

        Weighting:
          - Skills similarity:    45 %
          - Interests similarity: 35 %
          - Jaccard bonus (exact skill overlap): 20 %
        """
        cur_skills = current_user.get("skills", [])
        cur_interests = current_user.get("interests", [])

        cand_skills = candidate.get("skills", [])
        cand_interests = candidate.get("interests", [])

        # TF-IDF cosine similarities
        skill_sim = self._tfidf_similarity(
            self._list_to_text(cur_skills),
            self._list_to_text(cand_skills)
        )
        interest_sim = self._tfidf_similarity(
            self._list_to_text(cur_interests),
            self._list_to_text(cand_interests)
        )

        # Jaccard overlap on raw skill tokens
        jaccard_score = self._jaccard_similarity(cur_skills, cand_skills)

        # Weighted composite
        raw_score = (
            skill_sim * 0.45 +
            interest_sim * 0.35 +
            jaccard_score * 0.20
        )

        # Scale to 0-100 and clamp
        match_score = round(min(max(raw_score * 100, 0), 100))

        return {
            "matchScore": match_score,
            "breakdown": {
                "skillSimilarity": round(skill_sim * 100, 1),
                "interestSimilarity": round(interest_sim * 100, 1),
                "skillOverlap": round(jaccard_score * 100, 1)
            }
        }

    def compute_project_match(self, current_user, project):
        """
        Compute how well a project matches a user's profile (0-100).

        Weighting:
          - Skills vs project tags:      40 %
          - Interests vs project tags:   30 %
          - Skills vs lookingFor:        30 %
        """
        cur_skills = current_user.get("skills", [])
        cur_interests = current_user.get("interests", [])

        proj_tags = project.get("tags", [])
        proj_looking_for = project.get("lookingFor", [])
        proj_desc = project.get("description", "")

        # Build a richer project text representation
        proj_text = self._list_to_text(proj_tags) + " " + proj_desc.lower()

        skill_tag_sim = self._tfidf_similarity(
            self._list_to_text(cur_skills),
            proj_text
        )
        interest_tag_sim = self._tfidf_similarity(
            self._list_to_text(cur_interests),
            proj_text
        )
        skill_looking_sim = self._tfidf_similarity(
            self._list_to_text(cur_skills),
            self._list_to_text(proj_looking_for)
        )

        raw_score = (
            skill_tag_sim * 0.40 +
            interest_tag_sim * 0.30 +
            skill_looking_sim * 0.30
        )

        match_score = round(min(max(raw_score * 100, 0), 100))

        return {
            "matchScore": match_score,
            "breakdown": {
                "skillTagMatch": round(skill_tag_sim * 100, 1),
                "interestTagMatch": round(interest_tag_sim * 100, 1),
                "roleMatch": round(skill_looking_sim * 100, 1)
            }
        }

    def rank_users(self, current_user, candidates, top_n=None):
        """Rank all candidates by match score, highest first."""
        results = []
        for cand in candidates:
            score_data = self.compute_user_match(current_user, cand)
            results.append({
                **cand,
                "matchScore": score_data["matchScore"],
                "matchBreakdown": score_data["breakdown"]
            })

        results.sort(key=lambda x: x["matchScore"], reverse=True)

        if top_n:
            results = results[:top_n]

        return results

    def rank_projects(self, current_user, projects, top_n=None):
        """Rank all projects by match score, highest first."""
        results = []
        for proj in projects:
            score_data = self.compute_project_match(current_user, proj)
            results.append({
                **proj,
                "matchScore": score_data["matchScore"],
                "matchBreakdown": score_data["breakdown"]
            })

        results.sort(key=lambda x: x["matchScore"], reverse=True)

        if top_n:
            results = results[:top_n]

        return results


# ─────────────────────────────────────────────
#  Flask API Routes
# ─────────────────────────────────────────────

recommender = CollabRecommender()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "CollabSphere AI Recommender"})


@app.route("/recommend/users", methods=["POST"])
def recommend_users():
    """
    Expects JSON:
    {
        "currentUser": { "skills": [...], "interests": [...] },
        "candidates": [ { "_id": "...", "skills": [...], "interests": [...], ... }, ... ],
        "topN": 20    // optional
    }
    Returns ranked candidates with matchScore and breakdown.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        current_user = data.get("currentUser", {})
        candidates = data.get("candidates", [])
        top_n = data.get("topN")

        if not candidates:
            return jsonify({"ranked": [], "message": "No candidates to rank"})

        ranked = recommender.rank_users(current_user, candidates, top_n)

        return jsonify({
            "ranked": ranked,
            "totalCandidates": len(candidates),
            "algorithm": "TF-IDF Cosine Similarity + Jaccard Index"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/recommend/projects", methods=["POST"])
def recommend_projects():
    """
    Expects JSON:
    {
        "currentUser": { "skills": [...], "interests": [...] },
        "projects": [ { "_id": "...", "tags": [...], "lookingFor": [...], ... }, ... ],
        "topN": 10    // optional
    }
    Returns ranked projects with matchScore and breakdown.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        current_user = data.get("currentUser", {})
        projects = data.get("projects", [])
        top_n = data.get("topN")

        if not projects:
            return jsonify({"ranked": [], "message": "No projects to rank"})

        ranked = recommender.rank_projects(current_user, projects, top_n)

        return jsonify({
            "ranked": ranked,
            "totalProjects": len(projects),
            "algorithm": "TF-IDF Cosine Similarity"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────
#  CLI mode: read JSON from stdin (fallback)
# ─────────────────────────────────────────────

def run_cli():
    """Read JSON from stdin and print ranked results — used if Flask isn't needed."""
    input_data = json.loads(sys.stdin.read())
    mode = input_data.get("mode", "users")
    current_user = input_data.get("currentUser", {})

    if mode == "users":
        candidates = input_data.get("candidates", [])
        result = recommender.rank_users(current_user, candidates)
    else:
        projects = input_data.get("projects", [])
        result = recommender.rank_projects(current_user, projects)

    print(json.dumps(result))


if __name__ == "__main__":
    if "--cli" in sys.argv:
        run_cli()
    else:
        port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
        print(f"🧠 AI Recommender running on http://localhost:{port}")
        app.run(host="0.0.0.0", port=port, debug=False)