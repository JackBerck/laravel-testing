import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
    vus: 1,
    duration: '30s',
};

const BASE_URL = 'http://localhost:8000/api';

export default function () {
    // Test health endpoint
    let healthRes = http.get(`${BASE_URL}/health`);
    check(healthRes, {
        'health check status is 200': (r) => r.status === 200,
        'health check is healthy': (r) => {
            const body = JSON.parse(r.body);
            return body.status === 'healthy';
        },
    });

    sleep(1);

    // Test message endpoint
    let messageRes = http.get(`${BASE_URL}/message`);
    check(messageRes, {
        'message status is 200': (r) => r.status === 200,
        'message has data': (r) => {
            const body = JSON.parse(r.body);
            return body.success === true;
        },
    });

    sleep(1);

    // Test get all mahasiswa
    let mahasiswaRes = http.get(`${BASE_URL}/mahasiswa`);
    check(mahasiswaRes, {
        'get mahasiswa status is 200': (r) => r.status === 200,
        'get mahasiswa has data': (r) => {
            const body = JSON.parse(r.body);
            return body.success === true && body.data !== undefined;
        },
    });

    sleep(1);
}
