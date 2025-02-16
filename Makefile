# Makefile for managing web services and React app

.PHONY: all start stop restart start-react stop-react restart-react

# Directories of each web service
SERVICES_DIRS = \
    web-service1 \
    web-service2 \
    web-service3

# Start all services
start: start-services start-react

# Stop all services
stop: stop-services stop-react

# Restart all services
restart: restart-services restart-react

# Start all web services
start-services:
    @echo "Starting all web services..."
    @$(foreach dir,$(SERVICES_DIRS),(cd $(dir) && docker-compose up -d);)

# Stop all web services
stop-services:
    @echo "Stopping all web services..."
    @$(foreach dir,$(SERVICES_DIRS),(cd $(dir) && docker-compose down);)

# Restart all web services
restart-services:
    @echo "Restarting all web services..."
    @$(foreach dir,$(SERVICES_DIRS),(cd $(dir) && docker-compose down);)
    @$(foreach dir,$(SERVICES_DIRS),(cd $(dir) && docker-compose up -d);)

# Start React app
start-react:
    @echo "Starting React app..."
    cd frontend && npm start

# Stop React app
stop-react:
    @echo "Stopping React app..."
    cd frontend && npm stop

# Restart React app
restart-react: stop-react start-react
    @echo "Restarting React app..."
