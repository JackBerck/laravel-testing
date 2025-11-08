import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
    stages: [
        { duration: '2m', target: 50 }, // Ramp up to 50 users
        { duration: '5m', target: 50 }, // Stay at 50 users
        { duration: '2m', target: 100 }, // Spike to 100 users
        { duration: '3m', target: 100 }, // Stay at 100 users
        { duration: '2m', target: 0 }, // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% requests must complete below 1000ms
        http_req_failed: ['rate<0.01'], // Error rate must be below 1%
    },
};

const BASE_URL = 'http://localhost:8000/api';

export default function () {
    // Test GET all mahasiswa with pagination
    let res = http.get(`${BASE_URL}/mahasiswa?per_page=20`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 1000ms': (r) => r.timings.duration < 1000,
        'has data': (r) => {
            const body = JSON.parse(r.body);
            return body.success === true && body.data !== undefined;
        },
    });

    sleep(1);
}
