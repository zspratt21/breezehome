# Breezehome
Breezehome is an extension of the React & Inertia stack of Laravel's Breeze template. It includes some additional features such as
- [x] Two-factor authentication
- [x] Profile photos
- [x] Darkmode toggle
- [x] Mobile nav menu and mobile friendly layout
- [x] Integrated Header and Footer components
- [x] FontAwesome icons integration (adding an icon to your template is as easy as pasting its unicode!)
- [x] MeiliSearch integration via Laravel Scout
- [x] Sentry integration for improved error reporting
- [x] Clockwork integration for var dumping and debugging
- [x] Yarn for package management instead of NPM
- [x] A custom non-sail, HTTPS oriented Docker environment for local development which includes
    - A PHP + Nginx webserver with xDebug preconfigured
    - A MySQL database
    - A Redis instance for sessions, caching and handling 2FA tokens
    - An S3 API compatible object storage server (MinIO)
    - A local instance of MeiliSearch
    - A Vite server for hot module reloading
    - A Mailpit SMTP server for catching emails

## Requirements
- PHP 8.2
- Composer
- NodeJS 21
- Yarn
- OpenSSL
- Docker & Docker Compose

For Windows users it is HIGHLY recommended to use WSL2 and install the above dependencies on any distro of your choice (E.G Ubuntu). It's also recommended to store the project in your WSL filesystem. This is because the Docker development environment is very slow on regular Windows.

## Installation
1. Begin by starting a new project from this template.
2. You can either use your own certificates or follow [this guide](https://gist.github.com/cecilemuller/9492b848eb8fe46d462abeb26656c4f8) to generate local ssl certificates, where you will also need to install the root certificate into your machine's trusted root certification authorities and place the ssl cert and key in the docker/ssl/certs folder, ensuring they are named 'localhost.crt' and 'localhost.key' respectively.
3. Run `composer install`
4. Run `yarn`
5. Run `cp .env.example .env`
6. Set the xDebug remote host to your local machine's IP address in the .env file
7. If you want to use Sentry, set the SENTRY_DSN variable to your Sentry DSN's address. 
8. Modify any other variables in the .env file as needed.
9. Run `php artisan key:generate`
10. Run `php artisan migrate` from within the web container not your host machine terminal
11. Run `yarn build`

## Running the application
To start the local development environment powered by Docker, run `docker-compose up -d`

Once the containers are up and running, you just need to create the breezehome-public bucket and give it public access permissions at https://localhost:9001

You can now access your application on https://localhost:4430 😎
