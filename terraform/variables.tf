
variable "aws_region" {
  description = "AWS region to deploy all resources into"
  type        = string
  default     = "us-east-1"
}


variable "app_name" {
  description = "Short name of the application — used to prefix all AWS resource names"
  type        = string
  default     = "collabsphere"
}

variable "image_tag" {
  description = "Docker image tag to deploy (e.g. 'latest' or a git commit SHA)"
  type        = string
  default     = "latest"
}
