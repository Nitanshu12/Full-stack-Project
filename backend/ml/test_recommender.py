"""
Tests for the CollabSphere AI Recommendation Engine
"""

import json
import pytest
from recommender import app, CollabRecommender


# ─────────────────────────────────────────────
#  Unit tests for CollabRecommender class
# ─────────────────────────────────────────────

class TestCollabRecommender:
    def setup_method(self):
        self.recommender = CollabRecommender()

    def test_identical_users_high_score(self):
        """Two users with identical skills/interests should score high."""
        user_a = {
            "skills": ["Python", "Django", "PostgreSQL", "Machine Learning"],
            "interests": ["Data Science", "Research", "Academic Projects"]
        }
        user_b = {
            "skills": ["Python", "Django", "PostgreSQL", "Machine Learning"],
            "interests": ["Data Science", "Research", "Academic Projects"]
        }
        result = self.recommender.compute_user_match(user_a, user_b)
        assert result["matchScore"] >= 80, f"Identical users should score >=80, got {result['matchScore']}"

    def test_no_overlap_low_score(self):
        """Two users with zero overlap should score low."""
        user_a = {
            "skills": ["Python", "Django", "PostgreSQL"],
            "interests": ["Data Science", "Research"]
        }
        user_b = {
            "skills": ["Swift", "iOS", "Xcode"],
            "interests": ["Game Development", "Indie Games"]
        }
        result = self.recommender.compute_user_match(user_a, user_b)
        assert result["matchScore"] <= 30, f"No-overlap users should score <=30, got {result['matchScore']}"

    def test_partial_overlap_medium_score(self):
        """Users with some shared skills should score in the middle range."""
        user_a = {
            "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
            "interests": ["Web Development", "Open Source"]
        }
        user_b = {
            "skills": ["JavaScript", "Vue.js", "Express", "Firebase"],
            "interests": ["Web Development", "Side Projects"]
        }
        result = self.recommender.compute_user_match(user_a, user_b)
        assert 20 <= result["matchScore"] <= 80, f"Partial overlap should score 20-80, got {result['matchScore']}"

    def test_empty_skills_handled(self):
        """Empty skills should not cause errors."""
        user_a = {"skills": [], "interests": ["Web Development"]}
        user_b = {"skills": ["Python"], "interests": []}
        result = self.recommender.compute_user_match(user_a, user_b)
        assert result["matchScore"] >= 0

    def test_rank_users_sorting(self):
        """rank_users should return results sorted by matchScore descending."""
        current = {
            "skills": ["Python", "Machine Learning", "TensorFlow"],
            "interests": ["AI Research", "Deep Learning"]
        }
        candidates = [
            {"_id": "1", "skills": ["Java", "Spring"], "interests": ["Enterprise"]},
            {"_id": "2", "skills": ["Python", "Machine Learning"], "interests": ["AI Research"]},
            {"_id": "3", "skills": ["Python", "Flask"], "interests": ["Web Development"]},
        ]
        ranked = self.recommender.rank_users(current, candidates)
        scores = [r["matchScore"] for r in ranked]
        assert scores == sorted(scores, reverse=True), "Results should be sorted descending"

    def test_rank_users_top_n(self):
        """top_n should limit results."""
        current = {"skills": ["Python"], "interests": ["AI"]}
        candidates = [
            {"_id": str(i), "skills": [f"Skill{i}"], "interests": [f"Interest{i}"]}
            for i in range(10)
        ]
        ranked = self.recommender.rank_users(current, candidates, top_n=3)
        assert len(ranked) == 3

    def test_project_match(self):
        """Project matching should work with tags and lookingFor."""
        user = {
            "skills": ["React", "Node.js", "MongoDB"],
            "interests": ["Web Development", "Full Stack Projects"]
        }
        project = {
            "_id": "p1",
            "tags": ["Web Development", "React", "Node.js"],
            "lookingFor": ["Full Stack Developer", "Frontend Developer"],
            "description": "Building a modern web application with React and Node.js"
        }
        result = self.recommender.compute_project_match(user, project)
        assert result["matchScore"] > 0, "Should match user skills to project tags"

    def test_breakdown_keys_present(self):
        """Breakdown should contain expected keys."""
        user_a = {"skills": ["Python"], "interests": ["AI"]}
        user_b = {"skills": ["Python"], "interests": ["AI"]}
        result = self.recommender.compute_user_match(user_a, user_b)
        assert "breakdown" in result
        assert "skillSimilarity" in result["breakdown"]
        assert "interestSimilarity" in result["breakdown"]
        assert "skillOverlap" in result["breakdown"]


# ─────────────────────────────────────────────
#  Integration tests for Flask API
# ─────────────────────────────────────────────

class TestFlaskAPI:
    def setup_method(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_health(self):
        response = self.client.get("/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "ok"

    def test_recommend_users_endpoint(self):
        payload = {
            "currentUser": {
                "skills": ["Python", "Machine Learning"],
                "interests": ["AI Research"]
            },
            "candidates": [
                {"_id": "1", "skills": ["Python", "TensorFlow"], "interests": ["Deep Learning"]},
                {"_id": "2", "skills": ["Java", "Spring"], "interests": ["Enterprise"]},
            ]
        }
        response = self.client.post(
            "/recommend/users",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert "ranked" in data
        assert len(data["ranked"]) == 2
        # First result should be the Python/ML user (higher match)
        assert data["ranked"][0]["_id"] == "1"

    def test_recommend_projects_endpoint(self):
        payload = {
            "currentUser": {
                "skills": ["React", "Node.js"],
                "interests": ["Web Development"]
            },
            "projects": [
                {
                    "_id": "p1",
                    "tags": ["React", "Node.js", "Web Development"],
                    "lookingFor": ["Full Stack Developer"],
                    "description": "Web app project"
                },
                {
                    "_id": "p2",
                    "tags": ["Blockchain", "Solidity"],
                    "lookingFor": ["Blockchain Developer"],
                    "description": "Blockchain voting system"
                }
            ]
        }
        response = self.client.post(
            "/recommend/projects",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert "ranked" in data
        # Web project should rank higher than blockchain for a React/Node user
        assert data["ranked"][0]["_id"] == "p1"

    def test_empty_candidates(self):
        payload = {
            "currentUser": {"skills": ["Python"], "interests": []},
            "candidates": []
        }
        response = self.client.post(
            "/recommend/users",
            data=json.dumps(payload),
            content_type="application/json"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["ranked"] == []

    def test_no_body_returns_error(self):
        response = self.client.post(
            "/recommend/users",
            content_type="application/json"
        )
        assert response.status_code in [400, 500]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
