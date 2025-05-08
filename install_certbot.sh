#!/bin/bash

# Update packages
apt update
apt upgrade -y

# Install Certbot and Nginx plugin
apt install -y certbot python3-certbot-nginx

# Check if Nginx is installed, if not install it
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
fi

# Make sure Nginx is running
systemctl start nginx
systemctl enable nginx

# Set up Certbot for the domain
certbot --nginx -d frasesmarcosalcon.com -d www.frasesmarcosalcon.com --non-interactive --agree-tos --email admin@frasesmarcosalcon.com

# Output success message
echo "Certbot installation and configuration completed!"
echo "SSL certificates for frasesmarcosalcon.com have been installed."

# Show certificate status
certbot certificates 