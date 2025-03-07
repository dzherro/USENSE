# Test

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Redis Cache Setup

This application uses Redis for caching API requests. To run Redis locally:

### Option 1: Using Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Create a `docker-compose.yml` file in the root of your project with the following content:

```yaml
version: '3'
services:
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
volumes:
  redis-data:
```

3. Start Redis using Docker Compose:

```bash
docker-compose up -d
```

4. Verify Redis is running:

```bash
docker-compose ps
# or
docker ps | grep redis
# or test connection
docker exec -it $(docker ps -q --filter "name=redis") redis-cli ping
# Should return "PONG"
```

5. To stop Redis when you're done:

```bash
docker-compose down
```

### Option 2: Install Redis Natively

If you prefer not to use Docker:

1. Install Redis on your system:
   - **Mac**: `brew install redis` and start with `brew services start redis`
   - **Linux**: `sudo apt install redis-server` (Ubuntu/Debian) or equivalent
   - **Windows**: Download from [Redis for Windows](https://github.com/tporadowski/redis/releases)

2. Verify Redis is running:
   ```bash
   redis-cli ping
   # Should return "PONG"
   ```
### Redis Cache Configuration

The application is configured to cache weather API requests for 10 minutes to reduce API calls and improve performance. The cache implementation:

- Uses Redis on the server-side
- Falls back to in-memory caching on the client-side
- Automatically expires cache entries after 10 minutes

To modify the cache duration, update the `DEFAULT_EXPIRATION` constant in `src/app/services/redis-cache.service.ts` and the `CACHE_DURATION` constant in `src/app/services/weather.service.ts`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
