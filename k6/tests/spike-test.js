import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
    stages: [
        { duration: '1m', target: 50 }, // Normal load
        { duration: '30s', target: 500 }, // Sudden spike
        { duration: '1m', target: 500 }, // Maintain spike
        { duration: '1m', target: 50 }, // Scale down to normal
        { duration: '1m', target: 0 }, // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<3000'], // 95% requests must complete below 3000ms
        http_req_failed: ['rate<0.1'], // Error rate must be below 10%
    },
};

const BASE_URL = 'http://localhost:8000/api';

export default function () {
    // Test health check under spike
    let healthRes = http.get(`${BASE_URL}/health`);
    check(healthRes, {
        'health check status is 200': (r) => r.status === 200,
    });

    sleep(0.5);

    // Test get mahasiswa under spike
    let res = http.get(`${BASE_URL}/mahasiswa?per_page=10`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 3000ms': (r) => r.timings.duration < 3000,
    });

    sleep(0.5);
}
