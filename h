Create a docker-compose.yml file for the DuckDNS container:

yaml
version: '3'
services:
  duckdns:
    image: linuxserver/duckdns
    container_name: duckdns
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Chicago
      - SUBDOMAINS=your-subdomain
      - TOKEN=your-duckdns-token
    restart: always
Replace your-subdomain with your DuckDNS subdomain and your-duckdns-token with your DuckDNS token.

Run the DuckDNS container:

bash
docker-compose up -d
Step 2: Set up Nginx
Install Nginx:

Install Nginx on your server:

bash
sudo apt update
sudo apt install nginx
Configure Nginx as a Reverse Proxy:

Create a new Nginx configuration file for each service (Protodactyl Wings, panel, and Plex server):

bash
sudo nano /etc/nginx/sites-available/protodactyl
Add the following configuration for Protodactyl Wings:

nginx
server {
    listen 80;
    server_name wings.mcaaws.duckdns.org;

    location / {
        proxy_pass http://localhost:8080; # Replace with the actual port for Protodactyl Wings
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
Add the following configuration for the Protodactyl panel:

nginx
server {
    listen 80;
    server_name panel.mcaaws.duckdns.org;

    location / {
        proxy_pass https://upgraded-halibut-q7qv5jjgpw6w2j67-80.app.github.dev/; # Replace with the actual port for the Protodactyl panel
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
Add the following configuration for the Plex server:

nginx
server {
    listen 80;
    server_name plex.mcaaws.duckdns.org;

    location / {
        proxy_pass http://localhost:32400; # Replace with the actual port for the Plex server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
Enable the Nginx configuration files:

bash
sudo ln -s /etc/nginx/sites-available/protodactyl /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/panel /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/plex /etc/nginx/sites-enabled/
Test the Nginx configuration:

bash
sudo nginx -t
Reload Nginx to apply the changes:

bash
sudo systemctl reload nginx
Summary