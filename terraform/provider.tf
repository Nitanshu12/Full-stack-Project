terraform {
  required_version = ">= 1.3.0"

  backend "s3" {
    bucket         = "collabsphere-tf-state-953907694232"
    key            = "terraform/state.tfstate"
    region         = "us-east-1"
    dynamodb_table = "collabsphere-tf-lock"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
