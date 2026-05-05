output "backend_ecr_url" {
  description = "Full URL of the ECR repository for the backend Docker image"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_url" {
  description = "Full URL of the ECR repository for the frontend Docker image"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster where containers will run"
  value       = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "ARN (unique identifier) of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

output "aws_account_id" {
  description = "AWS Account ID of the authenticated user"
  value       = data.aws_caller_identity.current.account_id
}

output "aws_region" {
  description = "AWS region where all resources were deployed"
  value       = var.aws_region
}
