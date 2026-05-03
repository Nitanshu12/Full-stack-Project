# ─────────────────────────────────────────────────────────────
# PROVIDER CONFIGURATION
#
# This file tells Terraform:
#   1. Which version of Terraform itself is required
#   2. Which cloud provider plugin to download (AWS)
#   3. Which AWS region to deploy all resources into
#
# AWS credentials are NOT stored here — they come from environment
# variables (set via GitHub Secrets in CI, or ~/.aws/credentials locally).
# ─────────────────────────────────────────────────────────────

terraform {
  # Minimum Terraform CLI version required to run this config
  required_version = ">= 1.3.0"

  # Declare which provider plugins Terraform should download
  required_providers {
    aws = {
      source  = "hashicorp/aws"  # Official AWS provider from the Terraform Registry
      version = "~> 5.0"         # Use any 5.x version (e.g. 5.0, 5.31 — not 6.x)
    }
  }
}

# Configure the AWS provider
# The "region" value comes from var.aws_region (defined in variables.tf)
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are read automatically
# from environment variables — no need to hardcode them here.
provider "aws" {
  region = var.aws_region
}
