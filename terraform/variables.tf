variable "region" {
  default = "eu-north-1"
}

variable "ami_id" {
  description = "AMI ID for EC2"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "key_name" {
  description = "EC2 Key Pair Name"
}