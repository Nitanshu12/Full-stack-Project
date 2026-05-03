# ─────────────────────────────────────────────────────────────
# OUTPUTS
#
# Values printed in the terminal after "terraform apply" finishes.
# These tell you WHERE your infrastructure lives so you can:
#   - Know which ECR URL to push Docker images to
#   - Reference the ECS cluster in future Terraform configs
#   - Verify which AWS account and region was used
#
# View outputs anytime (without re-applying) with:
#   terraform output
# ─────────────────────────────────────────────────────────────

# ── Backend ECR Repository URL ────────────────────────────────
# The full URL needed to push/pull backend Docker images.
# Format: <account_id>.dkr.ecr.<region>.amazonaws.com/collabsphere-backend
#
# Usage after terraform apply:
#   docker tag collabsphere-backend:latest <this_url>:latest
#   docker push <this_url>:latest
output "backend_ecr_url" {
  description = "Full URL of the ECR repository for the backend Docker image"
  value       = aws_ecr_repository.backend.repository_url
}

# ── Frontend ECR Repository URL ───────────────────────────────
# The full URL needed to push/pull frontend Docker images.
# Format: <account_id>.dkr.ecr.<region>.amazonaws.com/collabsphere-frontend
output "frontend_ecr_url" {
  description = "Full URL of the ECR repository for the frontend Docker image"
  value       = aws_ecr_repository.frontend.repository_url
}

# ── ECS Cluster Name ──────────────────────────────────────────
# The name of the ECS cluster (e.g. "collabsphere-cluster").
# Used when registering ECS Task Definitions and Services.
output "ecs_cluster_name" {
  description = "Name of the ECS cluster where containers will run"
  value       = aws_ecs_cluster.main.name
}

# ── ECS Cluster ARN ───────────────────────────────────────────
# ARN = Amazon Resource Name — a globally unique AWS identifier.
# Needed when referencing this cluster from IAM policies or other configs.
output "ecs_cluster_arn" {
  description = "ARN (unique identifier) of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

# ── AWS Account ID ────────────────────────────────────────────
# Shows which AWS account was used — useful to confirm you are
# deploying to the right account (especially when credentials change).
output "aws_account_id" {
  description = "AWS Account ID of the authenticated user"
  value       = data.aws_caller_identity.current.account_id
}

# ── AWS Region ────────────────────────────────────────────────
# Confirms which region all resources were created in.
output "aws_region" {
  description = "AWS region where all resources were deployed"
  value       = var.aws_region
}
