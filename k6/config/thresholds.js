export const defaultThresholds = {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
};

export const stressThresholds = {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
};

export const spikeThresholds = {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.1'],
};
