import {
    randomIntBetween,
    randomString,
} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { __VU } from 'k6/execution';

export const options = {
    stages: [
        { duration: '2m', target: 50 }, // Ramp up to 50 users
        { duration: '5m', target: 50 }, // Stay at 50 users
        { duration: '2m', target: 100 }, // Ramp up to 100 users
        { duration: '5m', target: 100 }, // Stay at 100 users
        { duration: '2m', target: 200 }, // Spike to 200 users
        { duration: '5m', target: 200 }, // Stay at 200 users
        { duration: '2m', target: 0 }, // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% requests must complete below 2000ms
        http_req_failed: ['rate<0.05'], // Error rate must be below 5%
    },
};

const BASE_URL = 'http://localhost:8000/api';

export default function () {
    group('CRUD Operations', () => {
        // CREATE
        let createPayload = JSON.stringify({
            nama: `Mahasiswa ${randomString(8)} VU${__VU}`,
            nim: `${randomIntBetween(10000000, 99999999)}${__VU}`,
            jurusan: 'Teknik Informatika',
            email: `mahasiswa${randomString(8)}_${__VU}_${Date.now()}@university.ac.id`,
            nomor_telepon: `08${randomIntBetween(1000000000, 9999999999)}`,
        });

        let createRes = http.post(`${BASE_URL}/mahasiswa`, createPayload, {
            headers: { 'Content-Type': 'application/json' },
        });

        const createSuccess = check(createRes, {
            'create mahasiswa status is 201': (r) => r.status === 201,
            'create mahasiswa has data': (r) => {
                try {
                    const body = JSON.parse(r.body);
                    return body.success === true && body.data !== undefined;
                } catch {
                    return false;
                }
            },
        });

        if (!createSuccess) {
            console.log(`Create failed: ${createRes.body}`);
            return;
        }

        let mahasiswaId;
        try {
            mahasiswaId = JSON.parse(createRes.body).data.id;
        } catch {
            console.log(`Failed to parse create response: ${createRes.body}`);
            return;
        }

        sleep(1);

        // READ
        let getRes = http.get(`${BASE_URL}/mahasiswa/${mahasiswaId}`);
        check(getRes, {
            'get mahasiswa status is 200': (r) => r.status === 200,
            'get mahasiswa returns correct id': (r) => {
                try {
                    const body = JSON.parse(r.body);
                    return body.data.id === mahasiswaId;
                } catch {
                    return false;
                }
            },
        });

        sleep(1);

        // UPDATE
        let updatePayload = JSON.stringify({
            nama: `Updated Mahasiswa ${randomString(8)} VU${__VU}`,
            jurusan: 'Sistem Informasi',
        });

        let updateRes = http.put(
            `${BASE_URL}/mahasiswa/${mahasiswaId}`,
            updatePayload,
            {
                headers: { 'Content-Type': 'application/json' },
            },
        );

        check(updateRes, {
            'update mahasiswa status is 200': (r) => r.status === 200,
            'update mahasiswa success': (r) => {
                try {
                    const body = JSON.parse(r.body);
                    return body.success === true;
                } catch {
                    return false;
                }
            },
        });

        sleep(1);

        // DELETE
        let deleteRes = http.del(`${BASE_URL}/mahasiswa/${mahasiswaId}`);
        check(deleteRes, {
            'delete mahasiswa status is 200': (r) => r.status === 200,
            'delete mahasiswa success': (r) => {
                try {
                    const body = JSON.parse(r.body);
                    return body.success === true;
                } catch {
                    return false;
                }
            },
        });
    });

    sleep(1);
}
