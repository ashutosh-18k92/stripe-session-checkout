curl -X POST http://localhost:4242/create-checkout-session  -H "Content-Type: application/json"      -d '{"name": "user", "id": 123}'
curl -X GET http://localhost:4242/session-status?session_id=cs_test_a1vYc5nSD8pJLB0ecqNznWsG5wnaEXgd0ivivJFhyMmXyfDOLfzenLW43f  -H "Content-Type: application/json"

