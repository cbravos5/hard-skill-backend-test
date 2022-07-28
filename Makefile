start:
	docker-compose up -d
	docker-compose logs -f server

stop:
	docker-compose down

remove:
	docker-compose rm -f
	docker-compose pull
	