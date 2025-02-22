packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8, <2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = env("AWS_REGION")
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}


variable "access_key" {
  type    = string
  default = env("AWS_ACCESS_KEY_ID")
}

variable "secret_key" {
  type    = string
  default = env("AWS_SECRET_ACCESS_KEY")
}

variable "db_name" {
  type    = string
  default = env("DB_NAME")
}

variable "db_user" {
  type    = string
  default = env("DB_USER")
}

variable "db_password" {
  type    = string
  default = env("DB_PASSWORD")
}

variable "db_host" {
  type    = string
  default = env("DB_HOST")
}

variable "db_port" {
  type    = string
  default = env("DB_PORT")
}


variable "vpc_id" {
  type    = string
  default = env("VPC_ID")
}

variable "subnet_id" {
  type    = string
  default = env("SUBNET_ID")
}

variable "ami_name" {
  default = "webAMI"
}

variable "dev_user" {
  type    = string
  default = env("DEV_USER")
}

variable "demo_user" {
  type    = string
  default = env("DEMO_USER")
}

locals {
  ami_description = "Image for webapp"
  timestamp       = regex_replace(timestamp(), "[- TZ:]", "")
}


source "amazon-ebs" "ubuntu" {
  ami_name      = "${var.ami_name}-${local.timestamp}"
  instance_type = var.instance_type
  region        = var.aws_region
  access_key    = var.access_key
  secret_key    = var.secret_key
  source_ami    = "ami-04b4f1a9cf54c11d0"
  ssh_username  = var.ssh_username
  subnet_id     = var.subnet_id
  vpc_id        = var.vpc_id
  ami_users     = [var.dev_user, var.demo_user]

  tags = {
    Name        = "webAMI"
    Environment = "dev"
  }


  # ✅ Correct Placement of Block Device Mapping
  launch_block_device_mappings {
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
    delete_on_termination = true
  }
}

build {
  sources = ["source.amazon-ebs.ubuntu"]

  provisioner "shell" {
    script = "setup.sh"

  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "./csye6225-aws.service"
    destination = "/tmp/"
  }

  provisioner "file" {
  source      = "./.env"
  destination = "/tmp/.env"
}

  /*provisioner "shell" {
    script = "init-app.sh"
  }*/
}
