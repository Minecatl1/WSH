.PHONY: all start stop restart start-services stop-services restart-services start-react stop-react restart-react

# Directories of each web service
SERVICES_DIRS = \
    web-service1 \
    web-service2 \
    web-service3

start: start-services start-react

stop: stop-services stop-react

restart: restart-services restart-react

start-services:
    @echo "Starting all web services..."
    @$(foreach dir,$(SERVICES_DIRS),(cd $(dir) && docker-compose up -d);)

stop-services:
    @echo "Stopping all web services..."
    @$(foreach dir,$(SERVICES_DIRS),(cd $(dir) && docker-compose down);)

restart-services:
    @echo "Restarting all web services..."
    @$(foreach dir,$(SERVICES_DIRS),(cd $(dir) && docker-compose down);)
    @$(foreach dir,$(SERVICES_DIRS),(cd $(dir) && docker-compose up -d);)

start-react:
    @echo "Starting React app..."
    cd frontend && npm start

stop-react:
    @echo "Stopping React app..."
    # Add command to stop React app, e.g., pkill -f 'react-scripts start'

restart-react: stop-react start-react
    @echo "Restarting React app..."
